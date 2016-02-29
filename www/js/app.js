var testUrl = 'http://localhost:8181';
var liveUrl = 'http://dixit-app.appspot.com';

var dixitApp = angular.module('dixitApp', [ 'ngRoute', 'blockUI' ]).constant(
		'BACKEND_URL', liveUrl);

dixitApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginController'
	}).when('/register', {
		templateUrl : 'partials/register.html',
		controller : 'RegistrationController'
	}).when('/overview', {
		templateUrl : 'partials/overview.html',
		controller : 'PlayerController'
	}).when('/newmatch', {
		templateUrl : 'partials/new-match.html',
		controller : 'NewMatchController'
	}).when('/accept/:mId', {
		templateUrl : 'partials/accept-invitation.html',
		controller : 'PlayerController'
	}).when('/match/:mId', {
		templateUrl : 'partials/match.html',
		controller : 'MatchController'
	}).when('/image/:mId/:rNo', {
		templateUrl : 'partials/submit-image.html',
		controller : 'MatchController'
	}).when('/vote/:mId/:rNo', {
		templateUrl : 'partials/vote-image.html',
		controller : 'MatchController'
	}).when('/review/:mId/:rNo', {
		templateUrl : 'partials/review-round.html',
		controller : 'MatchController'
	}).otherwise({
		redirectTo : '/login'
	});
} ]);
