'use strict';

// Campagnes controller
angular.module('campagnes').controller('CampagnesController', ['$scope', '$stateParams', '$location', '$sce', 'Authentication', 'Campagnes', 'Gamesessions', 'Game',
	function($scope, $stateParams, $location, $sce, Authentication, Campagnes, Gamesessions, Game) {
		$scope.authentication = Authentication;

		$scope.slogan = '';
		$scope.summary = '';
		$scope.title = '';
		$scope.newGameSession = null;
		$scope.session = Game.getSession();

		// Create new Campagne
		$scope.create = function() {
			// Create new Campagne object
			var campagne = new Campagnes ({
				name: this.name,
				description : this.description,
				gameSessions: []
			});
			// campagne.gameSessions.push({
			// 	title: $scope.title,
			// 	summary: $scope.summary
			// });

			// Redirect after save
			campagne.$save(function(response) {
				$location.path('campagnes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Campagne
		$scope.remove = function(campagne) {
			if ( campagne ) { 
				campagne.$remove();

				for (var i in $scope.campagnes) {
					if ($scope.campagnes [i] === campagne) {
						$scope.campagnes.splice(i, 1);
					}
				}
			} else {
				$scope.campagne.$remove(function() {
					$location.path('campagnes');
				});
			}
		};

		// Update existing Campagne
		$scope.update = function(isValid) {
			$scope.newGameSession = {
				title: $scope.title,
				summary: $scope.summary,
				slogan: $scope.slogan,
				created: new Date(),
				id: $scope.campagne.gameSessions.length
			};

			console.dir($scope.campagne);

			//Check if we have to update a session or just campaign fields
			if($scope.newGameSession){
				$scope.campagne.gameSessions.push($scope.newGameSession);
			}

			var campagne = $scope.campagne;

			if(isValid){
				campagne.$update(function() {
					$location.path('campagnes/' + campagne._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
		};

		$scope.viewSession = function(id) {
			Game.setSession(id);

			console.log('$scope.session : '+$scope.session);
		};

		// Update Campagne without a particular session
		$scope.removeSession = function(campagne) {
			campagne = $scope.campagne;
			campagne.gameSessions.splice($scope.session,1);
			var game = {};
			console.log(campagne.gameSessions.length);

			//Decrement higher sessions IDs to respect sessions order
			for(var i=0; i<campagne.gameSessions.length; i++)
			{
				if(campagne.gameSessions[i].id > $scope.session){
					campagne.gameSessions[i].id--;
				}				
			}

			campagne.$update(function() {
					$location.path('campagnes/' + campagne._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Campagne
		$scope.updateSession = function(isValid) {
			$scope.newGameSession = {
				title: this.title,
				summary: this.summary,
				slogan: this.slogan,
				created: new Date(),
				id: this.session
			};

			console.dir($scope.newGameSession);

			//Check if we have to update a session or just campaign fields
			if($scope.newGameSession){
				$scope.campagne.gameSessions[$scope.session] = $scope.newGameSession;
			}

			var campagne = $scope.campagne;

			if(isValid){
				campagne.$update(function() {
					$location.path('campagnes/' + campagne._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
		};

		// Find a list of Campagnes
		$scope.find = function() {
			$scope.campagnes = Campagnes.query();
			console.log('--find--');
			console.dir($scope.campagne);
		};

		// Find existing Campagne
		$scope.findOne = function() {
			$scope.campagne = Campagnes.get({ 
				campagneId: $stateParams.campagneId
			});
			console.log('--findOne--');
			console.dir($scope.campagne);
		};
		// Find existing Session
		// $scope.findOneSession = function() {
		// 	$scope.session = Campagnes.get({ 
		// 		campagneId: $stateParams.campagneId,
		// 		sessionId: $stateParams.sessionId
		// 	});
		// 	console.log('--findOneSession--');
		// 	console.dir($scope.session);
		// };		

		$scope.trustedHtml = function (plainText) {
            return $sce.trustAsHtml(plainText);
        };

	}
]);