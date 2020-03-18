<template>
  <!-- 文章列表组件 -->
  <!-- 放置这个div的目的是形成滚动条,用于做阅读记忆 -->
  <div class="scrollwrapper">
      <!-- 当组件滚动到底部时，会触发load事件 loading => true -->
        <van-list @load="onLoad" :finished="finished" v-model="loading"></van-list>
        <!-- 初始化后就会检测长度 超过限定就会执行 load 把loading设成true -->
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      loading: false, // 是否开启上拉加载,默认为false
      finished: false // 是否完成所有数据加载
    }
  },
  methods: {
    onLoad () {
      setTimeout(() => {
        this.finished = true
      }, 1500)
    }
  }
}
</script>

<style>

</style>
