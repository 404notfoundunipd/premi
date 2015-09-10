/** 
    * Name:         trailMapDirective.js    
    * Package:      premi/client/trailMap/lib/
    * Author:       Mattia Cossu
    * Date:         2015-8-22

    * Use:
    direttiva che include la vista trailMap.ng e il controller trailMapCtrl e permette 
    con il tag html trail-map di settare i frame, gli identificativi dei frame e 
    il trail a cui ci si vuole riferire per la successiva modifica del percorso di presentazione.

    
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

angular.module("premi.trailMap")
	.directive('trailMap', function(TrailFactory) {
		return {
			restrict: 'AE',
			replace: 'true',
			controller: 'trailMapCtrl',
			templateUrl: 'client/trailMap/views/trailMap.ng.html',
			link:  {
			 	pre : function(scope, elem, attrs,ctrl){
				 	scope.setTrail(attrs.trail);
				 	scope.setFrames(attrs.frames);
				 	scope.setFramesId(attrs.ids);
				 	scope.init();
			 	},
			 	post : function(scope){
			 	
			 	}
			},
		};
	});
