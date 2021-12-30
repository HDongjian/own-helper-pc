<template>
  <Modal v-model="modal" width="80%" :title="title" class="no-footer-modal pdf-canvas">
    <div class="scroll-pdf-contanier" id="scrollPdfBox">
      <div v-for="index in pdfTotalPages" :key="index">
        <canvas :ref="`scrollPdfCanvas${index}`" class="scroll-pdf-container"></canvas>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
import pdfJS from 'pdfjs-dist'
export default {
  name: 'pdf-view',
  props: {
    title: { type: String, default: 'PDF预览' }
  },
  data () {
    return {
      carouselModal: 0,
      modal: false,
      pageNo: null,
      pdfPageNumber: null,
      pdfTotalPages: 1,
      renderingPage: false,
      pdfData: null, // PDF的base64
      scale: 4 // 缩放值
    }
  },
  created () {
  },
  methods: {
    showPdf (data) {
      this.modal = true
      this.$nextTick(() => {
        data = atob(data.substring(data.indexOf(',') + 1))
        this.loadPdfData(data)
      })
    },
    loadPdfData (data) {
      // 引入pdf.js的字体
      let CMAP_URL = 'https://unpkg.com/pdfjs-dist@2.0.943/cmaps/'
      // 读取base64的pdf流文件
      this.pdfData = pdfJS.getDocument({
        data: data, // PDF base64编码
        cMapUrl: CMAP_URL,
        cMapPacked: true
      })
      this.renderScrollPdf()
    },
    renderScrollPdf () {
      this.pdfData.promise.then((pdf) => {
        this.pdfTotalPages = pdf.numPages
        this.renderScrollPdfPage(1)
      })
    },
    // 渲染连续滚动PDF
    renderScrollPdfPage (num) {
      this.pdfData.promise.then((pdf) => {
        let numPages = pdf.numPages
        pdf.getPage(num).then((page) => {
          let canvas = this.$refs[`scrollPdfCanvas${num}`][0]
          let viewport = page.getViewport(this.scale)
          // canvas.height = viewport.height * this.scale
          // canvas.width = viewport.width * this.scale
          canvas.height = viewport.height
          canvas.width = viewport.width
          let ctx = canvas.getContext('2d')
          let renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext).then(() => {
            if (num < numPages) {
              this.renderScrollPdfPage(num + 1)
            }
          })
        })
      })
    }
  }
}
</script>

<style lang="less">
.pdf-canvas {
  .scroll-pdf-contanier {
    width: 100%;
    height: 800px;
    // border: 1px dashed black;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    .scroll-pdf-container {
      width: 100%;
    }
  }
  .ivu-modal {
    top: 40px;
  }
  // .ivu-modal-content {
  //   background-color: transparent;
  //   box-shadow: none;
  // }
  // .ivu-modal-header,
  // .ivu-modal-close {
  //   display: none;
  // }
  .ivu-modal-body {
    max-height: initial;
    overflow: auto;
  }
}
</style>
