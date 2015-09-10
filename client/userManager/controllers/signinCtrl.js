/**
    * Name:         signinCtrl.js
    * Package:      premi/client/userManager/controllers/
    * Author:       Camborata Marco
    * Date:         2015-06-03

    * Use:
    Controller della view signin.ng. Permette all’utente di effettuare il login
    
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
	.controller("signinCtrl", [ '$scope', '$meteor', '$state', 'toastMessageFactory',
		function($scope, $meteor, $state, toastMessageFactory){

			var var_init = function () {
				$scope.emailState = "";
				$scope.passwordState = "";
			};

			/* Controlla che le informazioni scritte dall'utente siano corrette. 
			   Restituisce una stringa vuota se corrette, o una descrizione sull'errore rilevato se incorrette
			*/
			var checkData = function () {
				$scope.emailState    = !$scope.email    ? "invalid" : "";
				$scope.passwordState = !$scope.password ? "invalid" : "";
				return ($scope.email && $scope.password);
			};

			/* Effettua il login sfruttando il metodo loginWithPassword di $meteor
			   Se sono presenti errori invia un messaggio tramite toastMessageFactory 
			   altrimenti manda l'utente alla lista delle presentazioni
			*/
			$scope.signIn = function () {
				var_init();

				if (checkData()){
					$meteor.loginWithPassword({email: $scope.email},$scope.password).then(
						function() {
							$state.go('premi.presentationManager.presentations');
							toastMessageFactory('Sign in success');
							console.log('Sign in success');
						},
						function(err) {
							toastMessageFactory('Sign in failed');
							console.log('Sign in failed');
						}
					);
				}
			};

			$scope.email = "";
			$scope.password = "";

			var_init();
	}]);
