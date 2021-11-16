<template>
  <img :class="classes" v-if="url" :src="url" :alt="iconClass">
  <svg :class="classes" v-else aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'MyIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  data () {
    return {
      modules: {}
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    },
    url () {
      return this.$pictures[this.iconClass]
    },
    classes () {
      return ['my-icon', 'my-icon-' + this.iconClass, this.className ? 'my-icon-' + this.className : '', this.size ? 'my-icon-' + this.size : '']
    }
  }
}
</script>

<style lang="less">
.my-icon,
.my-icon-medium {
  height: 26px;
  width: 26px;
  &svg {
    height: 100%;
    width: 100%;
    fill: currentColor;
  }
}
.my-icon-small {
  height: 22px;
  width: 22px;
}
.my-icon-mini {
  height: 18px;
  width: 18px;
}
</style>
