<template>
    <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button :loading="followLoading" @click="follow()" round size="small" type="info">{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- 有属性有样式  需要渲染html样式 -->
      </div>
      <div class="zan">
        <!-- 根据态度来判断是点赞还是不喜欢 -->
        <van-button round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- 遮罩层 -->
    <van-overlay :show="overLoading">
      <div class="overloading">
          <van-loading></van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unFollowUser } from '@/api/user'
export default {
  data () {
    return {
      article: {}, // 接收文章详情数据
      followLoading: false, // 是否正在点击关注
      overLoading: false // 遮罩层状态
    }
  },
  methods: {
    // 获取文章详情数据
    async getArticleInfo () {
      this.overLoading = true
      const { artId } = this.$route.query // 从路由对象中读取参数
      this.article = await getArticleInfo(artId)
      this.overLoading = false
    },
    // 关注/取消关注
    async follow () {
      this.followLoading = true
      try {
        //  当前是关注就取消关注,未关注就关注
        if (this.article.is_followed) {
        // 取消
          await unFollowUser(this.article.aut_id)
        } else {
          // 关注
          await followUser({ target: this.article.aut_id })
        }
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        this.$hnotify({ type: 'danger', message: '操作失败' })
      } finally {
        // 不论执行的是成功的还是失败的try or catch 都会进入finally
        // 关闭加载状态
        this.followLoading = false
      }
    }
  },
  created () {
    this.getArticleInfo() // 调用方法
  }
}
</script>

<style lang="less" scoped>
.van-overlay{
background: none;
}
.overloading{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
