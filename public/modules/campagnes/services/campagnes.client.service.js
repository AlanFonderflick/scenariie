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
]);