if($args.Length -ne 2) {
    Write-Output "Expected usage: copy [local-src-path] [remote-dest-path]"
}
else {
    $source = $args[0]
    $dest = $args[1]

    # Copy the package archive to the server
    ./copy.ps1 $source ~/bin/SeanMcBeth.Site/wwwroot/${dest}
}