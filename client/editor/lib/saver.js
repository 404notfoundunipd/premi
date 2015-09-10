/** 
    * Name:        saver.js
    * Package:     premi/client/editor/lib/
    * Author:      Cossu Mattia
    * Date:        2015-06-18

    * Use:
    rappresenta un oggetto che permette ad un contenitore di oggetti di interfacciarsi
    con il database ed effettuare le modifiche. L’oggetto saver riceve dal contenitore
    una serie di operazioni da eseguire sul database e le esegue rispettando i suoi
    tempi di risposta.

    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.4			2015-06-23	Cossu Mattia	save				correzioni algoritmo
    ----------------------------------------------------------------------------
    0.3			2015-06-23	Cossu Mattia	save, update		incremento metodi
    ----------------------------------------------------------------------------
    0.2			2015-06-19	Cossu Mattia	incremento classe
    ----------------------------------------------------------------------------
    0.1			2015-06-18	Cossu Mattia	inizio scrittura classe
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

angular.module('premi.editor')
	.factory('Saver',[ 'databaseAPI',
		function(databaseAPI){
			return klass(function(){
				this.containerId     = "";
				this.containerType   = "";
				this.updates         = {
					image       : {},	//oggetto JSON che contiene le modifiche sugli oggetti image
					shape       : {},	//oggetto JSON che contiene le modifiche sugli oggetti shape
					text        : {},	//oggetto JSON che contiene le modifiche sugli oggetti text
					frame       : {},	//oggetto JSON che contiene le modifiche sugli oggetti frame
					infographic : {},	//oggetto JSON che contiene le modifiche sugli oggetti infographic
				};
				this.saveFunctions   = {
					image       : databaseAPI.updateSimpleGOContent,	//contiene la funzione che si occupa di salvare le image
					shape       : databaseAPI.updateSimpleGOContent,	//contiene la funzione che si occupa di salvare le shape
					text        : databaseAPI.updateSimpleGOContent,	//contiene la funzione che si occupa di salvare le text
					frame       : databaseAPI.updateFrame,			//contiene la funzione che si occupa di salvare le frame
					infographic : databaseAPI.updateInfographic,		//contiene la funzione che si occupa di salvare le infographic
				};
				this.removed         = {
					image       : [],	//oggetto JSON che contiene le operazioni di rimozione degli oggetti image
					shape       : [],	//oggetto JSON che contiene le operazioni di rimozione degli oggetti shape
					text        : [],	//oggetto JSON che contiene le operazioni di rimozione degli oggetti text
					frame       : [],	//oggetto JSON che contiene le operazioni di rimozione degli oggetti frame
				};
				this.removeFunctions = {
					image       : databaseAPI.removeSimpleGOContent,	//contiene la funzione che si occupa di rimuovere le image
					shape       : databaseAPI.removeSimpleGOContent,	//contiene la funzione che si occupa di rimuovere le shape
					text        : databaseAPI.removeSimpleGOContent,	//contiene la funzione che si occupa di rimuovere le text
					frame 		: databaseAPI.removeFrameInfographic,	//contiene la funzione che si occupa di rimuovere le frame
				};
				this.inserted		 = {
					image       : [],	//oggetto JSON che contiene le operazioni di inserimento degli oggetti image
					shape       : [],	//oggetto JSON che contiene le operazioni di inserimento degli oggetti shape
					text        : [],	//oggetto JSON che contiene le operazioni di inserimento degli oggetti text
					frame       : [],	//oggetto JSON che contiene le operazioni di inserimento degli oggetti frame
				};
				this.insertFunctions = {
					image       : databaseAPI.insertSimpleGOContent,	//contiene la funzione che si occupa di inserire le image
					shape       : databaseAPI.insertSimpleGOContent,	//contiene la funzione che si occupa di inserire le shape
					text        : databaseAPI.insertSimpleGOContent,	//contiene la funzione che si occupa di inserire le text
					frame       : databaseAPI.insertFrameInfographic,	//contiene la funzione che si occupa di inserire le frame
				};
			}).methods({
				setContainer : function(id,type){
					this.containerId   = id;
					this.containerType = type;
					return this;
				},
				insert		 : function(GOJSON){
					if(this.inserted.hasOwnProperty(GOJSON.type)){
						this.inserted[GOJSON.type].push(GOJSON);
					}
					return this;
				},
				/* inserisce un operazione di modifica, nel campo updates. Restituisce un riferimento dell'oggetto Saver. update contiene 
				   l'oggetto JSON con chiave e valore delle modifiche da apportare
				*/
				update       : function(idGO,type,update){
					if(this.updates.hasOwnProperty(type)){
						if(!this.updates[type].hasOwnProperty(idGO)){
							this.updates[type][idGO] = {};
						}
						for(var key in update){
							this.updates[type][idGO][key] = update[key];							
						}
					}
					return this;
				},
				remove	     : function(idGO,type){					
					if(this.updates.hasOwnProperty(type)){
						if(this.updates[type].hasOwnProperty(idGO)){
							delete this.updates[type][idGO];
						}
					}
					if(this.removed.hasOwnProperty(type)){
						this.removed[type].push(idGO);						
					}
					return this;
				},
				/* esegue le operazioni pendenti di inserimento, modifica e rimozione sul database. 
				   Restituisce un riferimento dell'oggetto Saver.
				*/
				save         : function(){					
					for(var key in this.removed){
						
						for(var i = this.removed[key].length -1; i >= 0; i--){							
							this.removeFunctions[key](this.removed[key][i],this.containerId,this.containerType);
							this.removed[key].pop();
						}
					}
					for(var key in this.inserted){
						for (var i = this.inserted[key].length - 1; i >= 0; i--) {
							this.insertFunctions[key](angular.fromJson(angular.toJson(this.inserted[key][i])),this.containerId,this.containerType);
							this.inserted[key].pop();
						};
					}
					for(var key in this.updates){
						for(var idGO in this.updates[key]){							
							this.saveFunctions[key](idGO,this.updates[key][idGO],this.containerId,this.containerType);
							delete this.updates[key][idGO];
						}
					}
					
					return this;
				},
				init : function(){
					for(var key in this.removed){
						this.removed[key] = [];
					}

					for(var key in this.inserted){
						this.inserted[key] = [];
					}

					for(var key in this.updates){
						this.updates[key] = {};
					}
					
					return this;
				},
				
			});
		}])
		.factory('SaverFactory',['Saver',
			function(Saver){
				return new Saver;
			}]);
