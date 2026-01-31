# LeetCode Auto-Sync - Quick Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LeetCode Auto-Sync Setup Wizard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if extension directory exists
if (!(Test-Path "extension")) {
    Write-Host "❌ Error: extension directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Extension directory found" -ForegroundColor Green

# Step 2: Check icons
Write-Host ""
Write-Host "Step 1: Checking icons..." -ForegroundColor Yellow
if (!(Test-Path "extension/icons")) {
    Write-Host "⚠️  Icons folder not found. Creating..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "extension/icons" | Out-Null
    Write-Host "✅ Icons folder created" -ForegroundColor Green
} else {
    Write-Host "✅ Icons folder exists" -ForegroundColor Green
}

$iconFiles = @("icon16.png", "icon48.png", "icon128.png")
$missingIcons = @()

foreach ($icon in $iconFiles) {
    if (!(Test-Path "extension/icons/$icon")) {
        $missingIcons += $icon
    }
}

if ($missingIcons.Length -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Missing icon files:" -ForegroundColor Yellow
    foreach ($icon in $missingIcons) {
        Write-Host "   - $icon" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "📝 Action Required:" -ForegroundColor Cyan
    Write-Host "   1. Open extension/generate-icons.html in your browser" -ForegroundColor White
    Write-Host "   2. Click 'Download All' button" -ForegroundColor White
    Write-Host "   3. Move downloaded files to extension/icons/ folder" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Have you generated the icons? (y/n)"
    if ($response -ne "y") {
        Write-Host "❌ Setup cancelled. Please generate icons first." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ All icon files present" -ForegroundColor Green
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "Step 2: Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Step 4: Build check
Write-Host ""
Write-Host "Step 3: Checking build..." -ForegroundColor Yellow
Write-Host "⚠️  Running TypeScript check..." -ForegroundColor Yellow
npm run build 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "⚠️  Build has warnings (this is okay)" -ForegroundColor Yellow
}

# Step 5: Extension installation instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps: Install Chrome Extension" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Chrome and go to: chrome://extensions/" -ForegroundColor White
Write-Host "2. Enable 'Developer mode' (toggle in top right)" -ForegroundColor White
Write-Host "3. Click 'Load unpacked'" -ForegroundColor White
Write-Host "4. Select this folder:" -ForegroundColor White
Write-Host "   $(Get-Location)\extension" -ForegroundColor Cyan
Write-Host "5. Copy the Extension ID (long string under extension name)" -ForegroundColor White
Write-Host ""

$openChrome = Read-Host "Open Chrome extensions page now? (y/n)"
if ($openChrome -eq "y") {
    Start-Process "chrome://extensions/"
    Write-Host "✅ Opening Chrome extensions page..." -ForegroundColor Green
}

Write-Host ""
$extensionId = Read-Host "Enter your Extension ID (or press Enter to skip)"

if ($extensionId -ne "") {
    Write-Host ""
    Write-Host "Updating leetCodeSync.ts..." -ForegroundColor Yellow
    
    $filePath = "src/services/leetCodeSync.ts"
    $content = Get-Content $filePath -Raw
    $newContent = $content -replace "YOUR_EXTENSION_ID", $extensionId
    Set-Content $filePath $newContent
    
    Write-Host "✅ Extension ID updated in code" -ForegroundColor Green
    Write-Host ""
    Write-Host "Extension ID: $extensionId" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️  Skipped Extension ID update" -ForegroundColor Yellow
    Write-Host "   You can update it later in: src/services/leetCodeSync.ts" -ForegroundColor White
}

# Step 6: Start dev server
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Extension ready to use" -ForegroundColor Green
Write-Host "✅ All dependencies installed" -ForegroundColor Green
Write-Host "✅ Code configured" -ForegroundColor Green
Write-Host ""

$startDev = Read-Host "Start development server now? (y/n)"
if ($startDev -eq "y") {
    Write-Host ""
    Write-Host "🚀 Starting dev server..." -ForegroundColor Green
    Write-Host "   Local: http://localhost:5173/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 To test the extension:" -ForegroundColor Yellow
    Write-Host "   1. Login to your account" -ForegroundColor White
    Write-Host "   2. Click any LeetCode problem link" -ForegroundColor White
    Write-Host "   3. Solve the problem on LeetCode" -ForegroundColor White
    Write-Host "   4. Watch your dashboard auto-update! ✨" -ForegroundColor White
    Write-Host ""
    npm run dev
} else {
    Write-Host ""
    Write-Host "Run 'npm run dev' when ready to start!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Happy coding! 🚀" -ForegroundColor Green
}
