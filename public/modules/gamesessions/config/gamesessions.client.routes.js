'use strict';

//Setting up route
angular.module('gamesessions').config(['$stateProvider',
	function($stateProvider) {
		// Gamesessions state routing
		$stateProvider.
		state('listGamesessions', {
			url: '/gamesessions',
			templateUrl: 'modules/gamesessions/views/list-gamesessions.client.view.html'
		}).
		state('createGamesession', {
			url: '/campagnes/:campagneId/create',
			templateUrl: 'modules/gamesessions/views/create-gamesession.client.view.html'
		}).
		state('viewGamesession', {
			url: '/campagnes/:campagneId/gamesessions/:gamesessionId',
			templateUrl: 'modules/gamesessions/views/view-gamesession.client.view.html'
		}).
		state('editGamesession', {
			url: '/campagnes/:campagneId/gamesessions/:gamesessionId/edit',
			templateUrl: 'modules/gamesessions/views/edit-gamesession.client.view.html'
		});
	}
]);