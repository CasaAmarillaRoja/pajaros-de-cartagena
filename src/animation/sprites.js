import species from "../species.js"


export const RARITY = Object.freeze(/** @type {const} */ ({
	COMMON: "common",
	UNCOMMON: "uncommon",
	POE: "poe",
	SECRET: "secret"
}));

/** @typedef {typeof RARITY[keyof typeof RARITY]} Rarity */

export class BirdType {
	/**
	 * @param {string} name
	 * @param {string} description
	 * @param {string} latinName
	 * @param {string} url
	 * @param {number} spriteIndex
	 * @param {string} highlightColor
	 * @param {string[]} [tags]
	 * @param {Rarity} [rarity]
	 * @param {string} [hint]
	 */
	constructor(name, description, latinName, url, spriteIndex, highlightColor, tags = [], rarity = RARITY.COMMON, hint = "") {
		this.name = name;
		this.description = description;
		this.latinName = latinName;
		this.url = url;
		this.spriteIndex = spriteIndex;
		this.highlightColor = highlightColor;
		this.tags = tags;
		/** @type {Rarity} */
		this.rarity = rarity;
		this.hint = hint;
	}

	/**
	 * @param {Object<string, string>} colorScheme
	 */
	setColorScheme(colorScheme) {
		this.colorScheme = colorScheme;
	}

	/**
	 * @returns {Object<string, string>}
	 */
	getColorScheme() {
		if (!this.colorScheme) {
			throw new Error("Color scheme requested before generation");
		}
		return this.colorScheme;
	}

	/**
	 * @param {string[][]} spriteSheet
	 */
	setSpriteSheet(spriteSheet) {
		this.spriteSheet = spriteSheet;
	}

	/**
	 * @returns {string[][]}
	 */
	getSpriteSheet() {
		if (!this.spriteSheet) {
			throw new Error("Sprite sheet requested before generation");
		}
		return this.spriteSheet;
	}
}

/** @type {Record<string, BirdType>} */
export const SPECIES = Object.fromEntries(
	Object.entries(species).map(([id, data]) => [
		id,
		new BirdType(data.name, data.description, data.latinName, data.url, data.spriteIndex, data.highlightColor, data.tags, /** @type {Rarity|undefined} */ (data.rarity), data.hint)
	]),
);