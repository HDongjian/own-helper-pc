const svg = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext)
}
requireAll(svg)

const svgModules = svg.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/\.\/(.*)\.svg/, '$1')
  const value = svg(modulePath)
  modules[moduleName] = value
  return modules
}, {})

const pictures = require.context('./png', true, /\.png$/)
const pictureModules = pictures.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/\.\/(.*)\.png/, '$1')
  const value = pictures(modulePath)
  modules[moduleName] = value
  return modules
}, {})

export default {
  install (Vue) {
    Vue.pictures = Vue.prototype.$pictures = pictureModules
    Vue.svg = Vue.prototype.$svg = svgModules
  }
}
