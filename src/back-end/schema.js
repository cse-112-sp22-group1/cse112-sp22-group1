/**
 * Schema
 * @module schema
 */
require("dotenv").config();
const mongoose = require("mongoose");

/**
 * @typedef userSchema
 * @property {String} email The user's email
 * @property {String} pwd The user's password
 * @property {String} theme The user's theme
 * @property {Index} index The user's index
 * @property {Array<DailyLog>} dailyLogs An array of the user's dailyLogs
 * @property {Array<MonthlyLog>} monthlyLogs An array of the user's monthlyLogs
 * @property {Array<FutureLog>} futureLogs An array of the user's futureLogs
 * @property {Array<Tracker>} trackers An array of the user's trackers
 * @property {Array<Collection>} collections An array of the user's collections
 * @property {Array<ImageBlock>} imageBlocks An array of the user's imageBlocks
 * @property {Array<AudioBlock>} audioBlocks An array of the user's audioBlocks
 * @property {Array<TextBlock>} textBlocks An array of the user's textBlocks
 * @property {Array<Task>} tasks An array of the user's tasks
 * @property {Array<Event>} events An array of the user's events
 * @property {Array<Signifier>} signifiers An array of the user's signifiers
 */
const userSchema = {
	email: String,
	pwd: String,
	theme: String,

    /**
     * @typedef {Object} Index
     * @property {String} objectType The type of object
     * @property {Array<String>} contents List of id's of futureLogs and collections
     */
	index: {
		objectType: String,
		futureLogs: [String],
		collections: [String]
	},


	dailyLogs: [

        /**
         * @typedef {Object} DailyLog
         * @property {String} id The daily log's id
         * @property {String} objectType The type of object
         * @property {Date} date Date of the daily log
         * @property {String} parent ID of the parent
         * @property {Array<String>} content List of id's of textBlocks in the log
         * @property {Array<String>} collections List of id's of collections referenced by the log
         * @property {Array<String>} trackers List of id's of trackers in the log
         */
		{
			id: String,
			objectType: String,
			date: Date,
			parent: String,
			content: [String],
			collections: [String],
			trackers: [String]
		}
	],

	monthlyLogs: [

        /**
         * @typedef {Object} MonthlyLog
         * @property {String} id The monthly log's id
         * @property {String} objectType The type of object
         * @property {String} parent ID of the parent
         * @property {Date} startDate The start date for the month
         * @property {Date} endDate The end date for the month
         * @property {Array<String>} content List of id's of textBlocks in the log
         * @property {Array<String>} collections List of id's of collections referenced by the log
         * @property {Array<Day>} days List of days in log
         * @property {Array<String>} trackers List of id's of trackers in month
         * @property {Array<String>} recurringTrackers List of recuring trackers in days
         */
		{
			id: String,
			objectType: String,
			parent: String,
			startDate: Date,
			endDate: Date,
			content: [String],
			collections: [String],
			days: [
				{
					id: String,
					date: Date
				}
			],
			trackers: [String],
			recurringTrackers: [String]
		}
	],

	futureLogs: [

        /**
         * @typedef {Object} FutureLog
         * @property {String} id The future log's id
         * @property {String} objectType The type of object
         * @property {String} title The title of the future log
         * @property {Date} startDate The future log start date
         * @property {Date} endDate The future log end date
         * @property {Array<String>} content List of ids of textBlocks in the log
         * @property {Array<String>} collections List of ids of collections referenced by the log
         * @property {Array<Month>} months List of months in log
         * @property {Array<String>} trackers List ids of trackers in futureLog
         * @property {Array<String>} recurringTrackers List of ids of trackers in months
         */
		{
			id: String,
			objectType: String,
			title: String,
			startDate: Date,
			endDate: Date,
			content: [String],
			collections: [String],
			months: [
				{
					id: String,
					date: Date
				}
			],
			trackers: [String],
			recurringTrackers: [String]
		}
	],

	trackers: [

        /**
         * @typedef {Object} Tracker
         * @property {String} id The tracker's id
         * @property {String} objectType The type of object
         * @property {String} title Title of the tracker
         * @property {String} parent ID of the parent
         * @property {Array<String>} content List of id's of textBlocks in the tracker
         */
		{
			id: String,
			objectType: String,
			title: String,
			parent: String,
			content: [String]

		}
	],

	collections: [

        /**
         * @typedef {Object} Collection
         * @property {String} id The collection's id
         * @property {String} objectType The type of object
         * @property {String} parent The id of the parent
         * @property {String} title The collection's title
         * @property {Array<String>} content List of ids of the textBlocks in collection
         * @property {Array<String>} collections List of ids of collections referenced by the collection
         * @property {Array<String>} trackers List of ids of trackers referenced by the colection
         */
		{
			id: String,
			objectType: String,
			title: String,
			parent: String,
			content: [String],
			collections: [String],
			trackers: [String]
		}
	],

	imageBlocks: [

        /**
         * @typedef {Object} ImageBlock
         * @property {String} id The imageBlock's id
         * @property {String} objectType The type of object
         * @property {String} parent Id of the parent
         * @property {String} arrangement Arrangement of imageBlock
         * @property {String} data image as a String
         */
		{
			id: String,
			objectType: String,
			parent: String,
			arrangement: String,
			data: String
		}
	],

	audioBlocks: [

        /**
         * @typedef {Object} AudioBlock
         * @property {String} id The audioBlock's id
         * @property {String} objectType The type of object
         * @property {String} parent Id of the parent
         * @property {String} arrangement Arrangement of audioBlock
         * @property {String} data audio as a String
         */
		{
			id: String,
			objectType: String,
			parent: String,
			arrangement: String,
			data: String
		}
	],

	textBlocks: [

        /**
         * @typedef {Object} TextBlock
         * @property {String} id The textBlock's id
         * @property {String} objectType The type of object
         * @property {Number} tabLevel the tab level of the textBlock
         * @property {String} parent Id of the parent
         * @property {String} kind textBlock identifier for event and task creation
         * @property {String} objectReference id of the task or event or null if kind not either of those
         * @property {String} text the text inside textBlock
         * @property {Array<String>} signifiers id of the signifier for this textBlock
         */
		{
			id: String,
			objectType: String,
			tabLevel: Number,
			parent: String,
			kind: String,
			objectReference: String,
			text: String,
			signifiers: [String]
		}
	],

	events: [

        /**
         * @typedef {Object} JournalEvent
         * @property {String} id The event's id
         * @property {String} objectType The type of object
         * @property {String} title title of the event
         * @property {Array<String>} references id of the references
         * @property {Date} date date of the event (optional)
         */
		{
			id: String,
			objectType: String,
			title: String,
			references: [String],
			date: Date
		}
	],

	tasks: [

        /**
         * @typedef {Object} Task
         * @property {String} id The task's id
         * @property {String} objectType The type of object
         * @property {Array<String>} references id of the references
         * @property {String} text task description
         * @property {Number} complete non zero if task complete
         */
		{
			id: String,
			objectType: String,
			references: [String],
			text: String,
			complete: Number
		}
	],

	signifiers: [

        /**
         * @typedef {Object} Signifier
         * @property {String} id The signifier's id
         * @property {String} objectType The type of object
         * @property {String} meaning meaning of the signifier
         * @property {String} symbol the signifier symbol
         */
		{
			id: String,
			objectType: String,
			meaning: String,
			symbol: String
		}
	]
};

const User = new mongoose.Schema(userSchema);
module.exports = {
	User: mongoose.model("User", User)
};
