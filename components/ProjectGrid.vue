<template>
    <div class="project-grid">
        <project-item v-for="(proj,i) in allProjects" :key="i" :project="proj"/> 
    </div>
</template>
<script>
import ProjectItem from '@/components/ProjectItem.vue'
export default {
    data(){
        return {
            allProjects: []
        }
    },
    async fetch(){
        this.allProjects = await this.$content("projects").sortBy('year','desc').sortBy('month','desc').fetch()
    }
}
</script>
<style>
.project-grid{
    display:flex;
    flex-direction: row;
    flex-wrap:wrap;
    width:100%;
    margin:auto;
    justify-content:flex-start;
    margin-top:25px;
}
@media screen and (max-width:970px) {
  .project-grid{
      flex-direction: column;
      align-items:center;
  }
}



</style>