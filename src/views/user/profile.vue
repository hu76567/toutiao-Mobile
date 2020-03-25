<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link title="名称" value="用户名称" />
      <van-cell is-link title="性别" value='男'/>
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>
    <!-- 弹层组件 -->
    <van-popup :close-on-click-overlay="false" v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>

      <!-- 昵称弹层 -->
    <van-popup :close-on-click-overlay="false" v-model="showName" style="width:80%">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type='textarea'  rows="4"></van-field>
    </van-popup>

     <!-- 性别弹层 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

    <!-- 生日弹层 -->
    <van-popup :close-on-click-overlay="false" v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
         />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
      showBirthDay: false, // 是否显示日期弹层
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层
      showGender: false, // 是否显示性别选择的弹层
      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 当前时间
      user: {
        name: null,
        gender: null
      }
    }
  },
  methods: {
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        //  如果长度 小于1 或者大于7 表示 这个昵称不符合要求
        this.nameMsg = '您的用户昵称不符合1-7的长度要求'
        return false // 不会继续往下执行了
      }
      // 如果满足的话 就会继续执行
      this.nameMsg = '' // 先把提示消息清空
      this.showName = false // 关闭弹层
    },
    selectItem (item) {
      // item就是选择的对象
      this.user.gender = item.name === '男' ? 0 : 1 // 根据判断得到当前的性别
      this.showGender = false // 关闭当前的弹层
    }
  }
}
</script>

<style>

</style>
