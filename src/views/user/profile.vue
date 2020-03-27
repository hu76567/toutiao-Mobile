<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" @click-right="saveInfo" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell @click="showPhoto=true" is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link @click="showName=true" title="昵称" :value="user.name" />
      <van-cell is-link @click="showGender=true" title="性别" :value="user.gender ===0 ? '男':'女'"/>
      <van-cell is-link @click="showDate" title="生日" :value="user.birthday" />
    </van-cell-group>

    <!-- 头像弹层 -->
    <van-popup  v-model="showPhoto" style="width:80%">
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-image contain :src="user.photo"></van-image>
      <van-button block type="info" @click="openFile" is-link title="本地相册">相册</van-button>
      <van-button block type="primary" is-link title="拍照">拍照</van-button>
    </van-popup>

    <!-- 昵称弹层 -->
    <!-- 点击背景关闭弹窗 功能被禁用掉 -->
    <van-popup :close-on-click-overlay="false" v-model="showName" style="width:80%">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <!-- 绑定错误提示信息 -->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type='textarea'  rows="3"></van-field>
      <van-button @click="btnName" block type="info" size="normal">确定</van-button>
    </van-popup>

    <!-- 性别弹层 -->
    <van-action-sheet
    @select="selectItem"
    :actions="actions"
    v-model="showGender"
    cancel-text="取消"></van-action-sheet>

    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="confirmDate"
          @cancel="showBirthDay=false"
         />
    </van-popup>
    <!-- 放置一个input:file不能让人看见 -->
    <input @change="upLoad()" ref="myFile" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user'
export default {
  name: 'profile',
  data () {
    return {
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层
      showGender: false, // 是否显示性别选择的弹层
      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      showBirthDay: false, // 是否显示日期弹层
      currentDate: new Date(), // 弹出弹层是默认显示的时间
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      user: {
        name: '', // 昵称
        gender: 0, // 性别默认值
        birthday: '2002-02-20', // 生日
        photo: ''// 头像
      },
      nameMsg: '' // 错误信息
    }
  },
  methods: {
    async saveInfo () {
      try {
        // 保存信息
        await saveUserInfo(this.user)
        this.$hnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$hnotify({ message: '保存失败' })
      }
    },
    async upLoad () {
      // 选择完头像后上传
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 第二个参数选择的文件
      const res = await updatePhoto(data) // 上传头像
      this.user.photo = res.photo // 更新头像
      this.showPhoto = false // 关闭弹层
    },
    openFile () {
      // 触发点击input的动作
      this.$refs.myFile.click()
    },
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        //  如果内容长度 小于1 或者大于7 表示 这个昵称不符合要求
        this.nameMsg = '您的用户昵称不符合1-7的长度要求'
        return false // 不会继续往下执行了
      }
      // 如果满足的话 就会继续执行
      this.nameMsg = '' // 先把提示消息清空
      this.showName = false // 关闭弹层
    },
    selectItem (item, index) {
      //  通过item或者索引知道点击的是男还是女
      // 0男   1女
      this.user.gender = index
      this.showGender = false
    },
    showDate () {
      // 显示生日弹层
      this.showBirthDay = true
      // 将生日的字符串转化成对象绑定到日期组件上
      this.currentDate = new Date(this.user.birthday)
    },
    confirmDate () {
      // 确定生日日期
      // 需要把date转成字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthDay = false // 关闭弹层
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>

</style>
