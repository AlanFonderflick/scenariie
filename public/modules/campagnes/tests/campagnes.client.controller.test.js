'use strict';

(function() {
	// Campagnes Controller Spec
	describe('Campagnes Controller Tests', function() {
		// Initialize global variables
		var CampagnesController,
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

			// Initialize the Campagnes controller.
			CampagnesController = $controller('CampagnesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Campagne object fetched from XHR', inject(function(Campagnes) {
			// Create sample Campagne using the Campagnes service
			var sampleCampagne = new Campagnes({
				name: 'New Campagne'
			});

			// Create a sample Campagnes array that includes the new Campagne
			var sampleCampagnes = [sampleCampagne];

			// Set GET response
			$httpBackend.expectGET('campagnes').respond(sampleCampagnes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.campagnes).toEqualData(sampleCampagnes);
		}));

		it('$scope.findOne() should create an array with one Campagne object fetched from XHR using a campagneId URL parameter', inject(function(Campagnes) {
			// Define a sample Campagne object
			var sampleCampagne = new Campagnes({
				name: 'New Campagne'
			});

			// Set the URL parameter
			$stateParams.campagneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/campagnes\/([0-9a-fA-F]{24})$/).respond(sampleCampagne);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.campagne).toEqualData(sampleCampagne);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Campagnes) {
			// Create a sample Campagne object
			var sampleCampagnePostData = new Campagnes({
				name: 'New Campagne'
			});

			// Create a sample Campagne response
			var sampleCampagneResponse = new Campagnes({
				_id: '525cf20451979dea2c000001',
				name: 'New Campagne'
			});

			// Fixture mock form input values
			scope.name = 'New Campagne';

			// Set POST response
			$httpBackend.expectPOST('campagnes', sampleCampagnePostData).respond(sampleCampagneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Campagne was created
			expect($location.path()).toBe('/campagnes/' + sampleCampagneResponse._id);
		}));

		it('$scope.update() should update a valid Campagne', inject(function(Campagnes) {
			// Define a sample Campagne put data
			var sampleCampagnePutData = new Campagnes({
				_id: '525cf20451979dea2c000001',
				name: 'New Campagne'
			});

			// Mock Campagne in scope
			scope.campagne = sampleCampagnePutData;

			// Set PUT response
			$httpBackend.expectPUT(/campagnes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/campagnes/' + sampleCampagnePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid campagneId and remove the Campagne from the scope', inject(function(Campagnes) {
			// Create new Campagne object
			var sampleCampagne = new Campagnes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Campagnes array and include the Campagne
			scope.campagnes = [sampleCampagne];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/campagnes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCampagne);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.campagnes.length).toBe(0);
		}));
	});
}());