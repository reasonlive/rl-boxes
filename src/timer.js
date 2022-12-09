export default class Timer{
	//state could be ["zero", "now", "own"]
	constructor(state){
		this.state = state;
		return this;
	}
	tick(){
		if(this.value.s < 59){
			this.value.s += 1;
		}else{
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
		}else{
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
		}
		return {h:time.hours,m:time.minutes,s:time.seconds};
	}
	set(h,m,s){
		if(arguments.length > 0){
			return {h:h,m:m,s:s};
		}else{
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
		else str = `${this.value.h}:`
		if(this.value.m < 10)str += `0${this.value.m}:`;
		else str += `${this.value.m}:`;
		if(this.value.s < 10)str += `0${this.value.s}`;
		else str += `${this.value.s}`;
		element.innerHTML = str;
	}
}

//let timer = new Timer("thisTime").init(null).start();
//setTimeout(()=>timer.stop().render(), 2000)