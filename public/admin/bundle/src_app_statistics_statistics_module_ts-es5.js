!function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function n(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}(self.webpackChunkshk_app=self.webpackChunkshk_app||[]).push([["src_app_statistics_statistics_module_ts"],{75590:function(e,a,i){i.r(a),i.d(a,{StatisticsModule:function(){return S}});var r,s=i(38583),o=i(16964),c=i(5727),u=i(91841),h=i(25917),g=i(5304),l=i(37716),d=((r=function(){function e(n){t(this,e),this.http=n,this.headers=new u.WM({"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}),this.requestUrl="/admin/statistics",this.chartLineOptions={responsive:!0,maintainAspectRatio:!1}}return n(e,[{key:"setRequestUrl",value:function(t){this.requestUrl=t}},{key:"getRequestUrl",value:function(){return this.requestUrl}},{key:"getParams",value:function(t){var e=new u.LE;for(var n in t)!t.hasOwnProperty(n)||void 0===t[n]||(e=e.append(n,t[n]));return e}},{key:"getStatisticsOrders",value:function(t,e){var n=this.getParams(e),a=this.getRequestUrl()+"/orders";return this.http.get(a,{params:n,headers:this.headers}).pipe((0,g.K)(this.handleError()))}},{key:"handleError",value:function(){var t=arguments.length>1?arguments[1]:void 0;return function(e){if(e.error)throw e.error;return(0,h.of)(t)}}}]),e}()).\u0275fac=function(t){return new(t||r)(l.LFG(u.eN))},r.\u0275prov=l.Yz7({token:r,factory:r.\u0275fac}),r),f=i(73844),p=i(83667),v=i(3679),y=i(95047),m=i(64654),D=i(29790),k=[{path:"",component:function(){var e=function(){function e(n,a){t(this,e),this.dataService=n,this.appSettings=a,this.type="year",this.loading=!1,this.dateFormat="dd.mm.yy",this.firstDayOfWeek=0,this.rangeDates=[new Date,new Date],this.rangeDates[0].setMonth(this.rangeDates[1].getMonth()-1),this.locale=this.appSettings.settings.locale,this.yearRangeString=[this.rangeDates[1].getFullYear()-5,this.rangeDates[1].getFullYear()].join(":"),"en"!==this.locale&&(this.firstDayOfWeek=1)}return n(e,[{key:"ngOnInit",value:function(){this.getData()}},{key:"getData",value:function(){var t=this;!this.rangeDates[0]||!this.rangeDates[1]||(this.loading=!0,this.dataService.getStatisticsOrders(this.type,{dateFrom:this.getDateString(this.rangeDates[0]),dateTo:this.getDateString(this.rangeDates[1])}).subscribe(function(e){t.data=e,t.loading=!1},function(e){t.loading=!1}))}},{key:"getDateString",value:function(t){var e=String(t.getFullYear());return e+="-"+("0"+(t.getMonth()+1)).slice(-2),e+="-"+("0"+t.getDate()).slice(-2)}}]),e}();return e.title="STATISTICS",e.\u0275fac=function(t){return new(t||e)(l.Y36(d),l.Y36(f.d))},e.\u0275cmp=l.Xpm({type:e,selectors:[["app-statistics"]],features:[l._Bn([d])],decls:17,vars:19,consts:[[1,"card"],[1,"card-body"],[1,"icon-bar-graph-2"],[1,"min-height400"],[1,"d-inline-block","me-2"],[3,"ngModel","selectionMode","showIcon","monthNavigator","yearNavigator","yearRange","dateFormat","firstDayOfWeek","ngModelChange","onSelect"],["type","button",1,"btn","btn-secondary","ms-md-2",3,"ngbTooltip","click"],[1,"icon-reload"],["type","line",3,"data","height","responsive"]],template:function(t,e){1&t&&(l.TgZ(0,"div",0),l.TgZ(1,"div",1),l.TgZ(2,"h3"),l._UZ(3,"i",2),l._uU(4),l.ALo(5,"translate"),l.qZA(),l._UZ(6,"hr"),l.TgZ(7,"div",3),l.TgZ(8,"div"),l.TgZ(9,"div",4),l.TgZ(10,"p-calendar",5),l.NdJ("ngModelChange",function(t){return e.rangeDates=t})("onSelect",function(){return e.getData()}),l.qZA(),l.qZA(),l.TgZ(11,"button",6),l.NdJ("click",function(){return e.getData()}),l.ALo(12,"translate"),l._UZ(13,"i",7),l.qZA(),l.qZA(),l._UZ(14,"hr"),l.TgZ(15,"div"),l._UZ(16,"p-chart",8),l.qZA(),l.qZA(),l.qZA(),l.qZA()),2&t&&(l.xp6(4),l.hij(" ",l.lcZ(5,15,"STATISTICS")," "),l.xp6(3),l.ekj("loading",e.loading),l.xp6(3),l.Q6J("ngModel",e.rangeDates)("selectionMode","range")("showIcon",!0)("monthNavigator",!0)("yearNavigator",!0)("yearRange",e.yearRangeString)("dateFormat",e.dateFormat)("firstDayOfWeek",e.firstDayOfWeek),l.xp6(1),l.s9C("ngbTooltip",l.lcZ(12,17,"REFRESH")),l.xp6(5),l.Q6J("data",e.data)("height","400px")("responsive",!0))},directives:[p.f,v.JJ,v.On,y._L,m.C],pipes:[D.X$],styles:[""]}),e}()}],Z=function(){var e=function e(){t(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=l.oAB({type:e}),e.\u0275inj=l.cJS({imports:[[c.Bz.forChild(k)],c.Bz]}),e}(),S=function(){var e=function e(){t(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=l.oAB({type:e}),e.\u0275inj=l.cJS({imports:[[s.ez,o.m,Z]]}),e}()}}])}();