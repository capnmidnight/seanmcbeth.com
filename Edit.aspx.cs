using System;
using System.Data;
using System.Configuration;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;

public partial class Edit : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["SeanLoggedIn"] != null)
        {
            if (Request.QueryString["page"] == null)
                Response.Redirect("Default.aspx?page=main.xml");

            List<EntryData> data = new List<EntryData>();
            data.Add(new EntryData("(title)", "(date)", "(text)"));
            string filepath = Server.MapPath(Request.QueryString["page"]);
            if (System.IO.File.Exists(filepath))
            {
                try
                {
                    XmlDocument doc = new XmlDocument();
                    doc.Load(filepath);
                    foreach (XmlNode node in doc.SelectNodes("/Entries/Entry"))
                        data.Add(new EntryData(node));
                }
                catch
                {
                    Response.Redirect(string.Format("Default.aspx?page={0}", Request.QueryString["page"]));
                }
            }
            Repeater1.DataSource = data;
            Repeater1.DataBind();
        }
        else
        {
            Response.Redirect("Default.aspx?page=main.xml");
        }
    }
    protected void btnSave_Click(object sender, EventArgs e)
    {
        List<string> titles = new List<string>();
        foreach (string key in Request.Form.AllKeys)
            if (key.IndexOf("title") == 0)
                titles.Add(key.Substring(5));

        List<EntryData> entries = new List<EntryData>();
        foreach (string name in titles)
        {
            string title = Request.Form["title" + name].Trim();
            string date = Request.Form["date" + name].Trim();
            string text = Request.Form["text" + name].Trim();
            if (title.Length > 0 && !title.Equals("(title)"))
                entries.Add(new EntryData(title, date, text));
        }

        StringBuilder output = new StringBuilder();
        output.AppendLine("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
        output.AppendLine("<Entries>");
        foreach (EntryData entry in entries)
            output.AppendLine(entry.Xml);
        output.AppendLine("</Entries>");

        System.IO.File.WriteAllText(Server.MapPath((string)Session["Page"]), output.ToString());
        btnCancel_Click(sender, e);
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        Response.Redirect(string.Format("Default.aspx?page={0}", Request.QueryString["page"]));
    }
}
