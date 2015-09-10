/**	
	* Name: 		presentationsCtrl.js
	* Package: 		premi/client/presentationManager/controllers/
	* Author: 		Manuto Monica
	* Date: 		2015-06-20

	* Use:
	Fornisce alla vista associata presentations.ng una lista di tutte le presentazioni
	in possesso dell’utente

	
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
	.controller("presentationsCtrl", [ '$scope',
		function($scope){

			$(document).ready(function(){
    			$('.tooltipped').tooltip({delay: 50});
  			});

			$scope.Presentations = Presentations.find().fetch();
		}]);