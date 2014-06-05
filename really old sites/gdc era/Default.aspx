<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true"
    CodeFile="Default.aspx.cs" Inherits="_Default" Title="Sean T. McBeth - Software Engineer, Graphicist, Mad Scientist" %>

<asp:Content ID="contMain" ContentPlaceHolderID="Main" runat="Server">
    <asp:Repeater ID="Repeater1" runat="server">
        <HeaderTemplate>
            <table id="mainContentTable" cellspacing="0">
        </HeaderTemplate>
        <ItemTemplate>
            <tr class="entryHeaderRow">
                <td class="entryTitle">
                    <%#((EntryData) Container.DataItem).Title %>
                </td>
                <td class="entryDate">
                    <%#((EntryData) Container.DataItem).Created %>
                </td>
            </tr>
            <tr class="entryContentRow">
                <td colspan="2" class="entryText">
                    <%#((EntryData) Container.DataItem).Text %>
                </td>
            </tr>
            <tr class="entryFooterRow">
                <td colspan="2" class="entryFooter">
                    &nbsp;
                </td>
            </tr>
        </ItemTemplate>
        <FooterTemplate>
            </table>
        </FooterTemplate>
    </asp:Repeater>
    <asp:Button runat="server" ID="btnLogin" Text="Login" OnClick="btnLogin_Click" />
    <asp:Button runat="server" ID="btnLogout" Text="Logout" Visible="false" OnClick="btnLogout_Click" />
    <asp:Button runat="server" ID="btnEdit" Text="Edit" Visible="false" OnClick="btnEdit_Click" />
</asp:Content>
