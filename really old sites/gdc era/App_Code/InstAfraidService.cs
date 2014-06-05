using System;
using System.Collections;
using System.Configuration;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;

[WebService(Namespace = "http://www.seanmcbeth.com/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class InstAfraidService : System.Web.Services.WebService
{
    public InstAfraidService()
    {

    }

    [WebMethod]
    public int GetMaxUserID()
    {
        return int.Parse(ConfigurationManager.AppSettings["GDNetMaxUserID"]);
    }

    [WebMethod]
    public string GetStandardMessage(int userID, int maxPostLength)
    {
        string message = "";
        try
        {
            string input = InstAfraidService.GetProfileHtml(userID);
            string name = InstAfraidService.ExtractUserName(input);
            message = InstAfraidService.ExtractLatestPost(input);
            if (message == null)
                message = ConfigurationManager.AppSettings["GDNetDefaultMessage"];
            else if (message.Length > maxPostLength)
            {
                message = message.Substring(0, message.IndexOf(' ', maxPostLength)) + "...";
                message = string.Format("says stuff like \"{0}\"", message);
            }
            message = string.Format("{0}\n", InstAfraidService.ConstructMessage(name, message));
        }
        catch (Exception exp)
        {
            message = string.Format("I'm sorry, but there was an error. Could you please tell capn_midnight that '{0}' came up? Thanks. The stacktrace comes next, it's kinda long\nSTACKTRACE: {1}", exp.Message, exp.StackTrace);
        }
        return message;
    }

    private static string ExtractLatestPost(string profileHtml)
    {
        string post = null;
        int start = profileHtml.IndexOf("TD CLASS=altforumcell");
        if (start > -1)
        {
            start = profileHtml.IndexOf("<SPAN CLASS=SmallFont>", start) + 22;
            int end = profileHtml.IndexOf("</SPAN>", start);
            post = profileHtml.Substring(start, end - start).Replace("\n", "").Replace("\r", "").Replace("&#111;", "o").Trim();
        }
        return post;
    }

    [WebMethod]
    public string GetUserName(int userID)
    {
        return ExtractUserName(GetProfileHtml(userID));
    }

    private static string ExtractUserName(string profileHtml)
    {
        int start = profileHtml.IndexOf("Get to know ") + 12;
        int end = profileHtml.IndexOf("...", start);
        return profileHtml.Substring(start, end - start);
    }

    private static string ConstructMessage(string name, string message)
    {
        return string.Format("I think {0} is a cool guy. eh {1} and now he doesn't afraid of anything.", name, message);
    }

    private static string GetProfileHtml(int userID)
    {
        string input = null;
        Uri profileUri = new Uri(string.Format("http://www.gamedev.net/community/forums/viewprofile.asp?ID={0}", userID));
        WebRequest req = HttpWebRequest.CreateDefault(profileUri);
        WebResponse rep = req.GetResponse();
        using (StreamReader reader = new StreamReader(rep.GetResponseStream()))
        {
            input = reader.ReadToEnd();
        }
        return input;
    }
}