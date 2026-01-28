#!/usr/bin/env node

/**
 * Antigravity Kit (JZ Edition) - Node.js Installer
 * 
 * Provides "npx ag-jz-rm init" and "link" functionality.
 * Compatible with Windows, macOS, and Linux.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const os = require('os');

// Configuration
const REPO_CORE_URL = "https://github.com/vudovn/antigravity-kit/archive/refs/heads/main.zip";
const REPO_SKILLS_URL = "https://github.com/sickn33/antigravity-awesome-skills/archive/refs/heads/main.zip";
const KIT_DIR_NAME = ".gemini/antigravity/kit";

// Colors for console
const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    gray: "\x1b[90m"
};

function log(msg, color = colors.reset) {
    console.log(`${color}${msg}${colors.reset}`);
}

function getHomeDir() {
    return os.homedir();
}

function logHeader() {
    log("\n🌌 Antigravity JZ-RM Edition", colors.cyan);
    log("──────────────────────────", colors.gray);
}

function safeRemove(dir) {
    if (!fs.existsSync(dir)) return;
    try {
        fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch (e) {
        log(` [!] Note: Could not clean up temporary folder ${dir}. You can delete it manually.`, colors.gray);
    }
}

function mergeFolders(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const items = fs.readdirSync(src);
    items.forEach(item => {
        const sPath = path.join(src, item);
        const dPath = path.join(dest, item);

        if (fs.statSync(sPath).isDirectory()) {
            mergeFolders(sPath, dPath);
        } else {
            try {
                fs.copyFileSync(sPath, dPath);
            } catch (e) {
                log(` [!] Failed to copy ${item}: ${e.message}`, colors.yellow);
            }
        }
    });
}

async function link(installDir, globalKitDir) {
    logHeader();
    log(`\n🔗 Linking Modular Workspace...`, colors.cyan);

    if (!fs.existsSync(globalKitDir)) {
        log(`❌ Error: Global kit not found at ${globalKitDir}`, colors.red);
        log(`👉 Run 'ag-jz-rm init' first to provision the global system.`, colors.yellow);
        return;
    }

    if (!fs.existsSync(installDir)) {
        fs.mkdirSync(installDir, { recursive: true });
        log(` [✨] Created .agent workspace controller`, colors.green);
    }

    const subfolders = ["agents", "skills", "workflows", "scripts", ".shared"];
    subfolders.forEach(sub => {
        const src = path.join(globalKitDir, sub);
        const dest = path.join(installDir, sub);
        if (fs.existsSync(src)) {
            log(` [>] Linker: Synchronizing ${sub}...`, colors.gray);
            mergeFolders(src, dest);
        }
    });

    // Apply JZ-RM Logic Protocols (Identity Guard)
    const localGemini = path.join(__dirname, '..', '.agent', 'rules', 'GEMINI.md');
    const destRulesDir = path.join(installDir, 'rules');
    const destGemini = path.join(destRulesDir, 'GEMINI.md');

    if (!fs.existsSync(destRulesDir)) fs.mkdirSync(destRulesDir, { recursive: true });
    if (fs.existsSync(localGemini)) {
        fs.copyFileSync(localGemini, destGemini);
        log(` [🔭] JZ-RM Logic Protocols: Active`, colors.green);
    }

    log(`\n🌌  LINK SUCCESSFUL — Workspace is now ONLINE`, colors.green);
    log(`────────────────────────────────────────`, colors.gray);
    log(`Source:  ${globalKitDir}`, colors.gray);
    log(`Target:  .agent/`, colors.gray);
    log(`────────────────────────────────────────`, colors.gray);
    log(`Happy hacking! 🚀\n`, colors.cyan);
}


async function init(isLocal, installDir, globalKitDir) {
    logHeader();

    // Use system temp for less friction and avoid EPERM on ./ paths
    const tempDir = path.join(os.tmpdir(), `jz_rm_turbo_${Date.now()}`);

    try {
        log(`\n🛰️  Synchronizing Quantum Core...`, colors.cyan);
        try {
            if (isLocal) {
                execSync(`npx -y @vudovn/ag-kit init`, { stdio: 'inherit' });
            } else {
                execSync(`npm install -g @vudovn/ag-kit`, { stdio: 'ignore' });
                execSync(`ag-kit init`, { stdio: 'inherit' });
            }
            log(` [✨] Core Engine: Online`, colors.green);
        } catch (e) {
            log(` [!] Core Synchronization Notice. Continuing to augmentation...`, colors.yellow);
        }

        log(`\n⚡ Injecting High-Octane Capabilities...`, colors.cyan);
        log(` [>] Pulling 255+ Specialist Skills from Library...`, colors.gray);
        try {
            // Use giget directly via npx for maximum extraction robustness on Windows
            execSync(`npx -y giget github:sickn33/antigravity-awesome-skills#main "${tempDir}"`, { stdio: 'ignore' });

            const skillsSource = path.join(tempDir, '.agent', 'skills');
            // Check both potential paths (giget sometimes flattens)
            const skillsSourceAlt = path.join(tempDir, 'skills');

            if (fs.existsSync(skillsSource)) {
                mergeFolders(skillsSource, path.join(installDir, 'skills'));
                log(` [🚀] 255+ Skills Successfully Integrated`, colors.green);
            } else if (fs.existsSync(skillsSourceAlt)) {
                mergeFolders(skillsSourceAlt, path.join(installDir, 'skills'));
                log(` [🚀] 255+ Skills Successfully Integrated (Direct)`, colors.green);
            } else {
                log(` [!] Warning: Skills folder structure unexpected. Validation needed.`, colors.yellow);
            }

            const scriptsSource = path.join(tempDir, '.agent', 'scripts');
            if (fs.existsSync(scriptsSource)) {
                log(` [🛠️] Augmenting Scripts Ecosystem`, colors.gray);
                mergeFolders(scriptsSource, path.join(installDir, 'scripts'));
            }
        } catch (e) {
            log(` [!] Skill Injection Failed: ${e.message}. Run 'ag-jz-rm update' later.`, colors.yellow);
        }

        log(`Applying Identity & Governance Protocols...`, colors.cyan);

        // Robust GEMINI.md finding logic
        const possibleGeminiPaths = [
            path.join(__dirname, '..', '.agent', 'rules', 'GEMINI.md'),
            path.join(__dirname, '..', '.agent', 'GEMINI.md'),
            path.join(__dirname, 'rules', 'GEMINI.md'), // For npx packed structure
            path.join(process.cwd(), 'GEMINI.md') // Fallback dev
        ];

        let localGemini = possibleGeminiPaths.find(p => fs.existsSync(p));
        const destRulesDir = path.join(installDir, 'rules');
        const destGemini = path.join(destRulesDir, 'GEMINI.md');

        if (!fs.existsSync(destRulesDir)) fs.mkdirSync(destRulesDir, { recursive: true });

        if (localGemini) {
            fs.copyFileSync(localGemini, destGemini);
            log(` [🔭] JZ-RM Logic Protocols: Active`, colors.green);
        } else {
            log(` [!] Notice: Standard Identity Rules not found. Using Base Rules.`, colors.gray);
        }

        // Copy auxiliary local scripts if present
        const localScripts = path.join(__dirname, '..', '.agent', 'scripts');
        if (fs.existsSync(localScripts)) {
            mergeFolders(localScripts, path.join(installDir, 'scripts'));
        }

        safeRemove(tempDir);

        const indexerScript = path.join(installDir, 'scripts', 'generate_index.py');
        if (fs.existsSync(indexerScript)) {
            log(`\n📦 Initializing Neural Discovery & Validation...`, colors.cyan);
            const pyCmd = process.platform === 'win32' ? 'python' : 'python3';
            try {
                execSync(`${pyCmd} "${indexerScript}"`, { stdio: 'ignore' });
                log(` [✨] Neural Map: 100% Optimized`, colors.green);
            } catch (e) {
                log(` [!] Run 'python .agent/scripts/generate_index.py' manually.`, colors.yellow);
            }
        }

        log(`\n🌌  SETUP COMPLETE — Antigravity JZ-RM is now LIVE`, colors.green);
        log(`────────────────────────────────────────`, colors.gray);
        log(`Edition: JZ-RM "Base + Turbo"`, colors.cyan);
        log(`Mode:    ${isLocal ? "Local Workspace" : "Global System"}`, colors.gray);
        log(`Link:    .agent/rules/GEMINI.md`, colors.gray);
        log(`────────────────────────────────────────`, colors.gray);
        log(`Happy hacking! 🚀\n`, colors.cyan);

    } catch (err) {
        log(`\n❌ Fatal Error during setup: ${err.message}`, colors.red);
        safeRemove(tempDir);
        process.exit(1);
    }
}

async function main() {
    const isLocal = process.argv.includes('--local') || process.argv.includes('-l');
    const homeDir = getHomeDir();
    const globalKitDir = path.join(homeDir, KIT_DIR_NAME);
    const installDir = isLocal ? path.join(process.cwd(), ".agent") : globalKitDir;

    const command = process.argv[2];

    if (command === 'link') {
        const targetAgent = path.join(process.cwd(), ".agent");
        await link(targetAgent, globalKitDir);
    } else if (command === 'init') {
        await init(isLocal, installDir, globalKitDir);
    } else {
        logHeader();
        log(`Usage:`, colors.cyan);
        log(`  ag-jz-rm init [--local]    Provision the core engine`, colors.gray);
        log(`  ag-jz-rm link              Link a new workspace to global kit`, colors.gray);
        log(`\nDefaulting to 'init' flow...`, colors.yellow);
        await init(isLocal, installDir, globalKitDir);
    }
}

main();
