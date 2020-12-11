(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{220:function(t,e,r){var content=r(223);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(50).default)("4d2b1840",content,!0,{sourceMap:!1})},221:function(t,e,r){"use strict";r.r(e);r(51),r(101),r(26),r(22);var n={name:"ProjectIcons",props:{tech:{type:Array,required:!0},inline:{type:Boolean,default:!1}},computed:{techIcons:function(){return void 0!==this.tech?this.tech.filter((function(t){return void 0!==t.icon})):[]},techNoIcons:function(){return void 0!==this.tech?this.tech.filter((function(t){return void 0===t.icon})):[]},techNoIconsStr:function(){return this.techNoIcons.map((function(t){return t.name})).join("\n")}}},o=(r(222),r(25)),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"project-icons",style:{display:t.inline?"inline":"block"}},[t._l(t.techIcons,(function(t){return r("i",{key:t.icon,class:"devicon-"+t.icon.toLowerCase(),attrs:{title:t.name}})})),t._v(" "),t.techNoIcons.length>0?r("span",{staticClass:"tooltip-hint",attrs:{title:t.techNoIconsStr}},[t._v("\n        +\n        ")]):t._e()],2)}),[],!1,null,null,null);e.default=component.exports},222:function(t,e,r){"use strict";r(220)},223:function(t,e,r){(e=r(49)(!1)).push([t.i,".tooltip-hint{font-weight:600;font-size:20pt}.project-icons>i{margin:0 5px;font-size:16pt}",""]),t.exports=e},224:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNSAzbDMuMDU3LTMgMTEuOTQzIDEyLTExLjk0MyAxMi0zLjA1Ny0zIDktOXoiLz48L3N2Zz4="},225:function(t,e,r){var content=r(236);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(50).default)("583fe380",content,!0,{sourceMap:!1})},226:function(t,e,r){var content=r(242);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(50).default)("6ad05214",content,!0,{sourceMap:!1})},227:function(t,e,r){var content=r(244);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(50).default)("2c408e03",content,!0,{sourceMap:!1})},231:function(t,e,r){"use strict";r.r(e);var n={name:"ProjectLinks",props:{links:{type:Array,required:!0}}},o=(r(235),r(25)),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"project-detail-item project-links"},[r("h2",[t._v("links")]),t._v(" "),r("div",{staticClass:"project-links-holder"},t._l(t.links,(function(link){return r("a",{key:link.type,staticClass:"link-bubble",attrs:{href:link.url}},[void 0!==link.logo?r("i",{class:"devicon-"+link.logo}):t._e(),t._v(" "),r("span",[t._v(t._s(link.type))])])})),0)])}),[],!1,null,null,null);e.default=component.exports},232:function(t,e,r){"use strict";r.r(e);r(238),r(40);var n={name:"ProjectImages",props:{imageUrls:{type:Array,required:!0},autoScrollDuration:{type:Number,default:0},showButtons:{type:Boolean,default:!0}},data:function(){return{currentImg:0}},methods:{changeImg:function(t){this.currentImg=this.currentImg+t,this.currentImg>=this.imageUrls.length&&(this.currentImg=0),this.currentImg<0&&(this.currentImg=this.imageUrls.length-1)}},mounted:function(){this.autoScrollDuration>0&&setInterval(function(){this.changeImg(1)}.bind(this),this.autoScrollDuration)}},o=(r(241),r(25)),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"project-detail-item project-images-container"},[n("div",{staticClass:"project-images"},[t.imageUrls.length>1&&t.showButtons?n("button",{staticClass:"toggle-switch-pi",on:{click:function(e){return t.changeImg(1)}}},[n("img",{attrs:{src:r(237)}})]):t._e(),t._v(" "),n("div",{staticClass:"img-holder"},[n("img",{attrs:{src:t.imageUrls[t.currentImg]}})]),t._v(" "),t.imageUrls.length>1&&t.showButtons?n("button",{staticClass:"toggle-switch-pi",on:{click:function(e){return t.changeImg(-1)}}},[n("img",{attrs:{src:r(224)}})]):t._e()])])}),[],!1,null,null,null);e.default=component.exports},235:function(t,e,r){"use strict";r(225)},236:function(t,e,r){(e=r(49)(!1)).push([t.i,".project-links{grid-column:1/2;grid-row:3/4}.project-links-holder{display:flex;justify-content:flex-start}.link-bubble{flex:0 1 auto;margin-right:20px;text-align:left;border:6px solid var(--black);background-color:var(--white);color:var(--black);border-radius:50px;padding:5px 10px;font-size:12pt;font-weight:600;min-height:3.25rem;display:flex;align-items:center;transition:background-color .1s linear,color .1s linear}.link-bubble:hover{background-color:var(--black);color:var(--white)}.link-bubble>i{margin-right:10px}@media screen and (max-width:970px){.project-links-holder{flex-direction:column;justify-content:flex-start}.link-bubble{margin:10px 50px 10px 0}}@media screen and (max-width:740px){.project-links-holder{flex-direction:row;justify-content:center;flex-wrap:wrap}}",""]),t.exports=e},237:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTYuNjcgMGwyLjgzIDIuODI5LTkuMzM5IDkuMTc1IDkuMzM5IDkuMTY3LTIuODMgMi44MjktMTIuMTctMTEuOTk2eiIvPjwvc3ZnPg=="},238:function(t,e,r){"use strict";var n=r(10),o=r(4),c=r(72),l=r(16),d=r(13),h=r(28),f=r(160),m=r(71),v=r(6),x=r(104),I=r(102).f,j=r(52).f,k=r(15).f,w=r(239).trim,y=o.Number,_=y.prototype,N="Number"==h(x(_)),M=function(t){var e,r,n,o,c,l,d,code,h=m(t,!1);if("string"==typeof h&&h.length>2)if(43===(e=(h=w(h)).charCodeAt(0))||45===e){if(88===(r=h.charCodeAt(2))||120===r)return NaN}else if(48===e){switch(h.charCodeAt(1)){case 66:case 98:n=2,o=49;break;case 79:case 111:n=8,o=55;break;default:return+h}for(l=(c=h.slice(2)).length,d=0;d<l;d++)if((code=c.charCodeAt(d))<48||code>o)return NaN;return parseInt(c,n)}return+h};if(c("Number",!y(" 0o1")||!y("0b1")||y("+0x1"))){for(var C,P=function(t){var e=arguments.length<1?0:t,r=this;return r instanceof P&&(N?v((function(){_.valueOf.call(r)})):"Number"!=h(r))?f(new y(M(e)),r,P):M(e)},D=n?I(y):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),E=0;D.length>E;E++)d(y,C=D[E])&&!d(P,C)&&k(P,C,j(y,C));P.prototype=_,_.constructor=P,l(o,"Number",P)}},239:function(t,e,r){var n=r(12),o="["+r(240)+"]",c=RegExp("^"+o+o+"*"),l=RegExp(o+o+"*$"),d=function(t){return function(e){var r=String(n(e));return 1&t&&(r=r.replace(c,"")),2&t&&(r=r.replace(l,"")),r}};t.exports={start:d(1),end:d(2),trim:d(3)}},240:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},241:function(t,e,r){"use strict";r(226)},242:function(t,e,r){(e=r(49)(!1)).push([t.i,".project-images-container{grid-row:2/3;grid-column:1/2;align-self:center;height:100%}.toggle-switch-pi{background-color:var(--white);border:4px solid var(--black);color:var(--black);border-radius:30px;padding:6px;text-align:center;cursor:pointer;height:32px;width:32px}.toggle-switch-pi:focus{outline:none}.toggle-switch-pi:hover{background-color:var(--black);color:var(--white)}.toggle-switch-pi>img{width:12px}.toggle-switch-pi:hover>img{filter:invert(100%)}.night-mode .toggle-switch-pi:hover>img{filter:invert(0)}.link-images>h2{margin-bottom:15px}.project-images{display:flex;justify-content:space-between;align-items:center;padding:0 15px;height:100%}.project-images>.img-holder{flex:1 1 auto}.img-holder{text-align:center;height:100%;display:flex;align-items:center;justify-content:center}.img-holder img{max-width:95%;max-height:95%}",""]),t.exports=e},243:function(t,e,r){"use strict";r(227)},244:function(t,e,r){(e=r(49)(!1)).push([t.i,".link-description{grid-row:2/4}.project-detail{display:grid;grid-template-columns:65% 35%;grid-template-rows:110px minmax(0,4fr) 1fr}.description-content{overflow:auto;height:90%;font-size:12pt}.project-detail-item{padding:15px 0;position:relative}.project-detail-item h2{margin-bottom:15px}.project-logo{font-weight:600;line-height:.9;font-size:25pt;border-right:7px solid var(--black);padding-right:10px}.project-tagline{font-weight:400;font-size:11pt}.project-logo span{display:block}.titlebox{padding-left:10px;flex:1 1 auto}.bar{grid-column:1/3;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;padding:30px 0 10px}.project-page{width:1240px;margin:0 auto}.divider{height:100%;width:7px;background-color:#000;margin:0 15px}@media screen and (max-width:740px){.project-detail{display:flex;flex-direction:column;align-items:center;padding:0 30px}.project-images-container{order:1}.project-links{order:2;width:100%}.link-description{order:3}.description-content{overflow:visible}}",""]),t.exports=e},272:function(t,e,r){"use strict";r.r(e);r(22),r(27);var n=r(3),o=r(231),c=r(221),l=r(232),d={name:"ProjectPage",components:{ProjectIcons:c.default,ProjectImages:l.default,ProjectLinks:o.default},asyncData:function(t){return Object(n.a)(regeneratorRuntime.mark((function e(){var r,n,o,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.$content,n=t.params,o=t.error,e.next=3,r("projects").where({slug:n.name}).fetch();case 3:return void 0===(c=e.sent[0])&&o({statusCode:404,message:"Project '".concat(n.name,"' not found")}),e.prev=5,e.next=8,r(n.name).fetch();case 8:c.descriptionMarkdown=e.sent,e.next=13;break;case 11:e.prev=11,e.t0=e.catch(5);case 13:return e.abrupt("return",c);case 14:case"end":return e.stop()}}),e,null,[[5,11]])})))()}},h=(r(243),r(25)),component=Object(h.a)(d,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container project-detail",class:{"night-mode":t.$store.state.night}},[r("div",{staticClass:"bar"},[r("h1",{staticClass:"project-logo"},[r("NuxtLink",{attrs:{to:"/"}},[t._v("Robert "),r("span",[t._v("King")])])],1),t._v(" "),r("div",{staticClass:"titlebox"},[r("h1",{staticClass:"project-name"},[t._v(t._s(t.title))]),t._v(" "),r("h4",{staticClass:"project-tagline"},[t._v(t._s(t.tagline))])]),t._v(" "),r("ProjectIcons",{attrs:{tech:t.tech}})],1),t._v(" "),r("ProjectLinks",{attrs:{links:t.links}}),t._v(" "),r("div",{staticClass:"link-description project-detail-item"},[r("h2",{staticClass:"description-title"},[t._v("description")]),t._v(" "),r("div",{staticClass:"description-content"},[r("nuxt-content",{attrs:{document:t.descriptionMarkdown}})],1)]),t._v(" "),t.slideshow?r("ProjectImages",{attrs:{imageUrls:t.slideshow}}):t._e()],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{ProjectIcons:r(221).default,ProjectLinks:r(231).default,ProjectImages:r(232).default})}}]);