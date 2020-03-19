<template>
    <div class='container'>
     <van-tabs>
       <!-- title为显示内容 -->
        <van-tab :title="item.name" v-for="item in channels" :key="item.id">
           <!-- 列表单元格 -->
           <!-- 需要将频道id、传递给列表组件  父传子 -->
           <ArticleList :channel_id="item.id"></ArticleList>
          </van-tab>
     </van-tabs>
     <!-- 在tabs下放置图标  编辑频道的图标 -->
     <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
       <van-icon name="wap-nav"></van-icon>
     </span>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getmyChannels } from '@/api/channels'
export default {
  name: 'home',
  components: {
    ArticleList
  },
  data () {
    return {
      channels: []
    }
  },
  methods: {
    async getmyChannels () {
      const data = await getmyChannels() // 这个是请求
      this.channels = data.channels // 赋值给data中
    }
  },
  created () {
    // 获取频道数据
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
