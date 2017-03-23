'use strict';

dirisApp.controller('LoginController',
function LoginController($location, $log, $rootScope, $scope, 
                         blockUI, jwtHelper, toastr, dataService, BACKEND_URL) {

    var player = dataService.getLoggedInPlayer();

    if (player) {
        $log.debug('already authenticated');
        $location.path('/overview/refresh').replace();
        return;
    }

    $rootScope.menuItems = [];
    $rootScope.refreshPath = null;
    $rootScope.refreshReload = false;

    $scope.login = function login() {
        blockUI.start();

        dataService.getToken($scope.player.name, $scope.player.password)
        .then(function (token) {
            $log.debug('token:', token);
            if (!token)
                throw new Error('no token');
            $location.path('/overview/refresh').replace();
        }).catch(function (response) {
            $log.debug(response);
            $scope.message = response.message || "There was an error...";
            blockUI.stop();
        });
    }; // login
}); // LoginController
