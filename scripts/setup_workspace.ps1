# setup_workspace.ps1
# Automates the linkage of a local workspace to the Global Antigravity Kit

$GlobalKitPath = Join-Path $env:USERPROFILE ".gemini\antigravity\kit"
$LocalAgentPath = Join-Path (Get-Location) ".agent"

Write-Host "[AG-KIT] Initializing Workspace Link..." -ForegroundColor Cyan

if (-not (Test-Path $GlobalKitPath)) {
    Write-Host "[!] Global Kit not found in user profile. Trying current directory kit path..." -ForegroundColor Yellow
    $GlobalKitPath = Join-Path (Get-Location) "kit"
}

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
Copy-Item "$GlobalKitPath\ARCHITECTURE.md" -Destination "$LocalAgentPath\ARCHITECTURE.md" -Force
Write-Host " [+] Linker: ARCHITECTURE.md" -ForegroundColor Gray

# 3. Copy Workflows (Required for VS Code Menu)
if (Test-Path "$LocalAgentPath\workflows") {
    Remove-Item "$LocalAgentPath\workflows" -Recurse -Force
}
Copy-Item "$GlobalKitPath\workflows" -Destination "$LocalAgentPath" -Recurse -Force
Write-Host " [+] Linker: Workflows" -ForegroundColor Gray

# 4. Create .pointer file (Optional, for explicit tracking)
"path=$GlobalKitPath" | Out-File "$LocalAgentPath\.pointer" -Encoding utf8

Write-Host "[AG-KIT] Workspace Linked Successfully!" -ForegroundColor Cyan
Write-Host "You can now use global skills and local slash commands." -ForegroundColor Cyan
