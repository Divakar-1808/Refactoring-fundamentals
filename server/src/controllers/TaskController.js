const Task = require('../models/task');
const User = require('../models/user');
const Team = require('../models/team');
const { TASK_PRIORITY, TASK_STATUS } = require('../constants/taskConstants');

async function validateAssigneeAndTeam(assignee_id, team_id, res) {
  if (assignee_id) {
    const user = await User.findById(assignee_id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return false;
    }
  }
  if (team_id) {
    const team = await Team.findById(team_id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return false;
    }
  }
  return true;
}

exports.createTask = async (req, res) => {
  const { title, description, priority, status, assignee_id, team_id } = req.body;

  if (!title) return res.status(400).json({ error: 'Title required' });

  try {
    const isValid = await validateAssigneeAndTeam(assignee_id, team_id, res);
    if (!isValid) return;

    const task = await Task.create({
      title,
      description: description || null,
      priority: priority || TASK_PRIORITY.MEDIUM,
      status: status || TASK_STATUS.TODO,
      assignee_id: assignee_id || null,
      team_id: team_id || null
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Task creation failed' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, assignee_id, team_id } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const isValid = await validateAssigneeAndTeam(assignee_id, team_id, res);
    if (!isValid) return;

    const updatedData = {
      title: title ?? task.title,
      description: description ?? task.description,
      priority: priority ?? task.priority,
      status: status ?? task.status,
      assignee_id: assignee_id ?? task.assignee_id,
      team_id: team_id ?? task.team_id
    };

    const updatedTask = await Task.update(id, updatedData);
    res.json(updatedTask);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Task update failed' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.delete(id);
    res.json({ message: 'Task deleted successfully', id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Task deletion failed' });
  }
};