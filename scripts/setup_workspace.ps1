# setup_workspace.ps1
# Automates the linkage of a local workspace to the Global Antigravity Kit

$GlobalKitPath = Join-Path $env:USERPROFILE ".gemini\antigravity\kit"
$LocalAgentPath = Join-Path (Get-Location) ".agent"

Write-Host "[AG-KIT] Initializing Workspace Link..." -ForegroundColor Cyan

if (-not (Test-Path $GlobalKitPath)) {
    Write-Error "Global Kit not found at $GlobalKitPath. Please ensure the kit is installed in your home directory."
    exit 1
}

# 1. Create .agent directory
if (-not (Test-Path $LocalAgentPath)) {
    New-Item -ItemType Directory -Path $LocalAgentPath -Force | Out-Null
    Write-Host " [+] Created .agent directory" -ForegroundColor Green
}

# 2. Copy Architecture (Required for context)
$SourceArch = Join-Path $GlobalKitPath ".agent\ARCHITECTURE.md"
if (Test-Path $SourceArch) {
    Copy-Item $SourceArch -Destination "$LocalAgentPath\ARCHITECTURE.md" -Force
    Write-Host " [+] Linker: ARCHITECTURE.md" -ForegroundColor Gray
} else {
    Write-Host " [!] ARCHITECTURE.md not found in kit, skipping..." -ForegroundColor Yellow
}

# 3. Copy Workflows (Required for VS Code Menu)
$SourceWorkflows = Join-Path $GlobalKitPath ".agent\workflows"
if (Test-Path $SourceWorkflows) {
    if (Test-Path "$LocalAgentPath\workflows") {
        Remove-Item "$LocalAgentPath\workflows" -Recurse -Force
    }
    Copy-Item $SourceWorkflows -Destination "$LocalAgentPath" -Recurse -Force
    Write-Host " [+] Linker: Workflows" -ForegroundColor Gray
} else {
    Write-Host " [!] Workflows folder not found in kit, skipping..." -ForegroundColor Yellow
}

# 4. Create .pointer file (Optional, for explicit tracking)
"path=$GlobalKitPath" | Out-File "$LocalAgentPath\.pointer" -Encoding utf8

Write-Host "[AG-KIT] Workspace Linked Successfully!" -ForegroundColor Cyan
Write-Host "You can now use global skills and local slash commands." -ForegroundColor Cyan
