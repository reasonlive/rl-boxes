// DragDrop for DOM Elements //

// argument: {conditions}: 
// custom functions for setting some details
// _draggable: {options of draggable elements}
// events: {function}: handlers for mouseEvents 

export default function DragDrop(conditions){
	
	var _draggable =  {};
	var conditions = conditions || {};
	
	
	this.getOptions = function(){     
		if(_draggable)
			return _draggable;
	}


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
		
	}

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

	}
	this.getDropZone = ()=>{
		if(!this._droppable)return;
		return this._droppable;
	}
	this.setDropZoneProperty = (prop, value)=>{

		if(!this._droppable)return new Error("you haven't droppable object");
		this._droppable[prop] = value;
	}
               ////////////////////////////////////////////////////////////

	function checkCursor(event){
		let elem = document.elementFromPoint(event.pageX,event.pageY);
		//console.log(elem)
		if(elem && !elem.classList.contains("draggable")){
			elem.classList.remove("enable")
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
	//Experimental cancel-function
	function cancelDrag(elem){
		let old = getOption("oldElementState");
		elem.style.left = old.left;
		elem.style.top = old.top;
		elem.style.position = old.position;
		elem.style.zIndex = old.zIndex;

		elem.classList.remove("enable");
		
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
			dropElement(event)
		})
	}

	//You can use this move-function 
	//or adjust your own moving handlers through the initEvents({object})
	function moveElement(...args) {
		let [event] = args;
		let elem = event.target;
		elem.style.left = event.pageX - getOption("shiftFromLeftSide") + "px";
		elem.style.top = event.pageY - getOption("shiftFromTopSide") + "px";
		//checkCursor(event);

		ifCondition(args)
	}


	this.moveOnlyLeftToRight = function(...args) {
		
		let [event] = args;
		let elem = event.target;
		elem.style.left = event.pageX - getOption("shiftFromLeftSide") + "px";
		checkCursor(event);

		ifCondition(args);
		
	}

	this.moveOnlyTopToBottom = function(...args) {
		let [event] = args;
		let elem = event.target;
		elem.style.top = event.pageY - getOption("shiftFromTopSide") + "px";
		checkCursor(event);

		ifCondition(args);
	}

	function dropElement(...args) {
		let [event] = args;
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
		}

		let elem = getOption("object");
		for(let i=0;i<elem.length;i++){
			
			elem[i].addEventListener("mousedown", (e)=>{
				if(eventList && eventList[e.type])eventList[e.type](e);
				else pickElement(e)
			})
			
			elem[i].addEventListener("mouseup", e=>{
				if(eventList && eventList[e.type])eventList[e.type](e);
				else dropElement(e);
			});
		}
		
		document.addEventListener("mousemove", function(event){

			if(eventList && eventList[event.type])eventList[event.type](event);
			else moveElement(event)

				
			//else moveElement(event);
		}
			);
	}
		
}





