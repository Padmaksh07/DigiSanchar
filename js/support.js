const DigiSancharSupport = {
  init() {
    this.setupFAQ();
    this.setupCategoryCards();
    this.setupSearch();
    console.log('DigiSanchar Support initialized');
  },

  // Setup FAQ accordion
  setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        
        // Toggle current item
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  },

  // Setup category card interactions
  setupCategoryCards() {
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        this.showCategoryDetails(category);
      });
    });
  },

  // Setup search functionality
  setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }
  },

  // Show category details
  showCategoryDetails(category) {
    const categoryData = {
      'account': {
        title: 'Account Support',
        articles: [
          'How to create a DigiSanchar account',
          'Login troubleshooting',
          'Profile update guide',
          'Account security settings',
          'Two-factor authentication'
        ]
      },
      'bookings': {
        title: 'Booking Support',
        articles: [
          'How to book a journey',
          'Cancelling your booking',
          'Modifying trip details',
          'Booking confirmation issues',
          'Group booking guide'
        ]
      },
      'payments': {
        title: 'Payment Support',
        articles: [
          'Accepted payment methods',
          'DigiSanchar Wallet setup',
          'Refund processing time',
          'Payment failed issues',
          'Transaction history'
        ]
      },
      'safety': {
        title: 'Safety Support',
        articles: [
          'Emergency contacts',
          'Safety features in app',
          'Reporting incidents',
          'Lost item recovery',
          'Travel insurance'
        ]
      },
      'technical': {
        title: 'Technical Support',
        articles: [
          'App installation guide',
          'GPS not working',
          'App crashes or freezes',
          'Notification issues',
          'Device compatibility'
        ]
      },
      'general': {
        title: 'General Information',
        articles: [
          'How DigiSanchar works',
          'Service coverage areas',
          'Pricing and fare structure',
          'Partner with DigiSanchar',
          'Accessibility features'
        ]
      }
    };

    const data = categoryData[category];
    if (data) {
      this.showToast(`Loading ${data.title}...`, 'info');
      // In a real app, this would navigate to a detailed page
      setTimeout(() => {
        this.showToast(`${data.title} loaded successfully`, 'success');
      }, 1000);
    }
  },

  // Perform search
  performSearch() {
    const query = document.getElementById('globalSearch').value.trim();
    if (!query) {
      this.showToast('Please enter a search term', 'warning');
      return;
    }

    this.showToast(`Searching for "${query}"...`, 'info');
    
    // Simulate search results
    setTimeout(() => {
      const mockResults = [
        'How to cancel booking',
        'Payment methods accepted',
        'Contact customer support',
        'App troubleshooting guide'
      ];
      
      this.showToast(`Found ${mockResults.length} results for "${query}"`, 'success');
    }, 1200);
  },

  // Chat functions
  openChat() {
    document.getElementById('chatWidget').classList.add('active');
  },

  closeChat() {
    document.getElementById('chatWidget').classList.remove('active');
  },

  sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

    this.addChatMessage(message, 'user');
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        'Thanks for your message! How can I help you today?',
        'I understand your concern. Let me connect you with the right team.',
        'For immediate assistance, please call our support line.',
        'I\'ve found some helpful articles for you. Would you like me to share them?'
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      this.addChatMessage(response, 'bot');
    }, 1000);
  },

  addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fa-solid fa-${sender === 'user' ? 'user' : 'robot'}"></i>
      </div>
      <div class="message-content">
        <p>${text}</p>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },

  // Quick action functions
  trackBooking() {
    this.showToast('Redirecting to booking tracker...', 'info');
  },

  reportIssue() {
    this.showToast('Opening issue reporting form...', 'info');
  },

  refundStatus() {
    this.showToast('Checking refund status...', 'info');
  },

  showLogin() {
    this.showToast('Login functionality coming soon...', 'info');
  },

  // Toast notification
  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `${icons[type]} ${message}`;
    toast.style.background = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    }[type] || '#111827';
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  DigiSancharSupport.init();
});

// Global access
window.DigiSancharSupport = DigiSancharSupport;
