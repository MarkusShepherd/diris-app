var testUrl = 'http://localhost:8181';
var liveUrl = 'http://dixit-app.appspot.com';

var dixitApp = angular.module('dixitApp', [ 'ngRoute', 'blockUI', 'ngStorage' ]);

dixitApp.constant('BACKEND_URL', liveUrl);

dixitApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginController'
	}).when('/register', {
		templateUrl : 'partials/registration.html',
		controller : 'RegistrationController'
	}).when('/overview', {
		templateUrl : 'partials/overview.html',
		controller : 'OverviewController'
	}).when('/overview/:action', {
		templateUrl : 'partials/overview.html',
		controller : 'OverviewController'
	}).when('/newmatch', {
		templateUrl : 'partials/new-match.html',
		controller : 'NewMatchController'
	}).when('/match/:mId', {
		templateUrl : 'partials/match.html',
		controller : 'MatchController'
	}).when('/match/:mId/:action', {
		templateUrl : 'partials/match.html',
		controller : 'MatchController'
	}).when('/image/:mId/:rNo', {
		templateUrl : 'partials/submit-image.html',
		controller : 'SubmitImageController'
	}).when('/vote/:mId/:rNo', {
		templateUrl : 'partials/vote-image.html',
		controller : 'VoteImageController'
	}).when('/review/:mId/:rNo', {
		templateUrl : 'partials/review-round.html',
		controller : 'ReviewRoundController'
	}).otherwise({
		redirectTo : '/login'
	});
}]);

dixitApp.config(['$localStorageProvider', function ($localStorageProvider) {
	$localStorageProvider.setKeyPrefix('dixitApp_');
}]);