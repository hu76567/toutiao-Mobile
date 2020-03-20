<template>
  <!-- 文章列表组件 -->
  <!-- 放置这个div的目的是形成滚动条,用于做阅读记忆 -->
  <div class="scroll-wrapper">
    <!-- 下拉刷新解构 -->
    <!-- 下拉刷新时会触发@refresh -->
    <!-- v-model控制是否加载完成 -->
    <!-- 因为刷新时对整个列表刷新,所以需要包裹列表组件 -->
    <van-pull-refresh v-model="refreshed" @refresh="onRefresh" :success-text="successText">
      <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度-->
      <!-- 如果超过了限定 ,就会执行 load事件 -->
      <!-- 自动把绑定的 loading 变成true -->
      <!-- 上拉加载列表组件 -->
      <van-list finished-text="亲,没有数据了哦" @load="onLoad" :finished="finished" v-model="loading">
        <van-cell-group>
          <!-- item.art_id 此时是一个大数字的对象 v-for 的key需要用字符串或者数字代理 -->
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 根据封面类型决定是三图 单图 还是 无图 -->
              <!-- 三图 懒加载lazy-load -->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]"/>
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]"/>
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]"/>
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]"/>
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <!-- 使用过滤器 -->
                <span>{{item.pubdate | relTime}}</span>
                <!-- ×号的显示应该根据是否登陆来判断 登录时显示 未登录不显示 -->
                <!-- 被父组件监听是否点击了×  需要传出点击的文章id -->
                <span class="close" v-if="user.token" @click="$emit('showAction',item.art_id.toString())">
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
// 引入获取文章的模块
import { getArticles } from '@/api/articles'
// 引入store
import { mapState } from 'vuex'
import eventbus from '@/utils/eventbus'
export default {
  computed: {
    ...mapState(['user'])
  },
  name: 'article-list',
  data () {
    return {
      successText: '', // 下拉刷新成功的提示
      refreshed: false, // 是否开启下拉刷新
      loading: false, // 是否开启上拉加载,默认为false
      finished: false, // 是否完成所有数据加载
      articles: [], // 文章列表数组
      timestamp: null // 用来存放时间戳
    }
  },
  props: {
    // key(props 属性名):value(对象 配置)
    channel_id: {
      required: true, // 必填项 ,可以约束必传的值
      type: Number, // 表示传入的prop的类型
      default: null // 默认值 没传入用默认值
    }
  },
  methods: {
    // 上拉加载
    async onLoad () {
      /**
       if (this.articles.length > 50) {
        // 表示数据全部加载完成
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
      } */

      // 延迟处理函数
      await this.$sleep()
      // 如果有历史时间戳用历史时间戳,没有就用当前时间
      // 第一次加载, 时间戳的是空的, 所以给当前时间戳
      const res = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 把取回的数据追加在队尾
      this.articles.push(...res.results)
      // 关闭加载状态
      this.loading = false
      // 将历史时间戳给timestamp  赋值之前判断历史时间戳是否为零
      // 如果为零说明此时已经没有数据了,宣布结束 将finished设置为 true
      if (res.pre_timestamp) {
      // 表示还有数据可以进行加载
        this.timestamp = res.pre_timestamp
      } else {
        // 没有数据可以请求了了
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
    /** *
     下拉刷新, 读取新数据 ,新数据在articles头部
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
     * ***/

      // 强制等待,人为控制请求时间 在utils/plugin
      // 防止用户刷新太频繁
      // 控制刷新时间
      await this.$sleep()
      // 下拉刷新应该发最新的时间戳
      const res = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now()
      })
      this.refreshed = false
      // 此时需要判断新的时间戳能否换来数据
      // 如果能换来数据,就整个替换旧数据 ,若果没有就提示没有更新
      if (res.results.length) {
        // 将数据覆盖历史数据
        this.articles = res.results
        // 此时的finished是true
        if (res.pre_timestamp) {
          // 更新来的新数据中又有历史时间戳
          // 需要把finished唤醒
          this.finished = false // 让列表可以继续上拉加载
          this.timestamp = res.pre_timestamp // 记录历史时间戳
          this.successText = `更新了${res.results.length}条数据`
        }
      } else {
        // 如果换不来新数据
        this.successText = '当前已经是最新了哦'
      }
    }
  },
  created () {
    // 监听父组件不感兴趣删除
    eventbus.$on('delArticle', (artId, channelId) => {
      // 判断一下传过来的频道id是否等于自身的频道
      if (channelId === this.channel_id) {
        // 说明这个list就是要删除的
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          this.articles.splice(index, 1) // 删除对应下标的数据
        }
        if (this.articles.length === 0) {
          // 此时说明数据删除光了
          this.onLoad() // 手动触发onLoad事件
        }
      }
    })
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
