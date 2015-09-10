/*
	* Name: 		removeTrailCtrl.js
	* Package: 		premi/client/trailsEditor/controllers
	* Author: 		Camborata Marco
	* Date: 		2015-08-02

	* Use:
	Controller della view removeTrail.ng. Fornisce, tramite lo $scope, metodi e
	attributi necessari all’eliminazione di un trail

	
	* Changes:
	Version		Date		Who 			Changes				Reason
	----------------------------------------------------------------------------
	0.1			2015-08-02	Camborata Marco	Codifica del controller
	----------------------------------------------------------------------------

	* Created by 404Notfound for Premi - Better than Prezi!

	* Premi is a free software: you can redistribute it and/or modify
	* it under the terms of the GNU General Public License as published by
	* the Free Software Foundation, either version 3 of the License, or
	* (at your option) any later version.

	* This program is distributed in the hope that it will be useful,
	* but WITHOUT ANY WARRANTY; without even the implied warranty of
	* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	* GNU General Public License for more details.

	* You should have received a copy of the GNU General Public License
	* along with this program. If not, see <http://www.gnu.org/licenses/>
*/

angular.module("premi.editor.trailsEditor")
	.controller("removeChkPntCtrl", ['$scope', '$state', '$stateParams',
		function($scope, $state, $stateParams){

			/*$scope.Trail = Trails.findOne({ '_id' : $stateParams.idtrail});

			if (!$scope.Trail) {
				$state.go($state.current.data.defaultState, $stateParams);
			}*/

			$scope.remove = function () {
				//databaseAPI.removeTrail($stateParams.idtrail);
				$scope.okRem = true;
				$state.go('premi.editor.trails.modTrail', $stateParams);
			}

			$scope.discard = function () {
				$scope.okRem = false;
				$state.go('premi.editor.trails.modTrail', $stateParams);
			}
		}]);