if($args.Length -ne 2) {
    Write-Output "Expected usage: copy [local-src-path] [remote-dest-path]"
}
else {
    $key = "~\.ssh\sean-mcbeth.pem"
    $user = "smcbeth"
    $hostname = "seanmcbeth.com"
    $source = $args[0]
    $dest = $args[1]

    # Copy the package archive to the server
    scp -i ${key} ${source} ${user}@${hostname}:${dest}
}