import { destroy, get, post, put } from './helpers/ApiRequestsHelper'

function getAll () {
  return get('orders')
}

function getDetail (id) {
  return get(`orders/${id}`)
}

function create (data) {
  return post('orders', data)
}

function remove (id) {
  return destroy(`orders/${id}`)
}

function update (id, data) {
  return put(`orders/${id}`, data)
}

export { getAll, getDetail, create, remove, update }
