using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class InstAfraid : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        int userID = -1;
        int.TryParse(this.txtUserID.Text, out userID);
        this.panMessage.Visible = true;
        using (InstAfraidService afraid = new InstAfraidService())
            if (userID > 0 && userID < afraid.GetMaxUserID())
                this.lblMessage.Text = afraid.GetStandardMessage(userID, 50);
            else
                this.lblMessage.Text = "Invalid Input";

    }
}
