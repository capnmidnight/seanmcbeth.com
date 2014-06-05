<?php
$arr = file(".banlist");
$user = $_SERVER['REMOTE_ADDR'];
$banned = false;
foreach($arr as $usr)
{
	$temp = trim($usr);
	if($temp === $user)
	{
		$banned = true;
	}
}
if($banned)
{
?>
	<html>
	<body style="color:red;background-color:yellow;font-size:200px;font-family:courier;">
		You've been banned, ASSHAT!
	</body>

	<script language="javascript">
	var yellow = "#FFFF00";
	var red = "#FF0000";
	var tick = 0;
	function AGH()
	{
		var block = document.getElementsByTagName("body");
		block = block[0];
		if(tick == 0)
		{
			tick = 1;
			block.style.backgroundColor = yellow;
			block.style.color = red;
		}
		else
		{
			tick = 0;
			block.style.backgroundColor = red;
			block.style.color = yellow;
		}
		setTimeout("AGH()", 100);		
	}
	AGH();
	</script>
	</html>
<?php
}
else
{
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>McBeth Software Systems</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
<link rel="stylesheet" type="text/css" href="toggler.css"/>
<script type="text/javascript" src="toggler.js"></script>
</head>
<body>
<div class="page">
<div class="header"><a href="http://www.seanmcbeth.com"><img border=0 src="img/banner.jpg" alt="banner"/></a></div>
<div class="bottom">
<?php include "menu.html"; ?>
<div class="main">
<?php
	$page = "main.html";
	if(isset($_GET['page']))
	{
		$page = $_GET['page'];
	}
	include $page;
?>
</div>
</div>
</div>
</body>
</html>
<?php
}
?>
