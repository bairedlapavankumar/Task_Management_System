import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Team Task Manager</h2>
        <div>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', marginRight: '1.5rem', fontWeight: 500 }}>Login</Link>
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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Open Dashboard</Link>
            ) : (
              <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Start for Free</Link>
            )}
            <a href="#features" className="btn glass-panel" style={{ padding: '1rem 2rem', fontSize: '1.125rem', color: 'var(--text-main)', textDecoration: 'none' }}>Learn More</a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 2rem', backgroundColor: '#f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Why choose Team Task Manager?</h2>
          
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
