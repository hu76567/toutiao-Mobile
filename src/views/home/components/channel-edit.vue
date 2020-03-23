<template>
  <div class="channel-edit">
      <!-- 我的频道 -->
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
          <!-- 第一个推荐不能被编辑 -->
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <!-- 点击某个频道的时候需要跳转对应频道,子父传值,传频道id或者索引 -->
          <!-- 传id -->
          <!-- <span @click="$emit('selectChannel',item.id)" class="f12">{{item.name}}</span> -->
          <!-- 比对索引,给当前频道 加一个激活样式 -->
          <!-- 传索引 -->
          <span @click="$emit('selectChannel',index)" :class="{red:index===activeIndex}" class="f12">{{item.name}}</span>

          <!-- ×号应该在进入编辑状态时显示,退出编辑状态时不显示 -->
          <!-- 第一个永远不显示× -->
          <!-- 注册点击事件告诉父组件要删除,传出id -->
          <van-icon @click="$emit('delChannel',item.id)" v-if="index!=0 && editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 推荐频道 -->
    <div class="channel">
      <div class="tit">频道推荐：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <!-- 直接把整个item传出 -->
          <van-icon @click="$emit('addChannel',item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false,
      allChannels: [] // 所有的频道数据
    }
  },
  // 接收父组件传过来的channels和activeIndex
  props: {
    channels: {
      required: true, // 必传项 ,必须传递channels
      type: Array, // 表示传入的prop的类型 数组类型
      default: () => [] // 默认值 用空数据 ,返回一个空数组作为默认值
    },
    activeIndex: {
      required: true,
      type: Number // 制定type是Numberleixing
    }
  },
  methods: {
    // 获取所有频道
    async getAllChannels () {
      const res = await getAllChannels()
      this.allChannels = res.channels // 返回值给到数据中的allChannels
    }
  },
  computed: {
    // 用过滤器来处理  推荐频道和我的频道的关系
    optionalChannels () {
      // 全部频道减去我的频道就是推荐频道
      // this.allChannels.filter(item=>!this.channels.some(o=>o.id===item.id))
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
      // 过滤出在allChannels这个大数组中与我的频道不同项
    }

  },
  created () {
    this.getAllChannels() // 调用获取所有频道的方法
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      top: 0;
      right: 0;
      background: #ddd;
      font-size: 13px;
      color: #fff;
      border-radius: 50%;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
