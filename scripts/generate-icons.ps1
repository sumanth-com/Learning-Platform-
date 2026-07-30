# Regenerates favicon / PWA / Apple icons from src/assets/Logo.png.
# Run with: powershell -File scripts/generate-icons.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root "src\assets\Logo.png"
$brandDark = [System.Drawing.ColorTranslator]::FromHtml("#18181b")

# The source PNG carries generous transparent padding and a soft drop shadow.
# Icons are cropped to the visible mark so every tile controls its own margin.
function Get-MarkBounds {
    param([System.Drawing.Bitmap]$Bitmap)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $Bitmap.Width, $Bitmap.Height)
    $data = $Bitmap.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $buffer = New-Object byte[] ($data.Stride * $data.Height)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buffer, 0, $buffer.Length)
    $stride = $data.Stride
    $Bitmap.UnlockBits($data)

    $minX = $Bitmap.Width; $minY = $Bitmap.Height; $maxX = -1; $maxY = -1
    for ($y = 0; $y -lt $Bitmap.Height; $y++) {
        $row = $y * $stride
        for ($x = 0; $x -lt $Bitmap.Width; $x++) {
            if ($buffer[$row + ($x * 4) + 3] -gt 24) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    New-Object System.Drawing.Rectangle($minX, $minY, ($maxX - $minX + 1), ($maxY - $minY + 1))
}

$logo = [System.Drawing.Bitmap]::FromFile($source)
$markBounds = Get-MarkBounds -Bitmap $logo
Write-Host "mark bounds: $($markBounds.Width)x$($markBounds.Height) at $($markBounds.X),$($markBounds.Y)"

function New-IconBitmap {
    param(
        [int]$Size,
        [System.Nullable[System.Drawing.Color]]$Background = $null,
        [double]$CornerRadius = 0,
        [double]$MarkScale = 0.62
    )

    # Compose large and downsample. Bicubic straight from a 1254px source to
    # 16px loses the counters inside the S.
    $scale = [Math]::Max(1, [int][Math]::Ceiling(256.0 / $Size))
    if ($scale -gt 1) {
        $large = New-IconBitmap -Size ($Size * $scale) -Background $Background -CornerRadius $CornerRadius -MarkScale $MarkScale
        $small = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $small.SetResolution(96, 96)
        $sg = [System.Drawing.Graphics]::FromImage($small)
        $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $sg.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $sg.Clear([System.Drawing.Color]::Transparent)
        $sg.DrawImage($large, 0, 0, $Size, $Size)
        $sg.Dispose()
        $large.Dispose()
        return $small
    }

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bitmap.SetResolution(96, 96)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    if ($null -ne $Background) {
        $brush = New-Object System.Drawing.SolidBrush($Background)
        if ($CornerRadius -gt 0) {
            $d = [double]($Size * $CornerRadius * 2)
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

    $box = [double]($Size * $MarkScale)
    $ratio = [Math]::Min($box / $markBounds.Width, $box / $markBounds.Height)
    $w = [double]($markBounds.Width * $ratio)
    $h = [double]($markBounds.Height * $ratio)
    $x = [double](($Size - $w) / 2)
    $y = [double](($Size - $h) / 2)

    # Parallelogram overload: the Rectangle destinations are integer-only, which
    # visibly off-centres the mark at 16px.
    $destination = @(
        (New-Object System.Drawing.PointF([float]$x, [float]$y)),
        (New-Object System.Drawing.PointF([float]($x + $w), [float]$y)),
        (New-Object System.Drawing.PointF([float]$x, [float]($y + $h)))
    )
    $sourceRect = New-Object System.Drawing.RectangleF(
        [float]$markBounds.X, [float]$markBounds.Y, [float]$markBounds.Width, [float]$markBounds.Height)

    $attributes = New-Object System.Drawing.Imaging.ImageAttributes
    $attributes.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    $g.DrawImage($logo, $destination, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
    $attributes.Dispose()
    $g.Dispose()

    $bitmap
}

function Save-Icon {
    param(
        [string]$OutPath,
        [int]$Size,
        [System.Nullable[System.Drawing.Color]]$Background = $null,
        [double]$CornerRadius = 0,
        [double]$MarkScale = 0.62
    )

    $bitmap = New-IconBitmap -Size $Size -Background $Background -CornerRadius $CornerRadius -MarkScale $MarkScale
    $full = Join-Path $root $OutPath
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $full) | Out-Null
    $bitmap.Save($full, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host "wrote $OutPath ($Size x $Size)"
}

# A 32bpp DIB frame: BITMAPINFOHEADER, a bottom-up BGRA image, then the legacy
# 1bpp AND mask. PNG-compressed frames are legal but several decoders (GDI+
# included) choke on them at small sizes, so stay with the classic encoding.
function ConvertTo-IcoFrame {
    param([System.Drawing.Bitmap]$Bitmap)

    $size = $Bitmap.Width
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $data = $Bitmap.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $pixels = New-Object byte[] ($data.Stride * $size)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $pixels, 0, $pixels.Length)
    $stride = $data.Stride
    $Bitmap.UnlockBits($data)

    $maskStride = [int]([Math]::Ceiling($size / 32.0) * 4)
    $stream = New-Object System.IO.MemoryStream
    $writer = New-Object System.IO.BinaryWriter($stream)

    $writer.Write([uint32]40)
    $writer.Write([int32]$size)
    $writer.Write([int32]($size * 2))
    $writer.Write([uint16]1)
    $writer.Write([uint16]32)
    $writer.Write([uint32]0)
    $writer.Write([uint32](($size * $size * 4) + ($maskStride * $size)))
    0..3 | ForEach-Object { $writer.Write([uint32]0) }

    for ($y = $size - 1; $y -ge 0; $y--) {
        $writer.Write($pixels, $y * $stride, $size * 4)
    }
    $writer.Write((New-Object byte[] ($maskStride * $size)))

    $writer.Flush()
    $bytes = $stream.ToArray()
    $writer.Dispose()
    $stream.Dispose()

    # Comma operator: without it PowerShell unrolls the byte[] and the caller
    # ends up with an Object[] that BinaryWriter treats as char data.
    , $bytes
}

# Multi-resolution .ico so the browser tab uses a purpose-built 16/32/48 render
# instead of downscaling a large PNG into mush.
function Save-Ico {
    param(
        [string]$OutPath,
        [int[]]$Sizes,
        [System.Drawing.Color]$Background,
        [double]$CornerRadius,
        [double]$MarkScale
    )

    $payloads = @()
    foreach ($size in $Sizes) {
        $bitmap = New-IconBitmap -Size $size -Background $Background -CornerRadius $CornerRadius -MarkScale $MarkScale
        $payloads += , @{ size = $size; bytes = (ConvertTo-IcoFrame -Bitmap $bitmap) }
        $bitmap.Dispose()
    }

    $full = Join-Path $root $OutPath
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $full) | Out-Null
    $file = [System.IO.File]::Create($full)
    $writer = New-Object System.IO.BinaryWriter($file)

    $writer.Write([uint16]0)
    $writer.Write([uint16]1)
    $writer.Write([uint16]$payloads.Count)

    $offset = 6 + (16 * $payloads.Count)
    foreach ($entry in $payloads) {
        $dimension = if ($entry.size -ge 256) { 0 } else { $entry.size }
        $writer.Write([byte]$dimension)
        $writer.Write([byte]$dimension)
        $writer.Write([byte]0)
        $writer.Write([byte]0)
        $writer.Write([uint16]1)
        $writer.Write([uint16]32)
        $writer.Write([uint32]$entry.bytes.Length)
        $writer.Write([uint32]$offset)
        $offset += $entry.bytes.Length
    }
    foreach ($entry in $payloads) { $writer.Write([byte[]]$entry.bytes) }

    $writer.Dispose()
    $file.Dispose()
    Write-Host "wrote $OutPath ($($Sizes -join ', '))"
}

# Browser tab. A solid tile keeps the mark legible on light and dark chrome —
# the top arm of the S is near-white and disappears against a white tab strip.
Save-Ico -OutPath "src\app\favicon.ico" -Sizes @(16, 32, 48) -Background $brandDark -CornerRadius 0.19 -MarkScale 0.78
Save-Icon -OutPath "src\app\icon.png" -Size 512 -Background $brandDark -CornerRadius 0.22 -MarkScale 0.62

# iOS home screen: no alpha, no rounding — the system applies its own mask.
Save-Icon -OutPath "src\app\apple-icon.png" -Size 180 -Background $brandDark -MarkScale 0.6

# PWA install icons.
Save-Icon -OutPath "public\icons\icon-192.png" -Size 192 -Background $brandDark -CornerRadius 0.22 -MarkScale 0.62
Save-Icon -OutPath "public\icons\icon-512.png" -Size 512 -Background $brandDark -CornerRadius 0.22 -MarkScale 0.62

# Maskable variants keep the mark inside the 80% safe zone Android may crop to.
Save-Icon -OutPath "public\icons\maskable-192.png" -Size 192 -Background $brandDark -MarkScale 0.46
Save-Icon -OutPath "public\icons\maskable-512.png" -Size 512 -Background $brandDark -MarkScale 0.46

$logo.Dispose()
