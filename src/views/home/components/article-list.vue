<template>
  <!-- 文章列表组件 -->
  <!-- 放置这个div的目的是形成滚动条,用于做阅读记忆 -->
  <div class="scroll-wrapper">
      <!-- 当组件滚动到底部时， 检测长度 会触发load事件 loading => true -->
        <van-list finished-text="亲,没有数据了哦" @load="onLoad" :finished="finished" v-model="loading">
          <van-cell-group >
            <van-cell v-for="item in articles" :key="item" title="美股熔断" :value="'天台排队'+item"></van-cell>
          </van-cell-group>
        </van-list>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      loading: false, // 是否开启上拉加载,默认为false
      finished: false, // 是否完成所有数据加载
      articles: [] // 文章列表
    }
  },
  methods: {
    onLoad () {
      // setTimeout(() => {
      //   this.finished = true
      // }, 1500)
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        // 把数据加载到数组的队尾
        this.articles.push(...arr)
        // 添加完数据关闭loading
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
