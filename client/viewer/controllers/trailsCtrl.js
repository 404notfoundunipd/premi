/**
    * Name:         trailsCtrl.js
    * Package:      premi/client/viewer/views
    * Author:       De Lazzari Enrico
    * Date:         2015-08-03

    * Use:
    Controller della vista generata dal template trails.ng. Fornisce, tramite lo $scope,
	la lista di tutti i trail creati dall’utente per la presentazione selezionata

    * Changes:
    Version     Date        Who                 Changes                 Reason
    ----------------------------------------------------------------------------
    0.1         2015-08-03  De Lazzari Enrico	scrittura Controller
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

angular.module("premi.viewer")
    .controller("trailsCtrl", [ '$scope', '$stateParams','$state',
        function($scope,$stateParams,$state){
        	$scope.Trails = Trails.find({ presid : $stateParams.idpres}).fetch();
            $scope.pre_init = function(idtrail){
            	$state.go('premi.viewer')
            }   
        }]);