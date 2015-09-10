/** 
    * Name:         routes.js    
    * Package:      premi/client/infographicEditor
    * Author:       De Lazzari Enrico
    * Date:         2015-6-4

    * Use:
    I file routes.js utilizzano $rootScope, $state e $stateProvider per la configurazione
    degli stati, o posizioni, che l'utente può percorrere all'interno dell'applicazione.
    View e controller devono essere uniti tra loro, e le informazioni di cui hanno bisogno
    devono essere precaricate dal database e associate allo stato tramite $meteor.subscribe
    
    * Changes:
    Version     Date        Who             	Changes             Reason
    ----------------------------------------------------------------------------
    0.1         2015-6-4    De Lazzari Enrico   stesura iniziale
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

angular.module("premi.editor.infographicEditor")
	.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
		function($urlRouterProvider, $stateProvider, $locationProvider){

			$locationProvider.html5Mode(true);

			$stateProvider
				.state('premi.editor.infographic', {
					url: '/editor/:idpres/infographic',
					views: {
						'' : {
							templateUrl: 'client/infographicEditor/views/infographic.ng.html',
							controller: 'infographicEditorCtrl',
						},
						'frameList@premi.editor.infographic': {
							templateUrl: 'client/infographicEditor/views/frameList.ng.html',
						}
					},
					resolve: {
						'subscribe1' : [ "$meteor","$stateParams", function($meteor,$stateParams) {
							return $meteor.subscribe('getFramesByPresId',$stateParams.idpres);
						}],
						'subscribe2' : ["$meteor","$stateParams", function($meteor,$stateParams){
							return $meteor.subscribe('getInfographicByPresId',$stateParams.idpres);
						}]
					},
				});

			/*$urlRouterProvider
			//	.when('/', '/home')
				.when('/editor', '/editor/frame');
			//	.otherwise('home');*/
		}
	]);