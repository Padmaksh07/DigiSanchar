const DigiSancharAuth = {
  // API endpoints
  API_BASE: '/api',
  
  // Initialize authentication
  init() {
    this.setupEventListeners();
    this.checkAuthStatus();
    this.setupFormValidation();
    console.log('DigiSanchar Auth initialized');
  },

  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', this.handleRegister.bind(this));
      this.setupPasswordStrength();
    }
  },

  // Setup form validation
  setupFormValidation() {
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });

    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('input', () => this.validateEmail(input));
    });

    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => this.validatePhone(phoneInput));
    }
  },

  // Setup password strength indicator
  setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        this.checkPasswordStrength(passwordInput.value);
        if (confirmInput && confirmInput.value) {
          this.validatePasswordMatch();
        }
      });
    }
    
    if (confirmInput) {
      confirmInput.addEventListener('input', () => this.validatePasswordMatch());
    }
  },

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    if (!value && field.required) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required`;
    } else {
      switch (field.type) {
        case 'email':
          if (value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'tel':
          if (value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
          }
          break;
        case 'password':
          if (value && value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long';
          }
          break;
      }
    }

    this.setFieldError(field, errorMessage);
    return isValid;
  },

  // Validate email format
  validateEmail(input) {
    const email = input.value.trim();
    if (email && !this.isValidEmail(email)) {
      this.setFieldError(input, 'Please enter a valid email address');
      return false;
    }
    this.clearError(input);
    return true;
  },

  // Validate phone format
  validatePhone(input) {
    const phone = input.value.trim();
    if (phone && !this.isValidPhone(phone)) {
      this.setFieldError(input, 'Please enter a valid 10-digit phone number');
      return false;
    }
    this.clearError(input);
    return true;
  },

  // Validate password match
  validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
      this.setFieldError(document.getElementById('confirmPassword'), 'Passwords do not match');
      return false;
    }
    this.clearError(document.getElementById('confirmPassword'));
    return true;
  },

  // Check password strength
  checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;

    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength += 20;
    if (password.match(/[a-z]/)) strength += 15;
    if (password.match(/[A-Z]/)) strength += 15;
    if (password.match(/[0-9]/)) strength += 15;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20;
    if (password.length >= 12) strength += 15;

    if (strength < 40) {
      strengthBar.style.width = `${strength}%`;
      strengthBar.style.background = '#ef4444';
      feedback = 'Weak password';
    } else if (strength < 70) {
      strengthBar.style.width = `${strength}%`;
      strengthBar.style.background = '#f59e0b';
      feedback = 'Medium strength';
    } else {
      strengthBar.style.width = `${strength}%`;
      strengthBar.style.background = '#10b981';
      feedback = 'Strong password';
    }

    strengthText.textContent = feedback;
  },

  // Handle login form submission
  async handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const loginBtn = document.getElementById('loginBtn');
    
    // Validate form
    if (!this.validateForm(form)) {
      return;
    }

    // Show loading state
    this.setButtonLoading(loginBtn, true);

    try {
      const response = await fetch(`${this.API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCSRFToken()
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          remember: formData.get('remember') === 'on'
        })
      });

      const data = await response.json();

      if (response.ok) {
        this.showToast('Login successful! Redirecting...', 'success');
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = data.redirect_url || '/dashboard.html';
        }, 1500);
      } else {
        throw new Error(data.message || 'Login failed');
      }

    } catch (error) {
      console.error('Login error:', error);
      this.showToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      this.setButtonLoading(loginBtn, false);
    }
  },

  // Handle register form submission
  async handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const registerBtn = document.getElementById('registerBtn');
    
    // Validate form
    if (!this.validateForm(form)) {
      return;
    }

    // Additional validation
    if (!this.validatePasswordMatch()) {
      return;
    }

    if (!document.getElementById('agreeTerms').checked) {
      this.setFieldError(document.getElementById('agreeTerms'), 'You must agree to the terms and conditions');
      return;
    }

    // Show loading state
    this.setButtonLoading(registerBtn, true);

    try {
      const response = await fetch(`${this.API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCSRFToken()
        },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          password: formData.get('password'),
          newsletter: formData.get('newsletter') === 'on'
        })
      });

      const data = await response.json();

      if (response.ok) {
        this.showToast('Account created successfully! Please check your email for verification.', 'success');
        
        // Redirect to login after short delay
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 2000);
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      this.showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      this.setButtonLoading(registerBtn, false);
    }
  },

  // Validate entire form
  validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  // Utility functions
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  getFieldLabel(fieldName) {
    const labels = {
      'firstName': 'First name',
      'lastName': 'Last name',
      'email': 'Email',
      'phone': 'Phone number',
      'password': 'Password',
      'confirmPassword': 'Confirm password'
    };
    return labels[fieldName] || fieldName;
  },

  setFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}Error`) || 
                        document.getElementById(`${field.id}Error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
    field.closest('.input-group')?.classList.toggle('error', !!message);
  },

  clearError(field) {
    this.setFieldError(field, '');
  },

  setButtonLoading(button, loading) {
    if (loading) {
      button.disabled = true;
      button.classList.add('loading');
      const originalText = button.innerHTML;
      button.dataset.originalText = originalText;
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    } else {
      button.disabled = false;
      button.classList.remove('loading');
      button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
  },

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icons = {
      success: '<i class="fa-solid fa-check-circle"></i>',
      error: '<i class="fa-solid fa-exclamation-circle"></i>',
      warning: '<i class="fa-solid fa-exclamation-triangle"></i>',
      info: '<i class="fa-solid fa-info-circle"></i>'
    };

    toast.innerHTML = `${icons[type]} ${message}`;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  },

  getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
  },

  checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    if (token && (window.location.pathname === '/login.html' || window.location.pathname === '/register.html')) {
      // User is already logged in, redirect to dashboard
      window.location.href = '/dashboard.html';
    }
  }
};

// Global functions for templates
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const toggle = field.nextElementSibling;
  const icon = toggle.querySelector('i');
  
  if (field.type === 'password') {
    field.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    field.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

function socialLogin(provider) {
  DigiSancharAuth.showToast(`${provider} login will be available soon!`, 'info');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  DigiSancharAuth.init();
});

// Global access
window.DigiSancharAuth = DigiSancharAuth;
