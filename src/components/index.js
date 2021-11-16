
const modulesFiles = require.context('./', true, /\.vue$/)
const components = modulesFiles.keys().reduce((components, modulePath) => {
  const moduleName = modulePath.replace(/^\.(.*)\/(.*)\.\w+$/, '$2')
  const value = modulesFiles(modulePath)
  components[moduleName] = value.default
  return components
}, {})

export default {
  install (Vue) {
    for (const name in components) {
      Vue.component(name, components[name])
    }
  }
}
