using Juniper.Units;

namespace SeanMcBeth
{
    class Options
    {
        private bool parseLevel = false;
        public Level level = Level.None;
        public DirectoryInfo workingDir = null;

        public Options(string[] args)
        {
            var lastOpt = args.Where(ProcessArg).FirstOrDefault();
            if (!string.IsNullOrEmpty(lastOpt))
            {
                if (File.Exists(lastOpt))
                {
                    lastOpt = Path.GetDirectoryName(lastOpt);
                }
                workingDir = new DirectoryInfo(lastOpt);
            }
        }

        private bool ProcessArg(string arg)
        {
            if (arg == "--level")
            {
                parseLevel = true;
                return false;
            }

            if (parseLevel)
            {
                level = Enum.Parse<Level>(arg);
                parseLevel = false;
                return false;
            }

            return true;
        }
    }
}