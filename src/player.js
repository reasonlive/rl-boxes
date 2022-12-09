export class Player{
	constructor(name){
	this.name = name;

	}
	setPhoto(url){
		this.photo = url;
	}
	isWinner(){
		this.color = "yellow";
		return this.color;
	}
}