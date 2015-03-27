'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var campagnes = require('../../app/controllers/campagnes.server.controller');

	// Campagnes Routes
	app.route('/campagnes')
		.get(campagnes.list)
		.post(users.requiresLogin, campagnes.create);

	app.route('/campagnes/:campagneId')
		.get(campagnes.read)
		.put(users.requiresLogin, campagnes.hasAuthorization, campagnes.update)
		.delete(users.requiresLogin, campagnes.hasAuthorization, campagnes.delete);

	// Finish by binding the Campagne middleware
	app.param('campagneId', campagnes.campagneByID);
};
