const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
	.command('compile [path]', 'Compile the program', yargs => {
		yargs
			.positional('path', {
				describe : 'Program path'
			})
			.option('outFile', {
				describe : 'Compiled program out file path',
				alias : 'o',
				default : './main.bin'
			});
	}, argv => compile(argv.path, argv.outFile))
	.command('run [path]', 'Run the binary file', yargs => {
		yargs
			.positional('path', {
				describe : 'Binary file path'
			})
	}, argv => runBinary(argv.path))
	.argv;

function compile(path, outFile){
		const fs = require('fs');
		const Compiler = require('./libs/asm-compiler');

		let asm;
		try{
			asm = fs.readFileSync(path, 'utf8');
		}catch(e){ console.error(e); }

		const compiler = new Compiler(asm);
		compiler.createLabels();
		compiler.compile();

		let compiled = compiler.opcodesBuffer;

		fs.writeFileSync(outFile, compiled);
}

function runBinary(path){
	const fs = require('fs');
	const VM = require('./libs/vm');

	let program;
	try{
		program = fs.readFileSync(path);
	}catch(e){ console.error(e); }

	let bakaVM = new VM(program);
	bakaVM.interpret();
}