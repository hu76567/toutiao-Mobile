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
          <span class="f12">{{item.name}}</span>
          <!-- ×号应该在进入编辑状态时显示,退出编辑状态时不显示 -->
          <van-icon v-if="index!=0&&editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道 -->
    <div class="channel">
      <div class="tit">频道推荐：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="index in 8" :key="index">
          <span class="f12">频道{{index}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editing: false
    }
  },
  props: {
    channels: {
      required: true, // 必传项 ,必须传递channels
      type: Array, // 表示传入的prop的类型 数组类型
      default: () => [] // 默认值 用空数据 ,返回一个空数组作为默认值
    }
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
