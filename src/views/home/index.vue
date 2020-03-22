<template>
    <div class='container'>
       <!-- 放置tabs组件  默认绑定激活页签-->
     <van-tabs v-model="activeIndex">
       <!-- title为显示内容 -->
        <van-tab :title="item.name" v-for="item in channels" :key="item.id">
           <!-- 列表单元格组件 -->
          <!-- 监听子组件中的showAction -->
           <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
        </van-tab>
     </van-tabs>
     <!-- 在tabs下放置图标  编辑频道的图标 -->
     <!-- 注册点击事件 显示频道编辑 -->
     <span class="bar_btn" @click="showChannelEdit=true">
        <!-- 放入图标 vant图标 -->
       <van-icon name="wap-nav"></van-icon>
     </span>
      <!-- 反馈弹层组件 v-model控制弹层组件是否显示,默认为隐藏 -->
      <van-popup v-model="showMoreAction" style="width:80%">
        <!--不感兴趣\举报公用一个方法-->
        <!-- 监听more-action中的不感兴趣和举报的自定义事件,调用接口 -->
        <!-- @事件名="方法名($event)" -->
        <!-- $event是事件参数 在h5标签中 dom元素的事件参数, 自定义事件中 是自定义事件传出的第一个参数 -->
        <!-- report的第一个参数item.value 举报的类型 作为type的实参 -->
        <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)" />
      </van-popup>
        <!-- 频道编辑 -->
        <!-- v-model 控制显示和隐藏 -->
        <!-- title 标题 -->
      <van-action-sheet :round="false" v-model="showChannelEdit" title="频道编辑">
        <!-- 把父组件我的频道传递给子组件edit -->
        <channelEdit :channels="channels"></channelEdit>
      </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import channelEdit from './components/channel-edit'
import { getmyChannels } from '@/api/channels'
import { dislikeArticle, reportArticle } from '@/api/articles' // 引入不感兴趣和举报的接口
import eventbus from '@/utils/eventbus' // 公共事件池

export default {
  name: 'home',
  components: {
    ArticleList, MoreAction, channelEdit
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 控制反馈组件显示隐藏
      articleId: null, // 接收article-list点击的文章id
      activeIndex: 0, // 当前默认激活的页签
      showChannelEdit: false // 是否显示频道编辑组件
    }
  },
  methods: {
    // 获取频道信息
    async getmyChannels () {
      const data = await getmyChannels() // 这个是请求
      this.channels = data.channels // 赋值给data中
    },
    // openAction()会在article-list组件触发 showAction的时候 触发
    openAction (artId) {
      // 点击了子组件的×,弹出反馈层
      this.showMoreAction = true
      // 把list子组件传过来的id存储起来
      this.articleId = artId // 把article list子组件传过来id存储在data中
    },
    // 公用方法  不感兴趣和举报
    async dislikeOrReport (operateType, type) {
      // 调用不感兴趣接口
      try {
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId
        }) : await reportArticle({ target: this.articleId, type })
        // 触发一个事件,利用事件广播机制,通知对应的tab来删除
        // this.articleId //要删除的文章的id
        // this.channels[this.activeIndex].id 当前激活的频道的id
        // 将文章id和频道id作为事件的参数
        // 触发delArticle删除的自定义事件
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMoreAction = false // 关闭弹层
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
    // 获取频道数据
    this.getmyChannels()
  }
}
</script>
<style lang="less" scoped>
// 处理频道编辑的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
