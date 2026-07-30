# Regenerates favicon / PWA / Apple icons from src/assets/Logo.png.
# Run with: powershell -File scripts/generate-icons.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root "src\assets\Logo.png"
$brandDark = [System.Drawing.ColorTranslator]::FromHtml("#18181b")

function New-Icon {
    param(
        [string]$OutPath,
        [int]$Size,
        [System.Nullable[System.Drawing.Color]]$Background = $null,
        [double]$CornerRadius = 0,
        [double]$LogoScale = 1.0
    )

    $logo = [System.Drawing.Image]::FromFile($source)
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    if ($Background -ne $null) {
        $brush = New-Object System.Drawing.SolidBrush($Background)
        if ($CornerRadius -gt 0) {
            $r = [int]($Size * $CornerRadius)
            $d = $r * 2
            $path = New-Object System.Drawing.Drawing2D.GraphicsPath
            $path.AddArc(0, 0, $d, $d, 180, 90)
            $path.AddArc($Size - $d, 0, $d, $d, 270, 90)
            $path.AddArc($Size - $d, $Size - $d, $d, $d, 0, 90)
            $path.AddArc(0, $Size - $d, $d, $d, 90, 90)
            $path.CloseFigure()
            $g.FillPath($brush, $path)
            $path.Dispose()
        }
        else {
            $g.FillRectangle($brush, 0, 0, $Size, $Size)
        }
        $brush.Dispose()
    }

    $drawn = [int]($Size * $LogoScale)
    $offset = [int](($Size - $drawn) / 2)
    $g.DrawImage($logo, $offset, $offset, $drawn, $drawn)

    $full = Join-Path $root $OutPath
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $full) | Out-Null
    $bitmap.Save($full, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bitmap.Dispose()
    $logo.Dispose()
    Write-Host "wrote $OutPath ($Size x $Size)"
}

# Browser tab favicon — transparent so the mark reads on light and dark chrome.
New-Icon -OutPath "src\app\icon.png" -Size 512 -LogoScale 1.0

# iOS home screen — no alpha support, so composite on the brand surface.
New-Icon -OutPath "src\app\apple-icon.png" -Size 180 -Background $brandDark -LogoScale 0.86

# PWA icons.
New-Icon -OutPath "public\icons\icon-192.png" -Size 192 -Background $brandDark -CornerRadius 0.22 -LogoScale 0.86
New-Icon -OutPath "public\icons\icon-512.png" -Size 512 -Background $brandDark -CornerRadius 0.22 -LogoScale 0.86

# Maskable variants keep a full-bleed background and a smaller safe-zone mark.
New-Icon -OutPath "public\icons\maskable-192.png" -Size 192 -Background $brandDark -LogoScale 0.62
New-Icon -OutPath "public\icons\maskable-512.png" -Size 512 -Background $brandDark -LogoScale 0.62
