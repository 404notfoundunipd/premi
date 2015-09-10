/** 
    * Name:         navbarDirective.js    
    * Package:      premi/client/navbar/lib/
    * Author:       Ismaele Gobbo
    * Date:         2015-8-21

    * Use:
    navbarDirective è una direttiva che include la vista navbar.ng e permette 
    con il tag html navbar di visualizzare la navbar.

    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.6         2015-8-21   Ismaele Gobbo   creazione direttiva
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

angular.module("premi.navbar")
	.directive('navbar', function() {
		return {
			restrict: 'AE',
			templateUrl: 'client/navbar/views/navbar.ng.html',
			link:  {
			 	pre : function(scope, elem, attrs,ctrl){
			 		scope.username = attrs.username;
			 	}
			}
		};
	});
