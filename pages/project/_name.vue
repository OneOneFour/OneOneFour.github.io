<template>
    <div class="container project-detail"  :class="{'night-mode':$store.state.night}">
        <div class="bar">
            <h1 class="project-logo"><NuxtLink to="/">Robert <span>King</span></NuxtLink></h1>
            <div class="titlebox">
                <h1 class="project-name">{{title}}</h1>
                <h4 class="project-tagline">{{tagline}}</h4>
            </div>
            <ProjectIcons :tech="tech" />
        </div>
        <ProjectLinks :links="links"/>

         <div class="link-description project-detail-item">
             <h2 class="description-title">description</h2>
             <div class="description-content">
                <nuxt-content :document="descriptionMarkdown"></nuxt-content>
             </div>
         </div>
     
        <ProjectImages :imageUrls="slideshow" v-if="slideshow" />
    </div>
</template>
<script>
import ProjectLinks from '@/components/ProjectLinks.vue'
import ProjectIcons from '@/components/ProjectIcons.vue'
import ProjectImages from '@/components/ProjectImages.vue'
export default {
    name:'ProjectPage',
    components:{
        ProjectIcons,
        ProjectImages,
        ProjectLinks
    },
    async asyncData({$content,params,error}){
            const project = (await $content('projects').where({slug:params.name}).fetch())[0]
   
            if(typeof project == 'undefined'){
                error({statusCode:404,message:`Project '${params.name}' not found`})
            }
            try{
                project.descriptionMarkdown = await $content(params.name).fetch()
            }
            catch(e){}

            return project
    }
}
</script>
<style>
.link-description{
    grid-row: 2/4;
}
.project-detail{
    display:grid;
    grid-template-columns: 65% 35%;
    grid-template-rows: 110px minmax(0,4fr) 1fr;
}
 .description-content{
    overflow:auto;
    height:90%;
    font-size:12pt;
}
.project-detail-item{
    padding:15px 0;
    position:relative;
}
.project-detail-item h2{
    margin-bottom: 15px;
}

.project-logo{
    font-weight: 600;
    line-height: 0.9;
    font-size:25pt;
    border-right: 7px solid var(--black);
    padding-right: 10px; 
}
.project-tagline{
    font-weight: 400;
    font-size:11pt;
}
.project-logo span{
    display:block;
}
.titlebox{
    padding-left: 10px;
    flex: 1 1 auto;
}
.bar {
    grid-column: 1/3;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 30px 0 10px 0;
}
.project-page{
    width:1240px;
    margin:0 auto;
}
.divider{
    height:100%;
    width:7px;
    background-color: black;
    margin: 0 15px;
}
@media screen and (max-width:740px) {
    .project-detail{
        display:flex;
        flex-direction: column;
        align-items: center;
        padding: 0px 30px;
    }
    .project-images-container{
        order:1;
    }
    .project-links{
        order:2;
        width:100%;
    }
    .link-description{
        order:3;
    }
    .description-content{
        overflow:visible;
    }
}

</style>