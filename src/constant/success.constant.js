exports.successMessage = function (message, data, success = 'true') {
  return {
    success: success,
    message: message,
    data: data,
  }
}
