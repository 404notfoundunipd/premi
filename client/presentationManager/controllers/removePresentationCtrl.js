/**	
	* Name: 		removePresentationCtrl.js
	* Package: 		premi/client/presentationManager/controllers/
	* Author: 		Manuto Monica
	* Date: 		2015-06-20

	* Use:
	Controller della view removePresentation.ng. Permette all’utente di eliminare
	una presentazione da lui creata in precedenza.

	
	* Changes:
	Version		Date		Who 			Changes				Reason
	----------------------------------------------------------------------------
	0.1			2015-06-20	Manuto Monica	Creazione del controller
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

angular.module("premi.presentationManager")
	.controller("removePresentationCtrl", [ '$scope', '$state', '$stateParams', 'databaseAPI',
		function($scope, $state, $stateParams, databaseAPI){
			
			$scope.Presentation = Presentations.findOne({ '_id' : $stateParams.idpres});

			if (!$scope.Presentation) {
				$state.go('premi.presentationManager.presentations');
			}
			
			/* Utilizza il metodo removePresentation(id, title, description) di databaseAPI per la rimozione della presentazione dal database. 
			   Rimanda poi alla lista delle presentazioni utilizzando l'oggetto $state di $stateProvider
			*/
			$scope.remove = function () {
				databaseAPI.removePresentation($stateParams.idpres,function () {
					$state.go('premi.presentationManager.presentations');
				});
			}
			
			/* Annulla le modifiche effettuate dall'utente sulla presentazione. 
			   Rimanda poi alla lista delle presentazioni utilizzando l'oggetto $state di $stateProvider
			*/
			$scope.discard = function () {
				$state.go('premi.presentationManager.presentations'); 
			}
		}]);
