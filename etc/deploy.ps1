$key = "~\.ssh\sean-mcbeth.pem"
$user = "smcbeth"
$hostname = "seanmcbeth.com"

# Copy the package archive to the server
scp -i ${key} ..\deploy\seanmcbeth.com.linux.tar ${user}@${hostname}:~/seanmcbeth.com.linux.tar

# Execute the update script on the remote server
$cmd = (Get-Content -Raw .\deploy.sh) -replace "(?:`r?`n)+", "`n" # make sure the Windows/Unix newline character confusion doesn't happen
ssh -i ${key} ${user}@${hostname} "${cmd}"