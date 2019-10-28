<template>
  <div class="article-comments">
      <!-- 导航栏 -->
      <van-nav-bar title="comment.reply_count + '条回复'">
        <van-icon
        slot="left"
        name="cross"
        @click="$emit('close')" />
      </van-nav-bar>

      <!-- 当前评论 -->
      <van-cell title="当前评论">
          <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right:10px;"
          src="comment.aut_photo"/>
          <span style="color: #466b9d;" slot="title">{{ comment.aut_name }}</span>
          <div slot="label">
           <p style="color: #363636;">{{ comment.content }}</p>
           <p>
            <span style="margin-right: 10px;">{{ comment.pubdate | relativeTime }}</span>
            <van-button
            size="mini"
            type="default"
           >回复 {{ comment.reply_count }}</van-button>
          </p>
        </div>
        <van-icon
        slot="right-icon" />
      </van-cell>

      <van-cell title="全部评论"/>

    <!-- 回复列表 -->
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.com_id.toString()"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime}}</span>
            <van-button
            size="mini"
            type="default"
            @click="onReplyShow">回复{{item.reply_count}}</van-button>
          </p>
        </div>
        <van-icon
        slot="right-icon"
        :name="item.is_liking ? 'like' : 'like-o'"
        @click="onCommentLike(item)" />
      </van-cell>
    </van-list>

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model="commentText"
      >
        <van-button
        slot="button"
        size="mini"
        type="info"
        @click="onAddComment">发布</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import {
  getComments,
  addComments,
  addCommentLike,
  deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentReply',
  props: ['comment'],
  data () {
    return {
      loading: false, // 上拉加载更多
      finished: false, // 是否加载结束
      list: [], // 评论列表
      offset: null, // 获取下一页数据的页码，第一页就是null
      limit: 10, // 每页大小
      commentText: '',
      isReplyShow: false
    }
  },
  created () {
    console.log('created')
  },
  methods: {
    async  onLoad () {
      // 1.请求数据
      const { data } = await getComments({
        type: 'c', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.comment.com_id.toString(), // 源id，文章id或评论id
        offset: this.offset // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        // limit: this.limit
      })

      // 2.将数据添加到数组中
      this.list.push(...data.data.results)
      // 3.结束loading状态
      this.loading = false
      // 4.判断是否还有数据
      if (data.data.last_id) {
        // 如果有 更新页码
        this.offset = data.data.last_id
      } else {
        // 如果没有  将finished 设置为 true
        this.finished = true
      }

      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 结束加载状态
      //   this.loading = false
      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
    },
    // 发布评论
    async  onAddComment () {
      const commentText = this.commentText.trim()
      if (!commentText) {
        return
      }
      // 请求提交
      const { data } = await addComments({
        target: this.comment.com_id.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: commentText, // 评论内容

        // art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        art_id: this.$route.params.articleId
      })
      // 将最新添加的评论数据放到顶部展示
      this.list.unshift(data.data.new_obj)
      // 清空文本框
      this.commentText = ''

      // 更新当前评论的回复数量
      this.comment.reply_count++
    },
    // 评论点赞/取消点赞
    async onCommentLike (comment) {
      const commentId = comment.com_id.toString()
      // 如果以点赞 取消点赞
      if (comment.is_liking) {
        await deleteCommentLike(commentId)
      } else {
        await addCommentLike(commentId)
      }
      comment.is_liking = !comment.is_liking
    },
    // 展示回复弹出
    onReplyShow () {
      this.isReplyShow = true
    }

  }

}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
