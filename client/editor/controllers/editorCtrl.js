/** 
    * Name:         editorCtrl.js    
    * Package:      premi/client/editor/controllers/
    * Author:       Cossu Mattia
    * Date:         2015-6-8

    * Use:
    Controller che funge da scheletro per gli altri controller dell'editor.
    Non sono per ora previste funzionalità in questa parte di applicazione.

    
    * Changes:
    Version     Date        Who             Changes             Reason
     ----------------------------------------------------------------------------
    0.1         2015-6-10   Cossu Mattia  creazione del controller
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
	.controller("editorCtrl", [
		function(){
			$('main').css('padding-left','64px');
		}]);