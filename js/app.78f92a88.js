(function(t){function e(e){for(var n,a,s=e[0],u=e[1],l=e[2],h=0,f=[];h<s.length;h++)a=s[h],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(t[n]=u[n]);c&&c(e);while(f.length)f.shift()();return r.push.apply(r,l||[]),i()}function i(){for(var t,e=0;e<r.length;e++){for(var i=r[e],n=!0,s=1;s<i.length;s++){var u=i[s];0!==o[u]&&(n=!1)}n&&(r.splice(e--,1),t=a(a.s=i[0]))}return t}var n={},o={app:0},r=[];function a(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=t,a.c=n,a.d=function(t,e,i){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(a.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(i,n,function(e){return t[e]}.bind(null,n));return i},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=e,s=s.slice();for(var l=0;l<s.length;l++)e(s[l]);var c=u;r.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},"034f":function(t,e,i){"use strict";var n=i("85ec"),o=i.n(n);o.a},"56d7":function(t,e,i){"use strict";i.r(e);i("e260"),i("e6cf"),i("cca6"),i("a79d");var n=i("2b0e"),o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app",tabindex:"-1"}},[i("svg",{attrs:{width:t.pageWidth,height:t.pageHeight},on:{mousemove:t.mouseMove,mousedown:t.enableCue,mouseup:t.disableCue}},[i("pool-table",{attrs:{balls:t.balls,x:t.centerX,y:t.centerY,size:t.size,ballRadius:t.ballRadius,showCue:null==t.intervalId&&!t.freePositionCue}})],1),t.freePositionCue?i("button",{on:{click:function(e){t.freePositionCue=!1}}},[t._v("Cue position OK?")]):t._e()])},r=[],a=(i("99af"),i("4de4"),i("caad"),i("13d5"),i("2af1"),i("2532"),i("b85c")),s=new n["a"],u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("g",[n("image",{attrs:{width:t.size,height:t.height,"xlink:href":i("ac65"),x:t.x,y:t.y}}),t._l(t.balls,(function(e){return n("pool-ball",{key:e.id,attrs:{x:t.toTableX(e.x),y:t.toTableY(e.y),type:e.type,radius:t.radius,id:e.id}})})),t.showCue?n("pool-cue",{attrs:{ballRadius:t.radius}}):t._e()],2)},l=[],c=(i("a9e3"),function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("g",[i("circle",{attrs:{r:t.radius,fill:t.fill,cx:t.x,cy:t.y},on:{mousedown:function(e){return e.stopPropagation(),t.dragBall(e)},mouseup:function(e){return e.stopPropagation(),t.releaseBall(e)},mousemove:function(e){return e.stopPropagation(),t.trackBall(e)}}})])}),h=[],f={props:{x:Number,y:Number,type:String,radius:Number,id:Number},data:function(){return{draggingBall:!1}},methods:{dragBall:function(){this.draggingBall=!0},releaseBall:function(){this.draggingBall=!1},trackBall:function(t){var e=t.pageY;this.draggingBall&&"cue"===this.type&&(console.log(e),s.$emit("dragCue",{y:this.$parent.toBallY(e)}))}},computed:{fill:function(){switch(this.type){case"cue":return"#f0ead6";case"red":return"#c0392b";case"yellow":return"#f1c40f";case"black":return"#2d3436";default:return"#000000"}}}},d=f,p=i("2877"),y=Object(p["a"])(d,c,h,!1,null,null,null),b=y.exports,v=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("image",{staticClass:"cue",style:t.getOrigin,attrs:{opacity:t.clicked?1:.5,"xlink:href":i("cf20"),x:t.cueX-2.5*t.ballRadius,y:t.cueY+t.yOffset+t.extraOffset,transform:t.cueStyle}})},m=[],g={props:{ballRadius:Number},data:function(){return{clicked:!1,cueX:0,cueY:0,mouseOffsetX:0,mouseOffsetY:0,rotationLock:null,yOffset:1.5*this.ballRadius,velocity:0}},created:function(){var t=this;this.cueX=this.$parent.toTableX(this.$parent.$parent.balls[0].x),this.cueY=this.$parent.toTableY(this.$parent.$parent.balls[0].y),s.$on("mouseMove",(function(e){t.mouseOffsetX=e.mouseOffsetX-t.cueX,t.mouseOffsetY=e.mouseOffsetY-t.cueY})),s.$on("enableCue",(function(){t.rotationLock={rot:t.rotation,x:t.mouseOffsetX,y:t.mouseOffsetY},t.clicked=!0})),s.$on("disableCue",(function(){t.clicked=!1}))},computed:{cueStyle:function(){return"rotate("+-1*this.rotation+")"},getOrigin:function(){return{"transform-origin":"".concat(this.cueX,"px ").concat(this.cueY,"px")}},rotation:function(){return this.clicked?this.rotationLock.rot:Math.atan2(this.mouseOffsetX,this.mouseOffsetY)*(180/Math.PI)},basisVector:function(){if(this.clicked){var t=Math.sqrt(Math.pow(this.rotationLock.x,2)+Math.pow(this.rotationLock.y,2));return[this.rotationLock.x/t,this.rotationLock.y/t]}return 0},extraOffset:function(){return this.clicked?this.basisVector[0]*(this.mouseOffsetX-this.rotationLock.x)+this.basisVector[1]*(this.mouseOffsetY-this.rotationLock.y):0}},watch:{extraOffset:function(t,e){this.velocity=e-t,t+this.yOffset<this.ballRadius&&s.$emit("ballStrike",this.velocity,this.rotationLock.rot)}}},x=g,w=Object(p["a"])(x,v,m,!1,null,null,null),M=w.exports,O=19/137,C=1.7466,k={components:{PoolBall:b,PoolCue:M},props:{showCue:Boolean,balls:Array,x:Number,y:Number,size:Number,ballRadius:Number},methods:{toTableX:function(t){return this.x+this.tableHeight*(2/1.967)+t/100*this.tableHeight*(2/1.967)+this.boundaryWidth},toTableY:function(t){return this.y+this.tableHeight/2+t/50*this.tableHeight/2+this.boundaryWidth},toBallY:function(t){return 100*(t-this.y-this.boundaryWidth-this.tableHeight/2)/this.tableHeight}},computed:{boundaryWidth:function(){return O*this.height},height:function(){return this.size/C},tableHeight:function(){return this.height-2*this.boundaryWidth},radius:function(){return this.ballRadius*this.tableHeight/100}}},P=k,Y=Object(p["a"])(P,u,l,!1,null,null,null),$=Y.exports,X=6;function _(t,e){return t<-50?j(t,e,-105,e>0?54:-54):t>50?j(t,e,105,e>0?54:-54):j(t,e,0,e>0?57:-57)}function j(t,e,i,n){return Math.sqrt(Math.pow(i-t,2)+Math.pow(n-e,2))<3+X}function S(t,e,i,n,o,r){var a=arguments.length>6&&void 0!==arguments[6]&&arguments[6];this.id=t,a?(this.x=e+.5*(Math.random()-.5),this.y=i+.5*(Math.random()-.5)):(this.x=e,this.y=i),this.vx=n,this.vy=o,this.type=r,this.collided=[],this.deleteThisFrame=!1}S.prototype.stationary=function(){return Math.abs(this.vx)<.22&&Math.abs(this.vy)<.22};var B={name:"App",components:{PoolTable:$},mounted:function(){this.physicsSimulate(),window.addEventListener("keydown",this.pause),s.$on("ballStrike",function(t,e){this.cue.vx=-Math.sin(e/180*Math.PI)*t,this.cue.vy=-Math.cos(e/180*Math.PI)*t,this.freePositionCue=!1,this.physicsSimulate()}.bind(this)),s.$on("dragCue",function(t){this.freePositionCue&&(this.cue.y=t.y)}.bind(this))},destroyed:function(){window.removeEventListener("keydown",this.pause)},data:function(){return{intervalId:null,size:700,balls:[new S(0,-52,0,0,0,"cue"),new S(16,40,0,0,0,"red",!0),new S(15,48,-4.5,0,0,"red",!0),new S(14,48,4.5,0,0,"yellow",!0),new S(8,56,0,0,0,"black",!0),new S(12,56,-9,0,0,"yellow",!0),new S(11,56,9,0,0,"red",!0),new S(10,64,-13,0,0,"red",!0),new S(9,64,-4.5,0,0,"yellow",!0),new S(7,64,4.5,0,0,"red",!0),new S(6,64,13,0,0,"yellow",!0),new S(5,71.5,18,0,0,"red",!0),new S(4,71.5,9,0,0,"yellow",!0),new S(3,71.5,0,0,0,"yellow",!0),new S(2,71.5,-9,0,0,"red",!0),new S(1,71.5,-18,0,0,"yellow",!0)],restitutionCoeff:.9,staticFriction:10,ballRadius:3.5,freePositionCue:!1,frictionCoeff:.01}},methods:{pause:function(t){"Space"===t.code&&(null!=this.intervalId?(clearInterval(this.intervalId),this.intervalId=null):this.physicsSimulate())},physicsSimulate:function(){this.intervalId=setInterval(function(){var t=this;0==this.balls.filter((function(t){return!t.stationary()})).length&&(clearInterval(this.intervalId),this.intervalId=null,"cue"!==this.balls[0].type&&(this.balls=[new S(0,-52,0,0,0,"cue")].concat(this.balls),this.freePositionCue=!0));var e,i=Object(a["a"])(this.balls);try{var n=function(){var i=e.value;if(_(i.x,i.y))return i.deleteThisFrame=!0,"continue";var n,o=t.balls.filter((function(t){return!i.collided.includes(t)})).filter((function(t){return t!==i})).filter((function(t){return!t.deleteThisFrame})).filter((function(e){return Math.pow(e.x-i.x,2)+Math.pow(e.y-i.y,2)<4*t.ballRadius*t.ballRadius})),r=Object(a["a"])(o);try{for(r.s();!(n=r.n()).done;){var s=n.value,u=Math.sqrt(Math.pow(s.x-i.x,2)+Math.pow(s.y-i.y,2)),l=(i.vx+s.vx)/2,c=(i.vy+s.vy)/2,h=Math.sqrt(1-Math.pow((s.x-i.x)*l+c*(s.y-i.y),2)/(u*u*(Math.pow(l,2)+Math.pow(c,2)))),f=isNaN(h)?0:Math.asin(h*Math.sign(s.y-i.y)*Math.sign(s.x-i.x)),d=i.vx-l,p=s.vx-l,y=i.vy-c,b=s.vy-c;i.vx=l-d*t.restitutionCoeff*Math.cos(f)+y*t.restitutionCoeff*Math.sin(-f),s.vx=l-p*t.restitutionCoeff*Math.cos(f)+b*t.restitutionCoeff*Math.sin(-f),i.vy=c-d*t.restitutionCoeff*Math.sin(f)-y*t.restitutionCoeff*Math.cos(-f),s.vy=c-p*t.restitutionCoeff*Math.sin(f)-b*t.restitutionCoeff*Math.cos(-f),i.collided.push(s),s.collided.push(i)}}catch(v){r.e(v)}finally{r.f()}};for(i.s();!(e=i.n()).done;)n()}catch(f){i.e(f)}finally{i.f()}var o,r=Object(a["a"])(this.balls.filter((function(t){return!t.stationary()})));try{for(r.s();!(o=r.n()).done;){var s=o.value;Math.abs(s.x)>100&&(s.vx=-s.vx*this.restitutionCoeff,s.vy=s.vy*this.restitutionCoeff,s.x=100*Math.sign(s.x)),Math.abs(s.y)>50&&(s.vy=-s.vy*this.restitutionCoeff,s.vx=s.vx*this.restitutionCoeff,s.y=50*Math.sign(s.y));var u=Math.atan2(s.vy,s.vx);0==s.collided.length&&(s.vx-=(this.frictionCoeff*s.vx+this.staticFriction)*Math.cos(u)*(1/60),s.vy-=(this.frictionCoeff*s.vy+this.staticFriction)*Math.sin(u)*(1/60)),s.x+=s.vx*(1/60),s.y+=s.vy*(1/60),s.stationary()&&(s.vx=0,s.vy=0)}}catch(f){r.e(f)}finally{r.f()}var l,c=Object(a["a"])(this.balls);try{var h=function(){var e=l.value;e.collided=e.collided.filter((function(i){return Math.pow(i.x-e.x,2)+Math.pow(i.y-e.y,2)<4*t.ballRadius*t.ballRadius}))};for(c.s();!(l=c.n()).done;)h()}catch(f){c.e(f)}finally{c.f()}this.balls=this.balls.filter((function(t){return!t.deleteThisFrame}))}.bind(this),1e3/60)},mouseMove:function(t){s.$emit("mouseMove",{cueX:this.balls[0].x,cueY:this.balls[0].y,mouseOffsetX:t.clientX,mouseOffsetY:t.clientY})},enableCue:function(){s.$emit("enableCue")},disableCue:function(){s.$emit("disableCue")}},computed:{kineticEnergy:function(){return Math.round(this.balls.reduce((function(t,e){return t+Math.pow(e.vx,2)+Math.pow(e.vy,2)}),0))},momentumX:function(){return Math.round(this.balls.reduce((function(t,e){return t+e.vx}),0))},momentumY:function(){return Math.round(this.balls.reduce((function(t,e){return t+e.vy}),0))},pageWidth:function(){return window.innerWidth},pageHeight:function(){return window.innerHeight},centerX:function(){return(this.pageWidth-this.size)/2},centerY:function(){return(this.pageHeight-this.size/2)/2},cue:function(){return this.balls[0]}}},I=B,R=(i("034f"),Object(p["a"])(I,o,r,!1,null,null,null)),T=R.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(T)}}).$mount("#app")},"85ec":function(t,e,i){},ac65:function(t,e,i){t.exports=i.p+"img/table.0260e0c9.svg"},cf20:function(t,e,i){t.exports=i.p+"img/cue.44328701.svg"}});
//# sourceMappingURL=app.78f92a88.js.map