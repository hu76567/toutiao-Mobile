<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 有输入内容时显示模糊查询,没有时显示搜索记录 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 模糊查询 -->
    <van-cell-group class="suggest-box" v-if="q" >
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 搜索记录 -->
    <div class="history-box" v-else>
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 清空历史记录 -->
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 两个点击事件 事件冒泡 阻止事件冒泡 -->
        <!-- vue中用修饰符stop来阻止事件冒泡 -->
        <!-- 点击记录进到结果界面 -->
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 注册×的点击事件 删除历史记录 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'toutiao-h' // 用来读取本地缓存中的历史记录
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字数据
      historyList: [] // 历史记录数据  数组
    }
  },
  methods: {
    // 删除历史记录
    // 先在data中删除 然后同步到本地缓存
    delHistory (index) {
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    toResult (text) {
      // 传参给结果界面 params/query
      // this.$router.push(`/search/result?q=${text}`)
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确定要删除所有历史记录么'
        })
        this.historyList = [] // 历史记录置空
        localStorage.setItem('key', '[]') // 本地记录置空
      } catch (error) {
        // 不需要操作
      }
    },
    // 监听搜索回车事件 搜索时触发
    // q是v-model的q搜索的内容
    onSearch () {
      // 判断搜索内容为空 为空直接返回
      if (!this.q) return
      // 加到历史记录
      this.historyList.push(this.q)
      // 去重
      // 转成数组
      this.historyList = Array.from(new Set(this.historyList))
      // 记录存到本地
      localStorage.setItem(key.JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  },
  // 实例初始化之后
  // 或者是直接写在historyList
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
