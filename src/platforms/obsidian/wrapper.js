const { Plugin, Notice } = require('obsidian');
module.exports = class PajarosDeCartagena extends Plugin {
	onload() {
		console.log("Loading Pájaros de Cartagena version __VERSION__...");
		const OBSIDIAN_PLUGIN = this;
		__CODE__
		console.log("Pájaros de Cartagena loaded!");
	}

	onunload() {
		// Remove the birb when the plugin is unloaded
		document.getElementById('birb')?.remove();
		console.log('Pájaros de Cartagena unloaded!');
	}
};