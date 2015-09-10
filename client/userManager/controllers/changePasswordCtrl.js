/**
    * Name:         changePasswordCtrl.js
    * Package:      premi/client/userManager/controllers/
    * Author:       Camborata Marco
    * Date:         2015-06-03

    * Use:
    Controller della view changePassword.ng. Permette all’utente di cambiare la
	password del suo account
    
    * Changes:
    Version     Date        Who                 Changes             Reason
    ----------------------------------------------------------------------------
    0.2         2015-06-04  Camborata Marco     Modificato il metodo checkData
    ----------------------------------------------------------------------------
    0.1         2015-06-03  Camborata Marco     Scrittura del Controller
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

angular.module("premi.userManager")
	.controller("changePasswordCtrl", [ '$scope', '$meteor', '$state', 'toastMessageFactory',
		function($scope, $meteor, $state, toastMessageFactory){

			var var_init = function () {   
				$scope.oldPasswordState = "";
				$scope.pswState         = "";
				$scope.psw_confirmState = "";
			};

			/* Controlla che le informazioni scritte dall'utente siano corrette. 
			   Restituisce una stringa vuota se corrette, o una descrizione sull'errore rilevato se incorrette
			*/
			var checkData = function () {
				$scope.oldPasswordState = !$scope.oldPassword              ? "invalid" : "";
				$scope.pswState         = !$scope.psw                      ? "invalid" : "";
				$scope.psw_confirmState = $scope.psw_confirm != $scope.psw ? "invalid" : "";

				return ($scope.oldPassword && $scope.psw && ($scope.psw == $scope.psw_confirm));
			};
			
			/* Effettua il cambio di password sfruttando il metodo changePassword di $meteor
			   Se sono presenti errori invia un messaggio tramite toastMessageFactory
			*/
			$scope.changePsw = function() {
				var_init();
				
				if(checkData()) {
					$meteor
						.changePassword($scope.oldPassword, $scope.psw)
						.then(function(){
							toastMessageFactory('Password changed');
							$state.go('premi.presentationManager.presentations');
						},
						function(err){
							toastMessageFactory('Error changing password');
							console.log('Error changing password');
						});
				}
			};

			$scope.oldPassword = "";
			$scope.psw         = "";
			$scope.psw_confirm = "";

			var_init();
	}]);
