import Vue from 'vue'
let stores = {
  students: {
    name: 'students',
    key: ['name', 'subject', 'isDelect', 'creatTime', 'updateTime']
  },
  curriculum: {
    name: 'curriculum',
    key: ['studentName', 'subject', 'studentId', 'isDelect', 'startTime', 'endTime', 'periods', 'date', 'creatTime', 'updateTime']
  }
}

const indexedDB = {
  db: null,
  dbName: 'ForLv',
  dbDom: null,
  init (callback) {
    this.initCB = callback
    this.openDB()
  },
  openDB () {
    this.dbDom = window.indexedDB
    let request = this.dbDom.open(this.dbName)
    request.onerror = function (e) {
      throw new Error('打开本地数据库失败')
    }
    request.onsuccess = (e) => {
      console.log('打开本地数据库成功')
      this.db = e.target.result
      this.initCB && this.initCB()
    }
  },
  http (params) {
    let { method, data, url, key } = params
    return this[method]({ data, url, key })
  },
  initStore (storeName, callback) {
    let { name, key } = stores[storeName]
    if (!this.db.objectStoreNames.contains(name)) {
      this.closeDB()
      console.log(this.dbDom)
      const request = this.dbDom.open(this.dbName, parseInt(this.db.version) + 1)
      request.onupgradeneeded = (e) => {
        this.db = e.target.result
        this.createStore(key, name, e, callback)
      }
    } else {
      callback && callback()
    }
  },
  createStore (key, name, e, callback) {
    const objectStore = this.db.createObjectStore(name, {
      keyPath: 'id',
      autoIncrement: true
    })
    for (const k of key) {
      objectStore.createIndex(k, k)
    }
    const transaction = e.target.transaction
    transaction.oncomplete = (e) => {
      console.log('成功创建表')
      callback && callback()
    }
  },
  getKey (params) {
    const { url, key } = params
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction(url, 'readonly')
      let store = transaction.objectStore(url)
      let request = store.get(key)
      request.onsuccess = function (e) {
        let data = e.target.result
        resolve({ data, code: 200, message: '获取成功' })
      }
      request.onerror = function () {
        reject(new Error('获取失败'))
      }
    })
  },
  get (params) {
    const { url } = params
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction(url, 'readonly')
      let store = transaction.objectStore(url)
      let request = store.openCursor()
      let data = []
      request.onsuccess = (e) => {
        let cursor = e.target.result
        if (cursor) {
          data.push(cursor.value)
          cursor.continue()
        } else {
          resolve({ data, code: 200, message: '获取成功' })
        }
      }
      request.onerror = (e) => {
        reject(new Error('获取失败'))
      }
    })
  },
  add (params) {
    return new Promise((resolve, reject) => {
      const { data, url } = params
      if (data.isDelect === undefined) {
        data.isDelect = false
      }
      data.creatTime = Date.now()
      data.updateTime = ''
      let transaction = this.db.transaction(url, 'readwrite')
      let store = transaction.objectStore(url)
      const req = store.add(data)
      req.onsuccess = (e) => {
        Vue.bus.$emit(url)
        resolve({ code: 200, message: '添加成功' })
      }
      req.onerror = (e) => {
        reject(new Error('添加失败'))
      }
    })
  },
  put (params) {
    return new Promise((resolve, reject) => {
      const { data, url } = params
      data.updateTime = Date.now()
      let transaction = this.db.transaction(url, 'readwrite')
      let store = transaction.objectStore(url)
      const req = store.put(data)
      req.onsuccess = (e) => {
        Vue.bus.$emit(url)
        resolve({ code: 200, message: '更新成功' })
      }
      req.onerror = (e) => {
        reject(new Error('数据更新失败'))
      }
    })
  },
  closeDB () {
    console.log('关闭本地数据库')
    this.db.close()
  }
}

export default {
  install (Vue, callback) {
    indexedDB.init(callback)
    Vue.prototype.$indexedDB = indexedDB
  }
}
