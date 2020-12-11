<template>
    <div class="project-detail-item project-links">
    <h2>links</h2>
        <div class="project-links-holder">

            <a class="link-bubble" v-for="link in links" :key="link.type" :href="link.url">
                <i :class="`devicon-${link.logo}`" v-if="typeof link.logo !== 'undefined'"></i>
                <span>{{link.type}}</span>
                
            </a>
        </div>
    </div>
</template>
<script>
export default {
    name:'ProjectLinks',
    props:{
        links:{
            type:Array,
            required:true
        }
    }
}
</script>
<style>
.project-links{
    grid-column: 1/2;
    grid-row: 3/4;
}
.project-links-holder{
    display:flex;
    justify-content: flex-start;
}
.link-bubble{
    flex:0 1 auto;
    margin-right: 20px;
    text-align:left;
    border: 6px solid var(--black);
    background-color: var(--white);
    color: var(--black);
    border-radius: 50px;
    padding: 5px 10px;
    font-size: 12pt;
    font-weight:600;
    min-height:3.25rem;
    display:flex;
    align-items: center;
    transition: background-color 0.1s linear, color 0.1s linear;
}
.link-bubble:hover{
    background-color:var(--black);
    color:var(--white);
}
.link-bubble > i{
    margin-right:10px;
}
@media screen and (max-width:970px) {
    .project-links-holder{
        flex-direction: column;
        justify-content: flex-start;
    }
    .link-bubble{
        margin: 10px 50px 10px 0;
    }
}
@media screen and (max-width:740px){
    .project-links-holder{
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>