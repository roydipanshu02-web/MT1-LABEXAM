
// Task: Employee Task Management using Node.js HTTP and FS Modules

// Import required modules
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Array to store employee tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "In Progress"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "Completed"
    }
];

// Create HTTP server
const server = http.createServer((req, res) => {

    // Set common response header
    res.setHeader('Content-Type', 'application/json');

    // Route 1: Home route
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>Welcome to Employee Task Management System</h1>
            <p>Node.js HTTP Server is running successfully.</p>
        `);
    }

    // Route 2: Get all tasks
    else if (req.method === 'GET' && req.url === '/tasks') {
        res.writeHead(200);
        res.end(JSON.stringify(tasks, null, 2));
    }

    // Route 3: About route
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>About Employee Task Management</h1>
            <p>This application manages employee tasks using Node.js.</p>
        `);
    }

    // Route 4: Serve HTML using FS module
    else if (req.method === 'GET' && req.url === '/home') {
        const filePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Error reading HTML file');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(data);
            }
        });
    }

    // Route 5: Add a new task using POST
    else if (req.method === 'POST' && req.url === '/add-task') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);

                // Validate required fields
                const { id, taskName, assignedTo, status } = newTask;

                if (
                    id === undefined ||
                    !taskName ||
                    !assignedTo ||
                    !status
                ) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        message: 'All required fields are necessary'
                    }));
                    return;
                }

                // Check duplicate ID
                if (tasks.some(task => task.id === id)) {
                    res.writeHead(409);
                    res.end(JSON.stringify({
                        message: 'Task ID already exists'
                    }));
                    return;
                }

                tasks.push({
                    id,
                    taskName,
                    assignedTo,
                    status
                });

                res.writeHead(201);
                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task: newTask
                }));

            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    message: 'Invalid JSON data'
                }));
            }
        });
    }

    // Route 6: Invalid route
    else {
        res.writeHead(404);
        res.end(JSON.stringify({
            message: '404 - Route Not Found'
        }));
    }
});

// Start server on port 3000
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});