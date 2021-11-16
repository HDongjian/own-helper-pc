<template>
  <div class="subject-management">
    <div class="tool">
      <Form ref="query" :model="query" inline :label-width="80">
        <FormItem prop="user" label='科目姓名'>
          <!--eslint-disable-next-line vue/no-parsing-error -->
          <Input type="text" v-model="query.subjectName" placeholder="科目姓名"></Input>
        </FormItem>
        <FormItem :label-width="20">
          <Button type="primary" @click="load()">查询</Button>
          <Button @click="reset()">重置</Button>
          <Button type="primary" @click="add()">添加科目</Button>
        </FormItem>
      </Form>
    </div>
    <Table stripe :columns="columns" :data="data"></Table>
    <!-- <Page v-if="query.total>0" :total="query.total" show-total :page-size="query.pageSize" :current="query.pageNum" @on-change="change"/> -->
    <Modal v-model="modal" :title="modalTitle" @on-ok="modalOk" @on-cancel="modalCancel">
      <div class="modal-content">
        <Form ref="form" :model="form" :rules="formRules" :label-width="80">
          <FormItem label="科目名称" prop="subjectName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.subjectName"></Input>
          </FormItem>
          <FormItem label="科目描述" prop="description">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="100" v-model="form.description" type="textarea" :autosize="{minRows: 3,maxRows: 3}"></Input>
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
        subjectName: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '科目姓名',
          key: 'subjectName',
          align: 'center'
        },
        {
          title: '科目描述',
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
      modalTitle: '添加科目',
      modifyId: '',
      form: {
        subjectName: '',
        description: ''
      },
      formRules: {
        subjectName: [
          { required: true, message: '科目名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '科目描述不能为空', trigger: 'blur' }
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
        url: `/api/subject/list`
      }).then((res) => {
        this.data = res.data.data
      })
    },
    reset () { },
    add () {
      this.modal = true
      this.modifyId = ''
      this.modalTitle = '添加科目'
    },
    edit (row) {
      this.modal = true
      this.modifyId = row.subjectId
      this.modalTitle = `编辑${row.subjectName}`
      for (const key in row) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = row[key]
        }
      }
    },
    delect (data) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除${data.subjectName}科目`,
        onOk: () => {
          this.$http.request({
            method: 'post',
            url: `/api/subject/delect/${data.subjectId}`,
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
          let url = this.modifyId ? `/api/subject/update/${this.modifyId}` : `/api/subject/add`
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
    }
  }
}
</script>
