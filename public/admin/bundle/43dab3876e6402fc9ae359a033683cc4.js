ace.define("ace/ext/statusbar",["require","exports","module","ace/lib/dom","ace/lib/lang"],function(e,t,n){"use strict";var a=e("../lib/dom");var i=e("../lib/lang");var o=function e(t,n){this.element=a.createElement("div");this.element.className="ace_status-indicator";this.element.style.cssText="display: inline-block;";n.appendChild(this.element);var o=i.delayedCall((function(){this.updateStatus(t)}).bind(this)).schedule.bind(null,100);t.on("changeStatus",o);t.on("changeSelection",o);t.on("keyboardActivity",o)};(function(){this.updateStatus=function(e){var t=[];function n(e,n){e&&t.push(e,n||"|")}n(e.keyBinding.getStatusText(e));if(e.commands.recording)n("REC");var a=e.selection;var i=a.lead;if(!a.isEmpty()){var o=e.getSelectionRange();n("("+(o.end.row-o.start.row)+":"+(o.end.column-o.start.column)+")"," ")}n(i.row+":"+i.column," ");if(a.rangeCount)n("["+a.rangeCount+"]"," ");t.pop();this.element.textContent=t.join("")}}).call(o.prototype);t.StatusBar=o});(function(){ace.require(["ace/ext/statusbar"],function(e){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=e}})})();