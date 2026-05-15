import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the Team Task Manager</p>
        
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.75rem' }}>
              Must be 8+ characters with uppercase, lowercase, number, & special character.
            </small>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
        </form>
        
        <div className="text-center">
          <p style={{ color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
