#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { select, text, confirm, multiselect } = require('@clack/prompts');
const chalk = require('chalk');
const { exec } = require('child_process');

const gradient = chalk.hex('#57F287');
const accent = chalk.hex('#5865F2');
const errorColor = chalk.hex('#ED4245');
const warningColor = chalk.hex('#FEE75C');

const log = (message, type = 'info') => {
    const timestamp = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
    const symbols = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const colors = {
        success: gradient,
        error: errorColor,
        info: accent,
        warning: warningColor
    };

    console.log(`${timestamp} ${colors[type](symbols[type])} ${chalk.white(message)}`);
};

/**
 * Get all files recursively from a directory
 */
const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        } else if (file.endsWith('.js')) {
            arrayOfFiles.push(filePath);
        }
    });
    
    return arrayOfFiles;
};

/**
 * Get command/event tree structure
 */
const getFileTree = (basePath) => {
    const tree = {};
    const files = getAllFiles(basePath);
    
    files.forEach(file => {
        const relativePath = path.relative(basePath, file);
        const parts = relativePath.split(path.sep);
        const category = parts.length > 1 ? parts[0] : 'Root';
        
        if (!tree[category]) {
            tree[category] = [];
        }
        tree[category].push({
            name: path.basename(file, '.js'),
            path: file,
            relativePath: relativePath
        });
    });
    
    return tree;
};

/**
 * Pause/Resume commands
 */
const toggleCommandState = async (filePath, disable) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (disable) {
            if (!content.includes('disabled:')) {
                content = content.replace(
                    /(module\.exports\s*=\s*{)/,
                    `$1\n    disabled: true,`
                );
            } else {
                content = content.replace(/disabled:\s*false/g, 'disabled: true');
            }
            log(`Command paused: ${path.basename(filePath)}`, 'success');
        } else {
            content = content.replace(/disabled:\s*true/g, 'disabled: false');
            log(`Command resumed: ${path.basename(filePath)}`, 'success');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch (error) {
        log(`Error toggling command state: ${error.message}`, 'error');
        return false;
    }
};

/**
 * Open file in default editor
 */
const openInEditor = (filePath) => {
    return new Promise((resolve, reject) => {
        const editor = process.env.EDITOR || 'notepad';
        const command = process.platform === 'win32' 
            ? `start ${editor} "${filePath}"`
            : `${editor} "${filePath}"`;
        
        exec(command, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

/**
 * Delete file with confirmation
 */
const deleteFile = async (filePath) => {
    const confirmed = await confirm({
        message: `Are you sure you want to delete ${chalk.red(path.basename(filePath))}? This cannot be undone!`
    });
    
    if (confirmed) {
        try {
            fs.unlinkSync(filePath);
            log(`File deleted: ${path.basename(filePath)}`, 'success');
            return true;
        } catch (error) {
            log(`Error deleting file: ${error.message}`, 'error');
            return false;
        }
    }
    return false;
};

/**
 * Main menu
 */
const mainMenu = async () => {
    console.clear();
    console.log(gradient.bold('\n🛠️  DISCOBASE MANAGER\n'));
    
    const action = await select({
        message: 'What would you like to do?',
        options: [
            { value: 'manage-commands', label: '⚙️  Manage Commands' },
            { value: 'manage-events', label: '📅 Manage Events' },
            { value: 'create-new', label: '➕ Create New (Command/Event)' },
            { value: 'exit', label: '🚪 Exit' }
        ]
    });
    
    if (action === 'exit') {
        log('Goodbye! 👋', 'info');
        process.exit(0);
    }
    
    if (action === 'create-new') {
        require('./cli.js');
        return;
    }
    
    if (action === 'manage-commands') {
        await manageFiles(path.join(__dirname, 'src', 'commands'), 'Commands');
    } else if (action === 'manage-events') {
        await manageFiles(path.join(__dirname, 'src', 'events'), 'Events');
    }
};

/**
 * Manage files (commands or events)
 */
const manageFiles = async (basePath, type) => {
    if (!fs.existsSync(basePath)) {
        log(`${type} directory not found!`, 'error');
        return mainMenu();
    }
    
    const tree = getFileTree(basePath);
    const categories = Object.keys(tree);
    
    if (categories.length === 0) {
        log(`No ${type.toLowerCase()} found!`, 'warning');
        return mainMenu();
    }
    
    const category = await select({
        message: `Select a category:`,
        options: [
            ...categories.map(cat => ({ value: cat, label: `📁 ${cat} (${tree[cat].length} files)` })),
            { value: 'back', label: '⬅️  Back to Main Menu' }
        ]
    });
    
    if (category === 'back') {
        return mainMenu();
    }
    
    const file = await select({
        message: `Select a ${type.slice(0, -1).toLowerCase()}:`,
        options: [
            ...tree[category].map(f => ({ 
                value: f.path, 
                label: `📄 ${f.name}` 
            })),
            { value: 'back', label: '⬅️  Back' }
        ]
    });
    
    if (file === 'back') {
        return manageFiles(basePath, type);
    }
    
    const action = await select({
        message: `What would you like to do with ${chalk.cyan(path.basename(file))}?`,
        options: [
            { value: 'edit', label: '✏️  Edit' },
            { value: 'pause', label: '⏸️  Pause/Disable' },
            { value: 'resume', label: '▶️  Resume/Enable' },
            { value: 'delete', label: '🗑️  Delete' },
            { value: 'back', label: '⬅️  Back' }
        ]
    });
    
    switch (action) {
        case 'edit':
            log(`Opening ${path.basename(file)} in editor...`, 'info');
            try {
                await openInEditor(file);
                log('File opened successfully!', 'success');
            } catch (error) {
                log(`Could not open editor: ${error.message}`, 'error');
            }
            break;
        case 'pause':
            await toggleCommandState(file, true);
            break;
        case 'resume':
            await toggleCommandState(file, false);
            break;
        case 'delete':
            await deleteFile(file);
            break;
        case 'back':
            return manageFiles(basePath, type);
    }
    
    return manageFiles(basePath, type);
};

(async () => {
    await mainMenu();
})();
