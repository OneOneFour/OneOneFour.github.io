<template>
  <div>
    <Nuxt />
  </div>
</template>
<script>
export default {

  mounted(){
    if(process.client){
      if(localStorage.getItem('night') === 'true'){
        this.$store.commit('toggleNight',true)
      }
        let vh = window.innerHeight *0.01;
      document.documentElement.style.setProperty('--vh',`${vh}px`)
    }

  }
}
</script>
<style> 
@import url('@/assets/devicon.css');

</style>
