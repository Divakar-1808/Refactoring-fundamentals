const Team = require('../models/team');
const User = require('../models/user');

function prepareTeamMembers(members, ownerId) {
  const parsedMembers = members
    ? typeof members === 'string'
      ? JSON.parse(members)
      : members
    : [];

  if (ownerId && !parsedMembers.includes(ownerId)) {
    parsedMembers.unshift(ownerId);
  }

  return parsedMembers;
};

exports.createTeam = async (req, res) => {
  const { name, ownerId, members } = req.body; // Get members from request
  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Missing team data' });
  }
  try {
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    
    const membersList = prepareTeamMembers(members, ownerId);
    
    const team = await Team.create({
      name,
      ownerId,
      members: JSON.stringify(membersList)
    });
    res.json(team);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Team creation failed' });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();

    // parse members JSON before sending
    const formattedTeams = teams.map(t => ({
      ...t,
      members: JSON.parse(t.members)
    }));

    res.json(formattedTeams);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// Add to your existing team controller file

exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, ownerId, members } = req.body;
  
  try {
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const membersList = prepareTeamMembers(members, ownerId);

    const updatedData = {
      name: name || team.name,
      ownerId: ownerId || team.ownerId,
      members: JSON.stringify(membersList)
    };

    await Team.update(id, updatedData);
    const updatedTeam = await Team.findById(id);
    
    res.json(updatedTeam);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Team update failed' });
  }
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.params;
  
  try {
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    await Team.delete(id);
    res.json({ message: 'Team deleted successfully', id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Team deletion failed' });
  }
};