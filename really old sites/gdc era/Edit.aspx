<%@ Page Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true"
    ValidateRequest="false" EnableEventValidation="true" CodeFile="Edit.aspx.cs"
    Inherits="Edit" Title="Sean T. McBeth - Software Engineer, Graphicist, Mad Scientist" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Main" runat="Server">
    <asp:Button runat="server" ID="btnSaveTop" Text="Save" OnClick="btnSave_Click" />
    <asp:Button runat="server" ID="btnCancelTop" Text="Cancel" OnClick="btnCancel_Click" />
    <asp:Repeater ID="Repeater1" runat="server">
        <HeaderTemplate>
            <table id="mainContentTable" cellspacing="0">
        </HeaderTemplate>
        <ItemTemplate>
            <div id="block<%#((EntryData) Container.DataItem).ID %>">
                <tr class="entryHeaderRow">
                    <td class="entryTitle">
                        <input type="text" name="title<%#((EntryData) Container.DataItem).ID %>" id="title<%#((EntryData) Container.DataItem).ID %>"
                            value="<%#((EntryData) Container.DataItem).Title %>" />
                    </td>
                    <td class="entryDate">
                        <input type="text" name="date<%#((EntryData) Container.DataItem).ID %>" id="date<%#((EntryData) Container.DataItem).ID %>"
                            value="<%#((EntryData) Container.DataItem).Created %>" />
                    </td>
                    <td>
                        <button onclick="deleteEntry('<%#((EntryData) Container.DataItem).ID %>')" style="font-family:Fixedsys;font-weight:bold;text-align:center;">X</button>
                    </td>
                </tr>
                <tr class="entryContentRow">
                    <td colspan="3" class="entryText">
                        <textarea name="text<%#((EntryData) Container.DataItem).ID %>" rows="10" cols="50"><%#((EntryData) Container.DataItem).Text %></textarea>
                    </td>
                </tr>
                <tr class="entryFooterRow">
                    <td colspan="3" class="entryFooter">
                        &nbsp;
                    </td>
                </tr>
            </div>
        </ItemTemplate>
        <FooterTemplate>
            </table>
        </FooterTemplate>
    </asp:Repeater>
</asp:Content>
