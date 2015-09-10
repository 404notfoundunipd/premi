/**	
	* Name: 		toastMessageFactory.js
	* Package: 		premi/client/lib/
	* Author: 		Camborata Marco
	* Date: 		2015-06-18

	* Use:
	Semplice factory che restituisce una funzione per l’invio di notifiche o messaggi
	di errore all’utente
	
	* Changes:
	Version		Date		Who 			Changes				Reason
	----------------------------------------------------------------------------
	0.1			2015-06-18	Camborata Marco	creazione della factory
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

angular.module("premi")
	.factory('toastMessageFactory', [
		function() {
			return function (message) {
				console.log(message);
				Materialize.toast( message, 4000 );
			}
		}
	]);