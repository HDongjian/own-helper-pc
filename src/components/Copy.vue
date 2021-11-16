<template>
  <div class="copy">
    <Tooltip effect="dark" class="content-tooltip" :content="tooltip||text" placement="top-start">
      <slot><div>{{text}}</div></slot>
    </Tooltip>
    <Tooltip effect="dark" content="点击复制" placement="top-start">
      <my-icon :data-clipboard-text="text" id="copy-button" @click.native="copyText" size="mini" icon-class="copy"></my-icon>
    </Tooltip>
  </div>

</template>

<script>
import Clipboard from 'clipboard'
export default {
  props: {
    text: { type: String },
    tooltip: { type: String }
  },
  methods: {
    copyText () {
      var clipboard = new Clipboard('#copy-button')
      clipboard.on('success', (e) => {
        this.$Message.success('复制成功')
        e.clearSelection()
        clipboard.destroy()
      })

      clipboard.on('error', (e) => {
        this.$Message.success('复制失败')
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="less">
.copy {
  width: 100%;
  .content-tooltip {
    display: inline-block;
    max-width: calc(100% - 30px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
    margin-right: 6px;
  }
  .my-icon-copy {
    cursor: pointer;
    margin-bottom: -4px;
  }
}
</style>
