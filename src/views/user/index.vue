<template>
  <div>
      <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
      @click-right="onSave"
    />
    <van-cell-group>
        <van-cell title="头像" is-link @click="onChangePhoto">
            <van-image
            round
            width="30"
            height="30"
            :src="user.photo"/>
        </van-cell>
        <van-cell
        title="昵称"
        :value="user.name"
        is-link
        @click="isEditNameShow=true"/>
        <van-cell
        title="性别"
        :value="user.gender=== 0 ? '男' : '女'"
        is-link
        @click="isEditGenderShow=true"/>
        <van-cell
        title="生日"
        :value="user.birthday"
        is-link
        @click="isEditBirthdayShow=true"/>
    </van-cell-group>
    <input type="file" hidden ref="file" @change="onFileChange">

    <!-- 编辑用户昵称弹窗 -->
    <van-dialog
     v-model="isEditNameShow"
     title="用户昵称"
     show-cancel-button
     @confirm='onUserNameConfirm'>
        <van-field
        placeholder="请输入用户名"
        :value="user.name"
        @input="onUserNameInput">

        </van-field>
    </van-dialog>

    <!-- 编辑用户昵称上拉菜单 -->
    <van-action-sheet
    v-model="isEditGenderShow"
    :actions="actions"
    cancel-text="取消"
    @select="onSelect">
    </van-action-sheet>

    <!-- 编辑用户生日 -->
    <van-popup
    v-model="isEditBirthdayShow"
    :style="{height:'30'}"
    position="bottom">

    <van-datetime-picker
    type="date"
    @confirm="onUserBirthdayConfirm"
    @cancel="isEditBirthdayShow=false"
    />
    </van-popup>

  </div>
</template>

<script>
import { getProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {},
      isEditNameShow: false,
      inputUserName: '', // 存储编辑用户名字的输入框数据
      isEditGenderShow: false, // 控制编辑性别的上拉菜单的显示状态
      actions: [
        // 上拉菜单的数据
        // name 会当作文本输出渲染
        // value 是我自己自定义添加的
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false // 编辑用户生日
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getProfile()
      this.user = data.data
    },
    onChangePhoto () {
      this.$refs.file.click()
    },
    onFileChange () {
      const fileObj = this.$refs.file.files[0]

      if (fileObj) {
        this.user.photo = window.URL.createObjectURL(fileObj)
      }
    },
    async onSave () {
      // 这个时候传递一个 FormData 对象
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })
      try {
        const fileObj = this.$refs.file.files[0]
        // 如果用户选择了新的头像，那就更新用户头像
        if (fileObj) {
          const formDate = new FormData()
          // formData.append('名字', 数据)
          formDate.append('photo', fileObj)
          await updateUserPhoto(formDate)
        }

        // 更新用户其他文本信息
        await updateUserProfile({
          name: this.user.name,
          gender: this.user.gender,
          birthday: this.user.birthday
        })
        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('保存失败')
      }
    },
    onUserNameConfirm () {
      this.user.name = this.inputUserName
    },
    onUserNameInput (value) {
      this.inputUserName = value
    },
    onSelect (item) {
      // 修改数据
      this.user.gender = item.value

      // 关闭上拉菜单
      this.isEditGenderShow = false
    },
    onUserBirthdayConfirm (value) {
      // 更新数据
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')

      // 关闭弹层
      this.isEditBirthdayShow = false
    }

  }
}
</script>

<style>

</style>
