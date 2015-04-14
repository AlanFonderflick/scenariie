'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	GamesessionSchema = require('./gamesession.server.model');

/**
 * Campagne Schema
 */
var CampagneSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Veuillez préciser le nom de la campagne',
		trim: true
	},
	description: {
		type: String,
		default: '',
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
	gameSessions: [GamesessionSchema],
	players: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	applicants : [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	nextDate : {
		type: Date
	},
	state : {
		type: String,
		enum: ['closed', 'open'],
		default: 'open'
	},
	gameType : {
		type : String,
		enum: ['rpg', 'videoGame', 'cards', 'game']
	},
	isPrivate : {
		type: Boolean,
		default: false
	}
});

mongoose.model('Campagne', CampagneSchema);