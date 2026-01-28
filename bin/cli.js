#!/usr/bin/env node

/**
 * Antigravity Kit (JZ Edition) - Node.js Installer
 * 
 * Provides "npx ag-jz-rm init" functionality.
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

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        let downloadedBytes = 0;
        let lastDataTime = Date.now();
        const INACTIVITY_TIMEOUT = 20000; // 20s de inatividade causa timeout

        const request = https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                log(`[>] Redirecting to download server...`, colors.gray);
                file.close();
                fs.unlink(dest, () => { });
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Server returned ${response.statusCode}`));
                return;
            }

            const totalSize = parseInt(response.headers['content-length'], 10);

            let startTime = Date.now();
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                lastDataTime = Date.now();
                const elapsedSeconds = (Date.now() - startTime) / 1000;
                const speed = (downloadedBytes / 1024 / (elapsedSeconds || 1)).toFixed(1);

                if (totalSize) {
                    const percent = ((downloadedBytes / totalSize) * 100).toFixed(0);
                    process.stdout.write(`\r[>] Progress: ${percent}% (${(downloadedBytes / 1024).toFixed(0)} KB) @ ${speed} KB/s    `);
                } else {
                    process.stdout.write(`\r[>] Progress: ${(downloadedBytes / 1024).toFixed(0)} KB @ ${speed} KB/s    `);
                }
            });

            response.pipe(file);

            file.on('finish', () => {
                process.stdout.write('\n');
                file.close();
                clearInterval(inactivityCheck);
                resolve();
            });
        }).on('error', (err) => {
            process.stdout.write('\n');
            fs.unlink(dest, () => { });
            clearInterval(inactivityCheck);
            reject(err);
        });

        // Socket Inactivity Monitor
        const inactivityCheck = setInterval(() => {
            if (Date.now() - lastDataTime > INACTIVITY_TIMEOUT) {
                clearInterval(inactivityCheck);
                request.destroy();
                reject(new Error(`Download stalled (no data for ${INACTIVITY_TIMEOUT / 1000}s). Check your internet.`));
            }
        }, 2000);
    });
}

function logHeader() {
    log("\n🌌 Antigravity JZ-RM Edition", colors.cyan);
    log("──────────────────────────", colors.gray);
}

async function fetchRepo(url, name, destDir) {
    const zipPath = path.join(destDir, `${name}.zip`);
    log(`[>] Downloading ${name} library...`, colors.gray);
    await downloadFile(url, zipPath);

    const extractPath = path.join(destDir, name);
    if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath, { recursive: true });

    try {
        execSync(`tar -xf "${zipPath}" -C "${extractPath}"`, { stdio: 'ignore' });
    } catch (e) {
        if (process.platform === 'win32') {
            execSync(`powershell -c "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractPath}' -Force"`, { stdio: 'ignore' });
        } else {
            throw e;
        }
    }
    fs.unlinkSync(zipPath);

    const extractedFolder = fs.readdirSync(extractPath).find(n => {
        const fullPath = path.join(extractPath, n);
        return fs.statSync(fullPath).isDirectory() && n !== "__MACOSX";
    });

    return path.join(extractPath, extractedFolder);
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
            fs.copyFileSync(sPath, dPath);
        }
    });
}

async function main() {
    logHeader();

    const isLocal = process.argv.includes('--local') || process.argv.includes('-l');
    const homeDir = getHomeDir();
    const globalKitDir = path.join(homeDir, KIT_DIR_NAME);
    const installDir = isLocal ? path.join(process.cwd(), ".agent") : globalKitDir;
    const tempDir = path.join(process.cwd(), "tmp_jz_rm");

    try {
        // 1. Base Layer Initialization
        log(`\n🚀 Initializing Antigravity Core (@vudovn/ag-kit)...`, colors.cyan);
        try {
            if (isLocal) {
                // Ensure target dir doesn't block giget
                execSync(`npx -y @vudovn/ag-kit init`, { stdio: 'inherit' });
            } else {
                log(`[>] Global mode: Installing @vudovn/ag-kit core...`, colors.gray);
                execSync(`npm install -g @vudovn/ag-kit`, { stdio: 'ignore' });
                execSync(`ag-kit init`, { stdio: 'inherit' });
            }
        } catch (e) {
            log(`[!] Base initialization warned or failed. Attempting to continue...`, colors.yellow);
        }

        // 2. High-Octane Skills Augmentation (Sickn33)
        log(`\nTurbo-charging Skills Ecosystem...`, colors.cyan);
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        fs.mkdirSync(tempDir, { recursive: true });

        const skillsPath = await fetchRepo(REPO_SKILLS_URL, "skills", tempDir);
        const skillsSource = path.join(skillsPath, '.agent', 'skills');

        if (fs.existsSync(skillsSource)) {
            log(` [+] Injecting 255+ Specialist Skills`, colors.gray);
            mergeFolders(skillsSource, path.join(installDir, 'skills'));
        }

        // 3. Identity Governance (GEMINI.md)
        log(`Applying Identity & Rules Governance...`, colors.cyan);

        // Use the local GEMINI.md from this package as the source of truth
        const localGemini = path.join(__dirname, '..', '.agent', 'rules', 'GEMINI.md');
        const destRulesDir = path.join(installDir, 'rules');
        const destGemini = path.join(destRulesDir, 'GEMINI.md');

        if (!fs.existsSync(destRulesDir)) fs.mkdirSync(destRulesDir, { recursive: true });
        if (fs.existsSync(localGemini)) {
            fs.copyFileSync(localGemini, destGemini);
            log(` [✨] Antigravity JZ-RM Rules Activated`, colors.green);
        }

        // Copy auxiliary scripts too
        const localScripts = path.join(__dirname, '..', '.agent', 'scripts');
        const destScripts = path.join(installDir, 'scripts');
        if (fs.existsSync(localScripts)) {
            mergeFolders(localScripts, destScripts);
        }

        // 4. Cleanup
        fs.rmSync(tempDir, { recursive: true, force: true });

        // 5. Final Orchestration (Indexing)
        const indexerScript = path.join(destScripts, 'generate_index.py');
        if (fs.existsSync(indexerScript)) {
            log(`\n📦 Indexing Capabilities...`, colors.cyan);
            try {
                execSync(`python "${indexerScript}"`, { stdio: 'ignore' });
                log(` [✨] Skills Indexer: 100% Optimized`, colors.green);
            } catch (e) {
                log(` [!] Indexer manual run: python .agent/scripts/generate_index.py`, colors.yellow);
            }
        }

        log(`\n✅ ${isLocal ? "Local" : "Global"} Setup Complete!`, colors.green);
        log(`🚀 Antigravity JZ-RM is now ONLINE.`, colors.cyan);
        log(`Rules: .agent/rules/GEMINI.md`, colors.gray);
        log(`\n──────────────────────────`, colors.gray);

    } catch (err) {
        log(`\n❌ Setup Error: ${err.message}`, colors.red);
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        process.exit(1);
    }
}

main();
