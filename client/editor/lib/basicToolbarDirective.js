/** 
    * Name:         basicToolbarDirective.js    
    * Package:      premi/client/editor/lib/
    * Author:       Enrico De Lazzari
    * Date:         2015-8-15

    * Use:
    basicToolbarDirective è una direttiva che include basicToolbar.ng e 
    il controller basicToolbarCtrl e permette con il tag html basic-toolbar 
    di settare la visualizzazione a true o false della toolbar dell'editor.

    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.6         2015-8-15   Enrico De Lazzari  creazione direttiva
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

angular.module("premi.editor")
	.directive('basicToolbar', function() {
		return {
			restrict: 'AE',
			templateUrl: 'client/editor/views/basicToolbar.ng.html',
			controller: 'basicToolbarCtrl',
			link:  {
			 	pre : function(scope, elem, attrs,ctrl){
			 		scope.activeState = attrs.activeState;
			 	}
			}
		};
	});
