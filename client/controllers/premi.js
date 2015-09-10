angular.module("premi")
	.controller("premi", [ '$meteor', '$rootScope',
		function($meteor, $rootScope){

			$meteor.autorun($rootScope, function() {
				$rootScope.getReactively('currentUser');
			});
	}]);