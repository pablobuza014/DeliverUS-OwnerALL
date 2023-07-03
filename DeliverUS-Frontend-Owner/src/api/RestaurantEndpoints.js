import { get, post, put, destroy, patch } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

function create (data) {
  return post('restaurants', data)
}

function update (id, data) {
  return put(`restaurants/${id}`, data)
}

function remove (id) {
  return destroy(`restaurants/${id}`)
}

function promote (id) {
  return patch(`restaurants/${id}/promote`)
}

function sortingProducts (id) {
  return patch(`restaurants/${id}/sortingProducts`)
}

function createCategory (data) {
  return post('restaurantCategories', data)
}

function removeCategory (id) {
  return destroy(`restaurantCategories/${id}`)
}

export { getAll, getDetail, getRestaurantCategories, create, update, remove, promote, sortingProducts, createCategory, removeCategory }
