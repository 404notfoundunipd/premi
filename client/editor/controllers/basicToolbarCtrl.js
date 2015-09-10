angular.module("premi.editor")
	.controller("basicToolbarCtrl", ['$scope', '$state', '$stateParams',
		function($scope, $state, $stateParams){

			$(document).ready(function(){
				$('.tooltipped').tooltip({delay: 50});
			});

			$scope.activeStateClass = function (state) {
				return $scope.activeState == state ? 'active' : '';
			}

			$scope.goToState = function (state) {
				if ($scope.activeState != state){
					$state.go(state, $stateParams);
				}
	        };
		}]);