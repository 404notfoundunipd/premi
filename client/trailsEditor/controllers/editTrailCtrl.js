/*
	* Name: 		editTrailCtrl.js
	* Package: 		premi/client/trailsEditor/controllers
	* Author: 		Camborata Marco
	* Date: 		2015-08-02

	* Use:
	Controller della view editTrail.ng. Fornisce, tramite lo $scope, metodi e attributi
	necessari alla modifica del titolo di un trail

	
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
	.controller("editTrailCtrl", ['$scope', '$state', '$stateParams', '$meteor', 'databaseAPI', 'toastMessageFactory','signalsCtrl',
		function($scope, $state, $stateParams, $meteor, databaseAPI, toastMessageFactory,signalsCtrl){

			var trail = Trails.findOne({ '_id' : $stateParams.idtrail});
			signalsCtrl.removeAllSignals();
			$scope.data = {
				title : trail.title
			};

			if (!trail) {
				$state.go($state.current.data.defaultState, $stateParams);
			}

			/* Utilizza il metodo updateTrailTitle(idTrail, title) di databaseAPI per l'aggiornamento del Trail nel database. 
			   Aggiorna poi la pagina con il cambiamento apportato.
			*/
			$scope.save = function () {
				if ($scope.data.title != ""){
					databaseAPI.updateTrailTitle($stateParams.idtrail, $scope.data.title);
					$state.go($state.current.data.defaultState, $stateParams);
				}
				else {
					toastMessageFactory('Please, enter not empty title');
				}
			}
			
			/* Annulla le modifiche effettuate dall'utente sul titolo del trail. 
			   Aggiorna poi la pagina riportandola allo stato precedente alla modifica
			*/
			$scope.discard = function () {
				$state.go($state.current.data.defaultState, $stateParams);
			}
		}]);
