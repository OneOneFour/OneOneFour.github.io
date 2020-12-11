<template>
    <div class="project-icons" :style="{'display': inline? 'inline':'block'}">
            <i v-for="lang in techIcons" :class="`devicon-${lang.icon.toLowerCase()}`" :key="lang.icon" :title="lang.name"></i> 
            <span class="tooltip-hint" v-if="techNoIcons.length > 0" :title="techNoIconsStr">
            +
            </span>
    </div>
</template>
<script>
export default {
    name:"ProjectIcons",
    props:{
        tech:{
            type:Array,
            required:true
        },
        inline:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        techIcons(){
            if(typeof this.tech !== 'undefined'){
                return this.tech.filter(x=> typeof x.icon != 'undefined')
            }else{
                return []
            }  
        },
        techNoIcons(){
            if(typeof this.tech !== 'undefined'){
                return this.tech.filter(x=> typeof x.icon == 'undefined')
            }else{
                return []
            }  
        },
        techNoIconsStr(){
            return this.techNoIcons.map(x=>x.name).join('\n')
        }
    }
}
</script>
<style>
.tooltip-hint{
    font-weight:600;
    font-size:20pt;
}
.project-icons > i{
    margin: 0 5px;
    font-size:16pt;
}
</style>