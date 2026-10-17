import { useState } from 'react';
import { UserPlus, Mail, User, X, Plus, Search, Edit2, Trash2, Save } from 'lucide-react';
import { createUser, updateUser, deleteUser } from '../api/api';

export default function UserList({ users = [], setUsers }) {
  const [name, setName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit state
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const addUser = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const user = await createUser({ 
        name, 
        email: `${name.replace(/\s/g, '').toLowerCase()}@mail.com` 
      });
      setUsers([...users, user]);
      setName('');
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditName('');
    setEditEmail('');
  };

  const saveEdit = async (userId) => {
    if (!editName.trim() || !editEmail.trim()) return;
    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser(userId, {
        name: editName,
        email: editEmail
      });
      
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      cancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    setIsSubmitting(true);
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && name.trim()) {
      addUser();
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarColor = (index) => {
    const colors = [
      'from-rose-400 to-pink-500',
      'from-blue-400 to-cyan-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-indigo-500',
      'from-orange-400 to-red-500',
      'from-teal-400 to-green-500',
      'from-fuchsia-400 to-purple-500',
      'from-amber-400 to-orange-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              User Directory
            </h2>
            <p className="text-gray-600 mt-2">{users.length} total users</p>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isFormOpen ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {/* Add User Form */}
        {isFormOpen && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  placeholder="Enter user's name..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (Auto-generated)
                </label>
                <div className="relative">
                  <input
                    value={name ? `${name.replace(/\s/g, '').toLowerCase()}@mail.com` : ''}
                    readOnly
                    placeholder="Email will be generated automatically..."
                    className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 outline-none"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              onClick={addUser}
              disabled={isSubmitting || !name.trim()}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              {isSubmitting ? 'Adding User...' : 'Add User'}
            </button>
          </div>
        )}

        {/* Search Bar */}
        {users.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none shadow-sm"
              />
            </div>
          </div>
        )}

        {/* User List */}
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users yet</h3>
              <p className="text-gray-500">Add your first user to get started</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user, index) => {
                const isEditing = editingUser === user.id;
                
                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:scale-[1.02]"
                  >
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900">Edit User</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(user.id)}
                              disabled={isSubmitting}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                          <input
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                            type="email"
                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
                              {user.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <p className="text-sm truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* User ID and Actions */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400">
                            ID: {user.id}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(user)}
                              className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                              title="Edit user"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={isSubmitting}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Counter */}
        {users.length > 0 && searchTerm && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-indigo-600">{filteredUsers.length}</span> of{' '}
              <span className="font-semibold">{users.length}</span> users
            </p>
          </div>
        )}
      </div>
    </div>
  );
}