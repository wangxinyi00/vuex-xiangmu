import request from '@/utils/request'
export function login (user) {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations ',
    data: user
  })
}
