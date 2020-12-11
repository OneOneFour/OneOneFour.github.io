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

html {
  font-family:
    "Montserrat",
    sans-serif;
    font-size:10.5pt;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}


</style>
