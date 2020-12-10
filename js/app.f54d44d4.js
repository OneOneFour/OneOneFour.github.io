(function(t){function e(e){for(var o,i,u=e[0],a=e[1],c=e[2],p=0,d=[];p<u.length;p++)i=u[p],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&d.push(r[i][0]),r[i]=0;for(o in a)Object.prototype.hasOwnProperty.call(a,o)&&(t[o]=a[o]);l&&l(e);while(d.length)d.shift()();return s.push.apply(s,c||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],o=!0,u=1;u<n.length;u++){var a=n[u];0!==r[a]&&(o=!1)}o&&(s.splice(e--,1),t=i(i.s=n[0]))}return t}var o={},r={app:0},s=[];function i(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=o,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],a=u.push.bind(u);u.push=e,u=u.slice();for(var c=0;c<u.length;c++)e(u[c]);var l=a;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("64a9")},"2a55":function(t,e,n){"use strict";n("df0d")},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var o=n("2b0e"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[t.stops.length>0?[n("h1",[t._v("The next bus is...")]),n("bus-stop-selector",{attrs:{stops:t.stops,api_key:t.api_key}}),n("footer",[t._v("Last updated at "+t._s(t.updatedTime))])]:t.error?[n("h2",[t._v("There has been an error")]),n("p",[t._v(t._s(t.error))]),n("p",[t._v("(You are probably not located in the Vancouver area)")])]:[n("h2",[t._v("Loading...")])]],2)},s=[],i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"bus-selector"},[n("h4",{staticClass:"navigator",class:{"hide-space":t.currentStop<=0},on:{click:function(e){t.currentStop--}}},[t._v(" ‹")]),t._l(t.stops,(function(e,o){return n("bus-stop-detail",{directives:[{name:"show",rawName:"v-show",value:t.currentStop==o,expression:"currentStop==index"}],key:o,attrs:{stop:e,api_key:t.api_key,distance:t.stops[o].Distance}})})),n("h4",{staticClass:"navigator",class:{"hide-space":t.currentStop>=t.stops.length-1},on:{click:function(e){t.currentStop++}}},[t._v("›")])],2)},u=[],a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"bus-stop"},[n("h2",{staticClass:"stop-name"},[t._v(t._s(t.stop.OnStreet)+" @ "+t._s(t.stop.AtStreet))]),t.nextBuses.length>0?n("div",{staticClass:"busses"},t._l(t.nextBuses,(function(e,o){return n("h3",{key:o},[t._v(t._s(t._f("stripzeros")(e.RouteNo))+" to "+t._s(e.Schedules[0].Destination)+" arriving "+t._s(t._f("asCountdown")(e.Schedules[0].ExpectedCountdown))+" ")])})),0):[t._m(0)]],2)},c=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"busses"},[n("h3",{staticStyle:{"text-align":"center"}},[t._v("No buses 🙁")])])}],l=(n("28a5"),n("55dd"),{props:{stop:Object,api_key:String},data:function(){return{nextBuses:[],timeOnLoad:null}},methods:{refreshTimes:function(){var t=this,e="https://api.translink.ca/rttiapi/v1/stops/".concat(this.stop.StopNo,"/estimates?apikey=").concat(this.api_key);fetch(e,{headers:new Headers({accept:"application/JSON"})}).then((function(t){return t.json()})).then((function(e){t.nextBuses=e.filter((function(t){return t.Schedules[0].ExpectedCountdown>=0})),t.nextBuses.sort((function(t,e){return t.Schedules[0].ExpectedCountdown-e.Schedules[0].ExpectedCountdown})),t.timeOnLoad=new Date})),setInterval(function(){for(var t=[],e=0;e<this.nextBuses.length;e++){for(var n=this.nextBuses[e],o=0;o<n.Schedules.length;o++)n.Schedules[o].ExpectedCountdown-=1;t.push(n),t[e].Schedules=t[e].Schedules.filter((function(t){return t.ExpectedCountdown>=0}))}t.sort((function(t,e){return t.Schedules[0].ExpectedCountdown-e.Schedules[0].ExpectedCountdown})),this.nextBuses=t}.bind(this),6e4)}},filters:{asCountdown:function(t){return 0==t?"now!":"in "+t+" minute"+(t>1?"s":"")},stripzeros:function(t){return t.split("").filter((function(t){return"0"!=t})).join("")}},mounted:function(){this.refreshTimes()}}),p=l,d=(n("fe5b"),n("2877")),f=Object(d["a"])(p,a,c,!1,null,null,null),h=f.exports,v={props:{stops:Array,api_key:String},data:function(){return{currentStop:0}},methods:{getVisible:function(t){return{hide:t!=this.currentStop}}},components:{BusStopDetail:h}},_=v,g=(n("2a55"),Object(d["a"])(_,i,u,!1,null,null,null)),b=g.exports,S="o52MYm2YA0zvFBN3LU9D",m={name:"app",components:{BusStopSelector:b},data:function(){return{stops:[],error:!1,api_key:S,message:"",lastUpdated:null}},computed:{updatedTime:function(){return this.lastUpdated.getHours()+":"+(this.lastUpdated.getMinutes()<10?"0":"")+this.lastUpdated.getMinutes()}},methods:{updateAll:function(){var t=this;navigator.geolocation&&navigator.geolocation.getCurrentPosition((function(e){t.latitude=e.coords.latitude.toFixed(6),t.longitude=e.coords.longitude.toFixed(6);var n="https://api.translink.ca/rttiapi/v1/stops?apikey=".concat(S,"&lat=").concat(t.latitude,"&long=").concat(t.longitude);fetch(n,{headers:new Headers({accept:"application/JSON"})}).then((function(t){return 404==t.status?Promise.reject("Sorry, no stops found with specified latitude, longitude, radius, and routes."):t.json()})).catch((function(e){return t.error=e})).then((function(e){t.stops=e.filter((function(t){return t.Routes.length>0}))})),t.lastUpdated=new Date}))}},mounted:function(){this.updateAll()}},y=m,x=(n("034f"),Object(d["a"])(y,r,s,!1,null,null,null)),w=x.exports;o["a"].config.productionTip=!1,new o["a"]({render:function(t){return t(w)}}).$mount("#app")},"64a9":function(t,e,n){},"8d3e":function(t,e,n){},df0d:function(t,e,n){},fe5b:function(t,e,n){"use strict";n("8d3e")}});
//# sourceMappingURL=app.f54d44d4.js.map