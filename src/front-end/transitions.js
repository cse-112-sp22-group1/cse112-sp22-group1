/**
 * Transitions
 * @module transitions
 */

/**
 * Single parameter callback
 * @callback singleParameterCallback
 */

/**
 * Transitions an element using a fading effect
 * @function fade
 * @param {Object} element The element the transition occurs on.
 * @param {singleParameterCallback} callback Function for when transition end is true.
 */
export function fade (element, callback) {
	// Initial opacity
	let op = 1;
	let timer = setInterval(() => {
		let end = false;
		if (op <= 0.1) {
			clearInterval(timer);
			element.style.display = "none";
			element.style.opacity = 0;
			end = true;
		}
		element.style.opacity = op;
		op -= op * 0.1;
		if (end && callback) {
			callback();
		}
	}, 10);
}

/**
 * Single parameter callback
 * @callback singleParameterCallback
 */

/**
 * Transitions an element using a fading effect opposite of fade
 * @function unfade
 * @param {Object} element The element the transition occurs on.
 * @param {singleParameterCallback} callback function for when transition end is true
 */
export function unfade (element, callback) {
	element.style.display = "block";
	element.style.opacity = 0;
	setTimeout(() => {
		let end = false;
		// Initial opacity
		let op = 0.1;
		element.style.opacity = op;
		let timer = setInterval(() => {
			if (op >= 1) {
				clearInterval(timer);
				end = true;
			}
			element.style.opacity = op;
			op += op * 0.1;
			if (end && callback) {
				callback();
			}
		}, 15);
	}, 220);

}
