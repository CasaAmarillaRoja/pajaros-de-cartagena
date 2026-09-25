import { Directions, getLayerPixels, getWindowHeight, getFixedWindowHeight, getShadowRoot } from './shared.js';
import Layer from './animation/layer.js';
import Frame from './animation/frame.js';
import Anim from './animation/anim.js';
import { BirdType } from './animation/sprites.js';
import { createHatLayers } from './hats.js';

/**
 * @typedef {keyof typeof Animations} AnimationType
 */

export const Animations = /** @type {const} */ ({
	STILL: "STILL",
	BOB: "BOB",
	FLYING: "FLYING",
	HEART: "HEART"
});

export class Birb {
	animStart = Date.now();
	x = 0;
	y = 0;
	direction = Directions.RIGHT;
	isAbsolutePositioned = false;
	visible = true;
	/** @type {AnimationType} */
	currentAnimation = Animations.STILL;

	/** @type {Map<string[][], { frames: Record<string, Frame>, animations: Record<AnimationType, Anim> }>} */
	#animationSets = new Map();

	/**
	 * @param {number} birbCssScale
	 * @param {number} canvasPixelSize
	 * @param {number} spriteWidth
	 * @param {number} spriteHeight
	 * @param {string[][]} hatSpriteSheet The loaded hat sprite sheet pixel data
	 */
	constructor(birbCssScale, canvasPixelSize, spriteWidth, spriteHeight, hatSpriteSheet) {
		this.canvasPixelSize = canvasPixelSize;
		this.spriteWidth = spriteWidth;
		this.spriteHeight = spriteHeight;

		// Build hat layers
		this.hatLayers = createHatLayers(hatSpriteSheet);

		// Create canvas element
		this.canvas = document.createElement("canvas");
		this.canvas.id = "birb";
		this.canvas.width = spriteWidth * canvasPixelSize;
		this.canvas.height = spriteHeight * canvasPixelSize;

		this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext("2d"));

		// Append to shadow dom
		getShadowRoot().appendChild(this.canvas);
	}

	/**
	 * Build the frames and animations for one species' sprite sheet, caching the result
	 * @param {BirdType} species
	 */
	#getAnimationSet(species) {
		const spriteSheet = species.getSpriteSheet();
		let animationSet = this.#animationSets.get(spriteSheet);
		if (!animationSet) {
			animationSet = this.#buildAnimationSet(spriteSheet);
			this.#animationSets.set(spriteSheet, animationSet);
		}
		return animationSet;
	}

	/**
	 * @param {string[][]} spriteSheet The loaded sprite sheet pixel data
	 */
	#buildAnimationSet(spriteSheet) {
		const hatLayers = this.hatLayers;

		// Build layers from sprite sheet
		const layers = {
			base: new Layer(getLayerPixels(spriteSheet, 0, this.spriteWidth)),
			down: new Layer(getLayerPixels(spriteSheet, 1, this.spriteWidth)),
			heartOne: new Layer(getLayerPixels(spriteSheet, 2, this.spriteWidth)),
			heartTwo: new Layer(getLayerPixels(spriteSheet, 3, this.spriteWidth)),
			heartThree: new Layer(getLayerPixels(spriteSheet, 4, this.spriteWidth)),
			tuftBase: new Layer(getLayerPixels(spriteSheet, 5, this.spriteWidth), "tuft"),
			tuftDown: new Layer(getLayerPixels(spriteSheet, 6, this.spriteWidth), "tuft"),
			wingsUp: new Layer(getLayerPixels(spriteSheet, 7, this.spriteWidth)),
			wingsDown: new Layer(getLayerPixels(spriteSheet, 8, this.spriteWidth)),
			happyEye: new Layer(getLayerPixels(spriteSheet, 9, this.spriteWidth)),
		};

		// Build frames from layers
		const frames = {
			base: new Frame([layers.base, layers.tuftBase, ...hatLayers.base]),
			headDown: new Frame([layers.down, layers.tuftDown, ...hatLayers.down]),
			wingsDown: new Frame([layers.base, layers.tuftBase, layers.wingsDown, ...hatLayers.base]),
			wingsUp: new Frame([layers.down, layers.tuftDown, layers.wingsUp, ...hatLayers.down]),
			heartOne: new Frame([layers.base, layers.tuftBase, layers.happyEye, ...hatLayers.base, layers.heartOne]),
			heartTwo: new Frame([layers.base, layers.tuftBase, layers.happyEye, ...hatLayers.base, layers.heartTwo]),
			heartThree: new Frame([layers.base, layers.tuftBase, layers.happyEye, ...hatLayers.base, layers.heartThree]),
			heartFour: new Frame([layers.base, layers.tuftBase, layers.happyEye, ...hatLayers.base, layers.heartTwo]),
		};

		// Build animations from frames
		const animations = {
			[Animations.STILL]: new Anim([frames.base], [1000]),
			[Animations.BOB]: new Anim([
				frames.base,
				frames.headDown
			], [
				420,
				420
			]),
			[Animations.FLYING]: new Anim([
				frames.base,
				frames.wingsUp,
				frames.headDown,
				frames.wingsDown,
			], [
				30,
				80,
				30,
				60,
			]),
			[Animations.HEART]: new Anim([
				frames.heartOne,
				frames.heartTwo,
				frames.heartThree,
				frames.heartFour,
				frames.heartThree,
				frames.heartFour,
				frames.heartThree,
				frames.heartFour,
			], [
				60,
				80,
				250,
				250,
				250,
				250,
				250,
				250,
			], false),
		};

		return { frames, animations };
	}

	/**
	 * Draw the current animation frame
	 * @param {BirdType} species The species data
	 * @param {string} [hat] The name of the current hat
	 * @returns {boolean} Whether the animation has completed (for non-looping animations)
	 */
	draw(species, hat) {
		const anim = this.#getAnimationSet(species).animations[this.currentAnimation];
		return anim.draw(this.ctx, this.direction, this.animStart, this.canvasPixelSize, species.getColorScheme(), [...species.tags, hat || '']);
	}


	/**
	 * @returns {AnimationType} The current animation key
	 */
	getCurrentAnimation() {
		return this.currentAnimation;
	}

	/**
	 * Set the current animation by name and reset the animation timer
	 * @param {AnimationType} animationName
	 */
	setAnimation(animationName) {
		this.currentAnimation = animationName;
		this.animStart = Date.now();
	}

	/**
	 * Get the frames object for a species
	 * @param {BirdType} species
	 * @returns {Record<string, Frame>}
	 */
	getFrames(species) {
		return this.#getAnimationSet(species).frames;
	}

	/**
	 * Get the canvas element
	 * @returns {HTMLCanvasElement}
	 */
	getElement() {
		return this.canvas;
	}

	/**
	 * Get the canvas width in CSS pixels
	 * @returns {number}
	 */
	getElementWidth() {
		return this.canvas.getBoundingClientRect().width;
	}

	/**
	 * Get the canvas height in CSS pixels
	 * @returns {number}
	 */
	getElementHeight() {
		return this.canvas.getBoundingClientRect().height;
	}

	getElementTop() {
		const rect = this.canvas.getBoundingClientRect();
		return rect.top;
	}

	/**
	 * Set the X position
	 * @param {number} x
	 */
	setX(x) {
		this.x = x;
		this.canvas.style.left = `${x - this.canvas.width / 2 - (this.direction === Directions.RIGHT ? 2 : -2)}px`;
	}

	/**
	 * Set the Y position
	 * @param {number} y
	 */
	setY(y) {
		this.y = y;
		let bottom;
		if (this.isAbsolutePositioned) {
			// Position is absolute, convert from fixed
			// Account for address bar shrinkage on iOS
			bottom = y - window.scrollY - (getWindowHeight() - getFixedWindowHeight());
		} else {
			// Position is fixed
			bottom = y;
		}
		this.canvas.style.bottom = `${bottom}px`;
	}

	/**
	 * Get the current X position
	 * @returns {number}
	 */
	getX() {
		return this.x;
	}

	/**
	 * Get the current Y position
	 * @returns {number}
	 */
	getY() {
		return this.y;
	}

	/**
	 * Set the direction the bird is facing
	 * @param {number} direction
	 */
	setDirection(direction) {
		this.direction = direction;
	}

	/**
	 * Set whether the element should be absolutely positioned
	 * @param {boolean} absolute
	 */
	setAbsolutePositioned(absolute) {
		this.isAbsolutePositioned = absolute;
		if (absolute) {
			this.canvas.classList.add("birb-absolute");
		} else {
			this.canvas.classList.remove("birb-absolute");
		}
		// Update Y position to apply the new positioning mode
		this.setY(this.y);
	}

	/**
	 * Set visibility of the bird
	 * @param {boolean} visible
	 */
	setVisible(visible) {
		this.visible = visible;
		this.canvas.style.display = visible ? "" : "none";
	}

	/**
	 * Get visibility of the bird
	 * @returns {boolean}
	 */
	isVisible() {
		return this.visible;
	}
}