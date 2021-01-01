<template>
    <div class="container">
        <div class="bar">
             <h1 class="project-logo"><NuxtLink to="/">Robert <span>King</span></NuxtLink></h1>
            <div class="titlebox">
                <h1 class="project-name">{{title}}</h1>
                <h4 class="project-tagline">{{tagline}}</h4>
            </div>
            <h3>
            NYU Application Video
            </h3>

        </div>
        <section class="main">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/p60OWCBusUI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <p>
            Please find above my application video for my PhD appliciation to the NYU PhD program for Atmospheric, Ocean Science and Mathematics.
            If the above embeded video does not work, please try this link: <a href="https://www.youtube.com/watch?v=p60OWCBusUI">https://www.youtube.com/watch?v=p60OWCBusUI</a> 
            <br/>
            I hope you enjoy the video and reviewing the rest of my application! 
        </p>
        </section>
      
    </div>
</template>
<style scoped>
h3{
    margin-left:10px;
    font-size:25pt;
}
.main{
    padding-top:40px;
    width:100%;
    text-align:center;
    position:relative;
}
.main p{
    font-size:14pt;
    width:80%;
    text-align:left;
    margin: 20px auto;
}
.main iframe{
    width:80%;
    height:60vh;
}
.bar{
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 30px 0 10px 0;
}
.project-logo{
    font-weight: 600;
    line-height: 0.9;
    font-size:25pt;
    border-right: 7px solid var(--black);
    padding-right: 10px; 
}
.project-logo span{
    display:block;
}
</style>