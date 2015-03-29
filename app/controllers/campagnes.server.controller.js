'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Campagne = mongoose.model('Campagne'),
	_ = require('lodash');

/**
 * Create a Campagne
 */
exports.create = function(req, res) {
	var campagne = new Campagne(req.body);
	campagne.user = req.user;

	campagne.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(campagne);
		}
	});
};

/**
 * Show the current Campagne
 */
exports.read = function(req, res) {
	res.jsonp(req.campagne);
};

/**
 * Update a Campagne
 */
exports.update = function(req, res) {
	var campagne = req.campagne ;

	campagne = _.extend(campagne , req.body);

	campagne.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(campagne);
		}
	});
};

/**
 * Delete an Campagne
 */
exports.delete = function(req, res) {
	var campagne = req.campagne ;

	campagne.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(campagne);
		}
	});
};

/**
 * List of Campagnes
 */
exports.list = function(req, res) { 
	Campagne.find({}).sort('-created').populate('user', 'displayName').populate('gameSessions._id').exec(function(err, campagnes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(campagnes);
		}
	});
};

/**
 * Campagne middleware
 */
exports.campagneByID = function(req, res, next, id) { 
	Campagne.findById(id).populate('user', 'displayName').populate('gameSessions._id').exec(function(err, campagne) {
		if (err) return next(err);
		if (! campagne) return next(new Error('Failed to load Campagne ' + id));
		req.campagne = campagne ;
		console.log('\n\n\n\n\n\nsessionById id : '+id);		
		next();
	});
};
exports.sessionByID = function(req, res, next, id) { 
	Campagne.findById(id).populate('user', 'displayName').populate('gameSessions.id').where('id').equals(id).exec(function(err, campagne) {
		if (err) return next(err);
		if (! campagne) return next(new Error('Failed to load Campagne ' + id));
		req.campagne = campagne ;
		next();
	});
};

/**
 * Campagne authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.campagne.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
