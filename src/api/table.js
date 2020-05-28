import request from '@/utils/request'
import requests from '@/utils/requests'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getUsersByPage(params) {
  return requests({
    url: 'http://localhost:8181/usersPage?pageNum=' + (params.page - 1) + '&pageSize=' + params.limit,
    method: 'get'
  })
}

export function getUser(id) {
  return requests({
    url: 'http://localhost:8181/user/' + id,
    method: 'get'
  })
}

export function getUsers() {
  return requests({
    url: 'http://localhost:8181/users',
    method: 'get'
  })
}

export function updateUser(user) {
  return requests({
    url: 'http://localhost:8181/user',
    method: 'post',
    data: user
  })
}

export function deleteUser(id) {
  return requests({
    url: 'http://localhost:8181/user/' + id,
    method: 'delete'
  })
}

export function disableUser(id) {
  return requests({
    url: 'http://localhost:8181/user/disable/' + id,
    method: 'put'
  })
}

export function enableUser(id) {
  return requests({
    url: 'http://localhost:8181/user/enable/' + id,
    method: 'put'
  })
}
