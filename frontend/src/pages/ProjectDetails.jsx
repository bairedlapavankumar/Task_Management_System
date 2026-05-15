import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { UserPlus, Calendar, Flag, UserCircle, X, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskAssignee, setTaskAssignee] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/projects/${id}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/projects/${id}/members`, { email: newMemberEmail });
      setNewMemberEmail('');
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await axios.delete(`/projects/${id}/members/${memberId}`);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/projects/${id}/tasks`, {
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDue,
        priority: taskPriority,
        assignedTo: taskAssignee || null,
      });
      setTaskTitle(''); setTaskDesc(''); setTaskDue(''); setTaskPriority('Medium'); setTaskAssignee('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert('Error updating task');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    // If dropped in the same column
    if (source.droppableId === destination.droppableId) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId;
    
    // Find task
    const taskIndex = tasks.findIndex(t => t._id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    
    // Only allow admins or assigned users to move tasks
    if (!isAdmin && (!task.assignedTo || task.assignedTo._id !== user._id)) {
       alert("Not authorized to move this task");
       return;
    }
    
    // Optimistic UI update
    const previousTasks = [...tasks];
    const newTasks = [...tasks];
    newTasks[taskIndex] = { ...task, status: newStatus };
    setTasks(newTasks);

    try {
      await axios.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      // Revert on error
      setTasks(previousTasks);
      alert('Error updating task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task? This cannot be undone.')) return;
    try {
      await axios.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting task');
    }
  };

  if (!project) return <Layout title="Loading..."><div style={{ padding: '2rem' }}>Loading project...</div></Layout>;

  const isAdmin = project.admin._id === user._id;

  return (
    <Layout title={`${project.name} ${project.uniqueId ? `(#${project.uniqueId})` : ''}`}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Main Board Area */}
        <div style={{ flex: 1 }}>
          {isAdmin && (
            <div className="saas-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Create New Task</h3>
              <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Title</label>
                  <input type="text" required value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title..." />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Due Date</label>
                  <input type="date" value={taskDue} onChange={e => setTaskDue(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / span 2' }}>
                  <label>Description</label>
                  <input type="text" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Detailed description..." />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Priority</label>
                  <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Assign To</label>
                  <select value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)}>
                    <option value="">Unassigned</option>
                    {project.members.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / span 2' }}>Add Task</button>
              </form>
            </div>
          )}

          {/* Kanban Board Layout */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', flex: 1, alignItems: 'flex-start' }}>
              {['To Do', 'In Progress', 'Done'].map(status => (
                <div key={status} style={{ flex: 1, minWidth: '300px', background: 'var(--bg-color)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{status}</h3>
                    <span style={{ background: '#e2e8f0', color: 'var(--text-main)', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                      {tasks.filter(t => t.status === status).length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '150px', flex: 1, padding: '0.5rem', margin: '-0.5rem', borderRadius: '8px', background: snapshot.isDraggingOver ? 'rgba(0,0,0,0.02)' : 'transparent', transition: 'background 0.2s ease' }}
                      >
                        {tasks.filter(t => t.status === status).map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="saas-card saas-card-hover" 
                                style={{ 
                                  padding: '1.25rem', 
                                  background: 'var(--card-bg)',
                                  ...provided.draggableProps.style,
                                  boxShadow: snapshot.isDragging ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : undefined,
                                  transform: snapshot.isDragging && provided.draggableProps.style?.transform ? `${provided.draggableProps.style.transform} scale(1.02)` : provided.draggableProps.style?.transform
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                  <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Flag size={12} /> {task.priority}
                                  </span>
                                  {task.dueDate && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>{task.title}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{task.description}</p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 500 }}>
                                    <UserCircle size={18} color="var(--primary-color)" />
                                    {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                                  </div>
                                  
                                  {isAdmin && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        title="Delete task"
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: '0.25rem', borderRadius: '4px' }}
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>

        {/* Right Sidebar (Project Info & Members) */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          <div className="saas-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>About Project</h3>
            {project.uniqueId && (
              <p style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 500, marginBottom: '0.75rem' }}>ID: #{project.uniqueId}</p>
            )}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{project.description}</p>
          </div>

          <div className="saas-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Team ({project.members.length})</h3>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {project.members.map(m => (
                <li key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{m.name}</div>
                    {m._id === project.admin._id && <div style={{ fontSize: '0.7rem', color: 'var(--warning-color)', fontWeight: 600 }}>ADMIN</div>}
                  </div>
                  {isAdmin && m._id !== project.admin._id && (
                    <button 
                      onClick={() => handleRemoveMember(m._id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                      title="Remove member"
                    >
                      <X size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isAdmin && (
              <form onSubmit={handleAddMember} style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={16} /> Add Member
                </h4>
                <input 
                  type="email" 
                  placeholder="Enter email address..." 
                  value={newMemberEmail} 
                  onChange={e => setNewMemberEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', background: '#f1f5f9', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.875rem', outline: 'none' }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.625rem' }}>Invite to Project</button>
              </form>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default ProjectDetails;
