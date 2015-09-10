/** 
    * Name:         actionDialogDirective.js    
    * Package:      premi/client/utility/lib/
    * Author:       Enrico De Lazzari
    * Date:         2015-8-22

    * Use:
    direttiva che include la vista actionDialog.ng e permette con il tag html
    action-dialog di visualizzare un messaggio all'utente che può essere personalizzato 
    includendo codice html tra il tag di apertura e chiusura della direttiva

    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.6         2015-8-22   Enrico De Lazzari  creazione direttiva
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

angular.module("premi.utility")
	.directive('actionDialog', function() {
		return {
			restrict: 'AE',
			templateUrl: 'client/utility/views/actionDialog.ng.html',
			transclude: true,
			scope: {
				actionCallback: '&actionCallback',
				discardCallback: '&discardCallback' 
			},
			link:  {
			 	pre : function(scope, elem, attrs,ctrl){
			 		scope.title = attrs.title;
			 		scope.actionLabel = attrs.actionLabel;
			 		scope.discardLabel = attrs.discardLabel;
			 	}
			}
		};
	});
