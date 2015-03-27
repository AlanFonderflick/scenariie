'use strict';

(function() {
	// Gamesessions Controller Spec
	describe('Gamesessions Controller Tests', function() {
		// Initialize global variables
		var GamesessionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Gamesessions controller.
			GamesessionsController = $controller('GamesessionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gamesession object fetched from XHR', inject(function(Gamesessions) {
			// Create sample Gamesession using the Gamesessions service
			var sampleGamesession = new Gamesessions({
				name: 'New Gamesession'
			});

			// Create a sample Gamesessions array that includes the new Gamesession
			var sampleGamesessions = [sampleGamesession];

			// Set GET response
			$httpBackend.expectGET('gamesessions').respond(sampleGamesessions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gamesessions).toEqualData(sampleGamesessions);
		}));

		it('$scope.findOne() should create an array with one Gamesession object fetched from XHR using a gamesessionId URL parameter', inject(function(Gamesessions) {
			// Define a sample Gamesession object
			var sampleGamesession = new Gamesessions({
				name: 'New Gamesession'
			});

			// Set the URL parameter
			$stateParams.gamesessionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gamesessions\/([0-9a-fA-F]{24})$/).respond(sampleGamesession);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gamesession).toEqualData(sampleGamesession);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gamesessions) {
			// Create a sample Gamesession object
			var sampleGamesessionPostData = new Gamesessions({
				name: 'New Gamesession'
			});

			// Create a sample Gamesession response
			var sampleGamesessionResponse = new Gamesessions({
				_id: '525cf20451979dea2c000001',
				name: 'New Gamesession'
			});

			// Fixture mock form input values
			scope.name = 'New Gamesession';

			// Set POST response
			$httpBackend.expectPOST('gamesessions', sampleGamesessionPostData).respond(sampleGamesessionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gamesession was created
			expect($location.path()).toBe('/gamesessions/' + sampleGamesessionResponse._id);
		}));

		it('$scope.update() should update a valid Gamesession', inject(function(Gamesessions) {
			// Define a sample Gamesession put data
			var sampleGamesessionPutData = new Gamesessions({
				_id: '525cf20451979dea2c000001',
				name: 'New Gamesession'
			});

			// Mock Gamesession in scope
			scope.gamesession = sampleGamesessionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gamesessions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gamesessions/' + sampleGamesessionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gamesessionId and remove the Gamesession from the scope', inject(function(Gamesessions) {
			// Create new Gamesession object
			var sampleGamesession = new Gamesessions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gamesessions array and include the Gamesession
			scope.gamesessions = [sampleGamesession];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gamesessions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGamesession);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gamesessions.length).toBe(0);
		}));
	});
}());