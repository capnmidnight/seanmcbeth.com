using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["page"] == null)
            Response.Redirect("Default.aspx?page=main.xml");

        bool loggedIn = Session["SeanLoggedIn"] != null;
        btnLogin.Visible = !loggedIn;
        btnEdit.Visible = loggedIn;
        btnLogout.Visible = loggedIn;

        string filepath = Server.MapPath(Request.QueryString["page"]);
        List<EntryData> data = new List<EntryData>();
        try
        {
            if (System.IO.File.Exists(filepath))
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(filepath);
                foreach (XmlNode node in doc.SelectNodes("/Entries/Entry"))
                    data.Add(new EntryData(node));
            }
            else
            {
                if (Session["SeanLoggedIn"] == null)
                {
                    DateTime d = DateTime.Now;
                    data.Add(new EntryData("404: File Not Found", string.Format("{0}, {1}", d.ToString("m"), d.Year),
                        string.Format("The requested file '{0}' could not be found.", Request.QueryString["page"])));
                }
                else
                    Response.Redirect(string.Format("Edit.aspx?page={0}", Request.QueryString["page"]));
            }
        }
        catch (Exception exp)
        {
            //if (Session["SeanLoggedIn"] == null)
            //{
            DateTime d = DateTime.Now;
            data.Add(new EntryData("500: Server Error", string.Format("{0}, {1}", d.ToString("m"), d.Year),
                string.Format("The requested file '{0}' could not be processed as a content file. Reason: <pre>{1}</pre>", Request.QueryString["page"], exp.Message)));
            //}
            //else
            //    //Edit Raw
        }
        Repeater1.DataSource = data;
        Repeater1.DataBind();
    }

    protected void btnLogin_Click(object sender, EventArgs e)
    {
        Response.Redirect("Login.aspx");
    }
    protected void btnLogout_Click(object sender, EventArgs e)
    {
        Session.Remove("SeanLoggedIn");
        Response.Redirect("Default.aspx?page=main.xml");
    }
    protected void btnEdit_Click(object sender, EventArgs e)
    {
        Response.Redirect(string.Format("Edit.aspx?page={0}", Request.QueryString["page"]));
    }
}
