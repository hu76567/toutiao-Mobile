<template>
    <div class="more-action">
    <!-- 单元格组1 -->
    <!-- v-if v-else 前面满足前面显示 后面满足后面显示 -->
    <van-cell-group v-if="!isReport">
        <!-- 触发自定义事件,告诉父组件不感兴趣 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <!-- 单元格组2 -->
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
        <!-- 注册举报项的点击事件 -->
      <van-cell @click="$emit('report',item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 引入 常量文件 内容是举报中的选项
import { reports } from '@/api/constants'
import eventbus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false,
      reports: reports // 定义report的变量  初始值来源于constants
    }
  },
  created () {
    // 监听父组件删除文章事件,重置显示状态
    eventbus.$on('delArticle', () => { this.isReport = false })
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
