'use strict';

dirisApp.controller('ReviewRoundController',
function ReviewRoundController($location, $log, $q, $rootScope, $routeParams, $scope, $timeout,
                               blockUI, toastr, dataService) {

    var player = dataService.getLoggedInPlayer();

    if (!player) {
        $location.path('/login');
        return;
    }

    if (!blockUI.state().blocking)
        blockUI.start();

    var mPk = $routeParams.mPk;
    var rNo = $routeParams.rNo;

    $scope.mPk = mPk;
    $scope.rNo = rNo;

    $scope.currentPlayer = player;
    $rootScope.menuItems = [{
        link: '#/overview',
        label: 'Overview',
        glyphicon: 'home'
    }, {
        link: '#/match/' + mPk,
        label: 'Match',
        glyphicon: 'knight'
    }];
    $rootScope.refreshPath = null;
    $rootScope.refreshReload = false;

    dataService.getMatch(mPk)
    .then(function (match) {
        $scope.match = processMatch(match, player);
        $scope.round = $scope.match.rounds[rNo];
        return $scope.match;
    }).then(function(match) {
        if ($scope.round.status === 's' || $scope.round.status === 'o')
            $location.path('/image/' + mPk + '/' + rNo).replace();
        else if ($scope.round.status === 'v')
            $location.path('/vote/' + mPk + '/' + rNo).replace();
        else {
            var promises = $.map(match.players, dataService.getPlayer);
            $scope.players = {};
            $q.all(promises)
            .then(function (players) {
                $.each(players, function (i, player) {
                    $scope.players[player.pk] = player;
                });
                blockUI.stop();
            });
        }
    }).catch(function (response) {
        $log.debug('error');
        $log.debug(response);
        toastr.error("There was an error fetching the data - please try again later...");
        blockUI.stop();
    });

    dataService.getImages(true, true)
    .then(function (images) {
        $scope.images = {};
        $.each(images, function(k, img) {
            $scope.images['' + img.pk] = img;
        });
    }).catch(function (response) {
        $log.debug('error');
        $log.debug(response);
        toastr.error("There was an error fetching the data - please try again later...");
    });

    $scope.filterValues = function filterValues(items, value) {
        var result = [];
        angular.forEach(items, function (v, k) {
            if (v == value)
                result.push(k);
        });
        return result;
    };

    $scope.filterOutKey = function filterOutKey(items, key) {
        var result = [];
        angular.forEach(items, function (v, k) {
            if (k != key)
                result.push(v);
        });
        return result;
    };

});
