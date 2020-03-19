<template>
  <!-- 文章列表组件 -->
  <!-- 放置这个div的目的是形成滚动条,用于做阅读记忆 -->
  <div class="scroll-wrapper">
    <!-- 当组件滚动到底部时， 检测长度 会触发load事件 loading => true -->
    <van-pull-refresh v-model="refreshed" @refresh="onRefresh" :success-text="successText">
      <van-list finished-text="亲,没有数据了哦" @load="onLoad" :finished="finished" v-model="loading">
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item">
            <!-- 放置列表循环项 -->
            <!-- 三图 -->
            <div class="article_item">
              <h3 class="van-ellipsis">哈哈哈哈哈这是标题</h3>
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      successText: '', // 下拉成功提示
      refreshed: false, // 上拉刷新
      loading: false, // 是否开启上拉加载,默认为false
      finished: false, // 是否完成所有数据加载
      articles: [] // 文章列表
    }
  },
  methods: {
    onLoad () {
      // 上拉加载
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        // 把数据加载到数组的队尾
        this.articles.push(...arr)
        // 添加完数据关闭loading
        this.loading = false
      }
    },
    onRefresh () {
      // 下拉刷新, 读取新数据 ,新数据在articles头部
      setTimeout(() => {
        const arr = Array.from(
          Array(7),
          (value, index) => '追加' + (index + 1)
        )
        // 加到数组头部
        this.articles.unshift(...arr)
        // 关闭下拉刷新状态
        this.refreshed = false
        this.successText = `成功加载了${arr.length}条数据`
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
