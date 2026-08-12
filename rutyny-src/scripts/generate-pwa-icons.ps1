Add-Type -AssemblyName System.Drawing

$iconDirectory = Join-Path $PSScriptRoot '..\public\icons'
$brandDirectory = Join-Path $PSScriptRoot '..\..\..\04-website\assets\brand'
$sourceIcon = Join-Path $brandDirectory 'asz-znak-A-512.png'
$sourceAppleTouch = Join-Path $brandDirectory 'asz-znak-A-180.png'

function Copy-Resized([string]$SourcePath, [string]$FileName, [int]$Size) {
  $source = [System.Drawing.Image]::FromFile($SourcePath)
  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($source, 0, 0, $Size, $Size)
  $bitmap.Save((Join-Path $iconDirectory $FileName), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}

function New-MaskableIcon([string]$SourcePath, [string]$FileName, [int]$Size) {
  $source = [System.Drawing.Image]::FromFile($SourcePath)
  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#1C2E52'))
  $inset = $Size * 0.15
  $safeSize = $Size - ($inset * 2)
  $graphics.DrawImage($source, $inset, $inset, $safeSize, $safeSize)
  $bitmap.Save((Join-Path $iconDirectory $FileName), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}

Copy-Resized $sourceIcon 'icon-192.png' 192
Copy-Resized $sourceIcon 'icon-512.png' 512
Copy-Resized $sourceAppleTouch 'apple-touch-icon.png' 180
New-MaskableIcon $sourceIcon 'maskable-512.png' 512
