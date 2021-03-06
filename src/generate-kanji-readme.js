// node packages
const fs = require("fs");

// local packages
const xterm = require("./xterm-color");

// program settings
let verbose = true;

// parse arguments
for(let argument of process.argv){
	if(argument === "-q") verbose = false;
	else if(argument === "-v") verbose = true;
}

// local consts
const inputSceneFolder = "../scene/formatted/";
const inputNewFolder = "../kanji/new/";
const inputUniqueFolder = "../kanji/unique/";
const outputComprehensiveFile = "../kanji/README.md";

// kanji data
const kanji = require("./kanji");

// other
let kanjiRule = /([\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A])/g;
let sections = [];

// generate general data
{
	let general = [];
	general.push("# Unique Kanji in Order of Appearance");

	// compose text list of all unique kanji
	let list = [];
	for(let entry of kanji.table) list.push(entry.kanji);
	general.push(`> ${list.join("")}`);
	general.push("");

	// add counts
	general.push(`## Kanji Info`)
	general.push(`* There are **${kanji.total}** total kanji in the script.`)
	general.push(`* There are **${kanji.unique}** total unique kanji.`);

	// add to sections
	sections.push(general.join("\r\n"));
}

// add scene header
sections.push("# Scenes");

// generate scene sections
fs.readdir(inputNewFolder, function(err, files){
	for(let file of files){
		if(file.indexOf(".txt") === -1) continue;
		let noext = file.substring(0,file.length-4);
		let num = new Number(noext.substring(0,2));
		let name = noext.substring("00 - ".length);

		let newKanjiData = fs.readFileSync(inputNewFolder+file, "utf8");
		let nSplit = newKanjiData.split("");
		let uniqueKanjiData = fs.readFileSync(inputUniqueFolder+file, "utf8");
		let uSplit = uniqueKanjiData.split("");
		let sceneData = fs.readFileSync(inputSceneFolder+file, "utf8");
		let count = 0;

		count += sceneData.match(kanjiRule).length;
		let line = [];
		line.push(`## Scene ${num}: ${name}`);
		if(nSplit.length) {
			line.push("### New Kanji")
			line.push(`> ${newKanjiData}`);
			line.push("");
		}
		line.push("### Kanji Info");
		line.push(`* There are **${count}** total kanji that appear in this scene.`);
		line.push(`* There are **${uSplit.length}** unique kanji that appear in this scene.`);
		line.push(`* There are **${nSplit.length}** unique kanji that appear for the first time.`);
		if(nSplit.length) line.push(`* That's **${(nSplit.length / kanji.unique*100).toFixed(2)}%** of the unique kanji in the script.`);
		sections.push(line.join("\r\n"));
	}

	fs.writeFileSync(outputComprehensiveFile, sections.join("\r\n\r\n"), "utf8");
	console.log(`Generated ${outputComprehensiveFile}`);
});

