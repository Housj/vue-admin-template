import request from '@/utils/request'
import requests from '@/utils/requests'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getUsers() {
  return requests({
    url: 'http://localhost:8181/users',
    method: 'get'
  })
}
