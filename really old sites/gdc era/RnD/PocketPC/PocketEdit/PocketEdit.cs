using System;
using System.Drawing;
using System.Collections;
using System.Windows.Forms;

namespace PocketEdit
{
	/// <summary>
	/// Summary description for FrmPocketEdit.
	/// </summary>
	public class FrmPocketEdit : System.Windows.Forms.Form
	{
		private System.Windows.Forms.TextBox textBox1;
		private System.Windows.Forms.MenuItem menuItemFile;
		private System.Windows.Forms.MenuItem menuItemOpen;
		private System.Windows.Forms.MenuItem menuItemSave;
		private System.Windows.Forms.MenuItem menuItemExit;
		private System.Windows.Forms.MainMenu mainMenu1;
		private System.Windows.Forms.SaveFileDialog saveFileDialog1;
		private System.Windows.Forms.MenuItem menuItemSaveAs;
		private System.Windows.Forms.OpenFileDialog openFileDialog1;
		private Microsoft.WindowsCE.Forms.InputPanel inputPanel1;
		private System.Windows.Forms.MenuItem menuItem1;
		private System.Windows.Forms.MenuItem menuItem2;
		private System.Windows.Forms.MenuItem menuItem3;
		private System.Windows.Forms.MenuItem menuItem4;
		private string fname, clipboard_text;
        private MenuItem menuItem5;

		public FrmPocketEdit()
		{
			//
			// Required for Windows Form Designer support
			//
			InitializeComponent();
			fname = null;
			inputPanel1.EnabledChanged +=new EventHandler(inputPanel1_EnabledChanged);
		}
		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		protected override void Dispose( bool disposing )
		{
			base.Dispose( disposing );
		}
		#region Windows Form Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
            this.mainMenu1 = new System.Windows.Forms.MainMenu();
            this.menuItemFile = new System.Windows.Forms.MenuItem();
            this.menuItemOpen = new System.Windows.Forms.MenuItem();
            this.menuItemSave = new System.Windows.Forms.MenuItem();
            this.menuItemSaveAs = new System.Windows.Forms.MenuItem();
            this.menuItemExit = new System.Windows.Forms.MenuItem();
            this.menuItem1 = new System.Windows.Forms.MenuItem();
            this.menuItem2 = new System.Windows.Forms.MenuItem();
            this.menuItem3 = new System.Windows.Forms.MenuItem();
            this.menuItem4 = new System.Windows.Forms.MenuItem();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.inputPanel1 = new Microsoft.WindowsCE.Forms.InputPanel();
            this.menuItem5 = new System.Windows.Forms.MenuItem();
            // 
            // mainMenu1
            // 
            this.mainMenu1.MenuItems.Add(this.menuItemFile);
            this.mainMenu1.MenuItems.Add(this.menuItem1);
            // 
            // menuItemFile
            // 
            this.menuItemFile.MenuItems.Add(this.menuItemOpen);
            this.menuItemFile.MenuItems.Add(this.menuItemSave);
            this.menuItemFile.MenuItems.Add(this.menuItemSaveAs);
            this.menuItemFile.MenuItems.Add(this.menuItemExit);
            this.menuItemFile.Text = "File";
            // 
            // menuItemOpen
            // 
            this.menuItemOpen.Text = "Open...";
            this.menuItemOpen.Click += new System.EventHandler(this.menuItemOpen_Click);
            // 
            // menuItemSave
            // 
            this.menuItemSave.Text = "Save";
            this.menuItemSave.Click += new System.EventHandler(this.menuItemSave_Click);
            // 
            // menuItemSaveAs
            // 
            this.menuItemSaveAs.Text = "Save As...";
            this.menuItemSaveAs.Click += new System.EventHandler(this.menuItemSaveAs_Click);
            // 
            // menuItemExit
            // 
            this.menuItemExit.Text = "Exit";
            this.menuItemExit.Click += new System.EventHandler(this.menuItemExit_Click);
            // 
            // menuItem1
            // 
            this.menuItem1.MenuItems.Add(this.menuItem2);
            this.menuItem1.MenuItems.Add(this.menuItem3);
            this.menuItem1.MenuItems.Add(this.menuItem4);
            this.menuItem1.MenuItems.Add(this.menuItem5);
            this.menuItem1.Text = "Edit";
            // 
            // menuItem2
            // 
            this.menuItem2.Text = "copy";
            this.menuItem2.Click += new System.EventHandler(this.menuItem2_Click);
            // 
            // menuItem3
            // 
            this.menuItem3.Text = "cut";
            this.menuItem3.Click += new System.EventHandler(this.menuItem3_Click);
            // 
            // menuItem4
            // 
            this.menuItem4.Text = "paste";
            this.menuItem4.Click += new System.EventHandler(this.menuItem4_Click);
            // 
            // textBox1
            // 
            this.textBox1.AcceptsTab = true;
            this.textBox1.BackColor = System.Drawing.Color.White;
            this.textBox1.Font = new System.Drawing.Font("Courier New", 8.25F, System.Drawing.FontStyle.Regular);
            this.textBox1.ForeColor = System.Drawing.Color.Black;
            this.textBox1.Location = new System.Drawing.Point(0, 0);
            this.textBox1.Multiline = true;
            this.textBox1.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.textBox1.Size = new System.Drawing.Size(240, 272);
            // 
            // saveFileDialog1
            // 
            this.saveFileDialog1.FileName = "doc1";
            this.saveFileDialog1.Filter = "text files|*.txt|HTML files|*.htm|All files|*.*";
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.Filter = "text files|*.txt|HTML files|*.htm|All files|*.*";
            // 
            // menuItem5
            // 
            this.menuItem5.Text = "font";
            // 
            // FrmPocketEdit
            // 
            this.ClientSize = new System.Drawing.Size(240, 268);
            this.Controls.Add(this.textBox1);
            this.Menu = this.mainMenu1;
            this.Text = "PocketEdit";

		}
		#endregion

		/// <summary>
		/// The main entry point for the application.
		/// </summary>

		static void Main() 
		{
			Application.Run(new FrmPocketEdit());
		}

		private void menuItemSaveAs_Click(object sender, System.EventArgs e)
		{
			GetFileName();
			SaveFile();
		}
		private void GetFileName()
		{
			DialogResult res = this.saveFileDialog1.ShowDialog();
			if(res == DialogResult.OK)
			{
				fname = this.saveFileDialog1.FileName;
				if(fname.IndexOf(".") < 0)
				{
					fname += ".txt";
				}
			}
		}
		private void SaveFile()
		{
			if(fname != null)
			{
				try
				{
					System.IO.StreamWriter sw = new System.IO.StreamWriter(fname);
					sw.Write(this.textBox1.Text);
					sw.Close();
				}
				catch(Exception e)
				{
					MessageBox.Show(e.Message);
				}
			}
		}

		private void menuItemSave_Click(object sender, System.EventArgs e)
		{
			if(fname == null)
			{
				GetFileName();
			}
			SaveFile();
		}
		private void menuItemOpen_Click(object sender, System.EventArgs e)
		{
			DialogResult res =  this.openFileDialog1.ShowDialog();
			if(res == DialogResult.OK)
			{
				fname = this.openFileDialog1.FileName;
				System.IO.StreamReader sr = new System.IO.StreamReader(fname);
				this.textBox1.Text = sr.ReadToEnd();
				sr.Close();
			}
		}

		private void menuItemExit_Click(object sender, System.EventArgs e)
		{
			this.Dispose();
			Application.Exit();
		}
		protected override void OnParentChanged(EventArgs e)
		{
			base.OnParentChanged (e);
			MessageBox.Show("parent changed");
		}

		private void inputPanel1_EnabledChanged(object sender, EventArgs e)
		{
			if(inputPanel1.Enabled || !this.textBox1.Enabled)
			{
				this.Height = this.Height - inputPanel1.Bounds.Height;
				this.textBox1.Height = this.Height - inputPanel1.Bounds.Height;
			}
			else
			{
				this.textBox1.Height = this.Height;
			}
		}

		private void menuItem2_Click(object sender, System.EventArgs e)
		{
			clipboard_text = this.textBox1.SelectedText;
		}

		private void menuItem4_Click(object sender, System.EventArgs e)
		{
			if(clipboard_text != null)
			{
				int index = this.textBox1.SelectionStart;
				if(this.textBox1.SelectionLength > 0)
				{
					this.textBox1.Text = this.textBox1.Text.Remove(index, this.textBox1.SelectionLength);
				}
				this.textBox1.Text = this.textBox1.Text.Insert(index, clipboard_text);
				this.textBox1.SelectionStart = index;
				this.textBox1.SelectionLength = 0;
			}
		}

		private void menuItem3_Click(object sender, System.EventArgs e)
		{
			menuItem2_Click(null, null);
			int index = this.textBox1.SelectionStart;
			this.textBox1.Text = this.textBox1.Text.Remove(index, this.textBox1.SelectionLength);
			this.textBox1.SelectionStart = index;
			this.textBox1.SelectionLength = 0;
		}
	}
}
