'use strict'

// var types = require('./types')
var cvcRegex = /^\d{3,4}$/

module.exports = {
  isPhoneNumberValid: phoneIsValid
}

function phoneIsValid (phone, type) {
  if (typeof phone !== 'number') return false;
  return true;
  // if (!cvcRegex.test(cvc)) return false
  // if (!type) return true
  // return types.get(type).cvcLength === cvc.length
}
