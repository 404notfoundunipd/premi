/** 
    * Name:         shape.js    
    * Package:      premi/client/editor/lib/
    * Author:       Gobbo Ismaele
    * Date:         2015-6-6

    * Use:
    Rappresenta un oggetto shape. Contiene i metodi per gestire
    uno shape.
    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.2         2015-6-7    Gobbo Ismaele   aggiunti metodi init, initbyJSON
    ----------------------------------------------------------------------------
    0.1         2015-6-6    Gobbo Ismaele   Stesura iniziale
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
	.factory('Shape', ['GObject',
		function(GObject) {
			var defaultShape = {
                src : "",
            };
            return GObject.extend(function () {
                this.info = {
                    src : "",
                    content : "",
                    color : "black",
                    stroke : "black",
                    strokeWidth : 2,
                    path : "",
                    y: "",
                    viewBox : "",
                    style : "",
                    zoom : 100,
                    sWidth : 0,
                    sHeight : 0,
                    type : 'shape',

                }
            })
            .methods({
                get : function(field){
                    return this.supr(field) || this.info[field];
                },
                set : function(field,value){
                    if(this.info.hasOwnProperty(field)){
                        this.info[field] = value;
                    }
                    else{
                        this.supr(field,value);
                    }
                    return this;
                },
                update : function(update){
                    this.supr(update);
                    if(update.hasOwnProperty('src')){
                        this.info.src = update['src'];
                    }
                    return this;
                },
                getJSON : function(){
                    return this.info;
                },
                initByJSON : function(shapeJSON){
                    this.supr(shapeJSON);
                    this.info = shapeJSON;
                    return this;
                },
                initByDefault : function(){
                    this.info             = this.supr().getJSON();
                    this.info.content     = "";
                    this.info.color        = "black";
                    this.info.stroke      = "black";
                    this.info.strokeWidth = 2;
                    this.info.src         = defaultShape.src || "";
                    this.info.path        = "";
                    this.info.viewBox     = "0 0 48 48";
                    this.info.style       = "";
                    this.info.zoom        = 100;
                    this.info.sWidth      = 0;
                    this.info.sHeight     = 0;
                    this.info.type        = 'shape';
                    return this;
                },
                setShape : function(src){
                    this.info.src = src;
                    return this;
                },
                getShape : function(){
                    return this.info.src;
                },
                getType : function(){
                    return 'shape';
                },
            
            });
        }
	])
    .factory('ShapeFactory', ['Shape',
        function(shape) {
            return new shape;
        }]);