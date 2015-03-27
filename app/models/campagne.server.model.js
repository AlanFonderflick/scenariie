'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Campagne Schema
 */
var CampagneSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Campagne name',
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
	sessions: [{
		date: Date,
		summary: String,
		title: String
	}],
	players: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Campagne', CampagneSchema);