/** 
    * Name:         graphicObject.js    
    * Package:      premi/client/editor/lib/
    * Author:       Gobbo Ismaele
    * Date:         2015-6-4

    * Use:
    GObject e' una classe astratta che rappresenta un oggetto generico della presen-
    tazione. Contiene i metodi generali che caratterizzano ciascun oggetto grafico
    che può essere inserito in una presentazione.

    
    * Changes:
    Version     Date        Who             Changes             Reason
    0.3         2015-6-12   Cossu Mattia    scale, lvl          aggiunti attributi e
                                                                metodi associati
    ----------------------------------------------------------------------------
    0.2         2015-6-5    Gobbo Ismaele   aggiunt metodi 
    ----------------------------------------------------------------------------
    0.1         2015-6-4    Gobbo Ismaele   Stesura iniziale
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
	.factory('GObject', [
		function() {
            return klass(function () {
                this.info = {
                    _id : "",
                    dataX   : 0,
                    dataY   : 0,
                    dataZ   : 0,
                    height  : 100,
                    width   : 100,
                    scale   : 1,
                    lvl     : 0,
                };
            })        
            .methods({
                set : function(field,value){
                    if(field == 'id'){
                        this.info._id = value;
                    }
                    if(this.info.hasOwnProperty(field)){
                        this.info[field] = value;
                    }
                    return this;
                },
                get : function(field){
                    if(field == 'id'){
                        return this.info._id;
                    }
                    return this.info[field];
                },
                /* update permette di aggiornare i campi dell'attributo info.
                   l'attributo update è un oggetto JSON con chiave e valore congrui all'oggetto info.
                */
                update : function(update){
                    for(var key in update){
                        if(this.info.hasOwnProperty(key)){
                            this.info[key] = update[key];
                        }
                        else{
                            delete update[key];
                        }
                    }
                    return this;
                },
                //@params:
                //  -JSON : JSON object each camps in this.info will be initzialized with the respective in JSON
                //@return: 
                initByJSON : function(JSONiniter){
                    this.info = JSONiniter;
                    return this;
                },
                initByDefault : function(){
                    this.info = {
                        _id : "",
                        dataX   : 0,
                        dataY   : 0,
                        dataZ   : 0,
                        height  : 100,
                        width   : 100,
                        scale   : 1,
                        lvl     : 0,
                    };
                    return this;
                },
                getJSON : function(){
                    return this.info;
                },
                /*
                    resize permette di aggiornare i campi width e height che rappresentano il valore della larghezza e dell'altezza
                    dell'oggetto in una vista.
                */
                resize : function(height,width){
                    if(height && width){
                        this.info.height = height;
                        this.info.width = width;
                    }
                    return this;
                },
                /*
                    drag permette di aggiornare i campi dataX e dataY che rappresentano il valore della posizione dell'oggetto
                    nell'asse delle x e nell'asse delle y in una vista.
                */
                drag : function(deltaX,deltaY){
                    if(deltaX && deltaY){
                        this.info.dataX = deltaX;
                        this.info.dataY = deltaY;
                    }
                    return this;
                },
                setId : function(id){
                    this.info._id = id;
                    return this;
                },
                getId : function(){
                    return this.info._id;
                },

		    });
	}]);
