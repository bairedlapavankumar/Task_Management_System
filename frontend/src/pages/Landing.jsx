import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem clamp(1rem, 5vw, 2rem)', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Team Task Manager</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', marginRight: 'clamp(0.5rem, 3vw, 1.5rem)', fontWeight: 500 }}>Login</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="hero-title">
            Manage your team's work <br/> <span style={{ color: 'var(--primary-color)' }}>effortlessly</span>
          </h1>
          <p className="hero-subtitle">
            A modern, glassmorphic task management platform built to help teams organize projects, assign tasks, and track progress without the clutter.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>Open Dashboard</Link>
            ) : (
              <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>Start for Free</Link>
            )}
            <a href="#features" className="btn glass-panel" style={{ padding: '1rem 2rem', fontSize: '1rem', color: 'var(--text-main)', textDecoration: 'none' }}>Learn More</a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={{ padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 5vw, 2rem)', backgroundColor: '#f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: 'clamp(2rem, 6vw, 4rem)' }}>Why choose Team Task Manager?</h2>
          
          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon">🚀</div>
              <h3>Role-Based Access</h3>
              <p style={{ color: 'var(--text-muted)' }}>Admins can create projects and assign tasks, while Members focus entirely on completing what is assigned to them.</p>
            </div>
            
            <div className="feature-card glass-panel">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p style={{ color: 'var(--text-muted)' }}>Get a birds-eye view of your productivity. Track total tasks, tasks by status, and instantly see what is overdue.</p>
            </div>
            
            <div className="feature-card glass-panel">
              <div className="feature-icon">✨</div>
              <h3>Premium Design</h3>
              <p style={{ color: 'var(--text-muted)' }}>Built with modern glassmorphism and tailored color palettes to provide a beautiful, distraction-free environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)' }}>
      </footer>
    </div>
  );
};

export default Landing;
