using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Security.Cryptography;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class Login : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void LoginButton_Click(object sender, EventArgs e)
    {
        if (this.Login1.UserName.ToLower().Equals(ConfigurationManager.AppSettings["AuthUserName"].ToLower()) && ConfigurationManager.AppSettings["AuthPassword"].Equals(this.Login1.Password))
        {
            Session["SeanLoggedIn"] = true;
            Response.Redirect("Default.aspx");
        }
    }
}
