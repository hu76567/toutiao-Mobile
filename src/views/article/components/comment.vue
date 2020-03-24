<template>
  <div class="comment">
    <van-list v-model="loading" @load="onLoad" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>

    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 评论的评论弹出面板 -->
    <!-- immediate-check关闭load主动上拉加载 -->
     <van-action-sheet v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list @load="getReply"
      :immediate-check="false"
       v-model="reply.loading"
       :finished="reply.finished"
        finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo"/>
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate|relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
  <!-- 都不输入框 -->
</template>

<script>
// import { getComments } from '@/api/article'
import * as articles from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 存放评论
      offset: null, // 偏移量 例请求第二页数据,要第一页的最后一条数据的id
      showReply: false, // 控制评论的评论的面板是否显示
      reply: {
        // 此对象放置面板加载信息
        loading: false, // 表示评论的评论加载状态
        finished: false, // 评论的评论是否加载完毕
        offset: null, // 评论的评论分页加载的依据 偏移量
        list: [], // 评论的评论的数据
        commentId: null // 存放评论id,用id去找回复
      }
    }
  },
  methods: {
    // 加载滚动条距离底部超过一定限制的时候
    async onLoad () {
      const { artId } = this.$route.query
      const res = await articles.getComments({
        type: 'a', // a表示文章评论  //c表示评论的评论
        source: artId, // 查询的是谁的评论
        offset: this.offset // 赋值当前的偏移量
      })
      this.comments.push(...res.results) // 加到尾部
      this.loading = false// 关闭上拉加载状态
      // 判断是否还有下一页
      // endid 所有的最后一个id
      // lastid 当前页的最后一个id
      // res.end_id===res.last_id=>finished=true
      // 如果相等则给finished设置成true
      this.finished = res.end_id === res.last_id
      // 如果没有结束
      if (!this.finished) {
        // 表示还不是最后一页
        // 给到offset作为请求下一页数据的依据
        this.offset = res.last_id
      }
    },
    // 获取评论的评论
    async getReply () {
      const res = await articles.getComments({
        type: 'c', // 评论的评论
        source: this.reply.commentId, // 获取哪个评论的回复
        offset: this.reply.offset // 评论的回复的分页依据
      })

      this.reply.list.push(...res.results) // 追加
      this.reply.loading = false // 关闭加载状态
      // 相等则完成
      this.reply.finished = res.end_id === res.last_id
      if (!this.reply.finished) {
        // 表示还不是最后一页
        // 给到offset作为请求下一页数据的依据
        this.reply.offset = res.last_id
      }
    },
    openReply (commentId) {
      this.showReply = true
      // 记录id
      this.reply.commentId = commentId
      // 重置***********
      this.reply.list = [] // 清空之前的数据
      this.reply.offset = null // 希望弹出面板的时候是新的数据
      this.reply.finished = false // 打开
      this.reply.loading = true // 此时没有主动检查
      // *************
      // 在弹出层时调用
      this.getReply() // 主动的去请求一次数据
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
