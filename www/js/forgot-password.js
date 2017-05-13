'use strict';

/*jslint browser: true */
/*global dirisApp */

dirisApp.controller('ForgotPasswordController', function ForgotPasswordController(
    $location,
    $log,
    $rootScope,
    $scope,
    blockUI,
    toastr,
    dataService
) {
    dataService.logout();

    blockUI.stop();

    $rootScope.menuItems = [];
    $rootScope.refreshButton = false;

    $scope.forgot = function forgot() {
        if (!blockUI.state().blocking) {
            blockUI.start();
        }

        dataService.forgotPassword($scope.username, $scope.email)
            .then($log.debug)
            .then(function () {
                toastr.success('You should receive an email with your new password', 'Check your emails');
            }).catch(function (response) {
                $log.debug(response);
                $scope.message = response.message || "There was an error...";
            }).then(blockUI.stop);
    }; // forgot
}); // ForgotPasswordController
