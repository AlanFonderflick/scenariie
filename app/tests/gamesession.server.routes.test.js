'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Gamesession = mongoose.model('Gamesession'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gamesession;

/**
 * Gamesession routes tests
 */
describe('Gamesession CRUD tests', function() {
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

		// Save a user to the test db and create new Gamesession
		user.save(function() {
			gamesession = {
				name: 'Gamesession Name'
			};

			done();
		});
	});

	it('should be able to save Gamesession instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gamesession
				agent.post('/gamesessions')
					.send(gamesession)
					.expect(200)
					.end(function(gamesessionSaveErr, gamesessionSaveRes) {
						// Handle Gamesession save error
						if (gamesessionSaveErr) done(gamesessionSaveErr);

						// Get a list of Gamesessions
						agent.get('/gamesessions')
							.end(function(gamesessionsGetErr, gamesessionsGetRes) {
								// Handle Gamesession save error
								if (gamesessionsGetErr) done(gamesessionsGetErr);

								// Get Gamesessions list
								var gamesessions = gamesessionsGetRes.body;

								// Set assertions
								(gamesessions[0].user._id).should.equal(userId);
								(gamesessions[0].name).should.match('Gamesession Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gamesession instance if not logged in', function(done) {
		agent.post('/gamesessions')
			.send(gamesession)
			.expect(401)
			.end(function(gamesessionSaveErr, gamesessionSaveRes) {
				// Call the assertion callback
				done(gamesessionSaveErr);
			});
	});

	it('should not be able to save Gamesession instance if no name is provided', function(done) {
		// Invalidate name field
		gamesession.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gamesession
				agent.post('/gamesessions')
					.send(gamesession)
					.expect(400)
					.end(function(gamesessionSaveErr, gamesessionSaveRes) {
						// Set message assertion
						(gamesessionSaveRes.body.message).should.match('Please fill Gamesession name');
						
						// Handle Gamesession save error
						done(gamesessionSaveErr);
					});
			});
	});

	it('should be able to update Gamesession instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gamesession
				agent.post('/gamesessions')
					.send(gamesession)
					.expect(200)
					.end(function(gamesessionSaveErr, gamesessionSaveRes) {
						// Handle Gamesession save error
						if (gamesessionSaveErr) done(gamesessionSaveErr);

						// Update Gamesession name
						gamesession.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gamesession
						agent.put('/gamesessions/' + gamesessionSaveRes.body._id)
							.send(gamesession)
							.expect(200)
							.end(function(gamesessionUpdateErr, gamesessionUpdateRes) {
								// Handle Gamesession update error
								if (gamesessionUpdateErr) done(gamesessionUpdateErr);

								// Set assertions
								(gamesessionUpdateRes.body._id).should.equal(gamesessionSaveRes.body._id);
								(gamesessionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gamesessions if not signed in', function(done) {
		// Create new Gamesession model instance
		var gamesessionObj = new Gamesession(gamesession);

		// Save the Gamesession
		gamesessionObj.save(function() {
			// Request Gamesessions
			request(app).get('/gamesessions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gamesession if not signed in', function(done) {
		// Create new Gamesession model instance
		var gamesessionObj = new Gamesession(gamesession);

		// Save the Gamesession
		gamesessionObj.save(function() {
			request(app).get('/gamesessions/' + gamesessionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gamesession.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gamesession instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gamesession
				agent.post('/gamesessions')
					.send(gamesession)
					.expect(200)
					.end(function(gamesessionSaveErr, gamesessionSaveRes) {
						// Handle Gamesession save error
						if (gamesessionSaveErr) done(gamesessionSaveErr);

						// Delete existing Gamesession
						agent.delete('/gamesessions/' + gamesessionSaveRes.body._id)
							.send(gamesession)
							.expect(200)
							.end(function(gamesessionDeleteErr, gamesessionDeleteRes) {
								// Handle Gamesession error error
								if (gamesessionDeleteErr) done(gamesessionDeleteErr);

								// Set assertions
								(gamesessionDeleteRes.body._id).should.equal(gamesessionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gamesession instance if not signed in', function(done) {
		// Set Gamesession user 
		gamesession.user = user;

		// Create new Gamesession model instance
		var gamesessionObj = new Gamesession(gamesession);

		// Save the Gamesession
		gamesessionObj.save(function() {
			// Try deleting Gamesession
			request(app).delete('/gamesessions/' + gamesessionObj._id)
			.expect(401)
			.end(function(gamesessionDeleteErr, gamesessionDeleteRes) {
				// Set message assertion
				(gamesessionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gamesession error error
				done(gamesessionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Gamesession.remove().exec();
		done();
	});
});