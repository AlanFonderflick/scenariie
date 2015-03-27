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
		required: 'Veuillez préciser un intitulé de séance',		
		default: ''
	}
});

mongoose.model('Gamesession', GamesessionSchema);