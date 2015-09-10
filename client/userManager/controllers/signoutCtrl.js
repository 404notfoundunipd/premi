/**
    * Name:         signoutCtrl.js
    * Package:      premi/client/userManager/controllers/
    * Author:       Camborata Marco
    * Date:         2015-06-03

    * Use:
    Controller per il logout dell’utente. Chiama la funzione logout di $meteor e
    rimanda l’utente alla pagina principale
    
    * Changes:
    Version     Date        Who                 Changes             Reason
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
    .controller("signoutCtrl", [ '$meteor', '$location',
        function ($meteor, $location) {
            $meteor.logout().then(function () {
                console.log('Logout success');
                $location.path('/');
            }, function (err) {
                console.log('logout error - ', err);
                $location.path('/');
            });
        }]);