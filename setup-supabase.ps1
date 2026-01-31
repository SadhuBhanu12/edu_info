# Supabase Quick Setup Script
# This script helps you create your .env file quickly

Write-Host "🔧 Supabase Setup Wizard" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "Exiting..." -ForegroundColor Red
        exit
    }
}

Write-Host "Let's set up your Supabase credentials!" -ForegroundColor Green
Write-Host ""
Write-Host "First, you need to:" -ForegroundColor Yellow
Write-Host "1. Go to https://supabase.com" -ForegroundColor White
Write-Host "2. Create a free account (if you haven't)" -ForegroundColor White
Write-Host "3. Create a new project" -ForegroundColor White
Write-Host "4. Go to Settings → API" -ForegroundColor White
Write-Host ""

# Get Supabase URL
Write-Host "Enter your Supabase Project URL" -ForegroundColor Cyan
Write-Host "(It looks like: https://xxxxx.supabase.co)" -ForegroundColor Gray
$supabaseUrl = Read-Host "URL"

# Validate URL
if (-not $supabaseUrl -or -not $supabaseUrl.StartsWith("https://")) {
    Write-Host "❌ Invalid URL. Please make sure it starts with https://" -ForegroundColor Red
    exit
}

Write-Host ""

# Get Supabase Anon Key
Write-Host "Enter your Supabase Anonymous Key" -ForegroundColor Cyan
Write-Host "(The 'anon public' key from Settings → API)" -ForegroundColor Gray
Write-Host "(It's a long string starting with 'eyJ...')" -ForegroundColor Gray
$supabaseKey = Read-Host "Key"

# Validate Key
if (-not $supabaseKey -or $supabaseKey.Length -lt 50) {
    Write-Host "❌ Invalid key. Please copy the full 'anon public' key." -ForegroundColor Red
    exit
}

Write-Host ""

# Create .env file
$envContent = @"
# Supabase Configuration
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

VITE_SUPABASE_URL=$supabaseUrl
VITE_SUPABASE_ANON_KEY=$supabaseKey
"@

try {
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Show next steps
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "===============" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Setup Database Schema:" -ForegroundColor Yellow
    Write-Host "   - Go to your Supabase dashboard" -ForegroundColor White
    Write-Host "   - Click 'SQL Editor' → 'New query'" -ForegroundColor White
    Write-Host "   - Copy contents from 'supabase-schema.sql'" -ForegroundColor White
    Write-Host "   - Paste and click 'Run'" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. Restart Dev Server:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Test Signup:" -ForegroundColor Yellow
    Write-Host "   - Go to http://localhost:5173/signup" -ForegroundColor White
    Write-Host "   - Create an account" -ForegroundColor White
    Write-Host "   - Should work now! ✨" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🎉 Setup complete! Read SUPABASE_SETUP_GUIDE.md for details." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error creating .env file: $_" -ForegroundColor Red
    exit 1
}
