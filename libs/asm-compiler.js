const OPCODES = require('./opcodes-enum');

module.exports = class Compiler{
	constructor(text){
		this.text = text.trim().replace(/((\r)?\n)+/g, ' ').split(' ');
		this.opcodesBuffer = Buffer.alloc(128);
		this.literals = Object.keys(OPCODES);
		this.labels = {};
	}

	createLabels(){
		this.text.forEach((literal, i) => {
			if(/(.+):/.test(literal)){
				let label = literal.match(/(?<label>.+):/).groups.label;
				this.labels[label] = i;
				delete this.text[i];
			}
		});
	}

	compile(){
		this.text.forEach((literal, i) => {
			if(this.literals.indexOf(literal) != -1)
				literal = OPCODES[literal];
			else if(/#(.+)/.test(literal)){
				literal = this.labels[literal.match(/#(?<label>.+)/).groups.label];
			}else literal = parseInt(literal);

			this.opcodesBuffer[i] = literal;
		});
	}
}