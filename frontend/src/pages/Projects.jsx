import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Plus, Users, ShieldAlert } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const { user } = useContext(AuthContext);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/projects', { name, description, uniqueId });
      setName('');
      setDescription('');
      setUniqueId('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return project.name.toLowerCase().includes(q) || (project.uniqueId && project.uniqueId.toLowerCase().includes(q));
  });

  return (
    <Layout title="Projects Workspace">
      
      {user?.role === 'Admin' && (
        <div className="saas-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Plus size={20} color="var(--primary-color)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Create New Project</h3>
          </div>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Project Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website Redesign" />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 2 }}>
              <label>Description</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief overview of the project..." />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Unique ID</label>
              <input type="text" value={uniqueId} onChange={e => setUniqueId(e.target.value)} placeholder="Optional (e.g. PRJ-01)" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 2rem' }}>Create</button>
          </form>
        </div>
      )}

      {searchQuery && (
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Showing results for "{searchQuery}"
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredProjects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="saas-card saas-card-hover" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ color: 'var(--text-main)', fontSize: '1.125rem', fontWeight: 600 }}>
                  {project.name}
                  {project.uniqueId && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>#{project.uniqueId}</span>}
                </h3>
                {project.admin._id === user._id && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--warning-color)', background: '#fffbeb', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                    <ShieldAlert size={14} /> Admin
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5 }}>
                {project.description || 'No description provided.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Users size={16} />
                  <span>{project.members.length} {project.members.length === 1 ? 'Member' : 'Members'}</span>
                </div>
                <div style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 500 }}>
                  View Project &rarr;
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            No projects found matching your search.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
