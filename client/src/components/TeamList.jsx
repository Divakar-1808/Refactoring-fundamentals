import { useState } from 'react';
import { Users, UserPlus, X, Plus, Crown, ChevronDown, ChevronUp, Edit2, Trash2, Save } from 'lucide-react';
import { createTeam, updateTeam, deleteTeam } from '../api/api';

export default function TeamList({ teams = [], users = [], setTeams }) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const [editingTeam, setEditingTeam] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMembers, setEditMembers] = useState([]);

  const toggleMember = (userId) => {
    setMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleEditMember = (userId) => {
    setEditMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const addTeam = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const team = await createTeam({ 
        name, 
        ownerId: users[0]?.id, 
        members: JSON.stringify(members) 
      });
      setTeams([...teams, team]);
      setName('');
      setMembers([]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (team) => {
    setEditingTeam(team.id);
    setEditName(team.name);
    const teamMembers = getTeamMemberIds(team);
    setEditMembers(teamMembers);
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setEditName('');
    setEditMembers([]);
  };

  const saveEdit = async (team) => {
    if (!editName.trim()) return;
    setIsSubmitting(true);
    try {
      const updatedTeam = await updateTeam(team.id, {
        name: editName,
        ownerId: team.ownerId,
        members: JSON.stringify(editMembers)
      });
      
      setTeams(teams.map(t => t.id === team.id ? updatedTeam : t));
      setEditingTeam(null);
      setEditName('');
      setEditMembers([]);
    } catch (error) {
      console.error('Error updating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (teamId) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    
    setIsSubmitting(true);
    try {
      await deleteTeam(teamId);
      setTeams(teams.filter(t => t.id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeamExpanded = (teamId) => {
    setExpandedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const getTeamMemberIds = (team) => {
    if (!team.members) return [];
    const membersArray = Array.isArray(team.members) 
      ? team.members 
      : JSON.parse(team.members);
    return membersArray.map(id => +id);
  };

  const getTeamMembers = (team) => {
    const memberIds = getTeamMemberIds(team);
    return memberIds
      .map(mid => users.find(u => u.id === mid))
      .filter(Boolean);
  };

  const getTeamColor = (index) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Team Management
            </h2>
            <p className="text-gray-600 mt-2">{teams.length} active teams</p>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isFormOpen ? 'Cancel' : 'New Team'}
          </button>
        </div>

        {/* Add Team Form */}
        {isFormOpen && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Team</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team Name</label>
                <input
                  placeholder="Enter team name..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Team Members ({members.length} selected)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                  {users.map(user => (
                    <label
                      key={user.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        members.includes(user.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-25'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={members.includes(user.id)}
                        onChange={() => toggleMember(user.id)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={addTeam}
              disabled={isSubmitting || !name.trim()}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Creating Team...' : 'Create Team'}
            </button>
          </div>
        )}

        {/* Team List */}
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams yet</h3>
              <p className="text-gray-500">Create your first team to get started</p>
            </div>
          ) : (
            teams.map((team, index) => {
              const teamMembers = getTeamMembers(team);
              const isExpanded = expandedTeams.has(team.id);
              const isEditing = editingTeam === team.id;
              
              return (
                <div
                  key={team.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Team Header */}
                  <div className={`bg-gradient-to-r ${getTeamColor(index)} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Users className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="text-2xl font-bold bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            />
                          ) : (
                            <h3 className="text-2xl font-bold text-white mb-1">{team.name}</h3>
                          )}
                          <p className="text-white text-opacity-90 text-sm">
                            {isEditing ? editMembers.length : teamMembers.length} {(isEditing ? editMembers.length : teamMembers.length) === 1 ? 'member' : 'members'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(team)}
                              disabled={isSubmitting}
                              className="p-2 bg-green-500 bg-opacity-90 backdrop-blur-sm rounded-lg hover:bg-opacity-100 transition-all disabled:opacity-50"
                              title="Save"
                            >
                              <Save className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                              title="Cancel"
                            >
                              <X className="w-5 h-5 text-white" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(team)}
                              className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                              title="Edit team"
                            >
                              <Edit2 className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={() => handleDelete(team.id)}
                              disabled={isSubmitting}
                              className="p-2 bg-red-500 bg-opacity-90 backdrop-blur-sm rounded-lg hover:bg-opacity-100 transition-all disabled:opacity-50"
                              title="Delete team"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={() => toggleTeamExpanded(team.id)}
                              className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-6 h-6 text-white" />
                              ) : (
                                <ChevronDown className="w-6 h-6 text-white" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Members Section */}
                  {isEditing && (
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Edit Team Members ({editMembers.length} selected)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                        {users.map(user => (
                          <label
                            key={user.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              editMembers.includes(user.id)
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-25'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={editMembers.includes(user.id)}
                              onChange={() => toggleEditMember(user.id)}
                              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team Members (Expandable) */}
                  {isExpanded && !isEditing && (
                    <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      {teamMembers.length === 0 ? (
                        <div className="text-center py-8">
                          <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No members in this team</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {teamMembers.map((member, idx) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all"
                            >
                              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTeamColor(idx)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                                {member.id === team.ownerId && (
                                  <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                                    <Crown className="w-3 h-3" />
                                    <span>Team Owner</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Preview (when collapsed) */}
                  {!isExpanded && !isEditing && teamMembers.length > 0 && (
                    <div className="px-6 pb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {teamMembers.slice(0, 4).map((member, idx) => (
                            <div
                              key={member.id}
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTeamColor(idx)} flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md`}
                              title={member.name}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        {teamMembers.length > 4 && (
                          <span className="text-sm text-gray-500 font-medium">
                            +{teamMembers.length - 4} more
                          </span>
                        )}
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