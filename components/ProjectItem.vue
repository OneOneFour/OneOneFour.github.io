<template>
    <div class="project-item" :style="itemStyle" @mouseenter="mouseOver = true"  @mouseleave="mouseOver=false; showToolTip=false;">
        <transition :key="0" name="slide">
            <div v-if="mouseOver" class="project-item-content">
                <h3 class="project-item-title"> {{project.title}}</h3>
                {{startDate}}{{endDate}}
                <p class="project-item-tagline"> {{project.tagline}}</p>
                <div class="project-item-footer">
                    <a class="project-item-link" v-if="project.directLink" :href="project.directLink">View</a>
                    <NuxtLink v-else class="project-item-link" :to="projectUrl">View</NuxtLink>
                    <ProjectIcons :tech="project.tech" />
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import ProjectIcons from '@/components/ProjectIcons.vue';
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]
export default {
    name:'ProjectName',
    props:{
        project:{
            type:Object,
            required:true
        }
    },
    components:{
        ProjectIcons
    },
    data(){
        return {
            mouseOver:false,
            showToolTip:false
        }
    },
    methods:{
        getMonthStr(i){
            if(typeof months[i-1] !== 'undefined'){
                return months[i - 1];
            }
            return "";
        }
    },
    computed:{
        endDate(){
            return this.getMonthStr(this.project.month) + " " + this.project.year
        },
        startDate(){
            if(typeof this.project.start_year !== 'undefined'){
                return this.getMonthStr(this.project.start_month) + " "  + this.project.start_year + " - "
            }
            return ""
            
        },
        projectUrl(){
            return `/project/${this.project.slug}`
        },
        itemStyle(){
            return {
                'background-image': (typeof this.project.image != 'undefined')? `url(${this.project.image})`:'url(/blank.png)'
            }
            
        }
    },
}
</script>
<style>


.project-item{
    margin: 1rem;
    flex: 0 0 auto;
    width: 280px; 
    height: 200px;
    background-size:cover;
    overflow:hidden;
    position:relative;
    background-position: center;
}
.night-mode .project-item-content{
    background-color: rgba(0,0,0,0.7);
}
.project-item-content{
    background-color: rgba(255,255,255,0.3);
    color:var(--black);
    width:100%;
    height:100%;
    position:absolute;
    backdrop-filter:blur(10px);
     -webkit-backdrop-filter: blur(10px);

    display:flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding: 5px 15px;
}1
.project-item-tagline{
    font-size:10pt;
}
.project-item-title{
    font-weight:700;
    text-align: left;
}
.project-item-link{
    border: 4px solid var(--black);
    color:var(--black);
    font-weight:600;
    padding: 5px;
    border-radius:50px;
}
.project-item-link:hover{
    color:var(--white);
    background-color: var(--black);
}


.project-item-footer{
    width:100%;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
@keyframes slide{
    0%{
        transform:translateY(100%);
    }
    100%{
        transform:translateY(0);
    }
}
.slide-enter-active{
    animation: slide 0.25s;
}
.slide-leave-active{
    animation:slide 0.25s reverse;
}
</style>