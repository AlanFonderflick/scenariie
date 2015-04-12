'use strict';

// Campagnes controller
angular.module('campagnes').controller('CampagnesController', ['$scope', '$stateParams', '$location', '$sce', 'Authentication', 'Campagnes', 'Gamesessions', 'Game', 'Users',
	function($scope, $stateParams, $location, $sce, Authentication, Campagnes, Gamesessions, Game, Users) {
		$scope.authentication = Authentication;

		$scope.slogan = '';
		$scope.summary = '';
		$scope.title = '';
		$scope.created = null;
		$scope.id = '';
		$scope.newGameSession = null;
		$scope.session = Game.getSession();

		// Create new Campagne
		$scope.create = function() {
			// Create new Campagne object
			var campagne = new Campagnes ({
				name: this.name,
				description : this.description,
				gameSessions: [],
				players: []
			});

			campagne.players.push($scope.authentication.user._id);

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
		};

		// Update Campagne without a particular session
		$scope.removeSession = function(campagne) {
			campagne = $scope.campagne;
			campagne.gameSessions.splice($scope.session,1);
			var game = {};

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
			$scope.title = $scope.campagne.gameSessions[$scope.session].title;
			$scope.slogan = $scope.campagne.gameSessions[$scope.session].slogan;
			$scope.summary = $scope.campagne.gameSessions[$scope.session].summary;
			$scope.created = $scope.campagne.gameSessions[$scope.session].created;
			$scope.id = $scope.campagne.gameSessions[$scope.session].id;


			$scope.newGameSession = {
				title: this.title,
				summary: this.summary,
				slogan: this.slogan,
				created: new Date(),
				id: this.session
			};

			$scope.campagne.gameSessions[$scope.session] = $scope.newGameSession;

			var campagne = $scope.campagne;

			if(isValid){
				campagne.$update(function() {
					$location.path('campagnes/' + campagne._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
		};

		// Update existing Campagne
		$scope.updatePlayers = function() {
			var campagne = $scope.campagne;

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

		$scope.trustedHtml = function (plainText) {
            return $sce.trustAsHtml(plainText);
        };

        $scope.campaignSubscription = function () {
        	var isUsed = false ;
        	//Verify that we only put a user *once* in players list
        	for(var i=0; i<$scope.campagne.players.length; i++)
			{
				//Double check : first for players object populated by mongoose, and second for simple String (first player subscription)
				if($scope.campagne.players[i]._id === $scope.authentication.user._id ||
				$scope.campagne.players[i] === $scope.authentication.user._id){
					isUsed = true;
				}				
			}
			if(!isUsed) {
				$scope.campagne.players.push($scope.authentication.user._id);
	        	$scope.updatePlayers();
			}
       };


	}
]);