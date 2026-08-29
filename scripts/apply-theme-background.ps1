$ErrorActionPreference = "Stop"

$project = (Get-Location).Path

$targets = @(
  "components\restaurant\Menu.tsx",
  "components\restaurant\FeaturedMenu.tsx",
  "components\restaurant\About.tsx",
  "components\restaurant\sections\CTA.tsx"
)

foreach ($relative in $targets) {
  $path = Join-Path $project $relative

  if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "NO EXISTE: $relative" -ForegroundColor Yellow
    continue
  }

  $content = Get-Content -LiteralPath $path -Raw

  if ($content -match 'wolf-theme-public-section') {
    Write-Host "Ya aplicado: $relative" -ForegroundColor DarkGray
    continue
  }

  $backup = "$path.theme-background.backup"
  Copy-Item -LiteralPath $path -Destination $backup -Force

  $updated = [regex]::Replace(
    $content,
    '<section(?![^>]*wolf-theme-public-section)',
    '<section data-wolf-theme-section="true"',
    1
  )

  if ($updated -eq $content) {
    Write-Host "NO SE PUDO MARCAR LA PRIMERA SECTION: $relative" -ForegroundColor Yellow
    continue
  }

  Set-Content -LiteralPath $path -Value $updated -Encoding UTF8
  Write-Host "Aplicado: $relative" -ForegroundColor Green
}

Write-Host ""
Write-Host "Tema global aplicado a las secciones publicas." -ForegroundColor Cyan
Write-Host "Backups creados con .theme-background.backup" -ForegroundColor DarkGray
