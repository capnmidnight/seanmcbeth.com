if($args.Length -ne 1 -or $args[0] -notmatch "^(patch|minor|major)$") {
    Write-Output "Expected usage: bundle [patch|minor|major]"
}
else {
    $level = $args[0]
    $v=npm --prefix "..\TypeScript Code" version $level

    .\build.ps1

    git add -A
    git commit -m $v
    git push --recurse-submodules=on-demand --progress

    .\deploy.ps1 ..\deploy\seanmcbeth.com.linux.zip ~/seanmcbeth.com.linux.zip

    explorer https://seanmcbeth.com
}