/*
	* Name: 		newTrailCtrl.js
	* Package: 		premi/client/trailsEditor/controllers
	* Author: 		Camborata Marco
	* Date: 		2015-08-02

	* Use:
	Controller della view newTrail.ng. Fornisce, tramite lo $scope, metodi e attributi
	necessari alla creazione di un nuovo trail

	
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
	.controller("newTrailCtrl", ['$scope', '$state', '$stateParams', 'databaseAPI', 'toastMessageFactory','signalsCtrl',
 		function($scope, $state, $stateParams, databaseAPI, toastMessageFactory,signalsCtrl){

 			$scope.data = {
 				title : ""
 			};
 			signalsCtrl.removeAllSignals();
			/* Utilizza il metodo insertTrail di databaseAPI per il salvataggio del nuovo Trail nel database. 
			   Aggiorna poi la pagina con il cambiamento apportato al database
			*/
			$scope.save = function () {
				if ($scope.data.title != ""){
					databaseAPI.insertTrail($scope.data.title, $stateParams.idpres,function () {});
					$state.go($state.current.data.defaultState, $stateParams);
				}
				else {
					toastMessageFactory('Please, enter not empty title');
				}
			}
			/* Annulla il processo di creazione del trail. Aggiorna poi la pagina riportandola allo stato precedente
			*/
			$scope.discard = function () {
				$state.go($state.current.data.defaultState, $stateParams);
			}
		}]);
