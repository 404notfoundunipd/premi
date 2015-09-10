/*
	* Name: 		trailsCtrl.js
	* Package: 		premi/client/trailsEditor/controllers
	* Author: 		Camborata Marco
	* Date: 		2015-08-02

	* Use:
	Controller generale dell’editor dei trail. Prepara lo $scope con attributi e metodi
	utili alle viste e ai controller interni a questo editor.

	
	* Changes:
	Version		Date		Who 			Changes				Reason
	----------------------------------------------------------------------------
	0.2			2015-08-06	Camborata Marco	Aggiunti metodi di utilita' per
											gli stati
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
	.controller("trailsEditorCtrl", [ '$scope', '$state', '$stateParams',
		function($scope, $state, $stateParams){

	        $scope.idpres = $stateParams.idpres;

	        $scope.disableAllStateMenu = function () {
	                $scope.framesAddedMenu    = 'disabled';
	                $scope.framesToBeAddedMenu = 'disabled';

	                if(!$scope.$$phase) {
	                    $scope.$apply();
	                }
	            };

	        $scope.disableAllStateMenu();

		/* Se lo stato ricevuto è 'enabled' lo rende 'disabled', e viceversa
		*/
	        var switchEnabled = function (state) {
	            return state === 'enabled' ? 'disabled' : 'enabled';
	        };

		/* Abilita il menu rappresentato da stateMenu
		*/
	        $scope.enableStateMenu = function (stateMenu) {
	            switch(stateMenu) {
	                case 'framesAddedMenu':
	                    var state = switchEnabled($scope.framesAddedMenu);
	                    $scope.disableAllStateMenu();
	                    $scope.framesAddedMenu = state;
	                    break;
	                case 'framesToBeAddedMenu':
	                    var state = switchEnabled($scope.framesToBeAddedMenu);
	                    $scope.disableAllStateMenu();
	                    $scope.framesToBeAddedMenu = state;
	                    break;
	                default:
	                    $scope.disableAllStateMenu();
	            }
	        };

	        $scope.goToState = function (state) {
	            $state.go(state, $stateParams);
	        };

		}]);
