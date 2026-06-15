$ErrorActionPreference = "Stop"
$scriptPath = Join-Path $PSScriptRoot "update-catalog.mjs"
node $scriptPath
