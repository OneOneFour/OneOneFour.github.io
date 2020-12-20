(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{221:function(t,e,o){var content=o(224);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(37).default)("4d2b1840",content,!0,{sourceMap:!1})},222:function(t,e,o){"use strict";o.r(e);o(49),o(99),o(25),o(26);var r={name:"ProjectIcons",props:{tech:{type:Array,required:!0},inline:{type:Boolean,default:!1}},computed:{techIcons:function(){return void 0!==this.tech?this.tech.filter((function(t){return void 0!==t.icon})):[]},techNoIcons:function(){return void 0!==this.tech?this.tech.filter((function(t){return void 0===t.icon})):[]},techNoIconsStr:function(){return this.techNoIcons.map((function(t){return t.name})).join("\n")}}},n=(o(223),o(24)),component=Object(n.a)(r,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"project-icons",style:{display:t.inline?"inline":"block"}},[t._l(t.techIcons,(function(t){return o("i",{key:t.icon,class:"devicon-"+t.icon.toLowerCase(),attrs:{title:t.name}})})),t._v(" "),t.techNoIcons.length>0?o("span",{staticClass:"tooltip-hint",attrs:{title:t.techNoIconsStr}},[t._v("\n        +\n        ")]):t._e()],2)}),[],!1,null,null,null);e.default=component.exports},223:function(t,e,o){"use strict";o(221)},224:function(t,e,o){(e=o(36)(!1)).push([t.i,".tooltip-hint{font-weight:600;font-size:20pt}.project-icons>i{margin:0 5px;font-size:16pt}",""]),t.exports=e},225:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNSAzbDMuMDU3LTMgMTEuOTQzIDEyLTExLjk0MyAxMi0zLjA1Ny0zIDktOXoiLz48L3N2Zz4="},229:function(t,e,o){var content=o(253);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(37).default)("46c1090a",content,!0,{sourceMap:!1})},230:function(t,e,o){var content=o(255);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(37).default)("5d2e8db0",content,!0,{sourceMap:!1})},231:function(t,e,o){var content=o(258);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(37).default)("1b7833da",content,!0,{sourceMap:!1})},234:function(t,e,o){"use strict";o.r(e);o(27);var r=o(5),n=(o(235),{data:function(){return{allProjects:[]}},fetch:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$content("projects").sortBy("year","desc").sortBy("month","desc").fetch();case 2:t.allProjects=e.sent;case 3:case"end":return e.stop()}}),e)})))()}}),c=(o(254),o(24)),component=Object(c.a)(n,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"project-grid"},this._l(this.allProjects,(function(t,i){return e("project-item",{key:i,attrs:{project:t}})})),1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{ProjectItem:o(235).default})},235:function(t,e,o){"use strict";o.r(e);var r=o(222),n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],c={name:"ProjectName",props:{project:{type:Object,required:!0}},components:{ProjectIcons:r.default},data:function(){return{mouseOver:!1,showToolTip:!1}},methods:{getMonthStr:function(i){return void 0!==n[i-1]?n[i-1]:""}},computed:{endDate:function(){return this.getMonthStr(this.project.month)+" "+this.project.year},startDate:function(){return void 0!==this.project.start_year?this.getMonthStr(this.project.start_month)+" "+this.project.start_year+" - ":""},projectUrl:function(){return"/project/".concat(this.project.slug)},itemStyle:function(){return{"background-image":void 0!==this.project.image?"url(".concat(this.project.image,")"):"url(/blank.png)"}}}},l=(o(252),o(24)),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"project-item",style:t.itemStyle,on:{mouseenter:function(e){t.mouseOver=!0},mouseleave:function(e){t.mouseOver=!1,t.showToolTip=!1}}},[o("transition",{key:0,attrs:{name:"slide"}},[t.mouseOver?o("div",{staticClass:"project-item-content"},[o("h3",{staticClass:"project-item-title"},[t._v(" "+t._s(t.project.title))]),t._v("\n            "+t._s(t.startDate)+t._s(t.endDate)+"\n            "),o("p",{staticClass:"project-item-tagline"},[t._v(" "+t._s(t.project.tagline))]),t._v(" "),o("div",{staticClass:"project-item-footer"},[o("NuxtLink",{staticClass:"project-item-link",attrs:{to:t.projectUrl}},[t._v("View")]),t._v(" "),o("ProjectIcons",{attrs:{tech:t.project.tech}})],1)]):t._e()])],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{ProjectIcons:o(222).default})},246:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMCAxNi42N2wyLjgyOSAyLjgzIDkuMTc1LTkuMzM5IDkuMTY3IDkuMzM5IDIuODI5LTIuODMtMTEuOTk2LTEyLjE3eiIvPjwvc3ZnPg=="},247:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg=="},248:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNC45OCAzLjVjMCAxLjM4MS0xLjExIDIuNS0yLjQ4IDIuNXMtMi40OC0xLjExOS0yLjQ4LTIuNWMwLTEuMzggMS4xMS0yLjUgMi40OC0yLjVzMi40OCAxLjEyIDIuNDggMi41em0uMDIgNC41aC01djE2aDV2LTE2em03Ljk4MiAwaC00Ljk2OHYxNmg0Ljk2OXYtOC4zOTljMC00LjY3IDYuMDI5LTUuMDUyIDYuMDI5IDB2OC4zOTloNC45ODh2LTEwLjEzMWMwLTcuODgtOC45MjItNy41OTMtMTEuMDE4LTMuNzE0di0yLjE1NXoiLz48L3N2Zz4="},249:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjQgNC41NTdjLS44ODMuMzkyLTEuODMyLjY1Ni0yLjgyOC43NzUgMS4wMTctLjYwOSAxLjc5OC0xLjU3NCAyLjE2NS0yLjcyNC0uOTUxLjU2NC0yLjAwNS45NzQtMy4xMjcgMS4xOTUtLjg5Ny0uOTU3LTIuMTc4LTEuNTU1LTMuNTk0LTEuNTU1LTMuMTc5IDAtNS41MTUgMi45NjYtNC43OTcgNi4wNDUtNC4wOTEtLjIwNS03LjcxOS0yLjE2NS0xMC4xNDgtNS4xNDQtMS4yOSAyLjIxMy0uNjY5IDUuMTA4IDEuNTIzIDYuNTc0LS44MDYtLjAyNi0xLjU2Ni0uMjQ3LTIuMjI5LS42MTYtLjA1NCAyLjI4MSAxLjU4MSA0LjQxNSAzLjk0OSA0Ljg5LS42OTMuMTg4LTEuNDUyLjIzMi0yLjIyNC4wODQuNjI2IDEuOTU2IDIuNDQ0IDMuMzc5IDQuNiAzLjQxOS0yLjA3IDEuNjIzLTQuNjc4IDIuMzQ4LTcuMjkgMi4wNCAyLjE3OSAxLjM5NyA0Ljc2OCAyLjIxMiA3LjU0OCAyLjIxMiA5LjE0MiAwIDE0LjMwNy03LjcyMSAxMy45OTUtMTQuNjQ2Ljk2Mi0uNjk1IDEuNzk3LTEuNTYyIDIuNDU3LTIuNTQ5eiIvPjwvc3ZnPg=="},250:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTQuNTY4LjA3NWMyLjIwMiAxLjE3NCA1LjkzOCA0Ljg4MyA3LjQzMiA2Ljg4MS0xLjI4Ni0uOS00LjA0NC0xLjY1Ny02LjA5MS0xLjE3OS4yMjItMS40NjgtLjE4NS00LjUzNC0xLjM0MS01LjcwMnptNy40MzIgMTAuOTI1djEzaC0yMHYtMjRoOC40MDljNC44NTcgMCAzLjMzNSA4IDMuMzM1IDggMy4wMDktLjc0NSA4LjI1Ni0uNDE5IDguMjU2IDN6bS0xNiA1aDV2LTRoLTV2NHptMTIgMmgtMTJ2MWgxMnYtMXptMC0zaC01djFoNXYtMXptMC0zaC01djFoNXYtMXoiLz48L3N2Zz4="},251:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMTIuNzEzbC0xMS45ODUtOS43MTNoMjMuOTcxbC0xMS45ODYgOS43MTN6bS01LjQyNS0xLjgyMmwtNi41NzUtNS4zMjl2MTIuNTAxbDYuNTc1LTcuMTcyem0xMC44NSAwbDYuNTc1IDcuMTcydi0xMi41MDFsLTYuNTc1IDUuMzI5em0tMS41NTcgMS4yNjFsLTMuODY4IDMuMTM1LTMuODY4LTMuMTM1LTguMTEgOC44NDhoMjMuOTU2bC04LjExLTguODQ4eiIvPjwvc3ZnPg=="},252:function(t,e,o){"use strict";o(229)},253:function(t,e,o){(e=o(36)(!1)).push([t.i,".project-item{margin:1rem;flex:0 0 auto;width:280px;height:200px;background-size:cover;overflow:hidden;position:relative;background-position:50%}.night-mode .project-item-content{background-color:rgba(0,0,0,.7)}.project-item-content{background-color:hsla(0,0%,100%,.3);color:var(--black);width:100%;height:100%;position:absolute;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;padding:5px 15px}1 .project-item-tagline{font-size:10pt}.project-item-title{font-weight:700;text-align:left}.project-item-link{border:4px solid var(--black);color:var(--black);font-weight:600;padding:5px;border-radius:50px}.project-item-link:hover{color:var(--white);background-color:var(--black)}.project-item-footer{width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center}@-webkit-keyframes slide{0%{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes slide{0%{transform:translateY(100%)}to{transform:translateY(0)}}.slide-enter-active{-webkit-animation:slide .25s;animation:slide .25s}.slide-leave-active{animation:slide .25s reverse}",""]),t.exports=e},254:function(t,e,o){"use strict";o(230)},255:function(t,e,o){(e=o(36)(!1)).push([t.i,".project-grid{display:flex;flex-direction:row;flex-wrap:wrap;width:100%;justify-content:flex-start;margin:25px auto auto}@media screen and (max-width:970px){.project-grid{flex-direction:column;align-items:center}}",""]),t.exports=e},256:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMCA3LjMzbDIuODI5LTIuODMgOS4xNzUgOS4zMzkgOS4xNjctOS4zMzkgMi44MjkgMi44My0xMS45OTYgMTIuMTd6Ii8+PC9zdmc+"},257:function(t,e,o){"use strict";o(231)},258:function(t,e,o){(e=o(36)(!1)).push([t.i,':root{--black:#000;--white:#fff}.night-mode img{filter:invert(100%)}.mini-left-bar{cursor:pointer;border:6px solid #000;border:6px solid var(--black);border-radius:50px;position:absolute;left:15px;top:40px;padding:20px 8px;font-size:14pt;background-color:#fff;background-color:var(--white)}.mini-left-bar h1{transition:none;color:#000;color:var(--black)}.mini-left-bar:hover h1{color:#fff;color:var(--white)}.mini-left-bar>div{margin-top:5px;display:block;text-align:center}.mini-left-bar img{width:65%}.mini-left-bar:hover{background-color:#000;background-color:var(--black);color:#fff;color:var(--white)}.mini-left-bar:hover img{filter:invert(100%)}.night-mode .mini-left-bar:hover img{filter:invert(0)}.leftbar{width:300px;float:left;height:100%;display:flex;flex-direction:column;justify-content:flex-start;position:fixed;padding:0 25px;color:#000;color:var(--black);background-color:#fff;background-color:var(--white)}.rightbar{float:right;height:100%;width:1240px}body,html{background-color:#fff;background-color:var(--white)}*{transition:background-color .2s ease-in-out,color .2s ease-in-out}.name{font-size:42pt;line-height:.9;margin-top:30px;margin-bottom:1rem;font-weight:600}.sidetext{font-weight:400;flex:1 1 auto}.sidetext p{margin:10px 0}.link{flex:0 1 auto;margin-bottom:30px}.link>*{margin:1rem 0}.social{text-align:left}.social a{display:inline-block;height:3.25rem;width:3.25rem;padding:6px;border-radius:30px;border:4px solid #000;border:4px solid var(--black);box-sizing:border-box;position:relative}.social a,.social a img{text-align:center}.social>a:hover{background-color:#000;background-color:var(--black)}.social>a:hover img{filter:invert(100%)}.night-mode a:hover img{filter:invert(0)}.bubble{border:4px solid #000;border:4px solid var(--black);border-radius:50px 50px;padding:5px 10px;height:3.25rem;display:flex;align-items:center;justify-content:space-between;background-color:#fff;background-color:var(--white)}.bubble:hover{background-color:#000;background-color:var(--black);color:#fff;color:var(--white)}.bubble:hover>img{filter:invert(100%)}.night-mode .bubble:hover img{filter:invert(0)}.bubble>span{padding-left:5px;font-weight:bolder;text-decoration:none;cursor:pointer;font-weight:600;color:inherit}.bubble>img{flex:0 0 auto}.emailaddress{font-size:.9rem}.toggle-switch{background-color:#fff;background-color:var(--white);border:4px solid #000;border:4px solid var(--black);border-radius:30px;height:3.25rem;padding:6px;text-align:center;cursor:pointer}.toggle-switch:focus{outline:none}.toggle-switch:hover{background-color:#000;background-color:var(--black);color:#fff;color:var(--white)}.toggle-switch:hover img{filter:invert(100%)}.night-mode .toggle-switch:hover img{filter:invert(0)}.top{display:flex;align-items:center;justify-content:center;font-size:24px;font-family:"Montserrat";font-weight:600;width:60%;margin:30px auto 0;color:#000;color:var(--black)}.top>*{margin:0 8px}@media screen and (max-width:1580px){.rightbar{width:930px}}@media screen and (max-width:1240px){.rightbar{width:620px}}@media screen and (max-width:970px){.rightbar{width:400px}}@media screen and (max-width:740px){.project-grid{flex-direction:column;align-items:center}.rightbar.fill{width:100%;display:block}.rightbar{display:none}.leftbar{width:100%}.mini-left-bar{width:300px;text-align:center;padding:10px;position:-webkit-sticky;position:sticky;left:0;top:30px;margin:30px auto 0;z-index:10}.mini-left-bar h1{display:inline}.mini-left-bar div{display:inline;margin-top:0}.mini-left-bar div,.mini-left-bar img{width:auto;height:100%}}',""]),t.exports=e},272:function(t,e,o){"use strict";o.r(e);var r=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"link"},[r("div",{staticClass:"social"},[r("a",{attrs:{href:"https://www.github.com/OneOneFour"}},[r("img",{attrs:{alt:"GitHub",src:o(247)}})]),t._v(" "),r("a",{attrs:{href:"https://www.linkedin.com/in/robert-king-8263b6140/"}},[r("img",{attrs:{alt:"LinkedIn",src:o(248)}})]),t._v(" "),r("a",{attrs:{href:"https://twitter.com/HeIsRobKing"}},[r("img",{attrs:{alt:"Twitter",src:o(249)}})])]),t._v(" "),r("a",{staticClass:"bubble",attrs:{href:"/Robert_King_CV.pdf"}},[r("img",{attrs:{src:o(250),alt:"Download"}}),t._v(" "),r("span",[t._v(" Curriculum Vitae")])]),t._v(" "),r("a",{staticClass:"bubble",attrs:{href:"mailto:robertcking98@gmail.com"}},[r("img",{attrs:{src:o(251),alt:"Email"}}),t._v(" "),r("span",{staticClass:"emailaddress"},[t._v(" robertcking98@gmail.com ")])])])}],n=o(234),c=o(225),l=o.n(c),M=o(256),d=o.n(M),j={components:{ProjectGrid:n.default},data:function(){return{windowWidth:1e3,resizeResolved:{desktop:!0,prevPane:!0}}},computed:{night:function(){return this.$store.state.night},pane:function(){return this.$store.state.pane},currentIcon:function(){return this.night?"/sun_img.svg":"/moon_img.svg"},miniArrow:function(){return this.windowWidth<740?d.a:l.a}},methods:{toggleMode:function(){this.$store.commit("toggleNight")},togglePane:function(){this.$store.commit("changePane",!this.pane)}},mounted:function(){var t=this;this.windowWidth=window.innerWidth,window.addEventListener("resize",(function(){t.windowWidth=window.innerWidth}))}},m=(o(257),o(24)),component=Object(m.a)(j,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container",class:{"night-mode":t.night,fill:!t.pane}},[t.pane?r("div",{staticClass:"leftbar"},[t.windowWidth<=740?r("button",{staticClass:"toggle-switch top",on:{click:t.togglePane}},[r("img",{attrs:{src:o(246)}}),r("span",[t._v("Projects")])]):t._e(),t._v(" "),r("h1",{staticClass:"name"},[t._v("\n      Robert King\n    ")]),t._v(" "),r("div",{staticClass:"sidetext"},[r("p",[t._v("\n      Recent Physics graduate from Imperial College. \n      ")]),t._v(" "),r("p",[t._v("\n      Interested in atmospheric science, applied maths and creating educational visualisations.\n      ")]),r("p",[t._v("\n      Feel free to check out some of my recent projects.\n    ")]),t._v(" "),r("button",{staticClass:"toggle-switch",on:{click:t.toggleMode}},[r("img",{attrs:{src:t.currentIcon}})])]),t._v(" "),t._m(0)]):r("div",{staticClass:"mini-left-bar",on:{click:t.togglePane}},[r("h1",{staticClass:"mini-left-bar-title"},[t._v("RK")]),t._v(" "),r("div",[r("img",{attrs:{src:t.miniArrow}})])]),t._v(" "),r("div",{staticClass:"rightbar",class:{fill:!t.pane}},[r("ProjectGrid")],1)])}),r,!1,null,null,null);e.default=component.exports;installComponents(component,{ProjectGrid:o(234).default})}}]);