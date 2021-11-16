<template>
  <Modal v-model="modal" width="80%" :title="modalTitle" class="no-footer-modal pdf-modal">
    <Carousel v-model="carouselModal" loop v-if="modal">
      <CarouselItem v-for="(item,i) in pdfData" :key="i">
        <h3>{{item.title}}</h3>
        <embed :src="item.url" type="application/pdf" width=800 height=800>
      </CarouselItem>
    </Carousel>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
export default {
  name: 'pdf-view',
  data () {
    return {
      modalTitle: 'pdf预览',
      pdfData: [],
      carouselModal: 0,
      modal: false
    }
  },
  created () {
  },
  methods: {
    showPdf (data) {
      this.pdfData = data
      this.$nextTick(() => {
        this.modal = true
      })
    }
  }
}
</script>

<style lang="less">
.pdf-modal {
  .ivu-modal{
    top: 40px;
  }
  .ivu-modal-content{
    background-color: transparent;
    box-shadow:none;
  }
  .ivu-modal-header,.ivu-modal-close {
    display: none;
  }
  .ivu-modal-body {
    max-height: initial;
    overflow: auto;
  }
  .ivu-carousel-list {
    width: 1500px;
    //   height: 600px;
  }
  embed {
    width: 100%;
    height: 800px;
  }
  h3{
    color:#fff;
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
    font-weight: 600;
    letter-spacing:4px;
    text-shadow: #000 1px 1px 2px;
  }
}
</style>
