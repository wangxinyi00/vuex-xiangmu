import request from '@/utils/request'

export function getSearchSuggestions (params) {
  return request({
    method: 'get',
    url: 'app/v1_0/suggestion',
    params
  })
}
export function getSearch (params) {
  return request({
    method: 'get',
    url: '/app/v1_0/search',
    params
  })
}
