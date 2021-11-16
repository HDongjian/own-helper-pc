<template>
  <div class="role-management">
    <div class="tool">
      <Form v-if="false" ref="query" :model="query" inline :label-width="80">
        <FormItem prop="user" label='角色姓名'>
          <!--eslint-disable-next-line vue/no-parsing-error -->
          <Input type="text" v-model="query.roleName" placeholder="角色姓名"></Input>
        </FormItem>
        <FormItem :label-width="20">
          <Button type="primary" @click="load()">查询</Button>
          <Button @click="reset()">重置</Button>
        </FormItem>
      </Form>
    </div>
    <div class="tool">
      <Button type="primary" @click="add()">添加角色</Button>
    </div>
    <Table stripe :columns="columns" :data="data"></Table>
    <!-- <Page v-if="query.total>0" :total="query.total" show-total :page-size="query.pageSize" :current="query.pageNum" @on-change="change"/> -->
    <Modal v-model="modal" :title="modalTitle" @on-ok="modalOk" @on-cancel="modalCancel">
      <div class="modal-content">
        <Form ref="form" :model="form" :rules="formRules" :label-width="80">
          <FormItem label="角色名称" prop="roleName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.roleName"></Input>
          </FormItem>
          <FormItem label="角色描述" prop="description">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="100" v-model="form.description" type="textarea" :autosize="{minRows: 3,maxRows: 3}"></Input>
          </FormItem>
          <FormItem label="角色授权" prop="menuIds">
            <Tree v-if="showTree" :data="treeList" @on-check-change="treeChoosed" show-checkbox></Tree>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {

  data () {
    return {
      getCatch: true,
      query: {
        roleName: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '角色姓名',
          key: 'roleName',
          align: 'center'
        },
        {
          title: '角色描述',
          key: 'description',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          render: (h, params) => {
            return h('p', this.$lib.myMoment(new Date(params.row.createTime)).formate())
          }
        },
        {
          title: '更新时间',
          key: 'updateTime',
          align: 'center',
          render: (h, params) => {
            return h('p', this.$lib.myMoment(new Date(params.row.updateTime)).formate())
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  marginRight: '16px'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              }, '编辑'),
              h('a', {
                on: {
                  click: () => {
                    this.delect(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [],
      modal: false,
      modalTitle: '添加角色',
      modifyId: '',
      form: {
        roleName: '',
        menuIds: '',
        description: ''
      },
      formRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        menuIds: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      treeList: [],
      showTree: true
    }
  },

  created () {
    this.load()
  },
  mounted () { },
  methods: {
    load () {
      this.$http.request({
        method: 'get',
        url: `/api/role/list`
      }).then((res) => {
        this.data = res.data.data
      })
    },
    reset () { },
    add () {
      this.modal = true
      this.modifyId = ''
      this.modalTitle = '添加角色'
      this.getMenu()
    },
    edit (row) {
      this.modal = true
      this.modifyId = row.roleId
      this.modalTitle = `编辑${row.roleName}`
      for (const key in row) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = row[key]
        }
      }
      this.getMenu()
    },
    delect (data) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除${data.roleName}角色`,
        onOk: () => {
          this.$http.request({
            method: 'post',
            url: `/api/role/delect/${data.roleId}`,
            data: this.form
          }).then((res) => {
            if (res.data.code === 200) {
              this.load()
              this.$Message.success('删除成功')
            }
          })
        }
      })
    },
    modalOk () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = this.modifyId ? `/api/role/update/${this.modifyId}` : `/api/role/add`
          this.$http.request({
            method: 'post',
            url: url,
            data: this.form
          }).then((res) => {
            if (res.data.code === 200) {
              this.load()
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
    treeChoosed (ids) {
      let menuIds = []
      for (const d of ids) {
        if (!menuIds.includes(d.menuId)) {
          menuIds.push(d.menuId)
        }
        if (d.parentId !== 0 && !menuIds.includes(d.parentId)) {
          menuIds.push(d.parentId)
        }
      }
      this.form.menuIds = menuIds.join(',')
    },
    getMenu () {
      this.$http.request({
        method: 'get',
        url: `/api/menu/list`
      }).then((res) => {
        let menuIds = this.form.menuIds.split(',')
        let data = res.data.data.map(item => {
          let h = this.hasChildren(res.data.data, item.menuId)
          if (!h && this.form.menuIds && menuIds.indexOf(String(item.menuId)) >= 0) {
            item.checked = true
          }
          item.id = item.menuId
          item.value = item.menuId
          item.title = item.menuName
          return item
        })
        this.treeList = this.$lib.dealTreeList(data)
      })
    },
    hasChildren (menus, id) {
      for (const menu of menus) {
        if (Number(menu.parentId) === Number(id)) {
          return true
        }
      }
      return false
    }
  }
}
</script>
