<template>
  <div id="app">
    <keep-alive>
          <router-view v-if="$route.meta.isAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>
