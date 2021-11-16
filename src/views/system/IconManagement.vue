<template>
  <div class="icon-management">
    <h2>SVG图标</h2>
    <Row :gutter="16">
      <Col v-for="(content,iconClass) in $svg" :key="iconClass" span="2">
        <my-icon :icon-class="iconClass"></my-icon>
        <p><copy :text="iconClass">{{iconClass}}</copy></p>
      </Col>
    </Row>
    <h2>图片图标</h2>
    <Row :gutter="16">
      <Col v-for="(content,iconClass) in $pictures" :key="iconClass" span="2">
        <my-icon :icon-class="iconClass"></my-icon>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'icon-management',
  data () {
    return {

    }
  },
  created () {
    this.initIcon()
  },
  methods: {
    initIcon () {

    }
  }
}
</script>

<style lang="less">
.icon-management{
  h2{
    font-size: 18px;
    margin: 20px 0;
  }
  .ivu-col{
    margin-bottom: 20px;
    text-align: center;
    p{
      font-size: 16px;
    }
  }
}
</style>
