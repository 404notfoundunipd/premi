/** 
    * Name:         routes.js    
    * Package:      premi/client/presentationManager
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

angular.module("premi.presentationManager")
	.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
		function($urlRouterProvider, $stateProvider, $locationProvider){

			$locationProvider.html5Mode(true);

			$stateProvider
				.state('premi.presentationManager', {
					abstract: true,
					views: {
						'': {
							templateUrl: 'client/presentationManager/views/presentationManager.ng.html',
							controller: 'presentationManagerCtrl',
						},
					},
					resolve: {
						currentUser : ["$meteor", function($meteor){
					    	return $meteor.requireUser();
					    }]
					}
				})
				.state('premi.presentationManager.presentations', {
					url: '/presentations',
					views: {
						'': {
							templateUrl: 'client/presentationManager/views/presentations.ng.html',
							controller: 'presentationsCtrl',
						},
					},
					resolve: {
						'subscribe': [ "$meteor", function($meteor) {
							return $meteor.subscribe('getPresentations');
						}]
					}
				})
				.state('premi.presentationManager.newPresentation', {
					url: '/presentations/new',
					views: {
						'': {
							templateUrl: 'client/presentationManager/views/newPresentation.ng.html',
							controller: 'newPresentationCtrl',
						}
					}
				})
				.state('premi.presentationManager.editPresentation', {
					url: '/presentations/edit/:idpres',
					views: {
						'': {
							templateUrl: 'client/presentationManager/views/editPresentation.ng.html',
							controller: 'editPresentationCtrl',
						}
					},
					resolve: {
						'subscribe': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getPresentationById', $stateParams.idpres);
						}]
					}
				})
				.state('premi.presentationManager.removePresentation', {
					url: '/presentations/remove/:idpres',
					views: {
						'': {
							templateUrl: 'client/presentationManager/views/removePresentation.ng.html',
							controller: 'removePresentationCtrl',
						}
					},
					resolve: {
						'subscribe': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getPresentationById', $stateParams.idpres);
						}]
					}
				});

			/*$urlRouterProvider
				.when('/presentations', '/presentation');*/
		}
	]);