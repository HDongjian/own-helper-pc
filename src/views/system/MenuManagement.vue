<template>
  <div class="exam-management">
    <div class="tool">
      <Button type="primary" @click="addFirst">添加一级菜单</Button>
    </div>
    <div class="tree-grid">
      <div class="ivu-row tree-grid-header cl">
        <div class="fr">操作</div>
        <div class="fr">介绍</div>
        <div class="fr">菜单名称</div>
      </div>
      <my-tree :treeData='data'></my-tree>
    </div>
    <Modal v-model="modal" :title="modalTitle" @on-ok="modalOk" @on-cancel="modalCancel">
      <div class="modal-content">
        <Form ref="form" :model="form" :rules="formRules" :label-width="80">
          <FormItem label="父级菜单" prop="parentId">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input disabled v-model="form.parentId"></Input>
          </FormItem>
          <FormItem label="菜单名称" prop="menuName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.menuName"></Input>
          </FormItem>
          <FormItem label="菜单路径" prop="path">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="50" v-model="form.path"></Input>
          </FormItem>
          <FormItem label="菜单图标" prop="menuIcon">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="50" v-model="form.menuIcon"></Input>
          </FormItem>
          <FormItem label="菜单顺序" prop="orderNo">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input v-model="form.orderNo"></Input>
          </FormItem>
          <FormItem label="菜单描述" prop="description">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="200" v-model="form.description" type="textarea" :autosize="{minRows: 3,maxRows: 3}"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import { validateWage } from '../../utils/validate'

export default {
  data () {
    return {
      getCatch: true,
      data: [],
      modal: false,
      modalTitle: '添加一级菜单',
      modifyId: '',
      form: {
        parentId: 0,
        menuName: '',
        path: '',
        menuIcon: '',
        orderNo: '',
        description: ''
      },
      formRules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '菜单路径不能为空', trigger: 'blur' }
        ],
        orderNo: [
          { required: true, validator: validateWage, trigger: 'blur' }
        ],
        menuIcon: [
          { required: true, message: '菜单图标不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '菜单描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getMenu()
    this.getAction()
  },
  methods: {
    addFirst () {
      this.modal = true
      this.modalTitle = '添加一级菜单'
      this.modifyId = ''
      this.form.parentId = 0
    },
    getAction () {
      this.$on('action', (options) => {
        let { key, data } = options
        if (key === 'add') {
          this.actionAdd(data)
          return
        }
        if (key === 'modify') {
          this.actionModify(data)
          return
        }
        if (key === 'delect') {
          this.actionDelect(data)
        }
      })
    },
    actionModify (data) {
      this.modal = true
      this.modalTitle = `编辑${data.menuName}菜单`
      this.modifyId = data.menuId
      for (const key in data) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = data[key]
        }
      }
    },
    actionDelect (data) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除${data.menuName}菜单`,
        onOk: () => {
          this.$http.request({
            method: 'post',
            url: `/api/menu/delect/${data.menuId}`,
            data: this.form
          }).then((res) => {
            if (res.data.code === 200) {
              this.getMenu()
              this.$Message.success('删除成功')
            }
          })
        }
      })
    },
    actionAdd (data) {
      this.modal = true
      this.modalTitle = '添加二级菜单'
      this.modifyId = ''
      this.form.parentId = data.menuId
    },
    modalOk () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = this.modifyId ? `/api/menu/update/${this.modifyId}` : `/api/menu/add`
          this.$http.request({
            method: 'post',
            url: url,
            data: this.form
          }).then((res) => {
            if (res.data.code === 200) {
              this.getMenu()
              this.$Message.success(this.modifyId ? '编辑成功' : '添加成功')
              this.modalCancel()
            }
          })
        }
      })
    },
    modalCancel () {
      this.modal = false
      this.$refs.form.resetFields()
    },
    getMenu () {
      this.$http.request({
        method: 'get',
        url: `/api/menu/list`
      }).then((res) => {
        this.data = res.data.data.map(item => {
          item.id = item.menuId
          item.title = item.menuName
          item.count = item.parentId === 0 ? 1 : 2
          return item
        })
        this.data = this.$lib.dealTreeList(this.data)
      })
    }
  }
}
</script>
