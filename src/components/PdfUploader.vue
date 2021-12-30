<template>
  <div class="dpf-uploader">
    <div class="uplader-box">
      <Input readonly v-model="inputName">
      <Button @click="showPdf" slot="append" type="primary">预览</Button>
      <div class="choose-file" slot="prepend">
        <input class="file-input" type="file" ref="fielinput" @change="inputChange">
        <Button type="primary">选择文件</Button>
      </div>
      </Input>
    </div>
    <pdf-canvas :title="inputName" ref="pdfCanvas"></pdf-canvas>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String }
  },
  data () {
    return {
      inputName: '',
      privateValue: ''
    }
  },
  watch: {
    value () {
      if (!this.value) return
      this.inputName = 'PDF文件'
    }
  },
  methods: {
    async inputChange (e) {
      let inputDom = this.$refs.fielinput
      let file = inputDom.files[0]
      this.inputName = 'PDF文件'
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        console.log(reader.result)
        let data = reader.result
        this.$emit('input', data)
      }
    },
    showPdf () {
      if (!this.value) {
        this.$Message.info('请选择文件')
        return
      }
      this.$refs.pdfCanvas.showPdf(this.value)
    }
  }
}
</script>

<style lang="less">
.dpf-uploader {
  .ivu-input-group-prepend, .ivu-input-group-append{
    padding: 2px 7px;
  }
  .choose-file {
    position: relative;
    .file-input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      opacity: 0;
      cursor: pointer;
    }
  }
}
</style>
