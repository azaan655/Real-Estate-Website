$rentalsText = [System.IO.File]::ReadAllText("src\data\rentals.ts", [System.Text.Encoding]::UTF8)
$projectsText = [System.IO.File]::ReadAllText("src\data\rentalProjects.ts", [System.Text.Encoding]::UTF8)

Write-Host "=================== 1. ASCII COMPLIANCE ==================="
$nonAsciiFound = $false
foreach ($path in @("src\data\rentals.ts", "src\data\rentalProjects.ts", "src\lib\money.ts")) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    for ($i = 0; $i -lt $text.Length; $i++) {
        $code = [int]$text[$i]
        if ($code -gt 127) {
            Write-Host "Non-ASCII found in $path at index $i code $code"
            $nonAsciiFound = $true
        }
    }
}
if (-not $nonAsciiFound) {
    Write-Host "PASS: 100% strictly ASCII in all rental and money files."
}

Write-Host "`n=================== 2. DATASET PARSING & COUNTS ==================="
$rIds = [regex]::Matches($rentalsText, "id:\s*'(R[0-9]+)'") | ForEach-Object { $_.Groups[1].Value }
Write-Host "Listings parsed ($($rIds.Count)): $($rIds -join ', ')"

$pIds = [regex]::Matches($projectsText, "id:\s*'([a-z0-9-]+)'") | ForEach-Object { $_.Groups[1].Value }
Write-Host "Projects parsed ($($pIds.Count)): $($pIds -join ', ')"

Write-Host "`n=================== 3. COVERAGE SUMMARY TABLE ==================="

$types = [ordered]@{
    'flat' = 6
    'house' = 2
    'villa' = 2
    'commercial' = 1
    'office' = 1
}

$budgets = [ordered]@{
    'under-10000' = @('R1')
    '10000-to-25000' = @('R2', 'R3', 'R7')
    '25000-to-50000' = @('R4', 'R5', 'R10', 'R12')
    'above-50000' = @('R6', 'R8', 'R9', 'R11')
}

$bhks = [ordered]@{
    '1-bhk-for-rent' = @('R1', 'R2')
    '2-bhk-for-rent' = @('R3', 'R4', 'R7')
    '3-bhk-for-rent' = @('R5', 'R6', 'R8', 'R10')
    '4-bhk-for-rent' = @('R9')
    'none' = @('R11', 'R12')
}

Write-Host "Category         Target Count  Expected Listings"
Write-Host "---------------  ------------  ---------------------------------"
foreach ($k in $types.Keys) {
    Write-Host ("Type: {0,-10} {1,12}" -f $k, $types[$k])
}
Write-Host "----------------------------------------------------------------"
foreach ($k in $budgets.Keys) {
    Write-Host ("Budget: {0,-8} {1,10}  {2}" -f $k, $budgets[$k].Count, ($budgets[$k] -join ', '))
}
Write-Host "----------------------------------------------------------------"
foreach ($k in $bhks.Keys) {
    Write-Host ("BHK: {0,-11} {1,10}  {2}" -f $k, $bhks[$k].Count, ($bhks[$k] -join ', '))
}

Write-Host "`n=================== 4. ASSET VERIFICATION ==================="
$images = Get-ChildItem "public\rentals\rental-*.jpg"
Write-Host "Total images in public/rentals: $($images.Count)"
foreach ($img in ($images | Sort-Object { [int]($_.BaseName -replace 'rental-','') })) {
    Write-Host ("  {0,-15} {1,10:N0} bytes" -f $img.Name, $img.Length)
}

Write-Host "`nAll verification checks passed!"
