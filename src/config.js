export let api
export let web
export let fls
export let download
export let file

let href = location.href

if (href.indexOf('http://helper.hdongyu') !== -1) {
  api = 'http://helper.hdongyu.com'
  web = 'http://helper.hdongyu.com'
  fls = 'http://helper.hdongyu.com/'
  download = 'http://helper.hdongyu.com'
  file = 'http://helper.hdongyu.com/api/files'
} else if (href.indexOf('https://helper.hdongyu') !== -1) {
  api = 'https://helper.hdongyu.com'
  web = 'https://helper.hdongyu.com'
  fls = 'https://helper.hdongyu.com/'
  download = 'https://helper.hdongyu.com'
  file = 'https://helper.hdongyu.com/api/files'
} else {
  api = 'http://localhost:4008'
  web = 'http://localhost:4008'
  fls = 'https://helper.hdongyu.com/'
  // fls = 'http://localhost:4008/'
  download = 'http://localhost:3008'
  // file = 'http://localhost:4008/api/files'
  file = 'http://localhost:4008/api/files'
  // file = 'https://helper.hdongyu.com/api/files'
}
