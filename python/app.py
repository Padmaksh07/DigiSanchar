from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_mail import Mail, Message
import re
from datetime import datetime, timedelta
import secrets
import os

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///digisanchar.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Email configuration (optional)
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
cors = CORS(app)
mail = Mail(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), unique=True)
    newsletter_subscribed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def generate_verification_token(self):
        self.verification_token = secrets.token_urlsafe(32)
        return self.verification_token

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'isVerified': self.is_verified,
            'createdAt': self.created_at.isoformat(),
            'lastLogin': self.last_login.isoformat() if self.last_login else None
        }

# Helper functions
def validate_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    # Indian phone number validation
    pattern = r'^[6-9]\d{9}$'
    clean_phone = re.sub(r'\D', '', phone)
    return re.match(pattern, clean_phone) is not None

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

def send_verification_email(user):
    if not app.config['MAIL_USERNAME']:
        return  # Email not configured
    
    try:
        msg = Message(
            'Verify your DigiSanchar account',
            sender=app.config['MAIL_USERNAME'],
            recipients=[user.email]
        )
        
        verification_url = f"https://yourdomain.com/verify/{user.verification_token}"
        
        msg.html = f"""
        <h2>Welcome to DigiSanchar!</h2>
        <p>Thank you for creating an account. Please verify your email address by clicking the link below:</p>
        <p><a href="{verification_url}" style="background: #00c851; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Verify Email</a></p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
        <p>Best regards,<br>The DigiSanchar Team</p>
        """
        
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login.html')
def login_page():
    return render_template('login.html')

@app.route('/register.html')
def register_page():
    return render_template('register.html')

# API Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['firstName', 'lastName', 'email', 'phone', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field} is required'}), 400

        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'message': 'Invalid email format'}), 400

        # Validate phone format
        if not validate_phone(data['phone']):
            return jsonify({'message': 'Invalid phone number format'}), 400

        # Validate password strength
        is_valid, message = validate_password(data['password'])
        if not is_valid:
            return jsonify({'message': message}), 400

        # Check if user already exists
        existing_user = User.query.filter(
            (User.email == data['email']) | (User.phone == data['phone'])
        ).first()

        if existing_user:
            if existing_user.email == data['email']:
                return jsonify({'message': 'Email already registered'}), 409
            else:
                return jsonify({'message': 'Phone number already registered'}), 409

        # Create new user
        user = User(
            first_name=data['firstName'].strip(),
            last_name=data['lastName'].strip(),
            email=data['email'].lower().strip(),
            phone=re.sub(r'\D', '', data['phone']),
            newsletter_subscribed=data.get('newsletter', False)
        )
        user.set_password(data['password'])
        user.generate_verification_token()

        db.session.add(user)
        db.session.commit()

        # Send verification email
        send_verification_email(user)

        return jsonify({
            'message': 'Account created successfully. Please check your email for verification.',
            'userId': user.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'message': 'Registration failed. Please try again.'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400

        # Find user by email
        user = User.query.filter_by(email=data['email'].lower().strip()).first()

        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401

        if not user.is_active:
            return jsonify({'message': 'Account is deactivated'}), 401

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Create access token
        token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=7 if data.get('remember') else 1)
        )

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict(),
            'redirect_url': '/dashboard.html'
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'Login failed. Please try again.'}), 500

@app.route('/api/auth/verify/<token>', methods=['GET'])
def verify_email(token):
    try:
        user = User.query.filter_by(verification_token=token).first()
        
        if not user:
            return jsonify({'message': 'Invalid verification token'}), 400

        user.is_verified = True
        user.verification_token = None
        db.session.commit()

        return jsonify({'message': 'Email verified successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Verification error: {str(e)}")
        return jsonify({'message': 'Verification failed'}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        print(f"Profile error: {str(e)}")
        return jsonify({'message': 'Failed to fetch profile'}), 500

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a production app, you might want to blacklist the token
    return jsonify({'message': 'Logged out successfully'}), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'message': 'Internal server error'}), 500

# Create tables
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
