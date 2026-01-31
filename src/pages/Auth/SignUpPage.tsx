import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, User, AlertCircle, Eye, EyeOff, Shield, CheckCircle2 } from 'lucide-react';
import './Auth.css';

const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = supabaseUrl && supabaseKey && 
    !supabaseUrl.includes('placeholder') && !supabaseKey.includes('placeholder');

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Sanitize input
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>"']/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Sanitize inputs
    const sanitizedName = sanitizeInput(fullName);
    const sanitizedEmail = sanitizeInput(email);

    // Comprehensive validation
    if (!sanitizedName || sanitizedName.length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      return;
    }

    if (sanitizedName.length > 100) {
      setError('Name is too long (maximum 100 characters)');
      return;
    }

    if (!sanitizedEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password.length > 128) {
      setError('Password is too long (maximum 128 characters)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await signUp(sanitizedEmail, password, sanitizedName);

      if (signUpError) {
        // Handle specific error cases
        console.error('Signup error:', signUpError);
        
        // Check if Supabase is not configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
          setError('⚠️ Database not configured. Please set up Supabase credentials in Vercel environment variables. See VERCEL_SETUP_CHECKLIST.md for instructions.');
        } else if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered')) {
          setError('This email is already registered. Please try logging in instead.');
        } else if (signUpError.message.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else if (signUpError.message.includes('Password')) {
          setError(signUpError.message);
        } else if (signUpError.message.includes('fetch') || signUpError.message.includes('network')) {
          setError('Unable to connect to database. Please check your internet connection or verify Supabase is configured correctly.');
        } else {
          setError(signUpError.message || 'Unable to create account. Please try again.');
        }
        setLoading(false);
      } else if (data?.user) {
        // Secure session handling
        if (data.user.identities && data.user.identities.length === 0) {
          setSuccess('Account already exists! Please check your email to verify, then login.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
        } else if (data.session) {
          // User is immediately logged in
          setSuccess('✓ Account created successfully! Redirecting to your dashboard...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          // Email confirmation required
          setSuccess('✓ Account created! Please check your email to verify your account before logging in.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 4000);
        }
      } else {
        setError('Unable to create account. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
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
          
          <h1 className="auth-title">Join EDUINFO</h1>
          <p className="auth-subtitle">
            Start your learning journey with our comprehensive course library
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <CheckCircle2 size={20} />
              <span>Data Structures & Algorithms</span>
            </div>
            <div className="auth-feature">
              <CheckCircle2 size={20} />
              <span>More courses coming soon</span>
            </div>
            <div className="auth-feature">
              <Shield size={20} />
              <span>Secure & Private</span>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <div className="error-message" style={{ marginTop: '20px' }}>
              <AlertCircle size={18} />
              <div>
                <strong>Setup Required:</strong> Database not configured.
                <br />
                <small>Follow <a href="https://github.com/yourusername/dsa_tracter/blob/main/VERCEL_SETUP_CHECKLIST.md" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'underline' }}>this 5-minute guide</a> to enable account creation.</small>
              </div>
            </div>
          )}

          {error && !success && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Create Account</h2>
            <p className="auth-description">Enter your details to get started</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="fullName">
                  <User size={18} />
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                  maxLength={100}
                />
              </div>

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
                  autoComplete="email"
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
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    maxLength={128}
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
                <p className="field-hint">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={18} />
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    maxLength={128}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="success-message">
                  <CheckCircle2 size={18} />
                  <span>{success}</span>
                </div>
              )}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
