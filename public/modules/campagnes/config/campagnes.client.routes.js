'use strict';

//Setting up route
angular.module('campagnes').config(['$stateProvider',
	function($stateProvider) {
		// Campagnes state routing
		$stateProvider.
		state('listCampagnes', {
			url: '/campagnes',
			templateUrl: 'modules/campagnes/views/list-campagnes.client.view.html'
		}).
		state('createCampagne', {
			url: '/campagnes/create',
			templateUrl: 'modules/campagnes/views/create-campagne.client.view.html'
		}).
		state('viewCampagne', {
			url: '/campagnes/:campagneId',
			templateUrl: 'modules/campagnes/views/view-campagne.client.view.html'
		}).
		state('editCampagne', {
			url: '/campagnes/:campagneId/edit',
			templateUrl: 'modules/campagnes/views/edit-campagne.client.view.html'
		}).
		state('createGamesession', {
			url: '/campagnes/:campagneId/create',
			templateUrl: 'modules/gamesessions/views/create-gamesession.client.view.html'
		}).				
		state('viewSession', {
			url: '/campagnes/:campagneId/:sessionId',
			templateUrl: 'modules/campagnes/views/view-gamesession.client.view.html'
		}).
		state('editSession', {
			url: '/campagnes/:campagneId/:sessionId/edit',
			templateUrl: 'modules/campagnes/views/edit-gamesession.client.view.html'
		});		

	}
]);