<template>
   <div class="project-detail-item project-images-container">
    <div class="project-images">
        <button class="toggle-switch-pi" v-if="imageUrls.length > 1 && showButtons" @click="changeImg(1)"><img src="@/assets/iconmonstr-arrow-64.svg" /></button>
        <div class="img-holder">
        <img :src="imageUrls[currentImg]" />
        </div>
        <button class="toggle-switch-pi" v-if="imageUrls.length > 1 && showButtons" @click="changeImg(-1)"> <img src="@/assets/iconmonstr-arrow-25.svg"/></button>
    </div>
    </div>
</template>
<script>
export default {
    name:"ProjectImages",
    props:{
        imageUrls:{ // Array of urls of image
            type:Array,
            required:true
        },
        autoScrollDuration:{
            type:Number,
            default:0
        },
        showButtons:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            currentImg:0
        }
    },
    methods:{
        changeImg(increment){
            this.currentImg = this.currentImg + increment
            if(this.currentImg >= this.imageUrls.length) this.currentImg = 0;
            if(this.currentImg < 0) this.currentImg = this.imageUrls.length - 1;
        }
    },
    mounted(){
        if(this.autoScrollDuration > 0){
            setInterval( function () {
                this.changeImg(1)
            }.bind(this),this.autoScrollDuration)
        }
    }
}
</script>
<style>
.project-images-container{
    grid-row:2/3;
    grid-column: 1/2;
    align-self:center;
    height:100%;
}
.toggle-switch-pi{
  background-color: var(--white);
  border: 4px solid var(--black);
  color:var(--black);
  border-radius: 30px;
  padding:6px;
  text-align: center;
  cursor:pointer;
  height:32px;
  width:32px;
}
.toggle-switch-pi:focus{
    outline:none;
}
.toggle-switch-pi:hover{
    background-color: var(--black);
    color:var(--white);
}
.toggle-switch-pi > img{
    width:12px;
}
.toggle-switch-pi:hover > img{
    filter:invert(100%);
}
.night-mode .toggle-switch-pi:hover > img{
    filter:invert(0%);
}

.link-images > h2{
    margin-bottom: 15px;
}
.project-images{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height:100%;
}
.project-images > .img-holder{
    flex:1 1 auto;

}
.img-holder{
    text-align: center;
    height:100%;
    display:flex;
    align-items: center;
    justify-content: center;
}
.img-holder img{
    max-width:95%;
    max-height:95%;
}
</style>