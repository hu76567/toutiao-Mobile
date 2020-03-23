<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 有输入内容时显示模糊查询,没有时显示搜索记录 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 模糊查询 -->
    <van-cell-group class="suggest-box" v-if="q" >
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestList" :key="index">
        {{item}}
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
import { getSuggestion } from '@/api/articles'
const key = 'toutiao-h' // 用来读取本地缓存中的历史记录
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字数据
      historyList: [], // 历史记录数据  数组
      suggestList: []
    }
  },
  watch: {
    // 监听关键字q的变化
    q () {
      // 变化的时候去请求联想词条
      // 不能每变化一次就去请求一次
      // 防抖  触发事件后n秒内只执行一次,n秒内又触发事件,则重新计算执行时间
      // 节流  限制一个函数一定时间内只能执行一次

      // 防抖写法
      clearTimeout(this.timer)// 清除定时器
      this.timer = setTimeout(async () => {
        // 搜索框为空的时候的数据
        if (!this.q) {
          this.suggestList = []
          return
        }
        const res = await getSuggestion({ q: this.q })
        this.suggestList = res.options
      }, 1000)

      // 节流写法
      // if (!this.timer) {
      //   this.timer = setTimeout(async () => {
      //     this.timer = null
      //     // 搜索框为空的时候的数据
      //     if (!this.q) {
      //       this.suggestList = []
      //       return
      //     }
      //     const res = await getSuggestion({ q: this.q })
      //     this.suggestList = res.options
      //   }, 1000)
      // }
    }
  },
  methods: {
    // 删除历史记录
    // 先在data中删除 然后同步到本地缓存
    delHistory (index) {
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList))
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
    },
    // 历史记录和联想内容共用一个跳转
    toResult (text) {
      this.historyList.push(text)
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: text } })
    }
    // toSearchResult (text) {
    //   // 传参给结果界面 params/query
    //   // this.$router.push(`/search/result?q=${text}`)
    //   this.$router.push({ path: '/search/result', query: { q: text } })
    // }
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
