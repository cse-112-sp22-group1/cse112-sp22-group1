export function makeRandomString(){
	let length = 30;
	let result = [];
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join("");
}

export function compareUsers(stored, returned) {
	let isEqual = true;
	isEqual = isEqual && (stored.email === returned.email);
	isEqual = isEqual && (stored.theme === returned.theme);
    isEqual = isEqual && (stored.index.objectType === returned.index.objectType);
	isEqual = isEqual && (stored.index.futureLogs.length === returned.index.futureLogs.length);
	isEqual = isEqual && (stored.index.collections.length === returned.index.collections.length);
	isEqual = isEqual && (stored.dailyLogs.length === returned.dailyLogs.length);
	isEqual = isEqual && (stored.monthlyLogs.length === returned.monthlyLogs.length);
	isEqual = isEqual && (stored.futureLogs.length === returned.futureLogs.length);
	isEqual = isEqual && (stored.trackers.length === returned.trackers.length);
	isEqual = isEqual && (stored.collections.length === returned.collections.length);
	isEqual = isEqual && (stored.imageBlocks.length === returned.imageBlocks.length);
	isEqual = isEqual && (stored.audioBlocks.length === returned.audioBlocks.length);
	isEqual = isEqual && (stored.textBlocks.length === returned.textBlocks.length);
	isEqual = isEqual && (stored.tasks.length === returned.tasks.length);
	isEqual = isEqual && (stored.events.length === returned.events.length);
	isEqual = isEqual && (stored.signifiers.length === returned.signifiers.length);
	
	// Checks index
	for (let i = 0; i < stored.index.futureLogs.length && isEqual; i++) {
		isEqual = isEqual && (stored.index.futureLogs[i] == returned.index.futureLogs[i]);
	}

	for (let i = 0; i < stored.index.collections.length && isEqual; i++) {
		isEqual = isEqual && (stored.index.collections[i] == returned.index.collections[i]);
	}

	// Checks Daily Logs
	for (let i = 0; i < stored.dailyLogs.length && isEqual; i++) {
		let storedDaily = stored.dailyLogs[i];
		let returnedDaily = returned.dailyLogs[i];
		isEqual = isEqual && (storedDaily.id === returnedDaily.id);
		isEqual = isEqual && (storedDaily.objectType === returnedDaily.objectType);
		isEqual = isEqual && (new Date(storedDaily.date).getTime() === new Date(returnedDaily.date).getTime());
		isEqual = isEqual && (storedDaily.parent === returnedDaily.parent);
		isEqual = isEqual && (storedDaily.content.length === returnedDaily.content.length);
		isEqual = isEqual && (storedDaily.collections.length === returnedDaily.collections.length);
		isEqual = isEqual && (storedDaily.trackers.length === returnedDaily.trackers.length);
		for (let j = 0; j < storedDaily.content.length && isEqual; j++) {
			let storedContent = storedDaily.content[j];
			let returnedContent = returnedDaily.content[j];
			isEqual = isEqual && (storedContent === returnedContent);
		}
		for (let j = 0; j < storedDaily.collections.length && isEqual; j++) {
			let storedCollections = storedDaily.collections[j];
			let returnedCollections = returnedDaily.collections[j];
			isEqual = isEqual && (storedCollections === returnedCollections);
		}
		for (let j = 0; j < storedDaily.trackers.length && isEqual; j++) {
			let storedTrackers = storedDaily.trackers[j];
			let returnedTrackers = returnedDaily.trackers[j];
			isEqual = isEqual && (storedTrackers === returnedTrackers);
		}
	}

	// Checks Monthly Logs
    for (let i = 0; i < stored.monthlyLogs.length && isEqual; i++){
        let storedMonthly = stored.monthlyLogs[i];
        let returnedMonthly = returned.monthlyLogs[i];
        isEqual = isEqual && (storedMonthly.id === returnedMonthly.id);
        isEqual = isEqual && (storedMonthly.objectType === returnedMonthly.objectType);
        isEqual = isEqual && (storedMonthly.parent === returnedMonthly.parent);
        isEqual = isEqual && (new Date(storedMonthly.startDate).getTime() === new Date(returnedMonthly.startDate).getTime());
		isEqual = isEqual && (new Date(storedMonthly.endDate).getTime() === new Date(returnedMonthly.endDate).getTime());
        for(let j = 0; j < returnedMonthly.content.length && isEqual; j++){
           isEqual = isEqual && (returnedMonthly.content[j] === storedMonthly.content[j]);
        }
        for(let k = 0; k < returnedMonthly.collections.length && isEqual; k++){
            isEqual = isEqual && (returnedMonthly.collections[k] === storedMonthly.collections[k]);
        }
        for(let l = 0; l < returnedMonthly.days.length && isEqual; l++){
            isEqual = isEqual && (returnedMonthly.days[l] === storedMonthly.days[l]);
        }
        for(let m = 0; m < returnedMonthly.days.length && isEqual; m++){
            isEqual = isEqual && (returnedMonthly.trackers[m] === storedMonthly.trackers[m]);
        }
    }
	
	// Checks Future Logs
    for (let i = 0; i < stored.futureLogs && isEqual; i++){
        let storedFuture = stored.futureLogs[i];
        let returnedFuture = returned.futureLogs
        isEqual = isEqual && (storedFuture.id === returnedFuture.id);
        isEqual = isEqual && (storedFuture.objectType === returnedFuture.objectType);
        isEqual = isEqual && (storedFuture.parent === returnedFuture.parent);
        isEqual = isEqual && (new Date(storedFuture.startDate).getTime() === new Date(returnedFuture.startDate).getTime());
		isEqual = isEqual && (new Date(storedFuture.endDate).getTime() === new Date(returnedFuture.endDate).getTime());
        for(let j = 0; j < returnedFuture.content.length && isEqual; j++){
           isEqual = isEqual && (returnedFuture.content[j] === storedFuture.content[j]);
        }
        for(let k = 0; k < returnedFuture.collections.length && isEqual; k++){
            isEqual = isEqual && (returnedFuture.collections[k] === storedFuture.collections[k]);
        }
        for(let l = 0; l < returnedFuture.months.length && isEqual; l++){
            isEqual = isEqual && (returnedFuture.months[l] === storedFuture.months[l]);
        }
        for(let m = 0; m < returnedFuture.days.length && isEqual; m++){
            isEqual = isEqual && (returnedFuture.trackers[m] === storedFuture.trackers[m]);
        }
    }

	// Checks Trackers
	for (let i = 0; i < stored.trackers.length && isEqual; i++) {
		let storedTracker = stored.trackers[i];
		let returnedTracker = returned.trackers[i];
		isEqual = isEqual && (storedTracker.id === returnedTracker.id);
		isEqual = isEqual && (storedTracker.objectType === returnedTracker.objectType);
		isEqual = isEqual && (storedTracker.title === returnedTracker.title);
		isEqual = isEqual && (storedTracker.parent === returnedTracker.parent);
		isEqual = isEqual && (storedTracker.content.length === returnedTracker.content.length);
		for (let j = 0; j < storedTracker.content.length && isEqual; j++) {
			let storedContent = storedTracker.content[j];
			let returnedContent = returnedTracker.content[j];
			isEqual = isEqual && (storedContent === returnedContent);
		}
	}

	// Check Collections
	for (let i = 0; i < stored.collections.length && isEqual; i++) {
		let storedCollection = stored.collections[i];
		let returnedCollection = returned.collections[i];
		isEqual = isEqual && (storedCollection.id === returnedCollection.id);
		isEqual = isEqual && (storedCollection.objectType === returnedCollection.objectType);
		isEqual = isEqual && (storedCollection.title === returnedCollection.title);
		isEqual = isEqual && (storedCollection.parent === returnedCollection.parent);
		isEqual = isEqual && (storedCollection.content.length === returnedCollection.content.length);
		isEqual = isEqual && (storedCollection.collections.length === returnedCollection.collections.length);
		for (let j = 0; j < storedCollection.content.length && isEqual; j++) {
			let storedContent = storedCollection.content[j];
			let returnedContent = returnedCollection.content[j];
			isEqual = isEqual && (storedContent === returnedContent);
		}
		for (let j = 0; j < storedCollection.collections.length && isEqual; j++) {
			let storedCollections = storedCollection.collections[j];
			let returnedCollections = returnedCollection.collections[j];
			isEqual = isEqual && (storedCollections === returnedCollections);
		}
	}

    // Checks ImageBlocks
    for (let i = 0; i < stored.imageBlocks.length && isEqual; i++){
        let storedImageBlocks = stored.ImageBlocks[i];
        let returnedImageBlocks = returned.ImageBlocks[i];
        isEqual = isEqual && (storedImageBlocks.id === returnedImageBlocks.id);
        isEqual = isEqual && (storedImageBlocks.objectType === returnedImageBlocks.objectType);
        isEqual = isEqual && (storedImageBlocks.parent === returnedImageBlocks.parent);
        isEqual = isEqual && (storedImageBlocks.arrangement === returnedImageBlocks.arrangement);
        isEqual = isEqual && (storedImageBlocks.data === returnedImageBlocks.data);
    }

    // Checks AudioBlocks
    for (let i = 0; i < stored.audioBlocks.length && isEqual; i++){
        let storedAudioBlocks = stored.audioBlocks[i];
        let returnedAudioBlocks = returned.audioBlocks[i];
        isEqual = isEqual && (storedAudioBlocks.id === returnedAudioBlocks.id);
        isEqual = isEqual && (storedAudioBlocks.objectType === returnedAudioBlocks.objectType);
        isEqual = isEqual && (storedAudioBlocks.parent === returnedAudioBlocks.parent);
        isEqual = isEqual && (storedAudioBlocks.arrangement === returnedAudioBlocks.arrangement);
        isEqual = isEqual && (storedAudioBlocks.data === returnedAudioBlocks.data);
    }

	// Checks TextBlocks
    for (let i = 0; i < stored.textBlocks.length && isEqual; i++){
        let storedTextBlocks = stored.textBlocks[i];
        let returnedTextBlocks = returned.textBlocks[i];
        isEqual = isEqual && (storedTextBlocks.id === returnedTextBlocks.id);
        isEqual = isEqual && (storedTextBlocks.objectType === returnedTextBlocks.objectType);
		isEqual = isEqual && (storedTextBlocks.tabLevel === returnedTextBlocks.tabLevel);
        isEqual = isEqual && (storedTextBlocks.parent === returnedTextBlocks.parent);
		isEqual = isEqual && (storedTextBlocks.subParent === returnedTextBlocks.subParent);
		isEqual = isEqual && (storedTextBlocks.kind === returnedTextBlocks.kind);
        isEqual = isEqual && (storedTextBlocks.objectReference === returnedTextBlocks.objectReference);
        isEqual = isEqual && (storedTextBlocks.text === returnedTextBlocks.text);
		isEqual = isEqual && (storedTextBlocks.signifiers.length === returnedTextBlocks.signifiers.length);
		for (let j = 0; j < storedTextBlocks.signifiers.length && isEqual; j++) {
			let storedSignifier = storedTextBlocks.signifiers[j];
			let returnedSignifier = returnedTextBlocks.signifiers[j];
			isEqual = isEqual && (storedSignifier === returnedSignifier);
		}
    }

    // Checks Events
    for (let i = 0; i < stored.events.length && isEqual; i++){
        let storedEvents = stored.events[i];
        let returnedEvents = returned.events[i];
        isEqual = isEqual && (storedEvents.id === returnedEvents.id);
        isEqual = isEqual && (storedEvents.objectType === returnedEvents.objectType);
        isEqual = isEqual && (storedEvents.title === returnedEvents.title);
        isEqual = isEqual && (storedEvents.parent === returnedEvents.parent);
        isEqual = isEqual && (storedEvents.date.getTime() === returnedEvents.date.getTime() );
        isEqual = isEqual && (storedEvents.signifiers.length === returnedEvents.signifiers.length);
        for (let j = 0; j < storedEvents.signifiers.length && isEqual; j++) {
			let storedEvents = storedEvents.signifiers[j];
			let returnedEvents = returnedEvents.signifiers[j];
			isEqual = isEqual && (storedEvents === returnedEvents);
		}
    }

	// Checks Tasks
    for (let i = 0; i < stored.tasks.length && isEqual; i++){
        let storedtasks = stored.events[i];
        let returnedtasks = returned.events[i];
        isEqual = isEqual && (storedtasks.id === returnedtasks.id);
        isEqual = isEqual && (storedtasks.objectType === returnedtasks.objectType);
        isEqual = isEqual && (storedtasks.parent === returnedtasks.parent);
        isEqual = isEqual && (storedtasks.text === returnedtasks.text);
        isEqual = isEqual && (storedtasks.signifiers.length === returnedtasks.signifiers.length);
        for (let j = 0; j < storedtasks.signifiers.length && isEqual; j++) {
			let storedtasks = storedtasks.signifiers[j];
			let returnedtasks = storedtasks.signifiers[j];
			isEqual = isEqual && (storedtasks === returnedtasks);
		}

    }
	
	// Checks Signifiers
    for (let i = 0; i < stored.signifiers.length && isEqual; i++){
        let storedSignier = stored.signifiers[i];
        let returnedSignier = returned.signifiers[i];
        isEqual = isEqual && (storedSignier.id === returnedSignier.id);
        isEqual = isEqual && (storedSignier.objectType === returnedSignier.objectType);
        isEqual = isEqual && (storedSignier.meaning === returnedSignier.meaning);
        isEqual = isEqual && (storedSignier.symbol === returnedSignier.symbol);
    }
	
	return isEqual;
}
