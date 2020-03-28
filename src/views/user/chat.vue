<template>
      <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小爱同学"></van-nav-bar>
    <div class="chat-list">
      <div class="chat-item" :class="{left: item.name === 'xz', right: item.name!='xz' }" v-for="(item,index) in list" :key="index">
        <van-image v-if="item.name==='xz'" fit="cover" round :src="XZimg" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name!=='xz'"  fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:black">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZimg from '@/assets/head.jpg'
import { mapState } from 'vuex'
import io from 'socket.io-client'// 引入io客户端
export default {
  name: 'chat',
  data () {
    return {
      XZimg,
      list: [], // 存储聊天内容
      value: '',
      loading: false
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 用户头像地址
  },
  methods: {
    send () {
      if (!this.value) return false // 为空不能发送消息
      this.loading = true // 设置加载
      // 使用websocket发送消息
      // 两个参数 类型 内容
      const obj = {
        msg: this.value,
        timestamp: Date.now()
      }
      this.socket.emit('message', obj) // 发送消息
      this.list.push(obj) // 追加到消息队列
      this.value = '' // 清空输入框
      this.loading = false // 关闭加载状态
    }
  },
  created () {
  // 建立与服务端链接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 会拼接到url地址上
      query: { token: this.user.token }
    })
    // 监听成功
    // 接收消息 connect表示当前已经建立链接成功
    this.socket.on('connect', () => {
      this.list.push({ msg: '现在可以和我聊天啦', name: 'xz' })
    })
    // 监听回复的消息
    this.socket.on('message', res => {
      this.list.push({ ...res, name: 'xz' })
    })
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
