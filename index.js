#!/usr/bin/env node

const colors = {
    'reset': '\x1b[0m',
    'red': '\x1b[31m',
    'green': '\x1b[32m',
    'yellow': '\x1b[33m',
    'blue': '\x1b[34m',
};

const fileManager = require('./fileManager.js'); 

const filePath = 'tasks.json';
const args = process.argv.slice(2);

fileManager.CheckAndCreateFileSync(filePath);

const tasks = fileManager.ReadFileSync(filePath);

const ValidateTaskId = (taskId) => {
    if (taskId === undefined) {
        console.log(`${colors.yellow}Task ID cannot be empty`);
        return false;
    }
    return true;
};

const FindTaskIndexById = (taskId) => {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex === -1) {
        console.log(`${colors.red}Task not found`);
        return -1;
    }
    return taskIndex;
};

const commands = {
    'help': () => {
        console.log(`${colors.yellow}Available commands: \n`);
        Object.keys(commands).forEach(command => {
            console.log(`   ${colors.blue}${command}`);
        });
    },
    'add': (taskDescription) => {
        try {
            if (taskDescription === undefined)
            {
                console.log(`${colors.yellow}Task description cannot be empty`);
                return;
            }

            if (tasks.some(task => task.description === taskDescription))
                return console.log(`${colors.yellow}Task already exists`);

            let nextId = Math.max(...tasks.map(task => task.id), 0) + 1;

            tasks.push({
                id: nextId,
                description: taskDescription,
                status: 'todo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            fileManager.UpdateFile(tasks, filePath);

            console.log(`${colors.green}Task added successfully (ID: ${nextId})`);
        } catch (error) {
            console.error(`${colors.red}Error when trying to add task`);
        }
    },
    'update': (taskId, newTaskDescription) => {
        try {
            if (!ValidateTaskId(taskId)) return;

            const taskIndex = FindTaskIndexById(taskId);
            if (taskIndex === -1) return;

            if (newTaskDescription === undefined) {
                console.log(`${colors.yellow}Task description cannot be empty`);
                return;
            }

            tasks[taskIndex].description = newTaskDescription;
            tasks[taskIndex].updatedAt = new Date().toISOString();

            fileManager.UpdateFile(tasks, filePath);

            console.log(`${colors.green}Task updated successfully`);
        } catch (error) {
            console.error(`${colors.red}Error when trying to update task`);
        }
    },
    'delete': (taskId) => {
        try {
            if (!ValidateTaskId(taskId)) return;

            const taskIndex = FindTaskIndexById(taskId);
            if (taskIndex === -1) return;

            tasks.splice(taskIndex, 1);

            fileManager.UpdateFile(tasks, filePath);

            console.log(`${colors.green}Task deleted successfully`);
        } catch (error) {
            console.error(`${colors.red}Error when trying to delete task`);
        }
    },
    'mark-in-progress': (taskId) => {
        try {
            if (!ValidateTaskId(taskId)) return;

            const taskIndex = FindTaskIndexById(taskId);
            if (taskIndex === -1) return;

            tasks[taskIndex].status = 'in-progress';
            tasks[taskIndex].updatedAt = new Date().toISOString();

            fileManager.UpdateFile(tasks, filePath);

            console.log(`${colors.green}Task marked as in-progress`);
        } catch(error) {
            console.error(`${colors.red}Error when trying to mark task as in-progress`);
        }
    },
    'mark-done': (taskId) => {
        try{
            if (!ValidateTaskId(taskId)) return;

            const taskIndex = FindTaskIndexById(taskId);
            if (taskIndex === -1) return;

            tasks[taskIndex].status = 'done';
            tasks[taskIndex].updatedAt = new Date().toISOString();

            fileManager.UpdateFile(tasks, filePath);

            console.log(`${colors.green}Task marked as done`);
        } catch (error) {
            console.error(`${colors.red}Error when trying to mark task as done`);
        }
    },
    'list': (status = null) => {
        try {
            if (tasks.length === 0)
                return console.log(`${colors.red}No tasks found`);
            
            if (!status) {
                console.table(tasks);
                return;
            }

            const validStatuses = ['todo', 'in-progress', 'done'];
            if (!validStatuses.includes(status)) {
                console.log(`${colors.red}Invalid status: ${status}. Use todo, in-progress or done`);
                return;
            }

            const filterTasks = tasks.filter(task => task.status === status);
            
            if (filterTasks.length === 0)
                return console.log(`${colors.red}No tasks found with status: ${status}`); 

            console.table(filterTasks);
        }
        catch (error) {
            console.error(`${colors.red}Error when trying to list tasks`);	
        }
    }
};

if (commands[args[0]]) {
    commands[args[0]](...args.slice(1)); 
} else {
    console.log(`${colors.red}Invalid command. \n Type ${colors.yellow}help${colors.red} to see the available commands`       
    );
}

console.log(`${colors.reset}`);