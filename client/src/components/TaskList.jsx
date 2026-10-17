import { useState } from 'react';
import { Plus, AlertCircle, CheckCircle2, Clock, User, Users, X, Calendar, Edit2, Trash2, Save } from 'lucide-react';
import { createTask, updateTask, deleteTask } from '../api/api';

export default function TaskList({ tasks = [], users = [], teams = [], setTasks }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [assignee, setAssignee] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit state
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState('MEDIUM');
  const [editStatus, setEditStatus] = useState('TODO');
  const [editAssignee, setEditAssignee] = useState('');
  const [editTeamId, setEditTeamId] = useState('');

  const addTask = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const task = await createTask({ 
        title, 
        description: desc, 
        priority, 
        status, 
        assignee_id: assignee || null, 
        team_id: teamId || null 
      });
      setTasks([...tasks, task]);
      setTitle(''); 
      setDesc(''); 
      setPriority('MEDIUM'); 
      setStatus('TODO'); 
      setAssignee(''); 
      setTeamId('');
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditAssignee(task.assignee_id || '');
    setEditTeamId(task.team_id || '');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDesc('');
    setEditPriority('MEDIUM');
    setEditStatus('TODO');
    setEditAssignee('');
    setEditTeamId('');
  };

  const saveEdit = async (taskId) => {
    if (!editTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const updatedTask = await updateTask(taskId, {
        title: editTitle,
        description: editDesc,
        priority: editPriority,
        status: editStatus,
        assignee_id: editAssignee || null,
        team_id: editTeamId || null
      });
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      cancelEdit();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsSubmitting(true);
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'DONE': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-purple-500" />;
      case 'TODO': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DONE': return 'bg-emerald-50 border-l-emerald-500';
      case 'IN_PROGRESS': return 'bg-purple-50 border-l-purple-500';
      case 'TODO': return 'bg-amber-50 border-l-amber-500';
      default: return 'bg-gray-50 border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Task Management
            </h2>
            <p className="text-gray-600 mt-2">{tasks.length} total tasks</p>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isFormOpen ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {/* Add Task Form */}
        {isFormOpen && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                <input
                  placeholder="Enter task title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Enter task description..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to User</label>
                <select
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to Team</label>
                <select
                  value={teamId}
                  onChange={e => setTeamId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                >
                  <option value="">No Team</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={addTask}
              disabled={isSubmitting || !title.trim()}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Creating Task...' : 'Create Task'}
            </button>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-500">Create your first task to get started</p>
            </div>
          ) : (
            tasks.map(t => {
              const isEditing = editingTask === t.id;
              
              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 ${getStatusColor(t.status)} transform hover:scale-[1.01]`}
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Edit Task</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(t.id)}
                            disabled={isSubmitting}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                            title="Save"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                          <input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                          <textarea
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                          <select
                            value={editPriority}
                            onChange={e => setEditPriority(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                          <select
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to User</label>
                          <select
                            value={editAssignee}
                            onChange={e => setEditAssignee(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                          >
                            <option value="">Unassigned</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to Team</label>
                          <select
                            value={editTeamId}
                            onChange={e => setEditTeamId(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                          >
                            <option value="">No Team</option>
                            {teams.map(team => (
                              <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(t.status)}
                          <h3 className="text-xl font-bold text-gray-900 truncate">{t.title}</h3>
                        </div>
                        
                        {t.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">{t.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(t.priority)}`}>
                            {t.priority}
                          </span>

                          {t.assignee_id && (
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">
                                {users.find(u => u.id === t.assignee_id)?.name || 'Unknown'}
                              </span>
                            </div>
                          )}

                          {t.team_id && (
                            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-700">
                                {teams.find(team => team.id === t.team_id)?.name || 'Unknown'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                          t.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                          t.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {t.status.replace('_', ' ')}
                        </span>

                        <button
                          onClick={() => startEdit(t)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                          title="Edit task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={isSubmitting}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}