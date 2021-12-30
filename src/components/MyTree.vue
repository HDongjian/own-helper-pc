<template>
  <ul :class="{'tree-grid-ul-list':listName, 'cl':listName,'tree-grid-hiden':listName?false:!treeData.down}">
    <li v-for="(tree,i ) in dealTreedata" :key="i" class="cl">
      <div class="tree-grid-list" @click.stop="actions('click',tree.count,tree)">
        <div :class="'fl mt_title p-l-'+tree.count*3">
          <Icon class="icon" @click.stop="down(tree,i)" v-if="tree.children" :type="`ios-arrow-${tree.down?'down':'forward'}`" />
          {{ tree.title }}
        </div>
        <div class="fr action">
          <a @click.stop="actions('modify',tree.count,tree)">编辑</a>
          <a @click.stop="actions('delect',tree.count,tree)">删除</a>
          <a v-if="tree.count<layer" @click.stop="actions('add',tree.count,tree)">添加下一级</a>
        </div>
        <div class="fr b-r">
          <span>{{tree.description}}</span>
        </div>
      </div>
      <my-tree :parent="parent" :layer="layer" v-if="showTree&&tree.children&&tree.children.length" :treeData='tree'></my-tree>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      listName: false,
      downFlag: false,
      showTree: true,
      parentNode: ''
    }
  },
  props: {
    treeData: [Object, Array],
    loadData: { type: Function, default () {} },
    parent: { type: String },
    layer: { type: Number, default: 2 }
  },
  computed: {
    dealTreedata () {
      if (this.listName) {
        return this.treeData
      } else {
        return this.treeData.children
      }
    }
  },
  created () {
    this.listName = this.$lib.isArray(this.treeData)
    this.getParentNode()
  },
  methods: {
    getParentNode () {
      if (!this.parent) {
        this.parentNode = ''
        return
      }
      this.parentNode = this.$parent
      while (this.parentNode.componentName !== this.parent) {
        this.parentNode = this.parentNode.$parent
      }
    },
    down (params, i) {
      this.dealTreedata[i].down = !this.dealTreedata[i].down
      this.$set(this.dealTreedata, i, this.dealTreedata[i])
      this.showTree = false
      setTimeout(() => {
        this.showTree = true
      }, 1)
      this.loadData(params, data => {
        this.$set(params, 'children', data)
      })
    },
    actions (k, c, tree) {
      if (this.parentNode) {
        this.parentNode.$emit('action', { key: k, data: tree })
        return
      }
      var parent = this.$parent
      for (var i = 0; i < c - 1; i++) {
        parent = parent.$parent
      }
      parent.$emit('action', { key: k, data: tree })
    }
  }
}
</script>
