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

function checkFreeWay(element, side){
		let sides = freeWays(element);
		if(sides.length === 0)return false;
		for(i of sides){
			if(i === side)
				return true;
		}
		return false;
}

//////////////////////////////////FIND ELEMENT WHICH PLACED NEAR THE DRAGGABLE//////////////////////////////////////////////////


function findSideElem(mainElem, side){
	let count = 0;
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

	})
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
			
		}else{
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
			
		}else{
			return;
		}

	}
		
}

export {takeElement,moveTopOrBottom,moveLeftOrRight};