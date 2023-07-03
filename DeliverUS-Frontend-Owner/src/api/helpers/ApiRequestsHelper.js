import axios from 'axios'
import { handleError } from './Errors'
import { prepareData } from './FileUploadHelper'

axios.defaults.baseURL = process.env.API_BASE_URL

const get = route => {
  return new Promise(function (resolve, reject) {
    axios.get(route)
      .then(function (response) {
        resolve(response.data)
      })
      .catch(error => {
        try {
          handleError(error)
        } catch (error) {
          reject(error)
        }
      })
  })
}

const post = (route, data = null) => {
  const { config, preparedData } = prepareData(data)

  return new Promise(function (resolve, reject) {
    axios.post(route, preparedData, config)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        try {
          handleError(error)
        } catch (error) {
          reject(error)
        }
      })
  })
}

const put = (route, data = null) => {
  const { config, preparedData } = prepareData(data)

  return new Promise(function (resolve, reject) {
    axios.put(route, preparedData, config)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        try {
          handleError(error)
        } catch (error) {
          reject(error)
        }
      })
  })
}

const destroy = (route) => {
  return new Promise(function (resolve, reject) {
    axios.delete(route)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        try {
          handleError(error)
        } catch (error) {
          reject(error)
        }
      })
  })
}

const patch = (route, data = null) => {
  const { config, preparedData } = prepareData(data)

  return new Promise(function (resolve, reject) {
    axios.patch(route, preparedData, config)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        try {
          handleError(error)
        } catch (error) {
          reject(error)
        }
      })
  })
}

export { get, post, put, destroy, patch }
