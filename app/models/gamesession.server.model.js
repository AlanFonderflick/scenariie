'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gamesession Schema
 */

var notEmpty = function(gameSession){
    if(gameSession.sumarry.length === 0){
    	return false;
    }
    else {return true;}
};


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
		default: '',
		require: true,
		validate : [notEmpty, 'Veuillez compléter le résumé de la séance']
	},
	title: {
		type: String,
		trim: true,
		required: 'Veuillez préciser un intitulé de séance',		
		default: ''
	},
	slogan: {
		type: String,
		trim: true,
		required: 'Veuillez préciser un slogan',		
		default: ''
	}	
});

mongoose.model('Gamesession', GamesessionSchema);