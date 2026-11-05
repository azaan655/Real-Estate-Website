$hasErrors = $false
$files = Get-ChildItem -Path "src" -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.json | Where-Object { $_.FullName -notmatch 'node_modules|\.git|dist' }
$allFiles = @($files)
if (Test-Path "index.html") {
    $allFiles += (Get-Item "index.html")
}

Write-Host "Scanning src/ and index.html for non-ASCII characters..."

foreach ($f in $allFiles) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    $lines = $text.Split("`n")
    
    for ($l = 0; $l -lt $lines.Length; $l++) {
        $line = $lines[$l]
        for ($c = 0; $c -lt $line.Length; $c++) {
            $code = [int]$line[$c]
            if ($code -gt 127) {
                $hasErrors = $true
                $hex = "U+{0:X4}" -f $code
                Write-Host "Non-ASCII char $hex found in $($f.FullName):$($l + 1):$($c + 1)"
            }
        }
    }
}

if ($hasErrors) {
    Write-Host "`nFAIL: Non-ASCII characters detected."
    exit 1
} else {
    Write-Host "PASS: All scanned files contain strictly ASCII characters (<= U+007F)."
    exit 0
}

