/**	
	* Name: 		observer.js
	* Package: 		premi/client/editor/lib/
	* Author: 		Cossu Mattia
	* Date: 		2015-06-21

	* Use:
	si occupa di osservare degli oggetti grafici impostando e inviando
	dei segnali.
	
	* Changes:
	Version		Date		Who 				Changes				Reason
	----------------------------------------------------------------------------
	0.1			2015-06-21	Cossu Mattia		stesura classe
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

angular.module('premi')
	.factory('ObserverF',[
		function(){
			return klass(function(){
				this.slots = {};
			})
			.methods({
				/* assegna la funzione func al segnale signal. Restituisce un riferimento di Observer.
				*/
				on : function(signal,func){
					this.slots[signal] = func;
					return this;
				},
				/* Restituisce lo slot con segnale contenuto in signal e con parametri param dati dai valori in input.
				*/
				emit : function(signal,param1,param2,param3,param4){
					return this.slots[signal](param1,param2,param3,param4);
				},
			})
		}])
	.factory('Observer',['ObserverF',
		function(ObserverF){
			return new ObserverF;
		}]);
