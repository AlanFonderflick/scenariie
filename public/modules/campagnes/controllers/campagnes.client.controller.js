'use strict';

// Campagnes controller
angular.module('campagnes').controller('CampagnesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Campagnes',
	function($scope, $stateParams, $location, Authentication, Campagnes) {
		$scope.authentication = Authentication;

		$scope.summary = '';
		$scope.title = '';
		$scope.newGameSession = {};

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
		$scope.update = function() {
			$scope.newGameSession = {
				title: $scope.title,
				summary: $scope.summary
			};

			$scope.campagne.gameSessions.push($scope.newGameSession);

			var campagne = $scope.campagne;
			console.log(campagne);
			campagne.$update(function() {
				$location.path('campagnes/' + campagne._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Campagnes
		$scope.find = function() {
			$scope.campagnes = Campagnes.query();
		};

		// Find existing Campagne
		$scope.findOne = function() {
			$scope.campagne = Campagnes.get({ 
				campagneId: $stateParams.campagneId
			});
		};
	}
]);