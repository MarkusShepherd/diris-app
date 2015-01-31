var baseUrl = "http://localhost:8080/";
var playerController = angular.module('playerController', [ 'ngAnimate' ]);

playerController.controller('PlayerListController', [ '$scope', '$http',
		function($scope, $http) {

			$scope.players = [];

			$scope.loadPlayers = function() {
				$http.get(baseUrl + "player").success(function(response) {
					$scope.players = response;
				});
			};

			$scope.loadPlayers();

		} ]);

playerController.controller('PlayerDetailController', [
		'$scope',
		'$http',
		'$routeParams',
		function($scope, $http, $routeParams) {

			$http.get(baseUrl + "player/" + $routeParams.playerId).success(
					function(response) {
						$scope.player = response;
					});

		} ]);

playerController.controller('MatchController', [
		'$scope',
		'$http',
		'$routeParams',
		function($scope, $http, $routeParams) {

			$http.get(baseUrl + "match/" + $routeParams.matchId).success(
					function(response) {
						$scope.match = response;
						$scope.playerId = $routeParams.playerId;
					});

		} ]);
