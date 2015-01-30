var baseUrl = "http://localhost:8080/";

var myApp = angular.module('myApp', []);

myApp.controller('playerController', function playerController($scope, $http) {

	$scope.edit = true;
	$scope.error = false;
	$scope.incomplete = false;

	$scope.players = [];

	$scope.loadPlayers = function() {
		$http.get(baseUrl + "player").success(function(response) {
			$scope.players = response;
		});
	};

});