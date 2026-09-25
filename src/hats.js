import Anim from "./animation/anim.js";
import Frame from "./animation/frame.js";
import Layer, { TAG } from "./animation/layer.js";
import { getLayerPixels } from "./shared.js";

const HAT_WIDTH = 12;

export const HAT = {
	NONE: "none",
	TOP_HAT: "top-hat",
	FEZ: "fez",
	WIZARD_HAT: "wizard-hat",
	BASEBALL_CAP: "baseball-cap",
	FLOWER_HAT: "flower-hat",
	COWBOY_HAT: "cowboy-hat",
	BEANIE: "beanie",
	SUN_HAT: "sun-hat",
	VIKING_HELMET: "viking-helmet",
	STRAW_HAT: "straw-hat",
	CORDOVAN_HAT: "cordovan-hat"
};

/** @type {{ [hatId: string]: { name: string, description: string } }} */
export const HAT_METADATA = {
	[HAT.NONE]: {
		name: "Sombrero invisible",
		description: "¡Es como no llevar nada puesto!"
	},
	[HAT.TOP_HAT]: {
		name: "Sombrero de copa",
		description: "La seña de identidad de todo un caballero con plumas."
	},
	[HAT.VIKING_HELMET]: {
		name: "Casco vikingo",
		description: "Es cierto que los vikingos nunca llevaron cascos así, pero ¿por qué dejar que los hechos estropeen la buena moda?"
	},
	[HAT.COWBOY_HAT]: {
		name: "Sombrero de vaquero",
		description: "No puedes unirte a los vaqueros de consola sin el atuendo adecuado."
	},
	[HAT.FEZ]: {
		name: "Fez",
		description: "Es un fez. Llevar fez es lo máximo."
	},
	[HAT.WIZARD_HAT]: {
		name: "Sombrero de mago",
		description: "Otorga a quien lo lleva un poder místico aterrador, pero por suerte los pájaros solo lo usan para invocar abuelitas con migas de pan."
	},
	[HAT.BASEBALL_CAP]: {
		name: "Gorra de béisbol",
		description: "Los pájaros no batean muy bien, pero nadie les gana robando bases."
	},
	[HAT.FLOWER_HAT]: {
		name: "Sombrero de flores",
		description: "A decir verdad, más que un sombrero es un terrón que tu mascota recogió por ahí."
	},
	[HAT.BEANIE]: {
		name: "Gorro de lana",
		description: "¡Mantiene las plumas calientes durante las largas migraciones!"
	},
	[HAT.SUN_HAT]: {
		name: "Sombrero para el sol",
		description: "Perfecto para retozar por campos de flores encantados."
	},
	[HAT.STRAW_HAT]: {
		name: "Sombrero de paja",
		description: "Un diseño clásico, aunque conviene mantenerlo lejos del agua: al parecer, este sombrero no flota."
	},
	[HAT.CORDOVAN_HAT]: {
		name: "Sombrero cordobés",
		description: "Un sombrero tradicional español que no se mueve ni en los duelos de espadas más feroces."
	}
};

/**
 * @param {string[][]} spriteSheet 
 * @returns {{ base: Layer[], down: Layer[] }}
 */
export function createHatLayers(spriteSheet) {
	/** @type {{ base: Layer[], down: Layer[] }} */
	const hatLayers = {
		base: [],
		down: []
	};
	let index = 0;
	for (const [hatName, hatKey] of Object.entries(HAT)) {
		if (hatName === 'NONE') {
			continue;
		}
		const hatLayer = buildHatLayer(spriteSheet, hatKey, index);
		const downHatLayer = buildHatLayer(spriteSheet, hatKey, index, 1);
		hatLayers.base.push(hatLayer);
		hatLayers.down.push(downHatLayer);
		index++;
	}
	return hatLayers;
}

/**
 * @param {string[][]} spriteSheet
 * @param {string} hatId 
 * @returns {Anim}
 */
export function createHatItemAnimation(hatId, spriteSheet) {
	const hatLayer = buildHatItemLayer(spriteSheet, hatId);
	const frames = [
		new Frame([hatLayer])
	];
	return new Anim(frames, [1000], true);
}

/**
 * @param {string[][]} spriteSheet 
 * @param {string} hatName
 * @param {number} hatIndex
 * @param {number} [yOffset=0]
 * @returns {Layer}
 */
function buildHatLayer(spriteSheet, hatName, hatIndex, yOffset = 0) {
	const LEFT_PADDING = 6;
	const RIGHT_PADDING = 14;
	const TOP_PADDING = 5 + yOffset;
	const BOTTOM_PADDING = Math.max(0, 15 - yOffset);

	let hatPixels = getLayerPixels(spriteSheet, hatIndex, HAT_WIDTH);
	hatPixels = pad(hatPixels, TOP_PADDING, BOTTOM_PADDING, LEFT_PADDING, RIGHT_PADDING);
	hatPixels = drawOutline(hatPixels, false);

	return new Layer(hatPixels, hatName);
}

/**
 * @param {string[][]} spriteSheet 
 * @param {string} hatId 
 * @returns {Layer}
 */
function buildHatItemLayer(spriteSheet, hatId) {
	if (hatId === HAT.NONE) {
		return new Layer([], TAG.DEFAULT);
	}
	const hatIndex = Object.values(HAT).indexOf(hatId) - 1;
	let hatPixels = getLayerPixels(spriteSheet, hatIndex, HAT_WIDTH);
	hatPixels = pad(hatPixels, 1, 1, 1, 1);
	hatPixels = drawOutline(hatPixels, true);
	hatPixels = pushToBottom(hatPixels);
	return new Layer(hatPixels, TAG.DEFAULT);
}

/**
 * Add transparent padding around the pixel array
 * @param {string[][]} pixels 
 * @param {number} top 
 * @param {number} bottom 
 * @param {number} left 
 * @param {number} right 
 * @returns {string[][]}
 */
function pad(pixels, top, bottom, left, right) {
	const paddedPixels = [];
	const rowLength = pixels[0].length + left + right;
	// Top padding
	for (let y = 0; y < top; y++) {
		paddedPixels.push(Array(rowLength).fill("transparent"));
	}
	// Left and right padding
	for (let y = 0; y < pixels.length; y++) {
		const row = [];
		for (let x = 0; x < left; x++) {
			row.push("transparent");
		}
		for (let x = 0; x < pixels[y].length; x++) {
			row.push(pixels[y][x]);
		}
		for (let x = 0; x < right; x++) {
			row.push("transparent");
		}
		paddedPixels.push(row);
	}
	// Bottom padding
	for (let y = 0; y < bottom; y++) {
		paddedPixels.push(Array(rowLength).fill("transparent"));
	}
	return paddedPixels;
}

/**
 * Draw an outline around non-transparent pixels
 * @param {string[][]} pixels 
 * @param {boolean} [outlineBottom=false]
 * @return {string[][]}
 */
function drawOutline(pixels, outlineBottom = false) {
	let neighborOffsets = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[-1, -1],
		[1, -1],
	];
	if (outlineBottom) {
		neighborOffsets.push([0, 1], [-1, 1], [1, 1]);
	}
	for (let y = 0; y < pixels.length; y++) {
		for (let x = 0; x < pixels[y].length; x++) {
			const pixel = pixels[y][x];
			if (pixel !== "transparent" && pixel !== "#ffffff") {
				for (let [dx, dy] of neighborOffsets) {
					const newX = x + dx;
					const newY = y + dy;
					if (newY >= 0 && newY < pixels.length && newX >= 0 && newX < pixels[newY].length && pixels[newY][newX] === "transparent") {
						pixels[newY][newX] = "#ffffff";
					}
				}
			}
		}
	}
	return pixels;
}

/**
 * Trim transparent rows from the bottom and push them to the top
 * @param {string[][]} pixels
 * @returns {string[][]}
 */
function pushToBottom(pixels) {
	let trimmedPixels = pixels.slice();
	let trimCount = 0;
	while (trimmedPixels.length > 1) {
		const firstRow = trimmedPixels[trimmedPixels.length - 1];
		if (firstRow.every(pixel => pixel === "transparent")) {
			trimmedPixels.pop();
			trimCount++;
		} else {
			break;
		}
	}
	trimmedPixels = pad(trimmedPixels, trimCount, 0, 0, 0);
	return trimmedPixels;
}