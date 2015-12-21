var box = document.getElementById("frownies");

var skins = ["#FFDFC4",	"#F0D5BE", "#EECEB3",	"#E1B899",	"#E5C298",	"#FFDCB2",	"#E5B887",	"#E5A073",	"#E79E6D",	"#DB9065",	"#CE967C",	"#C67856",	"#BA6C49",	"#A57257",	"#F0C8C9",	"#DDA8A0",	"#B97C6D",	"#A8756C",	"#AD6452",	"#5C3836",	"#CB8442",	"#BD723C",	"#704139",	"#A3866A",	"#870400",	"#710101",	"#430000",	"#5B0001", "#302E2E" ];

// repeating faces changes the balance of what gets displayed
var faces = [":(",":(",":(",":(",":(",":(",":o",":^",":O", ":."];

function qp(n, x) {
  return Math.floor(Math.random() * (x-n) + n);
}

function q(a){
  return a[qp(0, a.length)];
}

var fs = [], cur;
for(var i = 0; i < 550; ++i){
  var frowny = document.createElement("div");
  fs[i] = frowny;
  frowny.className = "frowny";
  frowny.appendChild(document.createTextNode(q(faces)));
  frowny.style.backgroundColor = q(skins)
  box.appendChild(frowny);
}
setInterval(function(){
  fs.forEach(function(cur){
    cur.innerHTML = "";
    cur.appendChild(document.createTextNode(q(faces)));
  });
}, 100);

