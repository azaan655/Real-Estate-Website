$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$slugs = @(
    "ready-to-move",
    "under-construction",
    "new-launch",
    "featured-properties",
    "flats-apartments",
    "independent-houses",
    "villas",
    "plots-land",
    "commercial",
    "under-50-lacs",
    "50-lacs-to-1-cr",
    "1-cr-to-5-cr",
    "above-5-cr",
    "1-bhk",
    "2-bhk",
    "3-bhk",
    "4-bhk",
    "4-plus-bhk"
)

Write-Host "================ VALIDATING 18 ROUTES ================"
$results = @()

foreach ($s in $slugs) {
    $url = "http://127.0.0.1:8080/buy/$s"
    $out = & $edge --headless --disable-gpu --virtual-time-budget=6000 --dump-dom $url | Out-String
    $titleMatch = [regex]::Match($out, '<title>(.*?)</title>')
    $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { "No Title" }
    
    # Check for errors in DOM
    $hasError = $out.Contains("EXPLICIT_BABEL_PARSE_ERROR") -or $out.Contains("BABEL_OR_REACT_ERR") -or $out.Contains("Error 404")
    
    # Check if cards rendered
    $cardCount = ([regex]::Matches($out, 'class="[^"]*buy-card[^"]*"')).Count
    
    # Check if fallback section rendered
    $hasFallback = $out.Contains("You May Also Like") -or $out.Contains("Curated alternatives")
    
    Write-Host "$s : Title='$title' | Cards=$cardCount | Fallback=$hasFallback | Error=$hasError"
    $results += [PSCustomObject]@{
        Slug = $s
        Title = $title
        Cards = $cardCount
        HasFallback = $hasFallback
        Error = $hasError
    }
}

$results | Format-Table -AutoSize

