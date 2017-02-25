var testUrl = 'http://localhost:8000';
var liveUrl = 'http://diris-app.appspot.com';

var dirisApp = angular.module('dirisApp', ['angular-jwt', 'blockUI', 'ngAnimate',
	                                       'ngRoute', 'ngStorage', 'toastr']);

dirisApp.constant('BACKEND_URL', testUrl);

dirisApp.config(function (jwtOptionsProvider, $httpProvider, $routeProvider,
						  $localStorageProvider, $logProvider, blockUIConfig, toastrConfig) {
	jwtOptionsProvider.config({
		authPrefix: 'JWT ',
		unauthenticatedRedirectPath: '/login',
		whiteListedDomains: ['diris-app.appspot.com', 'localhost'],
		tokenGetter: ['$localStorage', function ($localStorage) {
			return $localStorage.token;
		}]
	});

	$httpProvider.interceptors.push('jwtInterceptor');

	$routeProvider.when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginController'
	}).when('/register', {
		templateUrl : 'partials/registration.html',
		controller : 'RegistrationController'
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
	}).when('/accept/:mId', {
		templateUrl : 'partials/accept.html',
		controller : 'AcceptController',
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
	}).when('/profile', {
		templateUrl : 'partials/profile.html',
		controller : 'ProfileController',
		requiresLogin: true
	}).when('/profile/:pId', {
		templateUrl : 'partials/profile.html',
		controller : 'ProfileController',
		requiresLogin: true
	}).when('/profile/:pId/:action', {
		templateUrl : 'partials/profile.html',
		controller : 'ProfileController',
		requiresLogin: true
	}).otherwise({
		redirectTo : '/login'
	});

	$localStorageProvider.setKeyPrefix('dirisApp_');

	$logProvider.debugEnabled(true);

	blockUIConfig.autoBlock = false;

	angular.extend(toastrConfig, {
		autoDismiss: false,
		newestOnTop: false,
		positionClass: 'toast-bottom-right',
		preventDuplicates: false,
		preventOpenDuplicates: true,
		extendedTimeOut: 1000,
		timeOut: 10000
		// TODO force refresh on click
	});
});

dirisApp.run(function($localStorage, $log, $rootScope, authManager, dataService, toastr) {
	authManager.checkAuthOnRefresh();
	// authManager.redirectWhenUnauthenticated();

	// $rootScope.$on('tokenHasExpired', function() {
	//     do something
	// });

	if (isBrowser())
		$log.debug('No notifications on browser');
	else {
		var push = PushNotification.init({
			android: {
				senderID: 879361060795
			},
			ios: {
				alert: true,
				badge: true,
				sound: true
			},
			windows: {}
		});

		push.on('registration', function(data) {
			$log.debug("Registered push");
			$log.debug(data);
			$log.debug(data.registrationId);

			var player = dataService.getLoggedInPlayer();
			if (player && player.key && player.key.id)
				dataService.updatePlayer(player.key.id, {
					gcmRegistrationID: data.registrationId
				});
			else
				dataService.setGcmRegistrationId(data.registrationId);
		});

		push.on('notification', function(data) {
			$log.debug("Received notification");
			$log.debug(data);
			$log.debug(data.message);
			$log.debug(data.title);
			$log.debug(data.count);
			$log.debug(data.sound);
			$log.debug(data.image);
			$log.debug(data.additionalData);
			toastr.info(data.message, data.title);
		});

		push.on('error', function(e) {
			$log.debug("Error in notifications");
			$log.debug(e);
			$log.debug(e.message);
			toastr.error(e.message);
		});
	}
});
