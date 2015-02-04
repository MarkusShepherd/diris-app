var dixitApp = angular.module('dixitApp', [ 'ngRoute', 'firebase' ]).constant(
		'FIREBASE_URL', 'https://dixitapp.firebaseio.com/');

dixitApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginController'
	}).when('/register', {
		templateUrl : 'partials/register.html',
		controller : 'RegistrationController'
	}).when('/overview/:pId', {
		templateUrl : 'partials/overview.html',
		controller : 'PlayerController'
	}).when('/newmatch/:pId', {
		templateUrl : 'partials/new-match.html',
		controller : 'PlayerController'
	}).when('/accept/:pId/:mId', {
		templateUrl : 'partials/accept-invitation.html',
		controller : 'PlayerController'
	}).when('/match/:pId/:mId', {
		templateUrl : 'partials/match.html',
		controller : 'MatchController'
	}).when('/image/:pId/:mId/:rNo', {
		templateUrl : 'partials/submit-image.html',
		controller : 'MatchController'
	}).when('/vote/:pId/:mId/:rNo', {
		templateUrl : 'partials/vote-image.html',
		controller : 'MatchController'
	}).when('/review/:pId/:mId', {
		templateUrl : 'partials/review-round.html',
		controller : 'MatchController'
	}).otherwise({
		redirectTo : '/login'
	});
} ]);