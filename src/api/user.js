import request from '@/utils/request'
// 登录
export function login (user) {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations ',
    data: user
  })
}
/**
 * 1、接口重用
 * 2、接口维护
 * 实际开发过程中，接口经常容易变化，
 * 你能记住你在哪里请求了这个接口吗？很难记住
 * 怎么办呢？
 *  我们单独的把接口请求的代码封装起来，统一的放到一起。
 * 放到哪里呢？
 *  我们放到项目的 api 目录中，
 *  根据接口的种类进行归类管理
 *  例如用户相关的接口放到 user.js 中
 *      文章相关的接口放到 article.js 中
 * 如何封装呢？
 *  一个函数，接收参数，返回请求结果就可以了。
 * 用户接口相关请求模块
 */
// 关注用户

export function followUser (userId) {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注
export const unFollowUser = userId => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

// 获取用户信息
export function getSelf (userId) {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
  })
}

// 获取用户个人资料
export function getProfile (userId) {
  return request({
    method: 'get',
    url: '/app/v1_0/user/profile'
  })
}

// 更新用户头像
export function updateUserPhoto (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}

// 更新用户基本信息
export function updateUserProfile (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
