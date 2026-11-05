# Verification of rentals.ts and rentalProjects.ts
$rentalsContent = [System.IO.File]::ReadAllText("src\data\rentals.ts", [System.Text.Encoding]::UTF8)
$projectsContent = [System.IO.File]::ReadAllText("src\data\rentalProjects.ts", [System.Text.Encoding]::UTF8)

Write-Host "=================== RENTALS DATASET VERIFICATION ==================="

# Check rentals count
$idMatches = [regex]::Matches($rentalsContent, "id:\s*'([^']+)'")
Write-Host "Total Listings:" $idMatches.Count " (Expected: 12)"

# Check Rental Projects count
$projMatches = [regex]::Matches($projectsContent, "id:\s*'([^']+)'")
Write-Host "Total Projects:" $projMatches.Count " (Expected: 6)"

# Check that properties.ts was NOT modified
$gitDiff = git status --short src/data/properties.ts 2>$null
if ($gitDiff) {
    Write-Host "WARNING: properties.ts modified!"
} else {
    Write-Host "Integrity confirmed: src/data/properties.ts untouched."
}

