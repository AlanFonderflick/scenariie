'use strict';

// Gamesessions controller
angular.module('gamesessions').controller('GamesessionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gamesessions',
	function($scope, $stateParams, $location, Authentication, Gamesessions) {
		$scope.authentication = Authentication;

		// Create new Gamesession
		$scope.create = function() {
			// Create new Gamesession object
			var gamesession = new Gamesessions ({
				title: this.title,
				summary: this.summary
			});

			// Redirect after save
			gamesession.$save(function(response) {
				$location.path('/campagnes/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.summary ='';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gamesession
		$scope.remove = function(gamesession) {
			if ( gamesession ) { 
				gamesession.$remove();

				for (var i in $scope.gamesessions) {
					if ($scope.gamesessions [i] === gamesession) {
						$scope.gamesessions.splice(i, 1);
					}
				}
			} else {
				$scope.gamesession.$remove(function() {
					$location.path('gamesessions');
				});
			}
		};

		// Update existing Gamesession
		$scope.update = function() {
			var gamesession = $scope.gamesession;

			gamesession.$update(function() {
				$location.path('gamesessions/' + gamesession._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gamesessions
		$scope.find = function() {
			$scope.gamesessions = Gamesessions.query();
		};

		// Find existing Gamesession
		$scope.findOne = function() {
			$scope.gamesession = Gamesessions.get({ 
				gamesessionId: $stateParams.gamesessionId
			});
		};
	}
]);