/**	
	* Name: 		order.js
	* Package: 		premi/client/presentations/lib/
	* Author: 		Gobbo Ismaele
	* Date: 		2015-06-05

	* Use:

	
	* Changes:
	Version		Date		Who 			Changes				Reason
	----------------------------------------------------------------------------
	0.5			2015-07-03	Vegro Federico	order				aggiunta possbilita'
																di scegliere l'ordine
	----------------------------------------------------------------------------
	0.4			2015-06-13	Gobbo Ismaele	insertGO			correzioni
	----------------------------------------------------------------------------
	0.3			2015-06-08	Gobbo Ismaele	swapPos				correzioni
	----------------------------------------------------------------------------
	0.2			2015-06-06	Gobbo Ismaele	shiftDx,			creati metodi privati
											swapPos,
											upgradeLvl
	----------------------------------------------------------------------------
	0.1			2015-06-05	Gobbo Ismaele	creazione della classe
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
	.factory('OrderedGOList',['Observer',
		function(Observer){
			return klass(function(){
				this.GOarray    = [];	//Array di oggetti grafici che compongono la lista ordinata
				this.orderBy    = "";	//Indica il nome dell'attributo che è stato scelto per ordinare gli oggetti grafici
				this.hashIdGO   = {};	//Oggetto Hash Javascript che contiene una lista degli id degli oggetti grafici presenti nell'array, associati alla loro posizione all'interno dell'array
				this.observer 	= Observer;	//Contiene una lista di segnali, ognuno dei quali è associato ad uno specifico oggetto grafico
				/* Sposta l'oggetto grafico presente nella posizione ricevuta nella posizione successiva dell'array
				*/
				this.shiftDx    = function(pos){
					this.GOarray[pos+1]=this.GOarray[pos];
					this.GOarray[pos] = null;
					this.hashIdGO[this.GOarray[pos+1]._id] = pos +1;
					return this;
				};
				/* Scambia di posizione un oggetto grafico. newPos rappresenta la posizione dove dev'essere spostato l'oggetto mentre oldPos la posizione
				   dove si trova l'oggetto prima di essere spostato.
				*/
				this.swapPos    = function(newPos,oldPos){
					var by = this.orderBy;
					var temp = this.GOarray[newPos];
					this.GOarray[newPos] = this.GOarray[oldPos];
					this.GOarray[oldPos] = temp;
					console.log("swap", this.GOarray[newPos],this.GOarray[oldPos])
					this.hashIdGO[this.GOarray[newPos]._id] = newPos;
					this.hashIdGO[this.GOarray[oldPos]._id] = oldPos;
					this.GOarray[newPos][by] = newPos;
					this.GOarray[oldPos][by] = oldPos;
					this.observer.emit('changeLvl',this.GOarray[newPos]._id,newPos);
					this.observer.emit('changeLvl',this.GOarray[oldPos]._id,oldPos);
					return this;
				};
				/* Incrementa il livello di visibilità dell'oggetto grafico associato al codice identificativo ricevuto
				*/
				this.upgradeLvl = function(idGO){
					var by = this.orderBy;
					var index = this.hashIdGO[idGO];
					var temp;
					console.log("index",this.GOarray[index][by])
					while(index < this.GOarray.length -1 && this.GOarray[index][by] > this.GOarray[index +1][by]){
						this.swapPos(index,index+1);
						index++;
					}
					return this;
				};
				/* Decrementa il livello di visibilità dell'oggetto grafico associato al codice identificativo ricevuto
				*/
				this.reduceLvl = function(idGO){
					var index = this.hashIdGO[idGO];
					var temp;
					var by = this.orderBy;
					while(index > 0 && this.GOarray[index-1][by] > this.GOarray[index][by]){
						this.swapPos(index,index-1);
						index--;
					}
					return this;
				};
			})
			.methods({
				setOrderBy : function(by){
					this.orderBy = by;
					return this;
				},
				setObserver : function(concreteObserver){
					this.observer = concreteObserver;
				},
				getOrderBy : function(){
					return this.orderBy;
				},
				getList    : function(){
					return this.GOarray;
				},

				insertGO   : function(GO){
					var by = this.orderBy;
					if(GO.hasOwnProperty(by)){
						var index = this.GOarray.length;
						var found = false;
						while( index > 0 && !found){
							if(this.GOarray[index-1][by] > GO[by]){
								this.shiftDx(index-1);
								index--;
							}
							else{
								found = true;
							}
						}
						this.GOarray[index] = GO;
						this.hashIdGO[GO._id] = index;
					}
					else{
						console.error("Try to insert a object that not has property "+by)
						console.error("Object ",GO," require ",by)
					}
					return this;
				},
				insertGOAndSetLvl : function(GO){
					var by = this.orderBy;
					this.observer.emit('changeLvl',GO._id,this.GOarray.length);
					GO[by] = this.GOarray.length;
					this.GOarray[this.GOarray.length] = GO;
					this.hashIdGO[GO._id] = this.GOarray.length-1;
				},
				removeGO    : function(idGO){
					var by = this.orderBy;
					console.log("da rimuover",idGO)
					if(this.hashIdGO.hasOwnProperty(idGO)){
						this.GOarray.splice(this.hashIdGO[idGO],1);
						for(var i = this.hashIdGO[idGO]; i < this.GOarray.length; i++){
							this.hashIdGO[this.GOarray[i]._id] = i;
							this.GOarray[i][by] = i;
							this.observer.emit('changeLvl',this.GOarray[i]._id,i);
						}
					}
					return this;
				},
				/* Incrementa di posizione un oggetto grafico nella lista
				*/
				upgradeGO : function(idGO){
					if(this.hashIdGO.hasOwnProperty(idGO)){
						if(this.hashIdGO[idGO]<this.GOarray.length-1){
							this.swapPos(this.hashIdGO[idGO],this.hashIdGO[idGO]+1);
						}
					}
				},
				/* Decrementa di posizione un oggetto grafico nella lista
				*/
				downgradeGO: function(idGO){
					if(this.hashIdGO.hasOwnProperty(idGO)){
						if(this.hashIdGO[idGO]>0){
							this.swapPos(this.hashIdGO[idGO],this.hashIdGO[idGO]-1);
						}
					}
				},
				initializeList : function(){
					this.GOarray = [];
					this.hashIdGO = {};
					return this;
				},
			});
		}])
		.factory('OrderedGOListFactory',['OrderedGOList',
			function(OrderedGOList){
				return new OrderedGOList;
		}]);
