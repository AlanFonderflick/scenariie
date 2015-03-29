'use strict';

//Campagnes service used to communicate Campagnes REST endpoints
angular.module('campagnes').factory('Campagnes', ['$resource',
	function($resource) {
		return $resource('campagnes/:campagneId/:sessionId', { campagneId: '@_id',sessionId: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.factory('Game', [
	function() {
		// Gamesession service logic
		// ...
		var session = 0;

		// Public API
		return {
			getSession: function() {
				return session;
			},
			setSession: function(id) {
				session = id;
			}
		};
	}
]);