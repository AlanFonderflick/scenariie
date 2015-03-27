'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gamesession Schema
 */
var GamesessionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Gamesession name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		default: Date.now
	},
	summary: {
		type: String,
		trim: true,
		default: ''
	},
	title: {
		type: String,
		trim: true,
		default: ''
	}
});

mongoose.model('Gamesession', GamesessionSchema);