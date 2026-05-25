$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "wrangler"
$psi.Arguments = "pages deploy dist --project-name=xyy --branch=main"
$psi.WorkingDirectory = "d:\Downloads\Program\Cloudflare Pages\XYY"
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false

$process = [System.Diagnostics.Process]::Start($psi)

Start-Sleep -Milliseconds 3000

$process.StandardInput.WriteLine("y")
$process.StandardInput.Flush()

$output = $process.StandardOutput.ReadToEnd()
$error = $process.StandardError.ReadToEnd()

Write-Host "Output: $output"
Write-Host "Error: $error"
