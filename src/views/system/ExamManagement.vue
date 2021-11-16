<template>
  <div class="exam-management">
    <div class="tool">
      <Button type="primary" @click="addFirst">添加考试类别</Button>
    </div>
    <div class="tree-grid">
      <div class="ivu-row tree-grid-header cl">
        <div class="fr">操作</div>
        <div class="fr">介绍</div>
        <div class="fr">考试类别</div>
      </div>
      <my-tree :treeData='data'></my-tree>
    </div>
    <Modal v-model="modal" :title="modalTitle" @on-ok="modalOk" @on-cancel="modalCancel">
      <div class="modal-content">
        <Form ref="form" :model="form" :rules="formRules" :label-width="80">
          <FormItem v-if="type==='exam'" label="考试类别" prop="examName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.examName"></Input>
          </FormItem>
          <FormItem v-else label="考试科目" prop="subjectName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.subjectName"></Input>
          </FormItem>
          <FormItem label="菜单描述" prop="description">
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
      data: [],
      modal: false,
      type: '',
      modalTitle: '添加一级菜单',
      modifyId: '',
      modifyData: {},
      form: {
        examName: '',
        subjectName: '',
        description: ''
      },
      formRules: {
        examName: [
          { required: true, message: '考试类别不能为空', trigger: 'blur' }
        ],
        subjectName: [
          { required: true, message: '考试科目不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '菜单描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getExamAndSubject()
    this.getAction()
  },
  methods: {
    addFirst () {
      this.modal = true
      this.modalTitle = '添加考试类别'
      this.modifyId = ''
      this.type = 'exam'
    },
    getAction () {
      this.$on('action', (options) => {
        let { key, data } = options
        this.modifyData = data
        this.type = data.type
        if (key === 'add') {
          this.type = 'subject'
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
      this.modalTitle = `编辑${data.examName || data.subjectName}`
      this.modifyId = this.type === 'subject' ? data.subjectId : data.examId
      for (const key in data) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = data[key]
        }
      }
    },
    actionDelect (data) {
      this.modifyId = this.type === 'subject' ? data.subjectId : data.examId
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除${data.examName || data.subjectName}`,
        onOk: () => {
          this.$http.request({
            method: 'post',
            url: `/${this.type}/delect/${this.modifyId}`,
            data: this.form
          }).then((res) => {
            if (res.data.code === 200) {
              this.getExamAndSubject()
              this.$Message.success('删除成功')
            }
          })
        }
      })
    },
    actionAdd (data) {
      this.modal = true
      this.modalTitle = '添加科目'
      this.modifyId = ''
    },
    modalOk () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = this.modifyId ? `/${this.type}/update/${this.modifyId}` : `/${this.type}/add`
          let data = { ...this.form }
          if (this.type === 'subject') {
            delete data.examName
          } else {
            delete data.subjectName
          }
          if (this.type === 'subject' && !this.modifyId) {
            data.examId = this.modifyData.examId
          }
          this.$http.request({
            method: 'post',
            url: url,
            data: data
          }).then((res) => {
            if (res.data.code === 200) {
              this.getExamAndSubject()
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
    async getExamAndSubject () {
      this.data = await this.getExam()
      let subject = await this.getSubject()
      for (const exam of this.data) {
        for (const sub of subject) {
          if (sub.examId === exam.examId && exam.children) {
            exam.children.push(sub)
          } else if (sub.examId === exam.examId && !exam.children) {
            exam.children = [{ ...sub }]
          }
        }
      }
      this.data = [...this.data]
    },
    getExam () {
      return this.$http.request({
        method: 'get',
        url: `/api/exam/list`
      }).then((res) => {
        return res.data.data.map(item => {
          item.title = item.examName
          item.count = 1
          item.type = 'exam'
          return item
        })
      })
    },
    getSubject () {
      return this.$http.request({
        method: 'get',
        url: `/api/subject/list`
      }).then((res) => {
        return res.data.data.map(item => {
          item.title = item.subjectName
          item.count = 2
          item.type = 'subject'
          return item
        })
      })
    }
  }
}
</script>
