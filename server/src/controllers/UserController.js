const User = require('../models/user');

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Invalid user data' });
  }
  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = await User.create({
      name,
      email,
      status: 'ACTIVE'
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'User creation failed' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    const isEmailChanged = email && email !== user.email;

    if (isEmailChanged) {
      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedData = {
      name: name || user.name,
      email: email || user.email,
      status: status || user.status
    };

    await User.update(id, updatedData);
    const updatedUser = await User.findById(id);

    res.json(updatedUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'User update failed' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.delete(id);
    res.json({ message: 'User deleted successfully', id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'User deletion failed' });
  }
};