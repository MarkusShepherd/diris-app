dirisApp.controller('SubmitImageController',
function SubmitImageController($http, $location, $log, $q, $rootScope, $routeParams, $scope, $timeout,
	                           blockUI, toastr, dataService, BACKEND_URL) {

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
		$scope.round = $scope.match.rounds[rNo - 1];
		return $scope.match;
	}).then(function (match) {
		if ($scope.round.status === 'v')
			$location.path('/vote/' + mPk + '/' + rNo).replace();
		else if ($scope.round.status === 'f')
			$location.path('/review/' + mPk + '/' + rNo).replace();
		else {
			var promises = $.map(match.players, dataService.getPlayer);
			$scope.players = {};
			$q.all(promises)
			.then(function (players) {
				$.each(players, function(i, player) {
					$scope.players[player.pk] = player;
				});
				blockUI.stop();
			});
		}
	}).catch(function(response) {
		$log.debug('error');
		$log.debug(response);
		toastr.error("There was an error fetching the data - please try again later...");
		blockUI.stop();
	});

	dataService.getImages()
	.then(function (images) {
		$scope.images = {};
		$.each(images, function(k, img) {
			$scope.images['' + img.pk] = img;
		});
	}).catch(function(response) {
		$log.debug('error');
		$log.debug(response);
		toastr.error("There was an error fetching the data - please try again later...");
	});

	function getImage(srcType) {
		navigator.camera.getPicture(setImage, function(message) {
			$scope.$apply(function () {
				toastr.error(message);
			});
		}, {
			quality : 100,
			destinationType : Camera.DestinationType.DATA_URL,
			sourceType : srcType,
			encodingType: 0
		});
	}

	function setImage(imageData) {
		$scope.$apply(function () {
			$scope.imageData = imageData;
			$scope.selectedImage = true;
			$("#image")
				.cropper('replace', "data:image/jpeg;base64," + imageData)
				.cropper('enable');
		});
	}

	$scope.getImageFromCamera = function getImageFromCamera() {
		getImage(Camera.PictureSourceType.CAMERA);
	};

	$scope.getImageFromLibrary = function getImageFromLibrary() {
		if (isBrowser())
			$('#file-input').trigger('click');
		else
			getImage(Camera.PictureSourceType.PHOTOLIBRARY);
	};

	$scope.submitImage = function submitImage() {
		$q(function (resolve, reject) {
			$("#image").cropper('getCroppedCanvas', {
				width: 1080,
				height: 1080
			}).toBlob(resolve, 'image/jpeg', 0.5);
		}).then(function (image) {
			$log.debug(image);
			return dataService.submitImage(mPk, rNo, image, $scope.round.story);
		}).then(function (match) {
			$log.debug(match);
			$location.path('/match/' + mPk + '/refresh').replace();
		}).catch(function (response) {
			$log.debug('error');
			$log.debug(response);
			toastr.error("There was an error");
		});
	};

	$scope.zoom = function zoom(ratio) {
		$('#image').cropper('zoom', ratio);
	};

	$scope.rotate = function rotate(angle) {
		$('#image').cropper('rotate', angle);
	};

	$scope.flip = function flip(axis) {
		var  img = $('#image');
		img.cropper('scale' + axis, -img.cropper('getData')['scale' + axis]);
	};

	$("#image").cropper({
		viewMode: 3,
		aspectRatio: 1,
		dragMode: 'move',
		modal: false,
		guides: false,
		center: false,
		highlight: false,
		autoCropArea: 1,
		cropBoxMovable: false,
		cropBoxResizable: false,
		toggleDragModeOnDblclick: false
	}).cropper('disable');

	$("#file-input").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
            	var d = e.target.result;
            	setImage(d.substr(d.indexOf(",") + 1));
            };

            reader.readAsDataURL(this.files[0]);
        }
	});

});
