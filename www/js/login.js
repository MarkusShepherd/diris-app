dixitApp.controller('LoginController', 
function($location, $scope, blockUI, dataService) {

	var player = dataService.getLoggedInPlayer();

	if (player) {
		$location.path('/overview/refresh').replace();
		return;
	}

	var myBlockUI = blockUI.instances.get('myBlockUI');

	$scope.login = function() {
		myBlockUI.start();

		dataService.getPlayerByName($scope.player.name)
		.then(function(player) {
			dataService.setLoggedInPlayer(player);
			$location.path('/overview/refresh').replace();
		}).catch(function(response) {
			console.log('error');
			console.log(response);
			dataService.setLoggedInPlayer(null);
			$scope.$apply(function() {
				$scope.message = response.message || "There was an error...";
			});
			myBlockUI.stop();
		});
	}; // login

}); // LoginController
