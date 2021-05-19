import {godsList} from "./godsList.js"
var selection = {
    currentGod: "default",
    currentSkin: "skin1",
     set god(god) {
	 this.currentGod = god;
	 this.currentSkin = "skin1"
	 changeGod();
    },
    get god() {
	return this.currentGod;
    },
    set skin(skin) {
	this.currentSkin = skin;
	changeGod();
    },
    get skin() {
	return this.currentSkin;
    }
};

var leftBar = document.querySelector('#left');
var rightBar = document.querySelector('#right');
var tauntlist = document.querySelector("#tauntlist");
var fragment = new DocumentFragment();
var tauntFragment = new DocumentFragment();

godsList.forEach(function (god) {
	 var div = document.createElement('div')
	 div.className = "god";
	 div.id = god
	 div.addEventListener('click', function (event) {
	     selection.god = this.id;
	 });
	 div.innerHTML = "<img src='images/icon/"+god+"/skin1.jpg' width='100%' height='100%'>";
	 fragment.appendChild(div)
	 var taunt = document.createElement("dd");
	 taunt.className = "vgs"
	 taunt.innerHTML = "<audio></audio>" + capitalizeFirstLetter(god);
	 taunt.id = "taunt_directed_" + god;
	 tauntFragment.appendChild(taunt);
     });
tauntlist.appendChild(tauntFragment)
leftBar.appendChild(fragment)

var rightBarFragment = new DocumentFragment();
Array(20).fill().map((_, i) => i + 1).forEach(function (number) {
    var div = document.createElement('div');
    div.id = "skin" + number.toString();
    div.className = "skin";
    div.addEventListener('click', function(){
	selection.skin = this.id;
    });
    div.innerHTML = "<img src='images/card/"+selection.god+"/"+div.id+".jpg' width='100%' height='100%'>"
    rightBarFragment.appendChild(div);
});
rightBar.appendChild(rightBarFragment);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function hidetabs(){
    document.querySelectorAll(".tab").forEach(function(tab){
    tab.style.display = "none"
    })};

var tabbuttons = document.querySelectorAll(".tabbutton");
tabbuttons.forEach(function(tabbutton){
    tabbutton.addEventListener("click",function(){
	hidetabs();
        tabbuttons.forEach(function(tabbutton){
	    tabbutton.className = "tabbutton";
	});
	tabbutton.className += " active";
    })});

document.querySelector("#talk").addEventListener("click",function(){
    document.querySelector("#talktab").style.display = "flex";
});
document.querySelector("#attack").addEventListener("click",function(){
    document.querySelector("#attacktab").style.display = "flex";
});
document.querySelector("#gank").addEventListener("click",function(){
    document.querySelector("#ganktab").style.display = "flex";
});
document.querySelector("#ward").addEventListener("click",function(){
    document.querySelector("#wardtab").style.display = "flex";
});
document.querySelector("#ingame").addEventListener("click",function(){
    document.querySelector("#ingametab").style.display = "flex";
});

     
function changeGod(god) {
    let overlay = document.querySelectorAll(".overlay");
    overlay.forEach(element => element.style.display = "")
    var image = document.getElementById("card");
    image.src = "images/card/"+selection.god+"/"+selection.skin+".jpg";
    image.style.display = "";
    document.querySelectorAll(".skin").forEach(
	function(element) {
	    element.style.display = "none";
	    element.firstElementChild.src = "images/card/"+selection.god+"/"+element.id+".jpg";
	    element.firstElementChild.addEventListener("load", function (event) {
		     element.style.display = "flex"
	    });
	});
    let vgsPromises = [];
    document.querySelectorAll(".vgs").forEach(
	function(element) {
	    let promise = new Promise((resolve, reject) => {
		element.style.display = "none";
		element.firstElementChild.src = "sounds/"+selection.god+"/"+selection.skin+"/"+element.id+".ogg";
		element.addEventListener("click", function (event) {
		     element.firstElementChild.play();
		});
		let timer = setInterval(function () {
		    if (element.firstElementChild.readyState == 4){
			element.style.display = "flex";
			clearInterval(timer);
			resolve("Loaded");
		    }
		    else if (element.firstElementChild.error){
			clearInterval(timer);
			reject(element.firstElementChild.error);
		    }},50)
	    });
	    vgsPromises.push(promise)
	});
    Promise.allSettled(vgsPromises).then(values => {
	console.log(values);
	overlay.forEach(element => element.style.display = "none");
    })
};

selection.god = "default"
selection.skin = "skin1"
