var testUrl = 'http://localhost:8181';
var liveUrl = 'http://dixit-app.appspot.com';

var dixitApp = angular.module('dixitApp', ['angular-jwt', 'auth0', 'blockUI', 'ngRoute', 'ngStorage']);

dixitApp.constant('BACKEND_URL', liveUrl);

dixitApp.config(
function(authProvider, jwtInterceptorProvider, $httpProvider, $routeProvider, $localStorageProvider, $logProvider, blockUIConfig) {
	authProvider.init({
		domain: 'dixit.auth0.com',
		clientID: 'SyQYBfqUOcxOgrXHjTUMKJGfJFPwLuBZ',
		loginUrl: '/login'
	});

	jwtInterceptorProvider.tokenGetter = ['$localStorage', function($localStorage) {
		return $localStorage.token;
	}];

	$httpProvider.interceptors.push('jwtInterceptor');

	$routeProvider.when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginController'
	}).when('/overview', {
		templateUrl : 'partials/overview.html',
		controller : 'OverviewController',
		requiresLogin: true
	}).when('/overview/:action', {
		templateUrl : 'partials/overview.html',
		controller : 'OverviewController',
		requiresLogin: true
	}).when('/newmatch', {
		templateUrl : 'partials/new-match.html',
		controller : 'NewMatchController',
		requiresLogin: true
	}).when('/match/:mId', {
		templateUrl : 'partials/match.html',
		controller : 'MatchController',
		requiresLogin: true
	}).when('/match/:mId/:action', {
		templateUrl : 'partials/match.html',
		controller : 'MatchController',
		requiresLogin: true
	}).when('/image/:mId/:rNo', {
		templateUrl : 'partials/submit-image.html',
		controller : 'SubmitImageController',
		requiresLogin: true
	}).when('/vote/:mId/:rNo', {
		templateUrl : 'partials/vote-image.html',
		controller : 'VoteImageController',
		requiresLogin: true
	}).when('/review/:mId/:rNo', {
		templateUrl : 'partials/review-round.html',
		controller : 'ReviewRoundController',
		requiresLogin: true
	}).otherwise({
		redirectTo : '/login'
	});

	$localStorageProvider.setKeyPrefix('dixitApp_');

	$logProvider.debugEnabled(false);

	blockUIConfig.autoBlock = false;
});

dixitApp.run(function($localStorage, $rootScope, auth) {
	auth.hookEvents();

	$rootScope.$on('$locationChangeStart', function() {
		if (!auth.isAuthenticated) {
			var token = $localStorage.token;
			if (token)
				auth.authenticate($localStorage.profile, token);
		}
	});
});
