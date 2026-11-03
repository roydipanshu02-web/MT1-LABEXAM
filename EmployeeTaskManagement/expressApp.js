
// Task: Employee Task Management REST API using Express.js

// Import Express
import express from 'express';

// Create Express application
const app = express();

// Configure JSON middleware
app.use(express.json());

// Initialize employee tasks array
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "In Progress",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "Completed",
        priority: "Low"
    }
];

// GET: Retrieve all employee tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET: Retrieve task by ID
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    res.status(200).json(task);
});

// POST: Add a new employee task
app.post('/tasks', (req, res) => {

    const { id, taskName, assignedTo, status, priority } = req.body;

    // Validate required fields
    if (
        id === undefined ||
        !taskName ||
        !assignedTo ||
        !status ||
        !priority
    ) {
        return res.status(400).json({
            message: 'All task fields are required'
        });
    }

    // Check duplicate ID
    if (tasks.some(t => t.id === Number(id))) {
        return res.status(409).json({
            message: 'Task ID already exists'
        });
    }

    const newTask = {
        id: Number(id),
        taskName,
        assignedTo,
        status,
        priority
    };

    tasks.push(newTask);

    res.status(201).json({
        message: 'Task added successfully',
        task: newTask
    });
});

// PUT: Update an existing task
app.put('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (
        !taskName ||
        !assignedTo ||
        !status ||
        !priority
    ) {
        return res.status(400).json({
            message: 'All task fields are required'
        });
    }

    tasks[taskIndex] = {
        id,
        taskName,
        assignedTo,
        status,
        priority
    };

    res.status(200).json({
        message: 'Task updated successfully',
        task: tasks[taskIndex]
    });
});

// DELETE: Delete an existing task
app.delete('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found'
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1);

    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: 'Invalid JSON data'
        });
    }

    res.status(500).json({
        message: 'Internal Server Error'
    });
});

// Start Express server on port 4000
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
