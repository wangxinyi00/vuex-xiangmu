<template>
  <div class="chat-container">
      <!-- 导航栏 -->
    <van-nav-bar
    title="小智同学"
    left-arrow
    fixed
    @click="$router.back()"/>

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
        <div class="message-item"
        :class="{reverse:item.isMe}"
        v-for="(item,index) in messages"
        :key="index">
        <van-image
        class="avatar"
        slot="icon"
        round
        width="30"
        height="30"
        :src="item.photo"
        />
        <div class="title">
            <span>{{item.message}}</span>
        </div>
        </div>
    </div>

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
        <van-field
        v-model="message"
        center
        clearable>
        <van-button
        slot="button"
        size="small"
        type="primary"
        @click="onSendMessage"
        >发送</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'ChatIndex',
  data () {
    return {
      message: '',
      socket: null,
      // [ { message: '消息数据', isMe: true, photo: '头像' }, ]
      messages: getItem('chat-messages') || []

    }
  },
  watch: {
    messages (newValue) {
      setItem('chat-messages', newValue)

      // 让列表滚动到最底部
      const messageList = this.$refs['message-list']
      // console.log('nextTick前:', messageList.scrollHeight)

      // 这需要操作Dom 的这个代码放到nextTick中
      this.$nextTick(() => {
        // console.log('nextTick后:', messageList.scrollHeight)
        messageList.scrollTop = messageList.scrollHeight
      })
    }
  },
  created () {
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn')
    // 把socket存储到data中 然后就可以在methods中找到了
    this.socket = socket

    // 当客户端与服务器建立成功 出发conne事件
    socket.on('connect', () => {
      console.log('建立连接成功！')
    })

    // 监听接收服务端消息
    socket.on('message', data => {
      console.log('收到服务器消息：', data)
      this.messages.push({
        message: data.msg,
        isMe: false,
        photo: 'http://toutiao.meiduo.site/FkBUsGwtrHKjoF0NPLzeilckol1-'
      })
    })
  },
  mounted () {
    const messageList = this.$refs['message-list']
    messageList.scrollTop = messageList.scrollHeight
  },
  methods: {
    onSendMessage () {
      const message = this.message.trim()
      if (!message) {
        return
      }

      // 发送消息
      this.socket.emit('message', {
        msg: message,
        timestamp: Date.now()
      })

      // 把消息存到数组中
      this.messages.push({
        message,
        isMe: true,
        photo: 'https://img.yzcdn.cn/vant/cat.jpeg'
      })

      // 清空文本框
      this.message = ''
    }
  }

}
</script>

<style lang='less' scoped>
.chat-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px 0;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background: #f5f5f6;
  .message-list {
    height: 100%;
    overflow-y: scroll;
    .message-item {
      display: flex;
      align-items: center;
      padding: 10px;
      .title {
        background: #fff;
        padding: 5px;
        border-radius: 6px;
      }
      .avatar {
        margin-right: 5px;
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .title {
        margin-right: 5px;
      }
    }
  }

  .send-message {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f6 !important;
  }
}

</style>
