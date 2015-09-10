/*
	* Name: 		listTrailCtrl.js
	* Package: 		premi/client/trailsEditor/controllers
	* Author: 		Camborata Marco
	* Date: 		2015-08-02

	* Use:
	Controller della view listTrail.ng. Fornisce, tramite lo $scope, la lista dei trails
	associati alla presentazione che l’utente sta modificando

	
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
	.controller("listTrailCtrl", [ '$scope', '$stateParams', '$meteor',
		function($scope, $stateParams, $meteor){

			$(document).ready(function(){
				$('.tooltipped').tooltip({delay: 50});
			});

			$scope.Trails = $meteor.collection(function () {
				return Trails.find({ presid : $stateParams.idpres})
			});
		}]);