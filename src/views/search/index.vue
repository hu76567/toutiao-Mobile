<template>
  <div class="container">
    <!-- left-arrow显示返回箭头 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'search'
}
</script>

<style>

</style>
