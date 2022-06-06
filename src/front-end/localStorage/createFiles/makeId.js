/**
 * Creates and returns a random id of length 30.
 * @memberof createFunctions
 * @return Returns a randomly generated id of length 30.
 */
function makeRandomString () {
   let length = 30;
   let result = [];
   let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join("");
}

/**
 * Checks ID uniqueness
 * @memberof createFunctions
 * @param {String} id generated ID for new object
 * @param {User} doc the localStorage stored User object
 * @return Returns UID
 */
function checkUniqueness (id, doc) {
   let finalID = id;
   let arrays = [];
   Array.prototype.push.apply(arrays, doc.dailyLogs);
   Array.prototype.push.apply(arrays, doc.monthlyLogs);
   Array.prototype.push.apply(arrays, doc.futureLogs);
   Array.prototype.push.apply(arrays, doc.collections);
   Array.prototype.push.apply(arrays, doc.trackers);
   Array.prototype.push.apply(arrays, doc.textBlocks);
   Array.prototype.push.apply(arrays, doc.tasks);
   Array.prototype.push.apply(arrays, doc.events);
   Array.prototype.push.apply(arrays, doc.signifiers);
   Array.prototype.push.apply(arrays, doc.imageBlocks);
   Array.prototype.push.apply(arrays, doc.audioBlocks);

   while (arrays.filter((element) => element.id === id).length > 0) {
      finalID = makeRandomString();
   }
   return finalID;
}

/**
 * Creates and returns a random id of length 30.
 * @memberof createFunctions
 * @param {User} doc the localStorage stored User object
 * @return Returns a randomly generated id of length 30.
 */
export function makeid (doc) {
   return checkUniqueness(makeRandomString(), doc);
}
