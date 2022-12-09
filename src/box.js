export default class Box{
	
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
			this.elem.style.marginLeft = calcPX(this.elem.style.marginLeft, this.width, "+")
		}
		
		if(direct === 'down' && this.elem.getBoundingClientRect().bottom !== bottom){
			let {x,y} = this.elem.getBoundingClientRect();
			let bottomElem = document.elementFromPoint(x,y+100);
			if(bottomElem === this.elem.parentNode)
			this.elem.style.marginTop = calcPX(this.elem.style.marginTop, this.height, "+")
		}
		if(direct === 'left' && this.elem.getBoundingClientRect().left !== left){
			let {x,y} = this.elem.getBoundingClientRect();
			let leftElem = document.elementFromPoint(x-100,y);
			if(leftElem === this.elem.parentNode)
			this.elem.style.marginLeft = calcPX(this.elem.style.marginLeft, this.width, "-")
		}
		if(direct === 'up' && this.elem.getBoundingClientRect().top !== top){
			let {x,y} = this.elem.getBoundingClientRect();
			let topElem = document.elementFromPoint(x,y-100);
			if(topElem === this.elem.parentNode)
			this.elem.style.marginTop = calcPX(this.elem.style.marginTop, this.height, "-")
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
			this.focus()
		})
		
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









