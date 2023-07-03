'use strict'

const defaultMaxFileSize = 2000000

const checkFileExists = (req, fieldName) => {
  if (req.files && req.files[fieldName]) { return req.files[fieldName][0] } else if (req.file && req.file.fieldname === fieldName) { return req.file } else { return false }
}

module.exports = {
  checkFileExists,
  checkFileIsImage: (req, fieldName) => {
    const file = checkFileExists(req, fieldName)
    if (file) {
      return ['image/jpeg', 'image/png'].includes(file.mimetype)
    }
    return true
  },
  checkFileMaxSize: (req, fieldName, maxFileSize = defaultMaxFileSize) => {
    const file = checkFileExists(req, fieldName)
    if (file) {
      return file.size < maxFileSize
    }
    return true
  }

}
