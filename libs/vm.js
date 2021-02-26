const OPCODES = require('./opcodes-enum');

module.exports = class VM{
	constructor(opcodesBuffer){
		this.stack = Buffer.alloc(128);
		this.sp = 0;
		this.opcodesBuffer = opcodesBuffer;
	}

	interpret(){
		for(let pc = 0; pc < this.opcodesBuffer.length; pc++){
			let opcode = this.opcodesBuffer[pc];
			let next_arg;

			switch(opcode){
				case OPCODES.push:
					next_arg = this.opcodesBuffer[++pc];
					this.stack[this.sp] = next_arg;
					break;
				case OPCODES.pop:
					this.stack[this.sp] = 0;
					break;
				case OPCODES.add:
					next_arg = this.opcodesBuffer[++pc];
					this.stack[this.sp] = this.stack[this.sp] + next_arg;
					break;
				case OPCODES.sub:
					next_arg = opcodesBuffer[++pc];
					this.stack[this.sp] -= next_arg;
				case OPCODES.print:
					console.log(this.stack[this.sp]);
					break;
				case OPCODES.isp: this.sp++; break;
				case OPCODES.dsp: this.sp--; break;
				case OPCODES.jmp:
					next_arg = this.opcodesBuffer[++pc];
					pc = next_arg;
					break;
				case OPCODES.test:
					next_arg = this.opcodesBuffer[++pc];
					this.stack[this.sp] == next_arg ? this.stack[this.sp+1] = 1 : this.stack[this.sp+1] = 0;
					break;
				case OPCODES.jit:
					next_arg = this.opcodesBuffer[++pc];
					if(this.stack[this.sp] == 1)
						pc = next_arg;
				case OPCODES.done: break;
				default:
					throw new Error('Unknown opcode: ' + opcode);
			}
		}
	}
}