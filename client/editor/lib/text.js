/** 
    * Name:         text.js    
    * Package:      premi/client/editor/lib/
    * Author:       Gobbo Ismaele
    * Date:         2015-6-6

    * Use:
    Rappresenta un oggetto text. Contiene i metodi per gestire uno
    text.
    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.2         2015-6-7    Gobbo Ismaele   aggiunti metodi init, initbyJSON, getJSON
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
	.factory('Text', ['GObject',
		function(GObject) {
			var defaultText = {
                text : "",
            }
            return GObject.extend(function () {
                this.info = {
                    text : "",
                    type : "text",
                    color : "#ffffff",
                    weight : "",
                    fontStyle : "",
                    fontFamily : "",
                    textDecoration : "",
                    sizeFontText : "20"
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
                    if(update.hasOwnProperty('text')){
                        this.info.text = update['text'];
                    }
                    return this;
                },
                getJSON : function(){
                    return this.info;
                },
                initByJSON : function(textJSON){
                    this.supr(textJSON);
                    this.info = textJSON;
                    return this;
                },
                initByDefault : function(){
                    this.info = this.supr().getJSON();
                    this.info.text = "text";
                    this.info.type = 'text';
                    this.info.color = '#000000';
                    this.info.weight = '';
                    this.info.fontStyle = '';
                    this.info.textDecoration = '';
                    this.info.sizeFontText = '20';
                    this.info.fontFamily = 'Arial';
                    return this;
                },
                setText : function(text){
                    this.info.text = text;
                    return this;
                },
                getText : function(){
                    return this.info.text;
                }, 
                getType : function(){
                    return 'text';
                },     
            });
        }
	])
    .factory('TextFactory', ['Text',
        function(text) {
            return new text;
        }]);