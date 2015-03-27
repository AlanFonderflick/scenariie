'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gamesessions = require('../../app/controllers/gamesessions.server.controller');

	// Gamesessions Routes
	app.route('/gamesessions')
		.get(gamesessions.list)
		.post(users.requiresLogin, gamesessions.create);

	app.route('/gamesessions/:gamesessionId')
		.get(gamesessions.read)
		.put(users.requiresLogin, gamesessions.hasAuthorization, gamesessions.update)
		.delete(users.requiresLogin, gamesessions.hasAuthorization, gamesessions.delete);

	// Finish by binding the Gamesession middleware
	app.param('gamesessionId', gamesessions.gamesessionByID);
};
