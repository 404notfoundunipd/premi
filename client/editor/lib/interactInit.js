/**	
	* Name: 		interactInit.js
	* Package: 		premi/client/editor/lib/
	* Author: 		Cossu Mattia
	* Date: 		2015-06-19

	* Use:
	classe che contiene i metodi per la gestione del ridimensionamento e dello spo-
	stamento degli oggetti.
	
	* Changes:
	Version		Date		Who 				Changes				Reason
	----------------------------------------------------------------------------
	0.5			2015-06-30	De Lazzari Enrico	initializeGO		correzione errore 
	----------------------------------------------------------------------------
	0.4			2015-06-25	De Lazzari Enrico	initializeGO		aggiunto wrapper
	----------------------------------------------------------------------------
	0.3			2015-06-23	Cossu mattia		aggiunto Observer
	----------------------------------------------------------------------------
	0.2			2015-06-20	Cossu mattia		incremento metodi
	----------------------------------------------------------------------------
	0.1			2015-06-19	Cossu mattia		inizio classe
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
	.factory('InteractInitF',['interact', 'Observer',
		function(interact,Observer){
			return klass(function(){
					this.observer = null;
					this.restrictArea = null;
					/* metodo che inizializza un oggetto impostando i comportamenti che deve avere quando viene effettuato il
					   drag & drop in un template grafico da parte dell'utente. All'evento onstart che corrisponde al momento 
					   in cui l'oggetto viene selezionato viene emesso un segnale 'select' dall'observer, mentre all'evento onmove
					   viene emesso un segnale 'drag' con i valori dello spostamento.
					*/
					this.initializeGO = function(idwrappergo){
						interact('#'+idwrappergo).unset();
						var obs = this.observer,
							restr = this.restrictArea;
				    	interact('#'+idwrappergo)
				            .draggable({
				                inertia: true,
				                restrict: {
				                	//restriction : '#'+restr,
				                    endOnly: false,
				                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				                },
				                onstart : function(event){
				                	obs.emit('select',idwrappergo);
				                },
				                onmove: function(event){
				                	obs.emit('drag',{
				                		dataX : (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx, 
				                		dataY : (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy,
				                	});
				                },
				            	//onend : endDrag,
				            });
				    };
				})
				.methods({
					setObserver : function(conObserver){
						this.observer = conObserver;
						return this;
					},
					setRestrictArea  : function(area){
						this.restrictArea = area;
						return this;
					},
					initializeText : function(idwrappergo) {
						this.initializeGO(idwrappergo);
						return this;
					},
					/* inizializza un determinato oggetto di tipo shape impostando il comportamento per lo spostamento e ridimensionamento 
					   dell'oggetto. Richiama il metodo per definire il comportamento per il drag & drop dell'oggetto e definisce anche quello per
					   resize dell'oggetto in un template grafico da parte dell'utente. Per quest ultimo imposta che all'evento onstart che corrisponde al momento 
					   in cui l'oggetto viene selezionato viene emesso un segnale 'select' dall'observer, mentre all'evento onmove
					   viene emesso un segnale 'resize' con i nuovi valori dell'altezza e della grandezza. 
					*/
					initializeShape : function(idwrappergo) {
						this.initializeGO(idwrappergo,ondrag);
						var obs = this.observer,
							restr = this.restrictArea;
						interact('#'+idwrappergo).resizable({
					    	restrict: {
				                	//restriction : '#'+restr,
				                    endOnly: false,
				                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				            },
					    	onstart : function(event){
				                obs.emit('select',idwrappergo);
				            },
							onmove : function(event){
								obs.emit('resize',{
									dataX : (parseFloat(event.target.getAttribute('data-x')) || 0) + event.deltaRect.left,
									dataY : (parseFloat(event.target.getAttribute('data-y')) || 0) + event.deltaRect.top,
									height : event.rect.height,
									width : event.rect.width,
								});
							},
							edges : { left: true, right: true, bottom: true, top: true }
						});
						return this;
	    			},
					initializeFrame : function(idwrappergo){
						this.initializeGO(idwrappergo);
						/*var obs = this.observer,
							restr = this.restrictArea;
						interact('#'+idwrappergo).resizable({
					    	restrict: {
				                	restriction : '#'+restr,
				                    endOnly: false,
				                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				            },
					    	onstart : function(event){
				                obs.emit('select',idwrappergo);
				            },
							onmove : function(event){
								obs.emit('resize',{
									dataX : (parseFloat(event.target.getAttribute('data-x')) || 0) + event.deltaRect.left,
									dataY : (parseFloat(event.target.getAttribute('data-y')) || 0) + event.deltaRect.top,
									height : event.rect.height,
									width : event.rect.width,
								});
							},
							edges : { left: true, right: true, bottom: true, top: true }
						});*/
	     				return this;
					},
					/* inizializza un determinato oggetto di tipo image impostando il comportamento per lo spostamento e ridimensionamento 
					   dell'oggetto. Richiama il metodo per definire il comportamento per il drag & drop dell'oggetto e definisce anche quello per
					   resize dell'oggetto in un template grafico da parte dell'utente. Per quest ultimo imposta che all'evento onstart che corrisponde al momento 
					   in cui l'oggetto viene selezionato viene emesso un segnale 'select' dall'observer, mentre all'evento onmove
					   viene emesso un segnale 'resize' con i nuovi valori dell'altezza e della grandezza. 
					*/
					initializeImage : function(idwrappergo) {
						this.initializeGO(idwrappergo,ondrag);
						var obs = this.observer,
							restr = this.restrictArea;
					    interact('#'+idwrappergo).resizable({
					    	restrict: {
				                	//restriction : '#'+restr,
				                    endOnly: false,
				                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				            },
					    	onstart : function(event){
				                obs.emit('select',idwrappergo);
				            },
							onmove : function(event){
								obs.emit('resize',{
									dataX : (parseFloat(event.target.getAttribute('data-x')) || 0) + event.deltaRect.left,
									dataY : (parseFloat(event.target.getAttribute('data-y')) || 0) + event.deltaRect.top,
									height : event.rect.height,
									width : event.rect.width,
								});
							},
							edges : { left: true, right: true, bottom: true, top: true }
						});
						return this;
	    			},
	    			initializeInf : function(id){
	    				var obs = this.observer,
							restr = this.restrictArea;
	    				interact("#"+id).draggable({
	    					onstart : function(){
	    						obs.emit('dragInfStart');
	    					},
	    					onmove : function(event){	    						
								obs.emit('dragInf',{
									dataX : (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx,
									dataY : (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy,
								});
							},
							onend : function(){
								obs.emit('dragInfEnd');
							}
	    				});
	    			},
	    			unSet : function(idwrappergo){	    				
	    				interact("#"+idwrappergo).unset();
	    			},
				});
			}])
			.factory('InteractInit',['InteractInitF',
				function(InteractInitF){
					return new InteractInitF;
			}]);
