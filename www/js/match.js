'use strict';

dirisApp.controller('MatchController',
function MatchController($location, $log, $q, $rootScope, $routeParams, $scope, 
                         blockUI, toastr, dataService) {

    var player = dataService.getLoggedInPlayer();

    if (!player) {
        $location.path('/login');
        return;
    }

    if (!blockUI.state().blocking)
        blockUI.start();

    $scope.currentPlayer = player;
    $rootScope.menuItems = [{
        link: '#/overview',
        label: 'Overview',
        glyphicon: 'home'
    }];

    var mPk = $routeParams.mPk;
    var action = $routeParams.action;

    $rootScope.refreshPath = '/match/' + mPk + '/refresh';
    $rootScope.refreshReload = action === 'refresh';

    $scope.mPk = mPk;

    var matchPromise = dataService.getMatch(mPk, action === 'refresh')
    .then(function (match) {
        $log.debug('Match:', match);
        $scope.match = processMatch(match, player);
        $scope.round = $scope.match.currentRoundObj;
        $log.debug('Match processed:', $scope.match);
        $log.debug('Round:', $scope.round);
        return $scope.match;
    }).then(function (match) {
        var promises = $.map(match.players, dataService.getPlayer);
        $scope.players = {};
        return $q.all(promises);
    }).then(function (players) {
        $.each(players, function(i, player) {
            $scope.players['' + player.pk] = player;
        });
    }).catch(function (response) {
        $log.debug('error');
        $log.debug(response);
        toastr.error("There was an error fetching the data - please try again later...");
    });

    var imagePromise = dataService.getImages(action === 'refresh', true)
    .then(function (images) {
        $scope.images = {};
        $.each(images, function(k, img) {
            $scope.images['' + img.pk] = img;
        });
        $log.debug('Images: ', $scope.images);
    }).catch(function(response) {
        $log.debug('error');
        $log.debug(response);
        toastr.error("There was an error fetching the data - please try again later...");
    });

    $q.all([matchPromise, imagePromise]).then(blockUI.stop);

}); // MatchController
