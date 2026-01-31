import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>"']/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rate limiting check (client-side)
    if (attemptCount >= 5) {
      setError('Too many login attempts. Please wait a few minutes before trying again.');
      return;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password; // Don't sanitize password, validate length only

    // Validation
    if (!sanitizedEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!sanitizedPassword) {
      setError('Please enter your password');
      return;
    }

    if (sanitizedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await signIn(sanitizedEmail, sanitizedPassword);

      if (signInError) {
        setAttemptCount(prev => prev + 1);
        
        // Handle specific error cases with secure messages
        if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email address. Check your inbox for the confirmation link.');
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (signInError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please try again in a few minutes.');
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
        setLoading(false);
      } else {
        // Successfully logged in - reset attempt counter
        setAttemptCount(0);
        // Redirect to user dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setAttemptCount(prev => prev + 1);
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <Link to="/" className="auth-logo">
            <GraduationCap size={40} />
            <span>EDUINFO</span>
          </Link>
          
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Continue your learning journey across multiple courses
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <Shield size={20} />
              <span>Secure Authentication</span>
            </div>
            <div className="auth-feature">
              <GraduationCap size={20} />
              <span>Multiple Courses Available</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Login to Your Account</h2>
            <p className="auth-description">Enter your credentials to continue</p>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {attemptCount > 0 && attemptCount < 5 && (
                <div className="security-notice">
                  <Shield size={16} />
                  <span>Login attempt {attemptCount} of 5</span>
                </div>
              )}

              <div className="form-group" style={{ display: 'none' }}>
                <label htmlFor="password">
                  <Lock size={18} />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
