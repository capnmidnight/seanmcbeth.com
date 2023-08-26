if($args.Length -ne 2) {
    Write-Output "Expected usage: deploy [local-src-path] [remote-dest-path]"
}
else {
    $key = "~\.ssh\sean-mcbeth.pem"
    $user = "smcbeth"
    $hostname = "seanmcbeth.com"
    $source = $args[0]
    $dest = $args[1]

    # Copy the package archive to the server
    .\copy.ps1 ${source} ${dest}

    # Execute the update script on the remote server
    $cmd = (Get-Content -Raw .\deploy.sh) -replace "(?:`r?`n)+", "`n" # make sure the Windows/Unix newline character confusion doesn't happen
    ssh -i ${key} ${user}@${hostname} "${cmd}"
}