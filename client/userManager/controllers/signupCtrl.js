/**
    * Name:         signupCtrl.js
    * Package:      premi/client/userManager/controllers/
    * Author:       Camborata Marco
    * Date:         2015-06-03

    * Use:
    Controller della view signup.ng. Permette all’utente di registrarsi all’interno del
	database
    
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
	.controller("signupCtrl", [ '$scope', '$meteor', '$state', 'databaseAPI', 'toastMessageFactory',
		function($scope, $meteor, $state, databaseAPI, toastMessageFactory){

			var var_init = function () {
				$scope.emailState = "";
				$scope.passwordState = "";
				$scope.pwdConfirmState = "";

				$scope.emailExists = false;
			};

			/* Controlla che le informazioni scritte dall'utente siano corrette. 
			   Restituisce una stringa vuota se corrette, o una descrizione sull'errore rilevato se incorrette
			*/
			var checkData = function () {
				$scope.emailState      = !$scope.email                        ? "invalid" : "";
				$scope.passwordState   = !$scope.password                     ? "invalid" : "";
				$scope.pwdConfirmState = $scope.password != $scope.pwdConfirm ? "invalid" : "";

				return ($scope.email && $scope.password && ($scope.password == $scope.pwdConfirm));
			};

			/* Effettua la registrazione sfruttando il metodo createUser di $meteor
			   Se sono presenti errori invia un messaggio tramite toastMessageFactory, 
			   altrimenti manda l'utente alla lista delle presentazioni
			*/
			$scope.signUp = function() {
				var_init();
				if (checkData()){
					$meteor.createUser({
						username: $scope.email,
						email: $scope.email,
						password: $scope.password
					}).then(function () {
						console.log('Signup success');
						$state.go('premi.presentationManager.presentations');
					}, function (err) {
						if (err.message == "Username already exists. [403]"){
							$scope.emailExists = true;
						}
						console.log('Signup Failed');
						toastMessageFactory('Signup Failed');
					});
				}
			};

			$scope.email = "";
			$scope.password = "";
			$scope.pwdConfirm = "";

			var_init();
		}]);
