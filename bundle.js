'use strict';

class Box{
	
	constructor(elem){
		this.elem = elem;
		this.width = elem.offsetWidth;
		this.height = elem.offsetHeight;
		//console.log(elem.offsetHeight)

	}
	shift(direct){
		let {top,right,bottom,left} = this.elem.parentNode.getBoundingClientRect();
		
		if(direct === 'right' && this.elem.getBoundingClientRect().right !== right)
		{
			let {x,y} = this.elem.getBoundingClientRect();
			let rightElem = document.elementFromPoint(x+100,y);
			if(rightElem === this.elem.parentNode)
			this.elem.style.marginLeft = calcPX(this.elem.style.marginLeft, this.width, "+");
		}
		
		if(direct === 'down' && this.elem.getBoundingClientRect().bottom !== bottom){
			let {x,y} = this.elem.getBoundingClientRect();
			let bottomElem = document.elementFromPoint(x,y+100);
			if(bottomElem === this.elem.parentNode)
			this.elem.style.marginTop = calcPX(this.elem.style.marginTop, this.height, "+");
		}
		if(direct === 'left' && this.elem.getBoundingClientRect().left !== left){
			let {x,y} = this.elem.getBoundingClientRect();
			let leftElem = document.elementFromPoint(x-100,y);
			if(leftElem === this.elem.parentNode)
			this.elem.style.marginLeft = calcPX(this.elem.style.marginLeft, this.width, "-");
		}
		if(direct === 'up' && this.elem.getBoundingClientRect().top !== top){
			let {x,y} = this.elem.getBoundingClientRect();
			let topElem = document.elementFromPoint(x,y-100);
			if(topElem === this.elem.parentNode)
			this.elem.style.marginTop = calcPX(this.elem.style.marginTop, this.height, "-");
		}
		
		
	}
	switchFocus(direction){

	}
	setEvents(){
		this.elem.addEventListener("focus", function(e){
			//if(!e.target.classList.contains('player'))
			this.classList.add("active");

		});
		this.elem.addEventListener("blur", function(e){
			//if (!e.target.classList.contains('player'))
			this.classList.remove("active");
		});
		this.elem.addEventListener("keydown", (e)=>{
			if(document.activeElement === e.target){
				switch(e.keyCode){
					case 37: this.shift("left");break;
					case 38: this.shift("up");break;
					case 39: this.shift("right");break;
					case 40: this.shift("down");break;
					default: return;
				}
			}
		});
		this.elem.addEventListener('mouseover', function(e){
			this.focus();
		});
		
	}
	getCoords(){
		return this.elem.getBoundingClientRect()
	}


}

// calculate numbers and pixels
function calcPX(a,b, act){
	let string = "";
	if(!a)a = 0;
	if(isNaN(a) || typeof a === 'string')
		a = parseInt(a);
	if(act === "+")
		string = a + b;
	if(act === "-")
		string = a - b;
	
	return string += "px";
}

// DragDrop for DOM Elements //

// argument: {conditions}: 
// custom functions for setting some details
// _draggable: {options of draggable elements}
// events: {function}: handlers for mouseEvents 

function DragDrop(conditions){
	
	var _draggable =  {};
	var conditions = conditions || {};
	
	
	this.getOptions = function(){     
		if(_draggable)
			return _draggable;
	};


	this.apply = function(item){    // it could be one element or collection of elements

		if(item instanceof HTMLElement){
			_draggable.object = [item];
			_draggable.object[0].classList.add("draggable");
		}else
		if(item instanceof HTMLCollection){
			_draggable.object = item;
			for(let i=0;i<item.length;i++)
				_draggable.object[i].classList.add("draggable");
		}else throw new Error("argument must be DOM Entity");
		
	};

	function addOptions(obj){
		for(let key in obj){
			_draggable[key] = obj[key];
		}
	}
	function addOption(key,value){
		_draggable[key] = value;
	}
	function getOption(key){
		return _draggable[key];
	}

	// methods for droppable object////////////////////////
	this.setDropZone = function(element){
		if(!this._droppable)this._droppable = {};
		this._droppable.object = element;

	};
	this.getDropZone = ()=>{
		if(!this._droppable)return;
		return this._droppable;
	};
	this.setDropZoneProperty = (prop, value)=>{

		if(!this._droppable)return new Error("you haven't droppable object");
		this._droppable[prop] = value;
	};
               ////////////////////////////////////////////////////////////

	function checkCursor(event){
		let elem = document.elementFromPoint(event.pageX,event.pageY);
		//console.log(elem)
		if(elem && !elem.classList.contains("draggable")){
			elem.classList.remove("enable");
			dropElement(event);
		}
	}

	function ifCondition(args){
		let [e, event] = args;
		let eventType = e.type ? e.type : event.type;

		for(let func in conditions){
			if(conditions[eventType])
				conditions[eventType](args);
		}
	}

	this.addProperties = addOptions;
// acts with element //////////////////////////////////////////


	function getOldState(elem){
		return {
			position: elem.style.position,
			zIndex: elem.style.zIndex,
			left: elem.style.left,
			top: elem.style.top
		}
	}

	function pickElement(...args){

		let [event] = args;
		let x = event.pageX, y = event.pageY;
		let elem = event.target;
		if(!elem.classList.contains("draggable"))return;

		addOption("oldElementState", getOldState(elem));
		elem.classList.add("enable");
		elem.style.position = "absolute";
		elem.style.zIndex = 1000;
		
		addOptions({shiftFromLeftSide: x - elem.getBoundingClientRect().left,
					 shiftFromTopSide: y - elem.getBoundingClientRect().top,
					 startx: x,
					  starty: y,
					  shiftFromRightSide: elem.getBoundingClientRect().right - x,
					  shiftFromBottomSide: elem.getBoundingClientRect().bottom - y
					});
		
		ifCondition(args);
		document.addEventListener("mouseup", function(e){
			dropElement(event);
		});
	}

	//You can use this move-function 
	//or adjust your own moving handlers through the initEvents({object})
	function moveElement(...args) {
		let [event] = args;
		let elem = event.target;
		elem.style.left = event.pageX - getOption("shiftFromLeftSide") + "px";
		elem.style.top = event.pageY - getOption("shiftFromTopSide") + "px";
		//checkCursor(event);

		ifCondition(args);
	}


	this.moveOnlyLeftToRight = function(...args) {
		
		let [event] = args;
		let elem = event.target;
		elem.style.left = event.pageX - getOption("shiftFromLeftSide") + "px";
		checkCursor(event);

		ifCondition(args);
		
	};

	this.moveOnlyTopToBottom = function(...args) {
		let [event] = args;
		let elem = event.target;
		elem.style.top = event.pageY - getOption("shiftFromTopSide") + "px";
		checkCursor(event);

		ifCondition(args);
	};

	function dropElement(...args) {
		if(document.getElementsByClassName("enable")[0])
			document.getElementsByClassName("enable")[0].
			classList.remove("enable");
		let drag = getOption("object");
		_draggable = {};
		addOption("object", drag);
		
	}
	this.dropElement = dropElement;

	
	this.initEvents = function(eventList){
		if(!getOption("object"))return;

		document.ondragstart = function(e){
			e.preventDefault();
			return false;
		};

		let elem = getOption("object");
		for(let i=0;i<elem.length;i++){
			
			elem[i].addEventListener("mousedown", (e)=>{
				if(eventList && eventList[e.type])eventList[e.type](e);
				else pickElement(e);
			});
			
			elem[i].addEventListener("mouseup", e=>{
				if(eventList && eventList[e.type])eventList[e.type](e);
				else dropElement(e);
			});
		}
		
		document.addEventListener("mousemove", function(event){

			if(eventList && eventList[event.type])eventList[event.type](event);
			else moveElement(event);

				
			//else moveElement(event);
		}
			);
	};
		
}

/*For making object in order to manage sound effects*/

class Sound{
	constructor(conditions){
		this.conditions = conditions || new Map();
		this.sounds = {};
	}
	getExtension(url){
		return url.slice(url.length-3);
	}
	getName(url){
		return url.slice(url.lastIndexOf("/")+1,(url.length-4));
	}

	setSound(url){
		this.sounds[this.getName(url)] = new Audio(url);
	}
	setSounds(urls){
		for(let url of urls){
			
			this.sounds[this.getName(url)] = new Audio(url);
		}
	}
	getSound(name){
		
		return this.sounds[name];
	}
	play(name, vol){
		if(this.conditions.size > 0 && this.conditions.has(name))
			this.conditions.get(name)(name);
		else if(this.getSound(name)){
			if(vol)this.getSound(name).volume = vol;
			this.getSound(name).play();
		}
		return this.getSound(name);
	}
	
	initEvents(){

	}
}

class Timer{
	//state could be ["zero", "now", "own"]
	constructor(state){
		this.state = state;
		return this;
	}
	tick(){
		if(this.value.s < 59){
			this.value.s += 1;
		}else {
			this.value.s = 0;
			this.value.m +=1;
		}
		if(this.value.m > 59){
			this.value.m = 0;
			this.value.h += 1;
		}
		if(this.value.h > 23){
			this.value.h = this.value.m = this.value.s = 0;
		}
	}
	reversedTick(){
		if(this.value.s === 0)this.value.s = 60;
		if(this.value.s < 61 && this.value.s > 1){
			this.value.s -= 1;
		}else {
			this.value.s = 0;
			this.value.m -=1;
			
		}
		if(this.value.m < 0){
			this.value.m = 59;
			this.value.h -= 1; 
		}
		if(this.value.h < 0){
			this.value.h = 23;
			this.value.m = 59;
			this.value.s = 0;
		}
	}
	

	now(){
		let time = {
			hours: new Date().getHours(),
			minutes: new Date().getMinutes(),
			seconds: new Date().getSeconds()
		};
		return {h:time.hours,m:time.minutes,s:time.seconds};
	}
	set(h,m,s){
		if(arguments.length > 0){
			return {h:h,m:m,s:s};
		}else {
			return {h:0,m:0,s:0};
		}
	}

	// can be used instead : init(initial){}
	setReverse(h,m,s){
		if(arguments.length < 3)
			return;
		else {
			this.value = {h:h,m:m,s:s};
			this.reversed = true;
		}
		return this;
	}
	//Main actions
	init(initial){
		if(this.state === "zero")
			this.value = this.set();
		if(this.state === "now"){
			this.value = this.now();
		}
		if(this.state === "own"){
			this.value = initial;
		}
		return this;
	}
	start(element, speed){
		this.go = setInterval(()=>{
			if(this.reversed){
				this.reversedTick();this.render(element);
			}
			else this.tick();this.render(element);
		},speed);
		return this;
	}
	stop(element){
		
		clearInterval(this.go);
		this.value = {h:0,m:0,s:0};
		this.render(element);
		//if(element)element.remove();
		return this;
	}
	render(element){
		let str = "";
		if(this.value.h < 10)str = `0${this.value.h}:`;
		else str = `${this.value.h}:`;
		if(this.value.m < 10)str += `0${this.value.m}:`;
		else str += `${this.value.m}:`;
		if(this.value.s < 10)str += `0${this.value.s}`;
		else str += `${this.value.s}`;
		element.innerHTML = str;
	}
}

//let timer = new Timer("thisTime").init(null).start();
//setTimeout(()=>timer.stop().render(), 2000)

// animation will be used in the end of the game

 function explodeBoxes(elements){
	let timing = setInterval(()=>{
		for(let i=0;i<elements.length;i++){
			if(i % 2 === 0)moveLeft(elements[i],2);
			else moveRight(elements[i],2);
		}
		if(elements[1].getBoundingClientRect().right < 0)
			clearInterval(timing);
	},20);
	for(let i=0;i<elements.length;i++){
		if(i % 2 === 0)
		elements[i].classList.add("box-spread-left");
		else elements[i].classList.add("box-spread-right");
	}
	
	showEndWords(timing, elements[1].parentNode);
	

}
function showEndWords(timing, where){
	let words = "";
	setTimeout(()=> clearInterval(timing),9000);
	words = document.createElement("div");
		words.className = "game-over";
		words.innerHTML = "Game Over";
		where.append(words);
	setTimeout(()=> {
		words.style.fontSize = `50px`;
		words.style.cursor = "pointer";
		words.addEventListener("click", ()=> window.location.reload());
	},4000);
	requestAnimationFrame(function animate(time){
		where.style.background = "black";
	});

	
}

function moveLeft(element, px){
	
		element.style.left = parseInt(element.style.left) -
		px + "px";
	
}

function moveRight(element, px){
	
		element.style.left = parseInt(element.style.left) +
		px + "px";	
}

////////METHODS FOR DETERMING DIRECTION FOR ELEMENTS
function freeWays(element){
	//count++;
	let parent = element.parentNode;
	let {left,right,bottom,top} = element.getBoundingClientRect();
	//console.log(element.getBoundingClientRect())
	//console.log(left,top)
	let freeSides = [];
	if(document.elementFromPoint(left-50, top) === parent)
		//console.log(document.elementFromPoint(left+5,top+5))
		freeSides.push("left");
	if(document.elementFromPoint(right, top) === parent)
		freeSides.push("right");
	if(document.elementFromPoint(left,top-50) === parent)
		freeSides.push("top");
	if(document.elementFromPoint(left, bottom) === parent)
		freeSides.push("bottom");
	return freeSides;
}

//////////////////////////////////FIND ELEMENT WHICH PLACED NEAR THE DRAGGABLE//////////////////////////////////////////////////


function findSideElem(mainElem, side){
	let width = mainElem.offsetWidth,height = mainElem.offsetHeight;
	let x = mainElem.getBoundingClientRect().left;
	let y = mainElem.getBoundingClientRect().top;
	let parent = mainElem.parentNode;
	let sideElem = null;
	if(side === "left"){
		while(parent === mainElem.parentNode){                           
			parent = document.elementFromPoint((x-width/2), (y+height/2));
			x -= width;
		}
        if(parent && parent.classList.contains('draggable'))
		sideElem = parent;
	}
	if(side === "right"){
		//console.log(parent.classList.contains("main__play-box"))
		while(parent === mainElem.parentNode){                           
			parent = document.elementFromPoint((x+width+(width/2)), (y+height/2));
			x += width;

		}
        if(parent && parent.classList.contains('draggable'))		
		sideElem = parent;
	}
	if(side === "top"){
		while(parent === mainElem.parentNode){                           
			parent = document.elementFromPoint((x+width/2), (y-height/2));
			y -= height;
		}
        if(parent && parent.classList.contains('draggable'))
		sideElem = parent;
	}
	if(side === "bottom"){
		while(parent === mainElem.parentNode){                           
			parent = document.elementFromPoint((x+width/2), (y+height+(height/2)));
			y += height;
		}
        if(parent && parent.classList.contains('draggable'))
		sideElem = parent;
	}
	return sideElem;
}

////////////////////////////////////////////////MANIPULATIONS WITH ELEMENT//////////////////////////////////////////////////////

function takeElement(...args){

	let [event, dragObject] = args;
	let x = event.pageX, y = event.pageY;
	let elem = event.target;
	if(!elem.classList.contains("draggable"))return;

	
	elem.classList.add("enable");
	elem.style.position = "absolute";
	elem.style.zIndex = 1000;
	
	elem.shiftx = x - elem.getBoundingClientRect().left;
	elem.shifty = y - elem.getBoundingClientRect().top;
	elem.leftx = elem.getBoundingClientRect().left;
	elem.rightx = elem.getBoundingClientRect().right;
	elem.topy = elem.getBoundingClientRect().top;
	elem.bottomy = elem.getBoundingClientRect().bottom;
	elem.leftelem = findSideElem(elem, "left");
	elem.rightelem = findSideElem(elem, "right");
	elem.topelem = findSideElem(elem, "top");
	elem.bottomelem = findSideElem(elem, "bottom");
	
	dragObject.addProperties({shiftFromLeftSide: x - elem.getBoundingClientRect().left,
				 shiftFromTopSide: y - elem.getBoundingClientRect().top,
				 startx: x,
				  starty: y,
				  shiftFromRightSide: elem.getBoundingClientRect().right - x,
				  shiftFromBottomSide: elem.getBoundingClientRect().bottom - y
				});
	
	document.addEventListener("mousedown", function(e){

	});
}

function moveLeftOrRight(...args){
	let [event,element,drag] = args;
	if(element.classList.contains("enable")){
		let leftelem = element.leftelem,
			rightelem = element.rightelem;
		let rightShift = drag.getOptions().shiftFromRightSide;
		
		let {left,right} =  element.parentNode.getBoundingClientRect();
		
		if(freeWays(element).length > 0){
			if(freeWays(element).some(i=>i==="left") && freeWays(element).some(i=>i==="right")){
				let leftBoundary = leftelem ? leftelem.getBoundingClientRect().right : left;
				let rightBoundary = rightelem ? rightelem.getBoundingClientRect().left : right;

				if(leftBoundary <= (event.pageX-element.shiftx) &&
					 rightBoundary >= (event.pageX+rightShift))
				element.style.left = event.pageX - element.shiftx + "px";
				else return;
			}else
			if(freeWays(element).some(i=> i === "right")){
				let leftBoundary = leftelem ? leftelem.getBoundingClientRect().right : left;
				let rightBoundary = rightelem ? rightelem.getBoundingClientRect().left : right;

				if(leftBoundary <= (event.pageX-element.shiftx) && rightBoundary >= (event.pageX+rightShift))
					element.style.left = event.pageX - element.shiftx + "px";
				else return;
				
				
			}else
			if(freeWays(element).some(i=> i === "left")){
				let leftBoundary = leftelem ? leftelem.getBoundingClientRect().right : left;
				let rightBoundary = rightelem ? rightelem.getBoundingClientRect().left : right;

				if(leftBoundary <= (event.pageX-element.shiftx) && rightBoundary >= (event.pageX+rightShift))
					element.style.left = event.pageX - element.shiftx + "px";
				else return;

				
			}
			
		}else {
			return;
		}

	}
		
}

function moveTopOrBottom(...args){
	let [event,element,drag] = args;

	if(element.classList.contains("enable")){
		let topelem = element.topelem,
			bottomelem = element.bottomelem;
		let bottomShift = drag.getOptions().shiftFromBottomSide;
		let {top,bottom} =  element.parentNode.getBoundingClientRect();
		
		if(freeWays(element).length > 0){

			if(freeWays(element).some(i=>i==="top") && freeWays(element).some(i=>i==="bottom")){
				let topBoundary = topelem ? topelem.getBoundingClientRect().bottom : top;
				let bottomBoundary = bottomelem ? bottomelem.getBoundingClientRect().top : bottom;

				if(topBoundary <= (event.pageY-element.shifty) &&
					 bottomBoundary >= (event.pageY+bottomShift))
				element.style.top = event.pageY - element.shifty + "px";
				else return;
			}else
			if(freeWays(element).some(i=> i === "top")){
				let topBoundary = topelem ? topelem.getBoundingClientRect().bottom : top;
				let bottomBoundary = bottomelem ? bottomelem.getBoundingClientRect().top : bottom;

				if(topBoundary <= (event.pageY-element.shifty) && bottomBoundary >= (event.pageY+bottomShift))
					element.style.top = event.pageY - element.shifty + "px";
				else return;
				
				
			}else
			if(freeWays(element).some(i=> i === "bottom")){

				let topBoundary = topelem ? topelem.getBoundingClientRect().bottom : top;
				let bottomBoundary = bottomelem ? bottomelem.getBoundingClientRect().top : bottom;
				//console.log(`${topBoundary}: ${event.pageY}`)
				//element.style.top = event.pageY - element.shifty + "px"
				if(topBoundary <= (event.pageY-element.shifty) && bottomBoundary >= (event.pageY+bottomShift))
					element.style.top = event.pageY - element.shifty + "px";
				else return;

				
			}
			
		}else {
			return;
		}

	}
		
}

const elements = document.getElementsByClassName("play-box__square");
const player = document.getElementsByClassName('player')[0];
let hole = null;
const mainElementsColor = getComputedStyle(elements[1]).backgroundColor;
let win = false;

document.body.onselectstart = function(e){
	e.preventDefault();
	return false;
};


// helpers for definition and initialization play field
function takeInitCoords(elements){
	let coords = [];
	for(let i=0;i<elements.length;i++){
		let {left,top} = elements[i].getBoundingClientRect();
		let item = {left: left,top:top};
		coords.push(item);
	}
	return coords;
}

function initGame(elems){
	let coords = takeInitCoords(elems);
	
	for(let i=0;i<elems.length;i++){
		elems[i].style.position = "absolute";
		elems[i].style.left = coords[i].left + "px";
		elems[i].style.top = coords[i].top + "px";
		let box = new Box(elems[i]);
		box.setEvents();
	}
}

function showRulesAndButtons(){
	let div = document.createElement("div");
	div.className = "rule-box";
	div.style.position = "absolute";
	div.style.top = `100px`;
	div.style.left = `30px`;
	div.innerHTML = `<div class='rule'>1.You have to reach the hole in 30 seconds</div>
	<br><br><br><div class="rule">2.To start the game click the "start" button</div>`;
	document.body.append(div);
	document.querySelector(".button").style.display = "flex";
	
}
function removeRulesAndButtons(){
	if(document.getElementsByClassName("button")[0])
		document.getElementsByClassName("button")[0].remove();
	if(document.getElementsByClassName("rule-box")[0])
		document.getElementsByClassName("rule-box")[0].remove();
}


///////////////////////// Main Code of webpage processes //


//set sound effects
let sound = new Sound();

sound.setSounds(["./audio/btn-begin.mp3", "./audio/light.wav",
	"./audio/explode.wav","./audio/over.mp3",
	"./audio/start.mp3","./audio/shift.mp3","./audio/bye.mp3", "./audio/applause.mp3",
	"./audio/tick-sound.mp3" ]);

// handler for "Begin" button
document.getElementsByClassName("greeting__btn-begin")[0].
addEventListener("click", ()=> {
	sound.play("btn-begin");
	document.getElementsByClassName("greeting")[0].hidden = true;
	document.getElementsByClassName("popup")[0].hidden = false;
	setTimeout(()=>{
		document.querySelector(".popup__inset").style.width = `300px`;
		document.querySelector(".popup__inset").style.height = `100px`;
		setTimeout(()=>{
			document.querySelector(".popup__inset__content").
			style.display = "block";
		},400);
	},400);
	
});

// handler for "Enter" keyboard
document.querySelector(".input-name").onkeydown = function(e){
	if(e.keyCode === 13 && this.value){
		player.name = this.value;
		document.querySelector(".status__text").innerHTML = `
		"${this.value}" is in the game!`;
		document.querySelector(".popup").hidden = true;
		document.querySelector(".main__play-box").style.display = "flex";
		sound.play("start", 0.1);
		setTimeout(()=> document.querySelector(".main__play-box").style.opacity = 1,0);
		setTimeout(()=>showRulesAndButtons(),1000);
		
	}
};

// handler for "OK" button
document.querySelector("label[for='name']").
addEventListener("click", ()=>{
	let input = document.querySelector(".input-name");
	if(input.value){
		player.name = input.value;
		document.querySelector(".status__text").innerHTML = `
		"${input.value}" is in the game!`;
		document.querySelector(".popup").hidden = true;
		document.querySelector(".main__play-box").style.display = "flex";
		sound.play("start", 0.1);
		setTimeout(()=>showRulesAndButtons(),1000);
		setTimeout(()=> document.querySelector(".main__play-box").style.opacity = 1,0);

	}else {
		return;
	}
});
// handler for "bye" button
document.querySelectorAll(".button__item")[1].onclick = function(){

	sound.play("bye",0.1);
	setTimeout(()=>location.reload(),700);
};

// handler for "start" button
document.querySelector(".button__item").onclick = function(e){
	sound.play("btn-begin");

	initGame(elements); // initializing field

	let drag = new DragDrop(); // initializing draggable functions
	drag.apply(elements);

	// need to detect the droppable place for player image
	let parentBox = document.getElementsByClassName("main__play-box")[0];
	let dropCoords = {
		left: parentBox.getBoundingClientRect().right - 50,
		top: parentBox.getBoundingClientRect().bottom - 50	};
		
	let droppablePoint =  {
		x: dropCoords.left,
		y: dropCoords.top
	};
	hole = droppablePoint;
	drag.setDropZone(droppablePoint);
	


	drag.initEvents({  // draggable handlers
		mousedown: function(e){
			takeElement(e,drag);
			drag.activeElement = e.target;
			document.getElementsByClassName("enable")[0].style.backgroundColor = "darkred";
		},
		mousemove: function(e){
			document.addEventListener("mouseup", e=>{
				if(drag.activeElement){
					sound.play("shift");
					drag.activeElement.style.backgroundColor = mainElementsColor;
				}
				

				// computing droppable place and if it is dropZone
				if(drag.getDropZone() && drag.activeElement === player){

					

					if(e.pageX > (droppablePoint.x - 50) && e.pageX < (droppablePoint.x+50) &&
						e.pageY > (droppablePoint.y -50) && e.pageY < (droppablePoint.y+50)){
				
							let [left,top] = [player.getBoundingClientRect().left, player.getBoundingClientRect().top];
							if(left == (droppablePoint.x - 50) && left < (droppablePoint.x+50) &&
								top == (droppablePoint.y - 50) && top < (droppablePoint.y+50))win = true; // player reached the aim


					}
						

				}
				delete drag.activeElement; 
				drag.dropElement(e);

			});
			moveLeftOrRight(e,e.target,drag);
			moveTopOrBottom(e,e.target,drag);
		},
	});

	startPlayInterval().catch((err)=>{// the begin of the game
		console.log(err);
	}); 
};

function renderAfterWin(){
	player.parentNode.remove();
	let html = "<div class='win'>"+player.name+" you are the winner!</div>";
	document.getElementsByClassName("main")[0].
	innerHTML = html;
	document.getElementsByClassName("status__text")[0].
	innerHTML = html;

}


//initializing timer;it must be wraped into Promise();
async function startPlayInterval(){

		hole.x = hole.x - 50;
		hole.y = hole.y - 50;
		console.log(hole);
		document.querySelector(".button__item").onclick = null;
		let timerRender = document.getElementsByClassName("timer")[0];
		timerRender.hidden = false;

		let timer = new Timer().setReverse(0,29,0).start(timerRender,16);
		let tick = sound.play("tick-sound", 0.03);
		
		// cancel if player will be winner
		function cancelPlayInterval(){
			timer.stop(timerRender);
			sound.play("applause");
			timerRender.remove();
			removeRulesAndButtons();
			renderAfterWin();
			timer = sound = null;
		}


		
		let checkWinner = setInterval(()=>{
			let left = player.getBoundingClientRect().left;
			let top = player.getBoundingClientRect().top;

			if(win || (left == hole.x && top == hole.y)){
				tick.muted = true;
				timer.stop(timerRender);
				clearInterval(checkWinner);
				cancelPlayInterval();

				return;
			}

			
		},200);

		await new Promise((res,rej)=> setTimeout(()=>
			res(timerRender.classList.add("timer-blink")), 14000));//14000
		

		await new Promise(res=> setTimeout(()=>{
			if(timer)timer.stop(timerRender);
			res(timer);
		},14800));//14800

		// after end of timer it will use explosion-animation and game-over rendering
		await new Promise(res=>{
			sound.play("explode",1); // zaebla
			timerRender.remove();
			removeRulesAndButtons();
			res(explodeBoxes(elements));
		});

		await new Promise(res=> setTimeout(()=>res(sound.play("over")),4000));

}
