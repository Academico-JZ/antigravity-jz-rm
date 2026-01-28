Param([switch]$Local)

$SKILLS_ZIP = "https://github.com/sickn33/antigravity-awesome-skills/archive/refs/heads/main.zip"
$GLOBAL_BASE = Join-Path $env:USERPROFILE ".gemini\antigravity\kit"

Write-Host ""
Write-Host "🌌 Antigravity JZ-RM Edition" -ForegroundColor Cyan
Write-Host "──────────────────────────" -ForegroundColor Gray

# 1. Determine Paths
$InstallDir = if ($Local) { Join-Path (Get-Location) ".agent" } else { $GLOBAL_BASE }
$TempDir = Join-Path (Get-Location) "tmp_jz_rm"

# Helper to fetch and extract
function Get-Source($Url, $Name, $Dest) {
    Write-Host "[>] Downloading $Name library..." -ForegroundColor Gray
    $ZipPath = Join-Path $Dest "$Name.zip"
    $ExtractPath = Join-Path $Dest $Name
    Invoke-WebRequest -Uri $Url -OutFile $ZipPath
    Expand-Archive -Path $ZipPath -DestinationPath $ExtractPath -Force
    Remove-Item $ZipPath -Force
    return (Get-ChildItem -Path $ExtractPath | Where-Object { $_.PSIsContainer } | Select-Object -First 1).FullName
}

# 2. Base Layer Initialization
Write-Host ""
Write-Host "🚀 Initializing Antigravity Core (@vudovn/ag-kit)..." -ForegroundColor Cyan
try {
    if ($Local) {
        npx -y @vudovn/ag-kit init
    }
    else {
        Write-Host "[>] Global mode: Installing core components..." -ForegroundColor Gray
        npm install -g @vudovn/ag-kit *>$null
        ag-kit init
    }
}
catch {
    Write-Host "[!] Base initialization had warnings. Continuing..." -ForegroundColor Yellow
}

# 3. High-Octane Skills Augmentation
Write-Host ""
Write-Host "Turbo-charging Skills Ecosystem..." -ForegroundColor Cyan
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force | Out-Null }
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

try {
    $SkillsPath = Get-Source -Url $SKILLS_ZIP -Name "skills" -Dest $TempDir
    $SrcSkills = Join-Path $SkillsPath ".agent\skills"
    
    if (Test-Path $SrcSkills) {
        Write-Host " [+] Injecting 255+ Specialist Skills" -ForegroundColor Gray
        $DestSkills = Join-Path $InstallDir "skills"
        if (-not (Test-Path $DestSkills)) { New-Item -ItemType Directory -Path $DestSkills -Force | Out-Null }
        Copy-Item -Path "$SrcSkills\*" -Destination $DestSkills -Recurse -Force
    }
}
catch {
    Write-Host "[!] Skills download failed. You can run 'ag-kit update' later." -ForegroundColor Yellow
}

# 4. Identity Governance
Write-Host "Applying Identity & Rules Governance..." -ForegroundColor Cyan
$LocalAgentDir = Join-Path $PSScriptRoot ".agent"
$SrcGemini = Join-Path $LocalAgentDir "rules\GEMINI.md"
$DestRules = Join-Path $InstallDir "rules"
$DestGemini = Join-Path $DestRules "GEMINI.md"

if (-not (Test-Path $DestRules)) { New-Item -ItemType Directory -Path $DestRules -Force | Out-Null }
if (Test-Path $SrcGemini) {
    Copy-Item $SrcGemini -Destination $DestGemini -Force
    Write-Host " [✨] Antigravity JZ-RM Rules Activated" -ForegroundColor Green
}

# Copy auxiliary scripts
$SrcScripts = Join-Path $LocalAgentDir "scripts"
$DestScripts = Join-Path $InstallDir "scripts"
if (Test-Path $SrcScripts) {
    Copy-Item -Path "$SrcScripts\*" -Destination $DestScripts -Recurse -Force
}

# 5. Cleanup
Remove-Item $TempDir -Recurse -Force | Out-Null

# 6. Indexing
$Indexer = Join-Path $InstallDir "scripts\generate_index.py"
if (Test-Path $Indexer) {
    Write-Host ""
    Write-Host "📦 Indexing Capabilities..." -ForegroundColor Cyan
    & python "$Indexer" *>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " [✨] Skills Indexer: 100% Optimized" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ $(if($Local){'Local'}else{'Global'}) Setup Complete!" -ForegroundColor Green
Write-Host "──────────────────────────" -ForegroundColor Gray
Write-Host ""
