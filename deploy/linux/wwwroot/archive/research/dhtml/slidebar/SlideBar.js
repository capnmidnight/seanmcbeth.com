function TrimNumber(d)
{
	if(d.indexOf("px") >= 0)
	{
		return TrimNumber(d.substring(0, d.length - 2));
	}
	else if(d.indexOf("%") >= 0)
	{
		return TrimNumber(d.substring(0, d.length - 1));
	}
	else
	{
		return Math.round(d * 1);
	}
}

var _controls = new Array();
var _currentControl;
var _curX;
var _curY;
function SelectControl(id)
{
	//find the control
	var i;
	for(i = 0; i < _controls.length; ++i)
	{
		if(_controls[i].block.id == id)
		{
			_currentControl = _controls[i];
		}
	}
	_curX = event.clientX;
	_curY = event.clientY;
}
function UnselectControl()
{
	try
	{
		_currentControl.Release();
	}
	catch(exp)
	{
		//do nothing
	}
	_currentControl = null;
}
function AddControl(control)
{
	_controls[_controls.length] = control;
}
function AddControlById(id)
{
	try
	{
		AddControl(new Control(id));
	}
	catch(exp)
	{
		//do nothing
	}
}
function DragControl()
{
	if(_currentControl != null)
	{
		var dx = event.clientX - _curX;
		_curX += dx;
		var dy = event.clientY - _curY;
		_curY += dy;
		_currentControl.MoveBy(dx, dy);
	}
}
//iterate through the list of tags looking for ones that have the SlideBar class
function FindSlideBars()
{
	var tags = document.getElementsByTagName("div");
	var i;
	for(i = 0; i < tags.length; ++i)
	{
		if(tags[i].className.indexOf("SlideBarControl") >= 0)
		{
			
			AddControl(new SlideBar(tags[i].id));
		}
	}
	//set up event handler for mouse up
	document.onmouseup = CatFunction(document.onmouseup, "UnselectControl()");
	//set up event handler for mouse move
	document.onmousemove = CatFunction(document.onmousemove, "DragControl()");
}
//preserve the function of a preexisting event handler and add functionallity to it.
function CatFunction(func_curr, str_add)
{
	var body = "";
	if(func_curr != null)
	{
		var func = func_curr.toString();
		var s = func.indexOf('{');
		var f = func.lastIndexOf('}');
		body = func.substring(s+1,f);
		body += "\n"
	}
	body += str_add+";";
	return new Function("",body);
}
//A generic page control
function Control(id)
{
	//check input
	if(id == null || id =="")
	{
		throw new Error("invalid ID, null or empty");
	}
	//attempt to retrieve the object
	this.block = document.getElementById(id);
	//check to see if the object exists
	if(this.block == null)
	{
		throw new Error("invalid object reference, ID["+id+"] does not refer to a page element");
	}
	this.BlockIs = Control_BlockIs;
	this.type = "Control";
	this.x = TrimNumber(this.block.style.left);
	this.y = TrimNumber(this.block.style.top);
}//checks a control to see if it possesses a specific class type
function Control_BlockIs(className)
{
	return this.block.className.indexOf(className) >= 0;
}
function SlideBar(id)
{
	this.parentControl = Control;
	this.parentControl(id);
	this.parentControl = null;
	var subTags = this.block.getElementsByTagName("div");
	//find all sub controls
	this.subControls = new Array();
	var i;
	for(i = 0; i < subTags.length; ++i)
	{
		try
		{
			var temp = new Control(subTags[i].id);
			this.subControls[this.subControls.length] = temp;
		}
		catch(exp)
		{
			//do nothing
		}
	}
	//parse parameters
	this.ParseParams = SlideBar_ParseParams;
	this.ParseParams();
	
	//setup sub controls
	this.SetupControls = SlideBar_SetupControls;
	this.SetupControls();
	this.SetValue = SlideBar_SetValue;
	this.SetPropValue = SlideBar_SetPropValue;
	this.ResetHandle = SlideBar_ResetHandle;
	//find value field
	this.value = null;
	subTags = this.block.getElementsByTagName("input");
	for(i = 0; i < subTags.length; ++i)
	{
		if(subTags[i].className = "SlideBarValue")
		{
			this.value = subTags[i];
			if(this.value.value > 0)
			{
				this.ResetHandle();
			}
			break;
		}
	}

}
//retrieve parameters of the control. Parameters may be defined in any order.
function SlideBar_ParseParams()
{
	var i;
	this.horizontal = false;
	this.snaps = 0;
	this.length = 100;
	if(this.BlockIs("vertical") || this.BlockIs("horizontal"))
	{
		this.horizontal = this.BlockIs("horizontal");
	}
	for(i = 0; i < this.subControls.length; ++i)
	{
		if(this.subControls[i].BlockIs("SlideBarParam"))
		{
			var value = this.subControls[i].block.innerText;
			if(this.subControls[i].BlockIs("snapPoints"))
			{
				try
				{
					this.snaps = this.subControls[i].block.innerText * 1;
				}
				catch(exp)
				{
					throw new Error("must specify a numerical value for the number of snapPoints.");
				}
				if(this.snaps < 2)
				{
					throw new Error("the number of snapPoints must be greater than 1.");
				}
			}
			else if(this.subControls[i].BlockIs("length"))
			{
				try
				{
					this.length = this.subControls[i].block.innerText * 1;
				}
				catch(exp)
				{
					throw new Error("The specified control length is not a number");
				}
			}
		}
	}
}
//build the internal controls of the slide bar.
function SlideBar_SetupControls()
{
	this.slot = null;
	this.handle = null;
	this.tabs = null;
	var param = this.horizontal?"width":"height";
	eval("this.block.style."+param+" = this.length + \"px\"");

	//create sub controls
	for(var i = 0; i < this.subControls.length; ++i)
	{
		if(this.subControls[i].BlockIs("SlideBarSlot"))
		{
			//create slot
			this.slot = new SlideBarSlot(this.subControls[i].block.id, this.horizontal);
		}
		else if(this.subControls[i].BlockIs("SlideBarHandle"))
		{
			//create handle
			this.handle = new SlideBarHandle(this.subControls[i].block.id, this.horizontal, this, this.length);
			AddControl(this.handle);
		}
		else if(this.subControls[i].BlockIs("SlideBarContainer"))
		{
			//orient containers
			var dir = (this.horizontal?"Horizontal":"Vertical");
			this.subControls[i].block.className += " " + dir + "SlideBarContainer";;
			if(this.subControls[i].BlockIs("SlideBarTabs"))
			{
				//set tab container
				this.tabs = this.subControls[i].block;
				this.tabs.className = "SlideBarContainer "+dir+"SlideBarContainer SlideBarTabs "+dir+"SlideBarTabs";
			}
		}
	}
	//build tabs
	if(this.snaps > 0 && this.tabs != null)
	{
		var front = "<div class=\"SlideBarTab\" id=\""+this.block.id+"tb";
		var back = "</div>";
		var com = "onclick=\"SetSlideValue('"+this.block.id+"',";
		var total = "<div style=\"position:absolute;width:100%;height:100%\">";
		var dv = 100/(this.snaps - 1);
		var w = this.horizontal?dv:100;
		var h = this.horizontal?100:dv;
		var edge = this.horizontal?"left":"top";
		for(var i = 0; i < this.snaps; ++i)
		{
			var v = dv * i;
			v = TrimNumber(v.toString());
			total += front + i + "\" "+com+v+")\" style=\"position:absolute;width:"+w+"%;";
			total += edge + ":"+(v*0.9+3)+"%;\">" + v + "%" + back;
		}
		this.tabs.innerHTML = total;
	}
}
//set the absolute location of the slide bar handle 
//and calculate the appropriate proportional value
function SlideBar_SetValue(v)
{
	if(v > this.length) v = this.length;
	else if(v < 0) v = 0;
	this.value.value = v * 100 /  this.length;
	if(this.horizontal)
	{
		this.handle.x = v;
		this.handle.block.style.left = v * 0.9 + "px";
	}
	else
	{
		this.handle.y = v;
		this.handle.block.style.top = v * 0.9 + "px";
	}
}
//set the proportional location of the slide bar handle 
//and calculate the appropriate absolute value
function SlideBar_SetPropValue(v)
{
	if(v > 100) v = 100;
	else if(v < 0) v = 0;
	this.value.value = v;
	if(this.horizontal)
	{
		this.handle.x = v * this.length / 100;
		this.handle.block.style.left = v * this.length * 0.009 + "px";
	}
	else
	{
		this.handle.y = v * this.length / 100;
		this.handle.block.style.top = v * this.length * 0.009 + "px";
	}
}

function SetSlideValue(id, val)
{
	SelectControl(id);
	try
	{
		_currentControl.SetPropValue(val);
	}
	catch(exp)
	{
	}
	_currentControl = null;
}

//When the slide bar is first loaded, it may have an initial point selected. This method resyncs
//the handle with the hidden field value.
function SlideBar_ResetHandle()
{
	var oldx, oldy, val, dim, param;
	oldx = this.handle.x;
	oldy = this.handle.y;
	try
	{
		val = this.value.value * 1;
	}
	catch(exp)
	{
		throw new Error("The initial position for the slide bar is invalid");
	}
	this.SetPropValue(val);
}
function SlideBarSlot(id, horizontal)
{
	this.parentControl = Control;
	this.parentControl(id);
	this.parentControl = null;
	var dir = (horizontal?"Horizontal":"Vertical") + "SlideBarSlot";
	this.block.className = this.block.className + " " + dir;
}

function SlideBarHandle(id, horizontal, parent, size)
{
	this.parentControl = Control;
	this.parentControl(id);
	this.parentControl = null;
	this.max = size;
	
	this.parent = parent;
	this.horizontal = horizontal;
	
	var dir = (this.horizontal?"Horizontal":"Vertical") + "SlideBarHandle";
	this.block.className = this.block.className + " " + dir;
	
	this.block.onmousedown = new Function("", "SelectControl(\""+this.block.id+"\");");
	this.Release = SlideBarHandle_Release;
	this.MoveBy = SlideBarHandle_MoveBy;
}
function SlideBarHandle_Release()
{
	var val = this.parent.value.value;
	//snap to
	if(this.parent.snaps >= 2)
	{
		val = Math.floor(val * (this.parent.snaps - 1) / 100 + 0.5) * 100 / (this.parent.snaps - 1);
		val = val.toString();
		if(val.indexOf(".") >= 0)
		{
			val = val.substring(0, val.indexOf("."));
		}
		val = val * 1;
		/*
		if(this.horizontal)
		{
			this.MoveBy(val - this.x, 0);
		}
		else
		{
			this.MoveBy(0, val - this.y);
		}
		*/
	}
	this.parent.SetPropValue(val);
}
function SlideBarHandle_MoveBy(dx, dy)
{
	var val;
	if(this.horizontal)
	{
		val = this.x + dx;
	}
	else
	{
		val = this.y + dy;
	}
	this.parent.SetValue(val);
}