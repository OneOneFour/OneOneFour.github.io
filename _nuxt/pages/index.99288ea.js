(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{156:function(t,e,o){var content=o(168);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("28f1127f",content,!0,{sourceMap:!1})},157:function(t,e,o){var content=o(172);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("45d01f5e",content,!0,{sourceMap:!1})},158:function(t,e,o){"use strict";o.r(e);var n=o(159),r=o.n(n);for(var c in n)"default"!==c&&function(t){o.d(e,t,(function(){return n[t]}))}(c);e.default=r.a},159:function(t,e){},160:function(t,e,o){var content=o(175);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("764850f1",content,!0,{sourceMap:!1})},161:function(t,e,o){var content=o(177);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("40e6f73e",content,!0,{sourceMap:!1})},162:function(t,e,o){var content=o(182);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("602ef90e",content,!0,{sourceMap:!1})},163:function(t,e,o){var content=o(186);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("4c6cfef1",content,!0,{sourceMap:!1})},164:function(t,e,o){var content=o(188);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("d753705e",content,!0,{sourceMap:!1})},165:function(t,e,o){var content=o(190);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(62).default)("1e92cb9e",content,!0,{sourceMap:!1})},166:function(t,e,o){"use strict";o.r(e),o.d(e,"navBus",(function(){return n}));var n=new(o(0).a),r={data:function(){return{variant:"dark",links:[{name:"About",to:{path:"/",hash:"about"}},{name:"Projects",to:{path:"/",hash:"projects"}},{name:"Contact",to:{path:"/",hash:"contact"}}]}},computed:{colorClass:function(){return["nav-blob-".concat(this.variant)]}},created:function(){n.$on("changeColor",function(t){this.variant=t.variant}.bind(this))}},c=(o(171),o(21)),component=Object(c.a)(r,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("nav",{staticClass:"nav-blob",class:t.colorClass},t._l(t.links,(function(link,e){return o("nuxt-link",{key:e,attrs:{to:link.to}},[t._v("\n    "+t._s(link.name)+"\n  ")])})),1)}),[],!1,null,null,null);e.default=component.exports},167:function(t,e,o){"use strict";var n=o(156);o.n(n).a},168:function(t,e,o){var n=o(61),r=o(169),c=o(170);(e=n(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap);"]);var l=r(c);e.push([t.i,".container{margin:0;padding:0;display:flex;justify-content:space-between;flex-direction:column;align-items:center;text-align:center}body{font-family:Hammersmith One,sans-serif;font-size:20pt}.light{background-color:#eed8c5;color:#b03b49}.primary{background:#b03b49;color:#eed8c5}.secondary{background-color:#db5a31;color:#eed8c5}.accent{background-color:#547160;color:#eed8c5}.accent-light{background-color:#eed8c5;color:#547160}h1{font-size:6rem}p{font-size:2.5rem}.blob{height:100vh}.blob-content{padding:2rem}#image-me{background-image:url("+l+");height:100%;background-position:75% 30%}#about,#image-me{width:100%}.about-me{height:100%;background-color:#db5a31;color:#eed8c5}",""]),t.exports=e},169:function(t,e,o){"use strict";t.exports=function(t,e){return e||(e={}),"string"!=typeof(t=t&&t.__esModule?t.default:t)?t:(/^['"].*['"]$/.test(t)&&(t=t.slice(1,-1)),e.hash&&(t+=e.hash),/["'() \t\n]/.test(t)||e.needQuotes?'"'.concat(t.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):t)}},170:function(t,e,o){t.exports=o.p+"img/me_lake.f7cf00c.jpg"},171:function(t,e,o){"use strict";var n=o(157);o.n(n).a},172:function(t,e,o){(e=o(61)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap);"]),e.push([t.i,".container{margin:0;padding:0;display:flex;justify-content:space-between;flex-direction:column;align-items:center;text-align:center}body{font-family:Hammersmith One,sans-serif;font-size:20pt}.light{background-color:#eed8c5;color:#b03b49}.primary{background:#b03b49;color:#eed8c5}.secondary{background-color:#db5a31;color:#eed8c5}.accent{background-color:#547160;color:#eed8c5}.accent-light{background-color:#eed8c5;color:#547160}.nav-blob-dark>a{color:#eed8c5}.nav-blob-dark>.nuxt-link-active{color:#b03b49;background-color:#eed8c5}.nav-blob-accent>a{color:#eed8c5}.nav-blob-accent>.nuxt-link-active{color:#547160;background-color:#eed8c5}.nav-blob-accent-light>a{color:#547160}.nav-blob-accent-light>.nuxt-link-active{color:#eed8c5;background-color:#547160}.nav-blob-secondary>a{color:#eed8c5}.nav-blob-secondary>.nuxt-link-active{color:#db5a31;background-color:#eed8c5}.nav-blob-secondary-light>a{color:#db5a31}.nav-blob-secondary-light>.nuxt-link-active{color:#eed8c5;background-color:#db5a31}.nav-blob-light>a{color:#b03b49}.nav-blob-light>.nuxt-link-active{color:#eed8c5;background-color:#b03b49}.nav-blob{display:flex;flex-direction:row;position:fixed;top:1.5rem;padding:5px 20px;justify-content:space-between;font-size:1.5rem;border-radius:50px;z-index:100}.nav-blob>a{transition:all .3s ease-in-out;display:block;padding:2px 15px;text-decoration:none}.nav-blob>.nuxt-link-active{border-radius:50px}",""]),t.exports=e},173:function(t,e,o){"use strict";o.r(e);var n=o(196),r=o(158);for(var c in r)"default"!==c&&function(t){o.d(e,t,(function(){return r[t]}))}(c);o(174);var l=o(21),component=Object(l.a)(r.default,n.a,n.b,!1,null,null,null);e.default=component.exports},174:function(t,e,o){"use strict";var n=o(160);o.n(n).a},175:function(t,e,o){(e=o(61)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap);"]),e.push([t.i,".container{margin:0;padding:0;display:flex;justify-content:space-between;flex-direction:column;align-items:center;text-align:center}body{font-family:Hammersmith One,sans-serif;font-size:20pt}.light{background-color:#eed8c5;color:#b03b49}.primary{background:#b03b49;color:#eed8c5}.secondary{background-color:#db5a31;color:#eed8c5}.accent{background-color:#547160;color:#eed8c5}.accent-light{background-color:#eed8c5;color:#547160}.intro-blob{display:flex;flex-direction:column;justify-content:center;width:100%;background-color:#b03b49}.intro-blob h1{font-size:5rem;color:#eed8c5}.intro-blob h4{font-size:2rem;margin-top:1rem;color:#eed8c5}.scroll-hint{position:absolute;top:calc(100vh - 3rem);color:#eed8c5;font-size:1.5rem;width:100%;opacity:.6;text-align:center}",""]),t.exports=e},176:function(t,e,o){"use strict";var n=o(161);o.n(n).a},177:function(t,e,o){(e=o(61)(!1)).push([t.i,".themer{width:100%;height:100%}",""]),t.exports=e},178:function(t,e,o){"use strict";var n=o(4),r=o(19),c=o(22),l=o(110),d=o(63),f=o(9),h=o(42).f,m=o(64).f,v=o(8).f,y=o(179).trim,k=n.Number,x=k,_=k.prototype,j="Number"==c(o(79)(_)),w="trim"in String.prototype,C=function(t){var e=d(t,!1);if("string"==typeof e&&e.length>2){var o,n,r,c=(e=w?e.trim():y(e,3)).charCodeAt(0);if(43===c||45===c){if(88===(o=e.charCodeAt(2))||120===o)return NaN}else if(48===c){switch(e.charCodeAt(1)){case 66:case 98:n=2,r=49;break;case 79:case 111:n=8,r=55;break;default:return+e}for(var code,l=e.slice(2),i=0,f=l.length;i<f;i++)if((code=l.charCodeAt(i))<48||code>r)return NaN;return parseInt(l,n)}}return+e};if(!k(" 0o1")||!k("0b1")||k("+0x1")){k=function(t){var e=arguments.length<1?0:t,o=this;return o instanceof k&&(j?f((function(){_.valueOf.call(o)})):"Number"!=c(o))?l(new x(C(e)),o,k):C(e)};for(var O,I=o(7)?h(x):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),E=0;I.length>E;E++)r(x,O=I[E])&&!r(k,O)&&v(k,O,m(x,O));k.prototype=_,_.constructor=k,o(10)(n,"Number",k)}},179:function(t,e,o){var n=o(6),r=o(23),c=o(9),l=o(180),d="["+l+"]",f=RegExp("^"+d+d+"*"),h=RegExp(d+d+"*$"),m=function(t,e,o){var r={},d=c((function(){return!!l[t]()||"​"!="​"[t]()})),f=r[t]=d?e(v):l[t];o&&(r[o]=f),n(n.P+n.F*d,"String",r)},v=m.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(f,"")),2&e&&(t=t.replace(h,"")),t};t.exports=m},180:function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},181:function(t,e,o){"use strict";var n=o(162);o.n(n).a},182:function(t,e,o){(e=o(61)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap);"]),e.push([t.i,".container{margin:0;padding:0;display:flex;justify-content:space-between;flex-direction:column;align-items:center;text-align:center}body{font-family:Hammersmith One,sans-serif;font-size:20pt}.light{background-color:#eed8c5;color:#b03b49}.primary{background:#b03b49;color:#eed8c5}.secondary{background-color:#db5a31;color:#eed8c5}.accent{background-color:#547160;color:#eed8c5}.accent-light{background-color:#eed8c5;color:#547160}.sticky-scroller{width:50%}.sticky-item{position:-webkit-sticky;position:sticky;top:0;display:flex;flex-direction:column;justify-content:center}",""]),t.exports=e},183:function(t,e,o){t.exports=o.p+"img/impvis.ad78184.gif"},184:function(t,e,o){t.exports=o.p+"img/snooker.fef0136.png"},185:function(t,e,o){"use strict";var n=o(163);o.n(n).a},186:function(t,e,o){(e=o(61)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap);"]),e.push([t.i,".container{margin:0;padding:0;display:flex;justify-content:space-between;flex-direction:column;align-items:center;text-align:center}body{font-family:Hammersmith One,sans-serif;font-size:20pt}.light{background-color:#eed8c5;color:#b03b49}.primary{background:#b03b49;color:#eed8c5}.secondary{background-color:#db5a31;color:#eed8c5}.accent{background-color:#547160;color:#eed8c5}.accent-light{background-color:#eed8c5;color:#547160}.stick-blob{height:150vh}.project-hint{position:absolute;top:calc(1.5rem + 5px);right:1em;text-align:right;opacity:.7;font-size:1.5rem}.project-blob{background-color:#547160;color:#eed8c5;display:flex;padding-top:5.5rem;flex-direction:row;justify-content:left;position:-webkit-sticky;position:sticky;top:0}.project-blob>.project-blob-item{display:flex;position:relative;flex-direction:column;justify-content:center;overflow:hidden;width:25%;height:33%;padding:.5rem}.project-blob>p{font-size:1rem;padding:2rem}",""]),t.exports=e},187:function(t,e,o){"use strict";var n=o(164);o.n(n).a},188:function(t,e,o){(e=o(61)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap);"]),e.push([t.i,".container{margin:0;padding:0;display:flex;justify-content:space-between;flex-direction:column;align-items:center;text-align:center}body{font-family:Hammersmith One,sans-serif;font-size:20pt}.light{background-color:#eed8c5;color:#b03b49}.primary{background:#b03b49;color:#eed8c5}.secondary{background-color:#db5a31;color:#eed8c5}.accent{background-color:#547160;color:#eed8c5}.accent-light{background-color:#eed8c5;color:#547160}.project-blob-img,.project-blob-img img{height:100%;width:100%}.project-blob-img img{-o-object-fit:cover;object-fit:cover}.project-blob-content{display:flex;flex-direction:column;justify-content:space-around;opacity:.8;position:absolute;width:100%;height:100%;z-index:100;background-color:#547160}@-webkit-keyframes slide{0%{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes slide{0%{transform:translateY(100%)}to{transform:translateY(0)}}.slide-enter-active{-webkit-animation:slide .5s;animation:slide .5s}.slide-leave-active{animation:slide .5s reverse}.blob-card-heading{font-size:1.5rem}.blob-card-content{font-size:1rem}",""]),t.exports=e},189:function(t,e,o){"use strict";var n=o(165);o.n(n).a},190:function(t,e,o){(e=o(61)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap);"]),e.push([t.i,".container{margin:0;padding:0;display:flex;justify-content:space-between;flex-direction:column;align-items:center;text-align:center}body{font-family:Hammersmith One,sans-serif;font-size:20pt}.light{background-color:#eed8c5;color:#b03b49}.primary{background:#b03b49;color:#eed8c5}.secondary{background-color:#db5a31;color:#eed8c5}.accent{background-color:#547160;color:#eed8c5}.accent-light{background-color:#eed8c5;color:#547160}.contact-blob{display:flex;width:100%;justify-content:space-around;align-items:center;background-color:#b03b49;color:#eed8c5}.contact-blob>*{text-align:center}.sub-contact-blob{display:flex;flex-direction:column;justify-content:center}",""]),t.exports=e},191:function(t,e,o){"use strict";o.r(e);o(43);var n=o(166),r={props:{variant:{type:String,default:"light"},route:{type:String,required:!1,default:null}},data:function(){return{scrollPos:0,itemTop:0,itemBottom:0,first:!0}},watch:{scrollPos:function(){this.scrollPos>this.itemTop&&this.scrollPos<this.itemBottom&&this.first&&(n.navBus.$emit("changeColor",{variant:this.variant}),this.first=!1,null!==this.route&&this.$router.replace({path:"#".concat(this.route),query:{noScroll:!0}})),(this.scrollPos<this.itemTop||this.scrollPos>this.itemBottom)&&!this.first&&(this.first=!0)}},mounted:function(){window.addEventListener("scroll",function(){this.scrollPos=window.scrollY}.bind(this)),this.itemTop=this.$el.offsetTop-50,this.itemBottom=this.itemTop+this.$el.offsetHeight-50}},c=(o(176),o(21)),component=Object(c.a)(r,(function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"themer",attrs:{id:this.route}},[this._t("default")],2)}),[],!1,null,null,null);e.default=component.exports},192:function(t,e,o){"use strict";o.r(e);o(178);var n={props:{blobHeight:{type:Number,required:!0},position:{type:String,default:"left"},bg:{type:String,default:"light"}},computed:{height:function(){return 100*this.blobHeight+"vh"},style:function(){return{height:this.height,float:this.position}}}},r=(o(181),o(21)),component=Object(r.a)(n,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"sticky-scroller",style:this.style},[e("div",{staticClass:"blob sticky-item",class:[this.bg]},[this._t("default")],2)])}),[],!1,null,null,null);e.default=component.exports},193:function(t,e,o){"use strict";o.r(e);var n={data:function(){return{mouseOver:!1}}},r=(o(187),o(21)),component=Object(r.a)(n,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"project-blob-item"},[o("transition",{key:0,attrs:{name:"slide"}},[t.mouseOver?o("div",{staticClass:"project-blob-content",on:{mouseleave:function(e){t.mouseOver=!1}}},[t._t("default")],2):t._e()]),t._v(" "),o("div",{key:1,staticClass:"project-blob-img",on:{mouseenter:function(e){t.mouseOver=!0}}},[t._t("img")],2)],1)}),[],!1,null,null,null);e.default=component.exports},194:function(t,e,o){"use strict";o.r(e);o(185);var n=o(21),component=Object(n.a)({},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"stick-blob"},[n("div",{staticClass:"blob project-blob"},[n("div",{staticClass:"project-hint"},[n("font-awesome-icon",{attrs:{icon:"mouse"}}),t._v(" Hover over to find out more!\n    ")],1),t._v(" "),n("project-item",{scopedSlots:t._u([{key:"img",fn:function(){return[n("img",{attrs:{src:o(183),alt:"IMP VIS IMG"}})]},proxy:!0}])},[t._v(" "),[n("h1",{staticClass:"blob-card-heading"},[t._v("\n          Imperial Visualisations\n        ")]),t._v(" "),n("p",{staticClass:"blob-card-content"},[t._v("\n          Developing interactive visualisations to assist undergraduate STEM eduacation.\n        ")])]],2),t._v(" "),n("project-item",{scopedSlots:t._u([{key:"img",fn:function(){return[n("img",{attrs:{src:o(184),alt:"SNOOKER"}})]},proxy:!0}])},[t._v(" "),[n("h1",{staticClass:"blob-card-heading"},[t._v("\n          Vue Snooker\n        ")]),t._v(" "),n("p",{staticClass:"blob-card-content"},[t._v("\n          Simple version of pool recreated using SVG and Vue.js\n        ")])]],2)],1)])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{ProjectItem:o(193).default})},195:function(t,e,o){"use strict";o.r(e);o(189);var n=o(21),component=Object(n.a)({},(function(){var t=this.$createElement;this._self._c;return this._m(0)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"blob contact-blob"},[e("div",{staticClass:"sub-contact-blob"},[e("h1",[this._v("Contact")]),this._v(" "),e("p",[this._v(" Currently searching for job oppertunities! ")])]),this._v(" "),e("div",{staticClass:"sub-contact-blob"},[e("div",[this._v("\n      Email: robertkng104@gmail.com\n    ")]),this._v(" "),e("div",[this._v("\n      Github: @OneOneFour\n    ")])])])}],!1,null,null,null);e.default=component.exports},196:function(t,e,o){"use strict";o.d(e,"a",(function(){return n})),o.d(e,"b",(function(){return r}));var n=function(){var t=this.$createElement;this._self._c;return this._m(0)},r=[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"intro-blob blob",attrs:{id:"home"}},[e("h1",[this._v(" Robert King ")]),this._v(" "),e("h4",[this._v(" Physicist, Programmer, Explorer ")]),this._v(" "),e("h3",{staticClass:"scroll-hint"},[this._v("\n    Scroll down for more\n  ")])])}]},197:function(t,e,o){"use strict";o.r(e);var n={},r=(o(167),o(21)),component=Object(r.a)(n,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"container"},[o("nav-blob"),t._v(" "),o("theme-blob",{attrs:{variant:"dark"}},[o("intro-blob")],1),t._v(" "),o("theme-blob",{attrs:{variant:"light",route:"about"}},[o("div",[o("smart-sticky",{attrs:{"blob-height":1,position:"left",bg:"secondary"}},[o("h1",[t._v(" About Me")])]),t._v(" "),o("smart-sticky",{attrs:{"blob-height":2,position:"right"}},[o("p",{staticClass:"blob-content"},[t._v("\n          Hi there! I'm a physics graduate who enjoys making cool projects and visualisations with data. I also enjoy going for long walks up mountains and the occasional bike ride.\n        ")])]),t._v(" "),o("smart-sticky",{attrs:{"blob-height":2,position:"left"}},[o("div",{attrs:{id:"image-me"}})]),t._v(" "),o("smart-sticky",{attrs:{"blob-height":1,position:"right",bg:"secondary"}},[o("p",{staticClass:"blob-content"},[t._v("\n          I've just graduated with a First in Physics from Imperial College London. I have also spent a summer doing research at the University of British Columbia.\n        ")])])],1)]),t._v(" "),o("theme-blob",{attrs:{variant:"accent",route:"projects"}},[o("smart-sticky",{attrs:{"blob-height":1,position:"right",bg:"accent"}},[o("h1",[t._v(" Projects ")])]),t._v(" "),o("smart-sticky",{attrs:{"blob-height":1,position:"left",bg:"secondary"}},[o("p",{staticClass:"blob-content"},[t._v("\n        Here is a collection of various technical projects that I have worked on over the past few years\n      ")]),t._v(" "),o("h3",{staticClass:"scroll-hint"},[t._v("\n        Scroll down to explore\n      ")])])],1),t._v(" "),o("theme-blob",{attrs:{variant:"accent"}},[o("project-grid")],1),t._v(" "),o("theme-blob",{attrs:{variant:"dark",route:"contact"}},[o("contact-blob")],1)],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{NavBlob:o(166).default,IntroBlob:o(173).default,ThemeBlob:o(191).default,SmartSticky:o(192).default,ProjectGrid:o(194).default,ContactBlob:o(195).default})}}]);