var header=null,main=null,axvaRSSPattern=/<item><title>(.+?)<\/title><link>(.+?)<\/link><description>([\w\W]+?)<\/description><pubDate>(.+?)<\/pubDate><\/item>/g;function getControls(){window.addEventListener("resize",resize,false);window.addEventListener("popstate",moveHistory,false);main=getDOM("#main");header=getDOM("header");header.style.left=0;header.style.opacity=1;}
function notesScreenShow(){}
function mapScreenShow(){}
function calendarScreenShow(){}
function aboutScreenShow(){}settings
function showTab(tab,skipState){var boxes=getDOMAll("#main>*");boxes.forEach(function(box,i){setDisplay(tab==box.id,box);box.style.display=tab==box.id?"":"none";});resize();if(window[tab+"ScreenShow"]){window[tab+"ScreenShow"]();}
if(!skipState){tab="#"+tab;window.history.pushState(tab,"Alexandria Mobile > "+tab,tab);}}
function moveHistory(evt){if(document.location.hash.length>0){showTab(document.location.hash.substring(1),true);}}
function resize(){var windowHeight=Math.min(window.innerHeight,screen.availHeight);main.style.height=px(windowHeight-header.clientHeight-2);main.style.top=px(header.clientHeight);window.scrollX=window.scrollY=0;}
function firstNavigation(){var tab,lastView=getSetting("lastView");if(document.location.hash.length>0){tab=document.location.hash.substring(1);}
if(tab&&tab.length>0){showTab(tab,true);}
else if(lastView){showTab(lastView,true);}
else{showTab("about");}}
function pageLoad(loadDataDone,initDone){var doneDone=function(){if(loadDataDone){loadDataDone();}
firstNavigation();if(initDone){initDone();}};try{getControls();clockTick();resize();loadData(doneDone);}
catch(exp){doneDone();}}