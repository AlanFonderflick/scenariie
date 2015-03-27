'use strict';

//Gamesessions service used to communicate Gamesessions REST endpoints
angular.module('gamesessions').factory('Gamesessions', ['$resource',
	function($resource) {
		return $resource('gamesessions/:gamesessionId', { gamesessionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);