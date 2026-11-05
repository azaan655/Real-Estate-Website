param([int]$Port = 8080)

$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Output "HTTP server started at $prefix"
} catch {
    Write-Error "Failed to start listener: $_"
    exit 1
}

$root = (Get-Item -Path $PSScriptRoot).FullName
if (-not $root) { $root = (Get-Location).Path }

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".ogv"  = "video/ogg"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

            $rawPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath).TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($rawPath)) {
                $rawPath = "index.html"
            }

            $filePath = Join-Path $root ($rawPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
            if (-not (Test-Path $filePath -PathType Leaf)) {
                $pubPath = Join-Path $root ("public\" + $rawPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
                if (Test-Path $pubPath -PathType Leaf) {
                    $filePath = $pubPath
                } elseif (-not [System.IO.Path]::HasExtension($rawPath)) {
                    # SPA Fallback for routes like /services
                    $filePath = Join-Path $root "index.html"
                }
            }

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $contentType

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.StatusCode = 200
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        } catch {
            # Ignore client aborts
        } finally {
            if ($response) {
                $response.OutputStream.Close()
            }
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
