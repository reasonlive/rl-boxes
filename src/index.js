import Box from "./box.js";
import DragDrop from "./drag-drop.js";
import Sound from "./sounds.js";
import Timer from "./timer.js";
import explodeBoxes from "./animate.js";
import {takeElement, moveLeftOrRight, moveTopOrBottom} from "./movable.js";

const elements = document.getElementsByClassName("play-box__square");
const player = document.getElementsByClassName('player')[0];
let hole = null;
const mainElementsColor = getComputedStyle(elements[1]).backgroundColor;
let win = false;

document.body.onselectstart = function(e){
	e.preventDefault()
	return false;
}


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
	div.style.left = `30px`
	div.innerHTML = `<div class='rule'>1.You have to reach the hole in 30 seconds</div>
	<br><br><br><div class="rule">2.To start the game click the "start" button</div>`
	document.body.append(div);
	document.querySelector(".button").style.display = "flex";
	
}
function removeRulesAndButtons(){
	if(document.getElementsByClassName("button")[0])
		document.getElementsByClassName("button")[0].remove();
	if(document.getElementsByClassName("rule-box")[0])
		document.getElementsByClassName("rule-box")[0].remove()
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
		},400)
	},400)
	
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
}

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
		sound.play("start", 0.1)
		setTimeout(()=>showRulesAndButtons(),1000);
		setTimeout(()=> document.querySelector(".main__play-box").style.opacity = 1,0);

	}else{
		return;
	}
})
// handler for "bye" button
document.querySelectorAll(".button__item")[1].onclick = function(){

	sound.play("bye",0.1);
	setTimeout(()=>location.reload(),700);
}

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
		top: parentBox.getBoundingClientRect().bottom - 50	}
		
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
			moveTopOrBottom(e,e.target,drag)
		},
	});

	startPlayInterval().catch((err)=>{// the begin of the game
		console.log(err)
	}) 
}

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

			
		},200)

		await new Promise((res,rej)=> setTimeout(()=>
			res(timerRender.classList.add("timer-blink")), 14000))//14000
		

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
		})

		await new Promise(res=> setTimeout(()=>res(sound.play("over")),4000));

}






