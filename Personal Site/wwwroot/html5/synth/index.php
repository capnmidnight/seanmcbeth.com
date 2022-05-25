<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript">
        var arr = [<?php
            for($i = 0; $i < 10; ++$i)
            {
                if($i > 0)
                    echo ",";
                echo $i;
            }
        ?>];
        console.log(arr);
function load()
{
	//audio variable
	var bpm = 360;
	var powerFactor = 100;
	var volume = 30;
	var samplen = 40;
	var fadeFactor = 50;
	var harmonics = 3;
	var harmonicScale = 20;
	var notes = 80;

	//audio dependants
	function timeToSamples(time)
	{
		return Math.ceil(sampleRate * time / 1000);
	}
	var bitsPerSample = 8;
	var numChannels = 2;
	var sampleRate = 44100;
	var scaleFactor = Math.pow(2, bitsPerSample) / 2;
	var blockAlign = bitsPerSample * numChannels / 8;
	var soundLength, numSamples, fadeLength, data;
	function calcDependants()
	{
		soundLength = 60000 / bpm; // milliseconds
		numSamples = timeToSamples(soundLength);
		fadeLength = numSamples * 0.125 * fadeFactor / 100;
		data = new Array(numSamples*numChannels);
	}

	var sound = [document.getElementById("sound1"), document.getElementById("sound2")];
	var times = [0,0];
	function makeLoadNext(n)
	{
		return function()
		{
			if(mousedown)
			{
				times[n] = Date.now();
				sound[n].src = play();
				setTimeout(function()
				{
					sound[n].play();
				}, soundLength/2);
			}
		};
	}
	function makePlay(n)
	{
		return function()
		{
			var time = Math.max(1, soundLength - Date.now() + times[n]);
			setTimeout(function()
			{
				sound[n].play();
			}, time);
		};
	}
	sound[0].addEventListener("playing", makeLoadNext(1));
	sound[1].addEventListener("playing",  makeLoadNext(0));
	sound[0].addEventListener("canplay", makePlay(0));
	sound[1].addEventListener("canplay",  makePlay(1));

	//UI variables
	var mx = 0, my = 0, nx = 0, ny = 0, fx = 0, fy = 0, lx = 0, ly = 0, ticker = 0;
	var mousedown = false;
	var scope = document.getElementById("scope");
	var bpmDisplay = document.getElementById("bpm");
	var powerDisplay = document.getElementById("power");
	var volumeDisplay = document.getElementById("volume");
	var sampleDisplay = document.getElementById("sampLen");
	var fadeDisplay = document.getElementById("fade");
	var harmonicsDisplay = document.getElementById("harmonics");
	var chordOffsetDisplay = document.getElementById("harmonicScale");
	var noteCountDisplay = document.getElementById("noteCount");
	var noteDisplay = document.getElementById("curNote");

	scope.style.width = scope.width + "px";
	scope.style.height = scope.height + "px";
	bpmDisplay.innerHTML = bpm;
	powerDisplay.innerHTML = powerFactor;
	volumeDisplay.innerHTML = volume;
	sampleDisplay.innerHTML = samplen;
	fadeDisplay.innerHTML = fadeFactor
	harmonicsDisplay.innerHTML = harmonics;
	chordOffsetDisplay.innerHTML = harmonicScale;
	noteCountDisplay.innerHTML = notes;

	var g = scope.getContext("2d");
	g.fillStyle = "#000000";

	calcDependants();
	function encodeAudio8bit(data)
	{
		function encInt8(v){ return String.fromCharCode(v & 0xff); }
		function encInt16(v){ return encInt8(v) + encInt8(v >> 8); }
		function encInt32(v){ return encInt16(v) + encInt16(v >> 16); }

		// 8-bit mono WAVE header. For details, see http://www.sonicspot.com/guide/wavefiles.html
		var header = "RIFF"				// RIFF is the real file format name.
		+ encInt32(36 + data.length)	// The full size of the file. 4 for "WAVE" + 4 for "fmt " + 4 for the size of the length of the format chunk + the length of the format chunk + 4 for "data" + 4 for the size of the length of the data chunk + the length of the data chunk
		+ "WAVE"						// We're encoding WAVEforms.
		+ "fmt " 						// Format chunk.
		+ encInt32(16) 					// 		The length of the format chunk. Count 2 for every encInt16 and 4 for every encInt32.
		+ encInt16(1)		 			// 		Compression format: 1 = Pulse-Code Modulation, no compression.
		+ encInt16(numChannels) 		// 		Number of channels. Stereo would require interleaving that would be a bother to code for such a simple toy.
		+ encInt32(sampleRate)		 	// 		Sample Rate
		+ encInt32(sampleRate * blockAlign)		// 		Average bytes per second to send to the DAC. AvgBytesPerSec = SampleRate * BlockAlign
		+ encInt16(blockAlign)			// 		Block align = Significant Bits per Sample * number of channels / 8
		+ encInt16(bitsPerSample)		// 		Significant bits per sample, in our case, 8-bit.
		+ "data" 						// Data chunk:
		+ encInt32(data.length);		//		The length of the data chunk. For 8-bit sound, it's the same as our number of samples.

		// Output sound data
		for (var i = 0; i < data.length; ++i) 
		{
			var sample = Math.floor((Math.min(1, Math.max(-1, data[i])) + 1) * scaleFactor);
			header += encInt8(sample);
		}
	  
		return 'data:audio/wav;base64,' + btoa(header);
    }

	function pianoFrequency(n)
	{
		return 440 * Math.pow(2, (n - notes / 2) / 12);
	}

	scope.addEventListener("mousemove", function(event)
	{
		mx = event.clientX - scope.offsetLeft;
		my = event.clientY - scope.offsetTop;
		nx = Math.floor(mx * notes / (scope.width + 10));
		ny = Math.floor(my * notes / (scope.height + 10));
		fx = pianoFrequency(nx);
		fy = pianoFrequency(ny);
		curNote.innerHTML = nx + ", " + ny;
	});

	document.addEventListener("keydown", function (event)
	{
	    switch (event.keyCode)
	    {
	        case 32: //Spacebar
	            mousedown = !mousedown;
	            if (mousedown)
	            {
	                sound[0].src = play();
	                sound[0].play();
	            }
	            event.preventDefault();
	            break;
	        case 81: //Q
	            bpm += 20;
	        case 65: //A
	            bpm -= 10;
	            calcDependants();
	            bpmDisplay.innerHTML = bpm;
	            break;
	        case 87: //W
	            powerFactor += 2;
	        case 83: //S
	            powerFactor--;
	            powerDisplay.innerHTML = powerFactor;
	            break;
	        case 69: //E
	            volume += 20;
	        case 68: //D
	            volume -= 10;
	            volumeDisplay.innerHTML = volume;
	            break;
	        case 82: //R
	            samplen += 20;
	        case 70: //F
	            samplen -= 10;
	            sampleDisplay.innerHTML = samplen;
	            break;
	        case 84: //T
	            fadeFactor += 20;
	        case 71: //G
	            fadeFactor -= 10;
	            calcDependants();
	            fadeDisplay.innerHTML = fadeFactor
	            break;
	        case 89: //Y
	            harmonics += 2;
	        case 72: //H
	            harmonics--;
	            harmonicsDisplay.innerHTML = harmonics;
	            break;
	        case 85: //U
	            harmonicScale += 2;
	        case 74: //J
	            harmonicScale--;
	            chordOffsetDisplay.innerHTML = harmonicScale;
	            break;
	        case 73: //I
	            notes += 20;
	        case 75: //K
	            notes -= 10;
	            noteCountDisplay.innerHTML = notes;
	            break;
	        default:
	            console.log(event.keyCode);
	            break;

	    }
	});
	
	function makeSample(t, dt, n, dn)
	{
		var ratio = n * Math.PI / numSamples;
		var x = 0;
		if(t >= 0 && t < dt)
		{
			for(var h = 1; h <= harmonics; ++h)
			x += Math.sin((t/h + h*harmonicScale) * ratio);
			x /= harmonics;
			x = (x<0?-1:1) * Math.pow(Math.abs(x), 1/powerFactor);
			x *= Math.min(1, (Math.pow(2, t/fadeLength)-1)/3)
			* Math.min(1, (Math.pow(2, (dt - t)/fadeLength)-1)/3)
			* volume * 0.95 / 100;
		}
		return x;
	}
	
	function rgb(r, g, b)
	{
		return "rgb(" + r + ", " + g + ", " + b + ")";
	}
    
    function rgba(r, g, b, a)
    {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    }
	
	function drawScope()
	{
		var r = Math.abs(510 * mx / innerWidth - 255);
		var gr = Math.abs(255 - 510 * mx / innerWidth);
		var b = Math.round(255 * my / innerHeight);
		g.fillStyle = rgb(0, 0, 0);
		g.fillRect(0, 0, scope.width, scope.height);
		g.strokeStyle = rgb(0, 255, 0);
		g.beginPath();
		g.moveTo(0, scope.height / 4);
		var sw = scope.width / numSamples;
		for(var i = 0; i < numSamples; ++i)
		{
			g.lineTo(i * sw, (data[2*i] + 1) * scope.height / 4);
		}
		g.stroke();
		g.strokeStyle = rgb(0, 255, 255);
		g.beginPath();
		g.moveTo(0, 3 * scope.height / 4);
		for(var i = 0; i < numSamples; ++i)
		{
			g.lineTo(i * sw, (data[2*i+1] + 3) * scope.height / 4);
		}
		g.stroke();

		g.strokeStyle = rgb(128, 128, 128);
		var nw = scope.width / notes;
		var nh = scope.height / notes;
		for(var i = 0; i < notes; i += 2)
		{
			g.strokeRect(i * nw, -1, nw, scope.height+2);
			g.strokeRect(-1, i * nh, scope.width+2, nh);
		}
        
        g.fillStyle = rgba(128, 128, 128, 0.5);
        g.fillRect(nx * nw, 0, nw, scope.height);
        g.fillRect(0, ny * nh, scope.width, nh);
	}
	drawScope();
	
	function play()
	{
		var ret = null;
		if(mousedown)
		{
			var dy = fy - ly;
			var dx = fx - lx;
			var skip = (100 - samplen) * numSamples / 100;
			for(var t = 0; t < numSamples; ++t)
			{
				var a = 2*t;
				var b = a+1;
				data[a] = makeSample(t - skip/2, numSamples - skip, lx, dx);
				data[b] = makeSample(t - skip/2, numSamples - skip, ly, dy);
			}
			ret = encodeAudio8bit(data);
			drawScope();
			lx = fx;
			ly = fy;
		}
		return ret;
	}
}
		</script>
		<style type="text/css">
		.lcd{
			float:left;
			margin-right:1em;
			width:4em;
			height:1em;
			background-color:black;
			color:#00ff00;
			font-family:Courier, Courier New, fixed;
			padding: 2px;
			border: inset 2px #808080;
			border-radius:2px;
			overflow-x:hidden;
			overflow-y:hidden;
			text-align:right;
		}
						
		#controlPanel{
			float:left;
			width:210px;
			color:#ffffff;
		}
			
		#scope{
			border:inset 5px #808080;
			border-radius: 5px;
		}
			
		#synthPanel{
			background-image:url("bg.jpg");
			padding:10px;
			float:left;
			border:outset 10px #808080;
			border-radius:10px;
			color:white;
			font-family: Gill Sans, Helvetica, Arial, sans-serif;
			font-size:8pt;
		}
			
		.control{
			float:left;
			clear:left;
			padding:2px;
			font-weight:bold;
		}
		</style>
	</head>
	<body onload="load()">
		<!-- it takes time for the audio element to load the file and play it, so we double buffer the sound so there is no delay between them. -->
		<div id="synthPanel">
			<div id="controlPanel">
				<img src="logo.png">
				<div class="control">
					<i>Press space bar to play</i>
				</div>
				<div class="control">
					<i>Use keyboard shortcuts to change parameters</i>
				</div>
				<br></br>
				<div class="control">
					<div class="lcd" id="curNote"></div>
					Current Notes
				</div>
				<div class="control">
					<div class="lcd" id="bpm"></div> BPM (Q/A)
				</div>
				<div class="control">
					<div class="lcd" id="power"></div> Power (W/S)
				</div>
				<div class="control">
					<div class="lcd" id="volume"></div> Volume (E/D)
				</div>
				<div class="control">
					<div class="lcd" id="sampLen"></div> Sample Length (R/F)
				</div>
				<div class="control">
					<div class="lcd" id="fade"></div> Fade Factor (T/G)
				</div>
				<div class="control">
					<div class="lcd" id="harmonics"></div> Chords (Y/H)
				</div>
				<div class="control">
					<div class="lcd" id="harmonicScale"></div> Chord offset (U/J)
				</div>
				<div class="control">
					<div class="lcd" id="noteCount"></div> Note Count (I/K)
				</div>
			</div>
			<audio id="sound1"></audio>
			<audio id="sound2"></audio>
			<canvas id="scope" width="465" height="360"></canvas><br/>
            <a href="http://www.wedusc.com" 
            style="color:White;float:right;">
            by sean t. mcbeth, 2012, maker extraordinaire</a>
		</div>
	</body>
</html>
