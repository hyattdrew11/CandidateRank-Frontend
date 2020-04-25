<template>
  <div id="app">
  	<vue-progress-bar></vue-progress-bar>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh
}
@import './assets/sass/style.scss'
</style>
