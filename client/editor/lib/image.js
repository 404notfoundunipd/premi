/** 
    * Name:         image.js    
    * Package:      premi/client/editor/lib/
    * Author:       Gobbo Ismaele
    * Date:         2015-6-6

    * Use:
    Rappresenta un oggetto immagine. Contiene i metodi per gestire
    un immagine.

    
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
	.factory('Image', ['GObject',
		function(GObject) {
			var defaultImage = {
                src : "ffff",
            };
            return GObject.extend(function () {
                this.info = {
                    src : "",
                    type : 'image'
                }
            })
            .methods({
                set : function(field,value){
                    this.supr(field,value);
                    return this;
                },
                update : function(update){
                    this.supr(update);
                    return this;
                },
                initByJSON : function(imageJSON){
                    this.info = this.supr(imageJSON).getJSON();                    
                    return this;
                },
                initByDefault : function(){
                    this.info = this.supr().getJSON();
                    this.info.src = defaultImage.src || "ffff";
                    this.info.type = 'image';
                    return this;
                },
                setImage : function(src){
                    this.info.src = src;
                    return this;
                },
                getImage : function(){
                    return this.info.src;
                },
                getType : function(){
                    return 'image';
                },
            });
        }
	])
    .factory('ImageFactory', ['Image',
        function(image) {
            return new image;
        }]);