<template>
  <div class="container">
    <h1>Hello</h1>
  </div>
</template>
<style>
:root{
  --black:black;
  --white:white;
}
@media(prefers-color-scheme: dark){
    .container{
        background-color:var(--black);
        color:var(--white);
    }
}
.container{
  background-color: var(--white);
  color:var(--black);
}

</style>