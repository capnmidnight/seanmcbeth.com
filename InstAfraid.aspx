<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true"
    CodeFile="InstAfraid.aspx.cs" Inherits="InstAfraid" Title="I think Website is a cool guy. eh writes Web services and now he doesn't
        afraid of anything." %>

<asp:Content ID="Content2" ContentPlaceHolderID="Main" runat="Server">
    <table id="mainContentTable" cellspacing="0">
        <tr class="entryHeaderRow">
            <td class="entryTitle">
                I Isn't Afraid
            </td>
            <td class="entryDate">
                March 10th, 2008
            </td>
        </tr>
        <tr class="entryContentRow">
            <td colspan="2" class="entryText">
                Enter user profile number:
                <asp:TextBox runat="server" ID="txtUserID" OnTextChanged="btnSubmit_Click" Width="65px" /><asp:Button runat="server" ID="btnSubmit"
                    Text="Afraid?" OnClick="btnSubmit_Click" />
            </td>
        </tr>
        <tr class="entryFooterRow">
            <td colspan="2" class="entryFooter">
                &nbsp;
            </td>
        </tr>
        <asp:Panel runat="server" ID="panMessage" Visible="false">
            <tr class="entryHeaderRow">
                <td class="entryTitle" colspan="2">
                    What's the story?
                </td>
            </tr>
            <tr class="entryContentRow">
                <td class="entryText" colspan="2">
                    <asp:Label runat="server" ID="lblMessage" />
                </td>
            </tr>
            <tr class="entryFooterRow">
                <td colspan="2" class="entryFooter">
                    &nbsp;
                </td>
            </tr>
        </asp:Panel>
        <tr class="entryHeaderRow">
            <td class="entryTitle">
                Now what?
            </td>
            <td class="entryDate">
                March 10th, 2008
            </td>
        </tr>
        <tr class="entryContentRow">
            <td colspan="2" class="entryText">
                You may use this Webservice for your own applications. <a href="InstAfraidService.asmx">
                    The service is here.</a> One thing that I hope people will use it for is random
                name generation in a game using the <a href="InstAfraidService.asmx?op=GetUserName">
                    GetUserName(int userID)</a> method.
            </td>
        </tr>
        <tr class="entryFooterRow">
            <td colspan="2" class="entryFooter">
                &nbsp;
            </td>
        </tr>
    </table>
</asp:Content>
