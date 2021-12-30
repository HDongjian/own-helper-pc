<template>
  <div class="image-uploader">
    <div class="image-upload-list" :key="item.name" v-for="item in uploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="image-upload-list-cover">
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload :accept="accept" v-show="uploadList.length<limit" ref="upload" :show-upload-list="false" :headers="headers" :default-file-list="defaultList" :data="{name:'112'}" :on-success="handleSuccess" :format="['jpg','jpeg','png','pdf']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :action="file" class="uploader">
      <div class="uploader-action">
        <Icon type="ios-cloud-upload-outline" size="25" />
      </div>
    </Upload>
  </div>

</template>
<script>
import { fls, file } from '@/config'
export default {
  props: {
    limit: { type: Number, default: 1 },
    accept: { type: String, default: '*' },
    value: { type: String }
  },
  data () {
    return {
      file,
      headers: {},
      defaultList: [],
      uploadList: [],
      valueChange: false
    }
  },
  watch: {
    value (strings) {
      let files = this.stringToFiles(strings)
      this.uploadList = [...files]
      this.valueChange = true
      this.defaultList = [...files]
    },
    uploadList (files) {
      if (this.valueChange) {
        this.valueChange = false
      } else {
        let strings = this.filesToString(files)
        this.$emit('input', strings)
      }
    }
  },
  created () {
    let account = JSON.parse(sessionStorage.getItem('account') || '{}')
    if (account && account.token) {
      this.headers.token = account.token
    }
  },
  methods: {
    stringToFiles (strings) {
      if (!strings) return []
      let fs = strings.split(',')
      let files = []
      for (const f of fs) {
        files.push({
          response: {
            data: f
          },
          status: 'finished',
          name: f.replace('static/', ''),
          url: fls + f
        })
      }
      return files
    },
    filesToString (files) {
      let strings = ''
      for (const file of files) {
        strings += file.response.data + ','
      }
      strings = strings.substring(0, strings.length - 1)
      return strings
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.uploadList = [...this.$refs.upload.fileList]
    },
    handleSuccess (res, file) {
      file.url = fls + res.data
      file.name = res.data.replace('static/', '')
      this.uploadList = [...this.$refs.upload.fileList]
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '图片格式错误',
        desc: '文件名' + file.name + '格式错误，请选择jpg or png'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '图片' + file.name + '太大，不能超过2M'
      })
    },
    handleBeforeUpload (file) {
      console.log(file)
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: '超出限制大小'
        })
      }
      return check
    }
  }
}
</script>
