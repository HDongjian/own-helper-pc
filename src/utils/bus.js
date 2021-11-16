import Vue from 'vue'

const bus = new Vue()

export default {
  install (Vue) {
    Vue.bus = Vue.prototype.$bus = bus
  }
}
