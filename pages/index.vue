<template>
  <div class="container" :class="{'night-mode':night,'fill':!pane}">
    <div class="leftbar" v-if="pane">
      <button class="toggle-switch top" @click="togglePane" v-if="windowWidth <= 740"><img src="@/assets/iconmonstr-arrow-66.svg"/><span>Projects</span></button>
      <h1 class="name">
        Robert King
      </h1>
      <div class="sidetext">
        <p>
        Recent Physics graduate from Imperial College. 
        </p>
        <p>
        Interested in atmospheric science, applied maths and creating educational visualisations.
        <p>
        Feel free to check out some of my recent projects.
      </p>
      <button class="toggle-switch" @click="toggleMode"><img :src="currentIcon"/> </button>
      </div>
      <div class="link">
        <div class="social">
          <a href="https://www.github.com/OneOneFour"> <img alt="GitHub" src="@/assets/iconmonstr-github-1.svg"/> </a>
          <a href="https://www.linkedin.com/in/robert-king-8263b6140/"> <img alt="LinkedIn" src="@/assets/iconmonstr-linkedin-1.svg"/> </a>
          <a href="https://twitter.com/HeIsRobKing"> <img alt="Twitter" src="@/assets/iconmonstr-twitter-1.svg"/> </a>
      </div>
      
      <a class=bubble href="/Robert_King_CV.pdf">  <img src="@/assets/iconmonstr-file-23.svg" alt="Download"/> <span> Curriculum Vitae</span> </a> 
      <a href="mailto:robertcking98@gmail.com" class="bubble"> <img src="@/assets/iconmonstr-email-1.svg" alt="Email"/> <span class="emailaddress"> robertcking98@gmail.com </span></a>
      
      </div>
    </div>
    <div class="mini-left-bar" v-else @click="togglePane">
      <h1 class="mini-left-bar-title">RK</h1>
      <div>
        <img :src="miniArrow"/>
      </div>

    </div>
      <div class="rightbar" :class="{'fill':!pane}">
        <ProjectGrid/>
      </div>
  </div>
</template>

<script>
import ProjectGrid from '../components/ProjectGrid.vue'
import right_arrow from '@/assets/iconmonstr-arrow-25.svg'
import down_arrow from '@/assets/iconmonstr-arrow-65.svg'

export default {
  components:{
    ProjectGrid
  },
  data(){
    return{
      windowWidth:1000,
      resizeResolved:{desktop:true,prevPane:true}
    }
  },
  computed:{
    night(){
      return this.$store.state.night
    },
    pane(){
      return this.$store.state.pane
    },
    currentIcon(){
      return (this.night)?  '/sun_img.svg': '/moon_img.svg'
    },
    miniArrow(){
      return (this.windowWidth < 740)? down_arrow:right_arrow;
    }
  },
  methods:{
    toggleMode(){
      this.$store.commit('toggleNight')
    },
    togglePane(){
      this.$store.commit('changePane',!this.pane)
    }
  },
  mounted(){
    if(process.client){
      this.windowWidth = window.innerWidth
      window.addEventListener('resize',()=>{
        this.windowWidth = window.innerWidth
      })
    }
    
  }
}
</script>

<style>
:root{
  --black:black;
  --white:white;
}
.night-mode img{
  filter:invert(100%);
}

.mini-left-bar{
  cursor:pointer;
  border:6px solid var(--black);
  border-radius: 50px;
  position:absolute;
  left: 15px;
  top:40px;
  padding:20px 8px;
  font-size:14pt;
  background-color: var(--white);
}
.mini-left-bar h1{
  transition: none;
  color:var(--black);
}
.mini-left-bar:hover h1{
    color:var(--white);
}
.mini-left-bar > div{
  margin-top: 5px;
  display:block;
  text-align: center;
}
.mini-left-bar img{
  width:65%;
}

.mini-left-bar:hover{
  background-color: var(--black);
  color:var(--white);
}
.mini-left-bar:hover img{
  filter:invert(100%);
}
.night-mode .mini-left-bar:hover img{
  filter:invert(0%);
}


.leftbar{
  width:300px;
  float:left;
  height:100%;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
  position:fixed;
  padding: 0 25px;
  color:var(--black);
  background-color: var(--white);
}
.rightbar{
  float:right;
  height:100%;
  width: 1240px;
  /* color:var(--black);
  background-color: var(--white); */
}
html,body{
  background-color: var(--white);

}
*{
  transition: background-color 0.2s ease-in-out,color 0.2s ease-in-out;
}



.name{
  font-size:42pt;
  line-height: 0.9;
  margin-top:30px;
  margin-bottom: 1rem;
  font-weight: 600;
}
.sidetext{
  font-weight: 400;
  flex: 1 1 auto;
}
.sidetext p{
  margin:10px 0;
}
.link{
  flex: 0 1 auto;
  margin-bottom: 30px;
}
.link > * {
  margin: 1rem 0;
}
.social{
  text-align: left;
}
.social a{
  display:inline-block;
  height:3.25rem;
  width:3.25rem;
  padding: 6px;
  border-radius: 30px;
  border: 4px solid var(--black);
  box-sizing: border-box;
  position:relative;
  text-align: center;

  /* color:white; */
}
.social a img{
  text-align:center;
}

.social > a:hover{
  background-color:var(--black);
}
.social > a:hover img{
  filter:invert(100%);

}
.night-mode a:hover img{
  filter:invert(0%);
}

.bubble{
  border: 4px solid var(--black);
  border-radius: 50px 50px;
  padding: 5px 10px;
  height:3.25rem;
  display:flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--white); /* Change this to something nicer */
}
.bubble:hover{
  background-color: var(--black);
  color:var(--white);

}
.bubble:hover > img{
  filter:invert(100%);
}
.night-mode .bubble:hover img{
  filter:invert(0%);
}
.bubble > span{
  padding-left: 5px;
  font-weight: bolder;
  text-decoration: none;
  cursor:pointer;
  font-weight: 600;
  color:inherit;
} 

.bubble > img{
  flex: 0 0 auto;
} 

.emailaddress{
  font-size: 0.9rem;

}

.toggle-switch{
  background-color: var(--white);
  border: 4px solid var(--black);
  border-radius: 30px;
  height:3.25rem;
  padding:6px;
  text-align: center;
  cursor:pointer;
}

.toggle-switch:focus{
  outline: none;
}
.toggle-switch:hover{
  background-color: var(--black);
  color: var(--white);
}
.toggle-switch:hover img{
  filter:invert(100%);
}
.night-mode .toggle-switch:hover img{
  filter:invert(0%);
}

.top {
  margin-top:30px;
  display:flex;
  align-items: center;
  justify-content: center;
  font-size:24px;
  font-family: "Montserrat";
  font-weight:600;
  width:60%;
  margin: 30px auto 0 auto;
  color: var(--black);
}
.top > *{
  margin: 0 8px;
}



/* Three Column */
@media screen and (max-width:1580px) {
  .rightbar{
    width: 930px;
  }

}

/* Two Column */
@media screen and (max-width:1240px) {

  .rightbar{
    width: 620px;
  }
}

@media screen and (max-width:970px) {


   .rightbar{
    width:400px;
  }

}
@media screen and (max-width:740px) {
  .project-grid{
      flex-direction: column;
      align-items:center;
  }
   .rightbar.fill{
    width:100%;
    display:block;
  }
  .rightbar{
    display:none;
  }
  .leftbar{
    width:100%;
  }
  .mini-left-bar{
    width:300px;
    margin: 0 auto;
    text-align: center;
    padding: 10px;
    position:sticky;
    left:0;
    top:30px;
    margin-top:30px;
    z-index: 10;
  }
  .mini-left-bar h1{
    display: inline;

  }
  .mini-left-bar div{
    display:inline;
    width:auto;
    margin-top:0;
    height:100%;
  }
  .mini-left-bar img{
    width:auto;
    height:100%;
  }
}

</style>
