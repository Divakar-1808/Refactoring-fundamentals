const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const UserController = require('../controllers/UserController');
const TeamController = require('../controllers/TeamController');

// Users
router.post('/users', UserController.createUser);
router.get('/users', UserController.getAllUsers);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Teams
router.post('/teams', TeamController.createTeam);
router.get('/teams', TeamController.getTeams);
router.put('/teams/:id', TeamController.updateTeam);
router.delete('/teams/:id', TeamController.deleteTeam);

// Tasks
router.post('/tasks', TaskController.createTask);
router.get('/tasks', TaskController.getTasks);
router.put('/tasks/:id', TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);

module.exports = router;