// animation will be used in the end of the game

 export default function explodeBoxes(elements){
	let timing = setInterval(()=>{
		for(let i=0;i<elements.length;i++){
			if(i % 2 === 0)moveLeft(elements[i],2);
			else moveRight(elements[i],2)
		}
		if(elements[1].getBoundingClientRect().right < 0)
			clearInterval(timing)
	},20)
	for(let i=0;i<elements.length;i++){
		if(i % 2 === 0)
		elements[i].classList.add("box-spread-left");
		else elements[i].classList.add("box-spread-right")
	}
	
	showEndWords(timing, elements[1].parentNode);
	

}
function animate({duration, draw}){
	let start = Performance.now();
	requestAnimationFrame(function animate(time){
		let timeFraction = (time - start) / duration;
		if(timeFraction > 1) timeFraction = 1;


	})
	
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

