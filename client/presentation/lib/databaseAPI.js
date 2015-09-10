/** 
    * Name:         databaseAPI.js
    * Package:      premi/client/presentation/lib/
    * Author:       Cossu Mattia
    * Date:         2015-06-07

    * Use:
    Lista di metodi che permettono al client di interagire con il database del server.
    
    * Changes:
    Version     Date        Who             	Changes                 Reason
    ----------------------------------------------------------------------------
    0.4         2015-06-27  Cossu Mattia    	metodi Trail            incremento
    ----------------------------------------------------------------------------
    0.3         2015-06-15  De Lazzari Enrico  	metodi dei Trail     	aggiunti metodi dei trail
    ----------------------------------------------------------------------------
    0.2         2015-06-14  Cossu Mattia    	removeSimpleGOContent	cambiati i parametri
    ----------------------------------------------------------------------------
    0.1         2015-06-07  Cossu Mattia    	Creazione primi metodi
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
	.factory('databaseAPI',['$meteor',
		function($meteor){
			return {
				/* Permette l'inserimento di una nuova presentazione all'interno del database
				*/
				insertNewPresentation : function(title,description,callbackFunc){
					$meteor.call('insertPresentation',title,description).then(function (newPresId){
						if(typeof callbackFunc === 'function'){
							callbackFunc(newPresId);
						}
					})
				},
				updatePresentation : function(id,title,description){
					$meteor.call('editPresentation',id,title,description);
				},
				publicPresentation : function(id,public_){
					$meteor.call('publicPresentation',id,public_);
				},
				/* Permette la rimozione di una presentazione dell'utente dal database
				*/
				removePresentation : function(id,callback){
					$meteor.call('removePresentation',id)
						.then(function () {
							callback();
						});
				},
				insertTrail : function(title,presid,callbackFunc){
					$meteor.call('insertTrail',title,presid)
						.then(function (newTrail){
							callbackFunc(newTrail);
						});
				},
				updateTrail : function(idTrail,update){
					$meteor.call('updateTrail',idTrail,update);
				},
				updateTrailTitle : function(idTrail,title){
					$meteor.call('editTrailById',idTrail,title);
				},
				removeTrail : function(idTrail){
					$meteor.call('removeTrailById',idTrail);
				},
				insertFrame : function(presid,callbackFunc){
					$meteor.call('insertFrameByIdPres',presid)
						.then(function (newFrameId){
							callbackFunc(newFrameId);
						})
				},
				updateFrame : function(idGO,update){
					$meteor.call('editFrameById',idGO,update);
				},
				removeFrame : function(idFrame,callback,idInf){
					if(idInf){
						$meteor.call('removeFrameInfographic',idFrame,idInf);
					}
					else{
						$meteor.call('removeFrameById',idFrame).then(function(id){
							callback(id);
						});
						
					}
				},
				updateInfographic : function(idInf,update){
					$meteor.call('updateInfographicById',idInf,update);
				},
				insertSimpleGOContent : function(GO,idContainer,containerType){
					if(containerType == "frame"){
						$meteor.call('insertGOContentFrame',GO,idContainer);
					}
					else if(containerType == "infographic"){
						$meteor.call('insertGOContentInfographic',GO,idContainer);
					}
				},
				/* Aggiorna un oggetto grafico con gli attributi modificati dall'utente. update contiene l'oggetto JSON
				   con le modifiche da apportare.
				*/
				updateSimpleGOContent : function(idGO,update,idContainer,containerType){
					if(containerType == "frame"){
						$meteor.call('updateGOContentFrame',idGO,update,idContainer);
					}
					else if(containerType == "infographic"){
						$meteor.call('updateGOContentInfographic',idGO,update,idContainer);
					}
				},
				removeSimpleGOContent : function(idGO,idContainer,containerType){
					if(containerType == "frame"){
						console.log("qui entra")
						$meteor.call('removeGOContentFrame',idGO,idContainer);
					}
					else if(containerType == "infographic"){
						$meteor.call('removeGOContentInfographic',idGO,idContainer);
					}
				},
				/* inserisce un frame all'interno di un'infografica
				*/
				insertFrameInfographic : function(Frame,idInf){
					console.log('infid',idInf)
					$meteor.call('insertFrameInfographic',Frame._id,idInf);
				},
				removeFrameInfographic : function(Frame,idInf){
					$meteor.call('removeFrameInfographic',Frame,idInf);
				},
				checkUsername : function (username, callback) {
					$meteor.call('checkUsername', username).then(
						function(response) {callback(response);}
					);
				},

			}
		}]);
