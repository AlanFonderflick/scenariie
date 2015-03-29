'use strict';

// Campagnes controller
angular.module('campagnes').controller('CampagnesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Campagnes', 'Gamesessions',
	function($scope, $stateParams, $location, Authentication, Campagnes, Gamesessions) {
		$scope.authentication = Authentication;

		$scope.slogan = '';
		$scope.summary = '';
		$scope.title = '';
		$scope.newGameSession = null;
		$scope.session = {};

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

	}
]);