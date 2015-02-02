var myApp = angular.module('myApp', [ 'ngRoute', 'playerController' ]);

myApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/player', {
		templateUrl : 'partials/player-list.html',
		controller : 'PlayerListController'
	}).when('/player/:playerId', {
		templateUrl : 'partials/player-detail.html',
		controller : 'PlayerDetailController'
	}).when('/player/:playerId/:matchId', {
		templateUrl : 'partials/match.html',
		controller : 'MatchController'
	}).when('/player/:playerId/:matchId/:roundNo', {
		templateUrl : 'partials/round.html',
		controller : 'RoundController'
	}).otherwise({
		redirectTo : '/player'
	});
} ]);