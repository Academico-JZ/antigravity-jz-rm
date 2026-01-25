#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Determine the script path relative to this binary wrapper
const psFile = path.join(__dirname, '..', '.agent', 'ag-jz.ps1');

// Capture all arguments passed to this wrapper
const args = process.argv.slice(2);

// Spawn PowerShell to execute the ps1 script with arguments
// We use 'pwsh' for cross-platform PowerShell Core if available, falling back to 'powershell' on Windows might be needed but assuming pwsh for modern envs
const child = spawn('pwsh', ['-ExecutionPolicy', 'Bypass', '-File', psFile, ...args], {
    stdio: 'inherit' // Pipe I/O directly to parent process
});

child.on('error', (err) => {
    console.error('Failed to start subprocess:', err);
    console.log('Trying with "powershell" instead of "pwsh"...');
    // Fallback to older powershell if pwsh missing
    const childFallback = spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', psFile, ...args], {
        stdio: 'inherit'
    });
    childFallback.on('exit', (code) => process.exit(code));
});

child.on('exit', (code) => {
    process.exit(code);
});
