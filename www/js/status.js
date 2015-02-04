dixitApp.controller('StatusController', function($scope, Authentication) {

	$scope.logout = function() {
		Authentication.logout();
	}; //logout

}); //StatusController
