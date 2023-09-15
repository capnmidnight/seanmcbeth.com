using Juniper.Processes;

var keyFile = new DirectoryInfo(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile))
    .CD(".ssh")
    .Touch("sean-mcbeth.pem");
var cmd = new SSHCommand(
    "Echo test", 
    keyFile, 
    "smcbeth", 
    "seanmcbeth.com", 
    "echo \"why does hello not work\"");

cmd.Info += (sender, e) => Console.WriteLine("Info: {0}", e.Value);
cmd.Warning += (sender, e) => Console.WriteLine("Wrn: {0}", e.Value);
cmd.Err += (sender, e) => Console.WriteLine("Err: {0}", e.Value);


await cmd.RunSafeAsync(CancellationToken.None);
