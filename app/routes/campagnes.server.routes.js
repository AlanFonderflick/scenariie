'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var campagnes = require('../../app/controllers/campagnes.server.controller');
	var gameSessions = require('../../app/controllers/gameSessions.server.controller');

	// Campagnes Routes
	app.route('/campagnes')
		.get(campagnes.list)
		.post(users.requiresLogin, campagnes.create);

	app.route('/campagnes/:campagneId')
		.get(campagnes.read)
		.put(users.requiresLogin, campagnes.hasAuthorization, campagnes.update)
		.post(users.requiresLogin, gameSessions.create)
		.delete(users.requiresLogin, campagnes.hasAuthorization, campagnes.delete);

	// Campagne gameSession
	app.route('/campagnes/:campagneId/:gameSessionId')
		.get(gameSessions.read)
		.put(users.requiresLogin, gameSessions.hasAuthorization, gameSessions.update)
		.delete(users.requiresLogin, gameSessions.hasAuthorization, gameSessions.delete);

	// Finish by binding the Campagne middleware
	app.param('campagneId', campagnes.campagneByID);
};
