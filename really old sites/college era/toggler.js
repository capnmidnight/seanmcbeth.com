function toggle(togID, boxID)
{
	var tog = document.getElementById(togID);
	var box = document.getElementById(boxID);

	if(box.style.display == "none")
	{
		box.style.display = "block";
		tog.innerText = "-";
	}
	else
	{
		box.style.display = "none";
		tog.innerText = "+";
	}
}
function toggleAll()
{
	var arr = document.getElementsByTagName("span");
	for(var i = 0; i < arr.length; ++i)
	{
		if(arr[i].className == "toggler" && arr[i].id != null)
		{
			arr[i].onclick();
		}
	}
}
