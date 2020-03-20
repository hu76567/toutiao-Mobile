<template>
    <div class='container'>
     <van-tabs>
       <!-- title为显示内容 -->
        <van-tab :title="item.name" v-for="item in channels" :key="item.id">
           <!-- 列表单元格组件 -->
           <!-- 需要将频道id、传递给列表组件  父传子 -->
           <!-- 监听list子组件触发的showAction事件 -->
           <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
          </van-tab>
     </van-tabs>
     <!-- 在tabs下放置图标  编辑频道的图标 -->
     <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
       <van-icon name="wap-nav"></van-icon>
     </span>
     <!-- 放置 一个弹层组件 -->
      <van-popup v-model="showMoreAction" style="width:75%">
        <!-- 放置反馈组件 监听点击不感兴趣-->
        <MoreAction @dislike="disLike" />
      </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getmyChannels } from '@/api/channels'
import MoreAction from './components/more-action'
import { dislikeArticle } from '@/api/articles'
export default {
  name: 'home',
  components: {
    ArticleList, MoreAction
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈组件显示隐藏
      articleId: null // 接收点击的文章id
    }
  },
  methods: {
    // 定义一个方法来发请求
    async getmyChannels () {
      const data = await getmyChannels() // 这个是请求
      this.channels = data.channels // 赋值给data中
    },
    openAction (artId) {
      // 点击了子组件的×,弹出反馈层
      this.showMoreAction = true
      // 把list子组件传过来的id存储起来
      this.articleId = artId
    },
    async disLike () {
      // 调用不感兴趣接口
      try {
        await dislikeArticle({
          target: this.articleId
        })
        this.$hnotify({
          type: 'success',
          message: '操作成功'
        })
      } catch (error) {
        this.$hnotify({
          message: '操作失败'
        })
      }
    }
  },
  created () {
    // 调用刚才的方法来获取频道数据
    this.getmyChannels()
  }
}
</script>
<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  // /deep/可以使子组件也生效 深度选择器
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
