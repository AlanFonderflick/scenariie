'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Campagne = mongoose.model('Campagne'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, campagne;

/**
 * Campagne routes tests
 */
describe('Campagne CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Campagne
		user.save(function() {
			campagne = {
				name: 'Campagne Name'
			};

			done();
		});
	});

	it('should be able to save Campagne instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Campagne
				agent.post('/campagnes')
					.send(campagne)
					.expect(200)
					.end(function(campagneSaveErr, campagneSaveRes) {
						// Handle Campagne save error
						if (campagneSaveErr) done(campagneSaveErr);

						// Get a list of Campagnes
						agent.get('/campagnes')
							.end(function(campagnesGetErr, campagnesGetRes) {
								// Handle Campagne save error
								if (campagnesGetErr) done(campagnesGetErr);

								// Get Campagnes list
								var campagnes = campagnesGetRes.body;

								// Set assertions
								(campagnes[0].user._id).should.equal(userId);
								(campagnes[0].name).should.match('Campagne Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Campagne instance if not logged in', function(done) {
		agent.post('/campagnes')
			.send(campagne)
			.expect(401)
			.end(function(campagneSaveErr, campagneSaveRes) {
				// Call the assertion callback
				done(campagneSaveErr);
			});
	});

	it('should not be able to save Campagne instance if no name is provided', function(done) {
		// Invalidate name field
		campagne.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Campagne
				agent.post('/campagnes')
					.send(campagne)
					.expect(400)
					.end(function(campagneSaveErr, campagneSaveRes) {
						// Set message assertion
						(campagneSaveRes.body.message).should.match('Please fill Campagne name');
						
						// Handle Campagne save error
						done(campagneSaveErr);
					});
			});
	});

	it('should be able to update Campagne instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Campagne
				agent.post('/campagnes')
					.send(campagne)
					.expect(200)
					.end(function(campagneSaveErr, campagneSaveRes) {
						// Handle Campagne save error
						if (campagneSaveErr) done(campagneSaveErr);

						// Update Campagne name
						campagne.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Campagne
						agent.put('/campagnes/' + campagneSaveRes.body._id)
							.send(campagne)
							.expect(200)
							.end(function(campagneUpdateErr, campagneUpdateRes) {
								// Handle Campagne update error
								if (campagneUpdateErr) done(campagneUpdateErr);

								// Set assertions
								(campagneUpdateRes.body._id).should.equal(campagneSaveRes.body._id);
								(campagneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Campagnes if not signed in', function(done) {
		// Create new Campagne model instance
		var campagneObj = new Campagne(campagne);

		// Save the Campagne
		campagneObj.save(function() {
			// Request Campagnes
			request(app).get('/campagnes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Campagne if not signed in', function(done) {
		// Create new Campagne model instance
		var campagneObj = new Campagne(campagne);

		// Save the Campagne
		campagneObj.save(function() {
			request(app).get('/campagnes/' + campagneObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', campagne.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Campagne instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Campagne
				agent.post('/campagnes')
					.send(campagne)
					.expect(200)
					.end(function(campagneSaveErr, campagneSaveRes) {
						// Handle Campagne save error
						if (campagneSaveErr) done(campagneSaveErr);

						// Delete existing Campagne
						agent.delete('/campagnes/' + campagneSaveRes.body._id)
							.send(campagne)
							.expect(200)
							.end(function(campagneDeleteErr, campagneDeleteRes) {
								// Handle Campagne error error
								if (campagneDeleteErr) done(campagneDeleteErr);

								// Set assertions
								(campagneDeleteRes.body._id).should.equal(campagneSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Campagne instance if not signed in', function(done) {
		// Set Campagne user 
		campagne.user = user;

		// Create new Campagne model instance
		var campagneObj = new Campagne(campagne);

		// Save the Campagne
		campagneObj.save(function() {
			// Try deleting Campagne
			request(app).delete('/campagnes/' + campagneObj._id)
			.expect(401)
			.end(function(campagneDeleteErr, campagneDeleteRes) {
				// Set message assertion
				(campagneDeleteRes.body.message).should.match('User is not logged in');

				// Handle Campagne error error
				done(campagneDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Campagne.remove().exec();
		done();
	});
});