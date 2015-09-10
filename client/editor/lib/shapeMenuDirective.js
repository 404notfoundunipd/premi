/** 
    * Name:         shapeMenuDirective.js    
    * Package:      premi/client/editor/lib/
    * Author:       Mattia Cossu
    * Date:         2015-8-22

    * Use:
    shapeMenuDirective è una direttiva che include la vista shapeMenu.ng e permette 
    con il tag html shape-menu di visualizzare il menu di scelta di un oggetto shape. 
    Per visualizzare gli shape, si appoggia alla funzione shapeFilesystemMapFactory 
    che ritorna la lista degli shape disponibili.

    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.6         2015-8-22   Mattia Cossu  creazione direttiva
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
	.directive('shapeMenu', [ 'shapeFilesystemMapFactory',
		function(shapeFilesystemMapFactory) {
			return {
				restrict: 'AE',
				templateUrl: 'client/editor/views/shapeMenu.ng.html',
				scope: {
					callback: '&callback',
				},
				link:  {
				 	pre : function(scope, elem, attrs,ctrl){
				 		scope.dataClass = attrs.dataClass;
				 		scope.files = shapeFilesystemMapFactory;
				 	}
				}
			};
		}]);
