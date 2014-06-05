using System;
using System.Xml;

public class EntryData
{
    public EntryData(XmlNode node)
        : this(
        node.Attributes["title"].Value,
        node.Attributes["created"].Value,
        node.InnerXml)
    {
    }

    public EntryData(string title, string date, string text)
    {
        Title = title.Replace("&amp;", "&").Replace("&lt;", "<").Replace("&gt;", ">");
        ID = Title.Replace(' ', '_').Replace("'", "");
        Created = date.Replace("&amp;", "&").Replace("&lt;", "<").Replace("&gt;", ">");
        Text = text.Replace("&amp;", "&").Replace("&lt;", "<").Replace("&gt;", ">").Replace("<br/>\r\n", "\r\n");
    }
    public string Title, Created, Text, ID;

    public string Xml
    {
        get
        {
            return string.Format(
@"  <Entry title=""{0}"" created=""{1}"">{2}</Entry>", 
             Title.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;"), 
             Created.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;"), 
             Text.Replace("\r\n","<br/>\r\n").Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;"));
        }
    }
}