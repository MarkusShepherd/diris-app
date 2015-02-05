dixitApp.factory('Authentication', function($firebase, FIREBASE_URL,
		$rootScope, $location, $firebaseAuth, $routeParams) {

	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);

	auth.$onAuth(function(authUser) {
		if (authUser) {
			var ref = new Firebase(FIREBASE_URL + '/players/' + authUser.uid);
			var player = $firebase(ref).$asObject();
			$rootScope.currentPlayer = player;
		} else {
			$rootScope.currentPlayer = '';
		}
	}); // Check user status

	var myObject = {

		login : function(player) {
			var ref = new Firebase(FIREBASE_URL);
			var auth = $firebaseAuth(ref);
			return auth.$authWithPassword({
				email : player.email,
				password : player.password
			});
		}, // login

		register : function(player) {
			return auth.$createUser({
				email : player.email,
				password : player.password
			}).then(function(regUser) {
				var ref = new Firebase(FIREBASE_URL + 'players');
				var firebaseUsers = $firebase(ref);

				var userInfo = {
					date : Firebase.ServerValue.TIMESTAMP,
					uid : regUser.uid,
					name : player.name,
					email : player.email
				};

				firebaseUsers.$set(regUser.uid, userInfo);
			}); // add user
		}, // register

		logout : function() {
			$location.path('/login');
			return auth.$unauth();
		}, // logout

		signedIn : function() {
			auth.$getAuth(function(authUser) {
				if (authUser) {
					var ref = new Firebase(FIREBASE_URL + '/players/'
							+ authUser.uid);
					var player = $firebase(ref).$asObject();
					$rootScope.currentPlayer = player;
				} else {
					$rootScope.currentPlayer = '';
				}
			}); // Check user status
		} // signedIn

	} // myObject

	// add the function to the rootScope

	$rootScope.signedIn = function() {
		return myObject.signedIn();
	}

	return myObject;
});