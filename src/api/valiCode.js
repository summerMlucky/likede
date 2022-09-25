import request from '@/utils/request'

export function valiCodeAPI(clientToken) {
  return request({
    url: '/user-service/user/imageCode/' + clientToken
  })
}
