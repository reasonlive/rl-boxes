/*For making object in order to manage sound effects*/

export default class Sound{
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






