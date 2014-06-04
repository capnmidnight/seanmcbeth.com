using System;
using System.Drawing;
using System.Collections;
using System.Windows.Forms;
using System.Data;

namespace PocketDice
{
	/// <summary>
	/// Summary description for Form1.
	/// </summary>
	public class Form1 : System.Windows.Forms.Form
	{
		private System.Windows.Forms.TextBox txtNumDice;
		private System.Windows.Forms.TextBox txtNumSides;
		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.Label label2;
		private System.Windows.Forms.Button btnRoll;
		private System.Windows.Forms.TextBox txtOut;
		private System.Windows.Forms.MainMenu mainMenu2;
		private System.Windows.Forms.MenuItem menuItem1;
		private System.Windows.Forms.MainMenu mainMenu1;

		public Form1()
		{
			//
			// Required for Windows Form Designer support
			//
			InitializeComponent();
		}
		#region Windows Form Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			System.Resources.ResourceManager resources = new System.Resources.ResourceManager(typeof(Form1));
			this.mainMenu1 = new System.Windows.Forms.MainMenu();
			this.txtNumDice = new System.Windows.Forms.TextBox();
			this.txtNumSides = new System.Windows.Forms.TextBox();
			this.label1 = new System.Windows.Forms.Label();
			this.label2 = new System.Windows.Forms.Label();
			this.btnRoll = new System.Windows.Forms.Button();
			this.txtOut = new System.Windows.Forms.TextBox();
			this.mainMenu2 = new System.Windows.Forms.MainMenu();
			this.menuItem1 = new System.Windows.Forms.MenuItem();
			// 
			// txtNumDice
			// 
			this.txtNumDice.Location = new System.Drawing.Point(64, 8);
			this.txtNumDice.Size = new System.Drawing.Size(24, 22);
			this.txtNumDice.Text = "1";
			// 
			// txtNumSides
			// 
			this.txtNumSides.Location = new System.Drawing.Point(160, 8);
			this.txtNumSides.Size = new System.Drawing.Size(24, 22);
			this.txtNumSides.Text = "6";
			// 
			// label1
			// 
			this.label1.Location = new System.Drawing.Point(8, 8);
			this.label1.Size = new System.Drawing.Size(56, 20);
			this.label1.Text = "# of dice";
			// 
			// label2
			// 
			this.label2.Location = new System.Drawing.Point(96, 8);
			this.label2.Size = new System.Drawing.Size(64, 20);
			this.label2.Text = "# of sides";
			// 
			// btnRoll
			// 
			this.btnRoll.Location = new System.Drawing.Point(192, 8);
			this.btnRoll.Size = new System.Drawing.Size(40, 20);
			this.btnRoll.Text = "Roll";
			this.btnRoll.Click += new System.EventHandler(this.btnRoll_Click);
			// 
			// txtOut
			// 
			this.txtOut.Location = new System.Drawing.Point(0, 32);
			this.txtOut.Multiline = true;
			this.txtOut.Size = new System.Drawing.Size(240, 40);
			this.txtOut.Text = "";
			// 
			// mainMenu2
			// 
			this.mainMenu2.MenuItems.Add(this.menuItem1);
			// 
			// menuItem1
			// 
			this.menuItem1.Text = "Exit";
			this.menuItem1.Click += new System.EventHandler(this.menuItem1_Click);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.Fixed3D;
			// 
			// Form1
			// 
			this.BackColor = System.Drawing.SystemColors.Control;
			this.ClientSize = new System.Drawing.Size(240, 72);
			this.Controls.Add(this.txtOut);
			this.Controls.Add(this.btnRoll);
			this.Controls.Add(this.label2);
			this.Controls.Add(this.label1);
			this.Controls.Add(this.txtNumSides);
			this.Controls.Add(this.txtNumDice);
			this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
			this.MaximizeBox = false;
			this.Menu = this.mainMenu2;
			this.Text = "PocketDice";

		}
		#endregion

		/// <summary>
		/// The main entry point for the application.
		/// </summary>

		static void Main() 
		{
			Application.Run(new Form1());
		}
		private int GetInt(string strNum, string name)
		{
			try
			{
				return int.Parse(strNum);
			}
			catch(Exception)
			{
				MessageBox.Show(name + " is not a valid number","ERROR!",MessageBoxButtons.OK, MessageBoxIcon.Hand,MessageBoxDefaultButton.Button1);
				return 0;
			}
		}
		private void btnRoll_Click(object sender, System.EventArgs e)
		{
			int numDice = GetInt(txtNumDice.Text, "'# of dice'");
			if(numDice > 0)
			{
				int numSides = GetInt(txtNumSides.Text, "'# of sides'");
				if(numSides > 0)
				{
					Random r =new Random();
					txtOut.Text = "";
					for(int i = 0; i < numDice; ++i)
					{
						txtOut.Text += (r.Next(numSides) + 1);
						if(i < numDice - 1)
						{
							txtOut.Text += ",";
						}
					}
				}
			}
		}
        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            base.OnClosing(e);
            Application.Exit();
        }
		private void menuItem1_Click(object sender, System.EventArgs e)
		{
			Application.Exit();
		}
	}
}
