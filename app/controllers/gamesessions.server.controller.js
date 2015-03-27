'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Gamesession = mongoose.model('Gamesession'),
	_ = require('lodash');

/**
 * Create a Gamesession
 */
exports.create = function(req, res) {
	var gamesession = new Gamesession(req.body);
	gamesession.user = req.user;

	gamesession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gamesession);
		}
	});
};

/**
 * Show the current Gamesession
 */
exports.read = function(req, res) {
	res.jsonp(req.gamesession);
};

/**
 * Update a Gamesession
 */
exports.update = function(req, res) {
	var gamesession = req.gamesession ;

	gamesession = _.extend(gamesession , req.body);

	gamesession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gamesession);
		}
	});
};

/**
 * Delete an Gamesession
 */
exports.delete = function(req, res) {
	var gamesession = req.gamesession ;

	gamesession.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gamesession);
		}
	});
};

/**
 * List of Gamesessions
 */
exports.list = function(req, res) { 
	Gamesession.find().sort('-created').populate('user', 'displayName').exec(function(err, gamesessions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gamesessions);
		}
	});
};

/**
 * Gamesession middleware
 */
exports.gamesessionByID = function(req, res, next, id) { 
	Gamesession.findById(id).populate('user', 'displayName').exec(function(err, gamesession) {
		if (err) return next(err);
		if (! gamesession) return next(new Error('Failed to load Gamesession ' + id));
		req.gamesession = gamesession ;
		next();
	});
};

/**
 * Gamesession authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gamesession.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
