angular.module('premi')
	.factory('signalsCtrl',[
		function(){
			var isSetSignals = {		//Oggetto JSON che indica per ogni campo che contiene se è presente almeno un Signal
				infographic : false,
				trails 		: false,
				viewer 		: false,
			};
			var slots = {			//Oggetto JSON che indica per ogni campo che contiene se è stato creato un certo slots
				infographic : false,
				trails 		: false,
				viewer 		: false,
			};
			var signals = {			//Oggetto JSON che indica per ogni campo quali sono i signal presenti
				infographic : [],
				trails 		: [],
				viewer 		: [],
			};
			return {
				initSignal : function(what,elem,eve,func){
					isSetSignals[what] = true;
					signals[what].push({
						_element	: elem,
						_event		: eve,
						_function 	: func,
					});
					elem.addEventListener(eve,func);
					return this;
				},
				deleteSignal : function(what,eve){
					var temp = signals[what];
					for(var i = 0; i < temp.length; i++){
						if(temp[i]._event == eve){
							var ele = temp[i]._element,
								eve = temp[i]._event
								func = temp[i]._function;	
							ele.removeEventListener(eve,func);
						}
					}
					return this;
				},
				removeAllSignalsOf : function(what){
					var temp = signals[what];
					for(var i = 0; i < temp.length; i++){	
						var ele = temp[i]._element,
							eve = temp[i]._event
							func = temp[i]._function;					
						ele.removeEventListener(eve,func);
					}
					isSetSignals[what] = false;
					return this;
				},
				removeAllSignals : function(){
					this.removeAllSignalsOf('infographic');
					this.removeAllSignalsOf('trails');
					this.removeAllSignalsOf('viewer');
					return this;
				},
				isSignalInited : function(what){
					return isSetSignals[what];
				},
				initSlot : function(what){
					slots[what] = true;
					return this;
				},
				isSlotInited : function(what){
					return slots[what];
				},
				initSlot : function(what){
					slots[what] = true;
					return this;
				},
			};

		}]);
