export const validateWage = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'))
  }
  if (isNaN(value)) {
    callback(new Error('必须是数字'))
  }
  callback()
}

export const validatePhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  }
  if (!/^[1][0-9]{10}$/.test(value)) {
    callback(new Error('手机号格式不正确'))
  }
  callback()
}

export const validateEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  // eslint-disable-next-line no-useless-escape
  if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) {
    callback(new Error('邮箱格式不正确'))
  }
  callback()
}

export const validatePassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  if (!/^[0-9A-Za-z]{6,18}$/.test(value)) {
    callback(new Error('密码由6-18位字母数字组成'))
  }
  callback()
}
export const validateUserName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  if (!/^[0-9A-Za-z]{2,10}$/.test(value)) {
    callback(new Error('登录名由2-10位字母数字组成'))
  }
  callback()
}

export const validateTime = (value) => {
  if (!value) {
    return false
  }
  // 模拟异步验证效果
  if (!/^(20|21|22|23|[0-1]\d):[0-5]\d$/.test(value)) {
    return false
  }
  return true
}
