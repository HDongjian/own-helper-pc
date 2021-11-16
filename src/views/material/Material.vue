<template>
  <div class="material">
    <Row :gutter="15">
      <Col span="6">
      <div class="catalogue tree-grid">
        <Button class="first-button" type="primary" @click="catalogueAdd">添加一级目录</Button>
        <my-tree parent="material" :layer="4" class="material-tree" :treeData='catalogueData'></my-tree>
      </div>
      </Col>
      <Col span="18">
      <div class="article">
        <div class="tool">
          <Form ref="query" :model="query" inline :label-width="80">
            <FormItem prop="user" label='资料名称'>
              <!--eslint-disable-next-line vue/no-parsing-error -->
              <Input type="text" v-model="query.articleName" placeholder="资料名称"></Input>
            </FormItem>
            <FormItem :label-width="20">
              <Button type="primary" @click="load()">查询</Button>
              <Button @click="reset()">重置</Button>
              <Button type="primary" v-if="catalogueRow.catalogueId" @click="add()">添加资料</Button>
            </FormItem>
          </Form>
        </div>
        <Table stripe :columns="columns" :data="data"></Table>
        <Page v-if="query.total>0" :total="query.total" show-total :page-size="query.pageSize" :current="query.pageNum" @on-change="load" />
      </div>
      </Col>
    </Row>
    <Modal v-model="catalogueModal" :title="catalogueTitle" @on-ok="catalogueOk" @on-cancel="catalogueCancel">
      <div class="modal-content">
        <Form ref="catalogue" :model="catalogue" :rules="catalogueRules" :label-width="80">
          <FormItem label="目录名称" prop="catalogueParentName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" readonly v-model="catalogue.catalogueParentName"></Input>
          </FormItem>
          <FormItem label="上级名称" prop="catalogueName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="catalogue.catalogueName"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 添加资料 -->
    <Modal v-model="modal" :title="modalTitle" @on-ok="modalOk" @on-cancel="modalCancel">
      <div class="modal-content">
        <Form ref="form" :model="form" :rules="formRules" :label-width="80">
          <FormItem label="目录名称" prop="catalogueName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" readonly v-model="catalogueRow.catalogueName"></Input>
          </FormItem>
          <FormItem label="资料名称" prop="articleName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.articleName" placeholder="资料名称"></Input>
          </FormItem>
          <FormItem prop="subjectId" label='资料科目'>
            <Select clearable style="width: 100%" v-model="form.subjectId" placeholder="资料科目">
              <Option v-for="(item,i) in subjectList" :key="i" :value="String(item.subjectId)">{{item.subjectName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="资料描述" prop="description">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="100" placeholder="资料描述" v-model="form.description" type="textarea" :autosize="{minRows: 3,maxRows: 3}"></Input>
          </FormItem>
          <FormItem label="解析" prop="analysis">
            <image-uploader :limit="1" v-model="form.analysis" accept="application/pdf"></image-uploader>
          </FormItem>
          <FormItem label="答案" prop="answer">
            <image-uploader :limit="1" v-model="form.answer" accept="application/pdf"></image-uploader>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <pdf-view ref="pdfView"></pdf-view>
  </div>
</template>

<script>
export default {
  name: 'material',
  data () {
    return {
      componentName: 'material',
      query: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
        articleName: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '资料名称',
          key: 'articleName',
          align: 'center'
        },
        {
          title: '资料描述',
          key: 'description',
          align: 'center'
        },
        {
          title: '科目',
          align: 'center',
          render: (h, params) => {
            return h('p', this.subjectMap[params.row.subjectId])
          }
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
                style: {
                  marginRight: '16px'
                },
                on: {
                  click: () => {
                    this.delect(params.row)
                  }
                }
              }, '删除'),
              h('a', {
                on: {
                  click: () => {
                    this.pdfDetail(params.row)
                  }
                }
              }, '查看资料')
            ])
          }
        }
      ],
      catalogueTitle: '新增目录',
      catalogueData: [],
      catalogueModal: false,
      catalogueEditId: '',
      catalogue: {
        catalogueParentId: '',
        catalogueParentName: '',
        catalogueName: ''
      },
      catalogueRules: {
        catalogueName: [
          { required: true, message: '目录名称不能为空', trigger: 'blur' }
        ]
      },
      catalogueRow: {},
      data: [],
      modal: false,
      modalTitle: '添加资料',
      modifyId: '',
      form: {
        articleName: '',
        description: '',
        analysis: '/static/text.pdf',
        subjectId: '',
        answer: ''
      },
      formRules: {
        articleName: [
          { required: true, message: '资料名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '资料描述不能为空', trigger: 'blur' }
        ],
        analysis: [
          { required: true, message: '解析不能为空', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '科目不能为空', trigger: 'change' }
        ]
      },
      subjectList: [],
      subjectMap: {}
    }
  },
  created () {
    this.loadCatalogue()
    this.loadSubject()
    this.getAction()
  },
  methods: {
    pdfDetail (row) {
      let data = [
        { title: '解析', url: this.$lib.getStatic(row.analysis) }
      ]
      if (row.answer) {
        data.push({ title: '答案', url: this.$lib.getStatic(row.answer) })
      }
      this.$refs.pdfView.showPdf(data)
    },
    loadSubject () {
      this.$http.request({
        method: 'get',
        url: `/api/subject/list`
      }).then((res) => {
        this.subjectList = res.data.data
        for (const item of this.subjectList) {
          this.subjectMap[item.subjectId] = item.subjectName
        }
      })
    },
    getAction () {
      this.$on('action', (options) => {
        let { key, data } = options
        if (key === 'click') {
          this.catalogueRow = data
          this.load(1)
        }
        if (key === 'add') {
          this.catalogueAdd(data)
          return
        }
        if (key === 'modify') {
          this.catalogueModal = true
          this.catalogueEdit(data)
          return
        }
        if (key === 'delect') {
          this.catalogueDelect(data)
        }
      })
    },
    loadCatalogue () {
      this.$http.request({
        method: 'get',
        url: `/api/catalogue/list`
      }).then((res) => {
        let data = res.data.data.map(item => {
          item.id = Number(item.catalogueId)
          item.title = item.catalogueName
          item.parentId = item.catalogueParentId
          item.count = item.parentId === '0' ? 1 : 2
          return item
        })
        this.catalogueData = this.$lib.dealTreeList(data)
      })
    },
    catalogueAdd (row = {}) {
      let { catalogueName, catalogueId } = row
      this.catalogueTitle = '新增目录'
      if (catalogueId) {
        this.catalogue.catalogueParentName = catalogueName
        this.catalogue.catalogueParentId = catalogueId
      } else {
        this.catalogue.catalogueParentName = '初始目录'
        this.catalogue.catalogueParentId = '0'
      }
      this.catalogueModal = true
    },
    catalogueEdit (row) {
      this.catalogueTitle = '编辑目录'
      this.catalogueEditId = row.catalogueId
      this.catalogue.catalogueName = row.catalogueName
      this.catalogue.catalogueParentId = row.catalogueParentId
    },
    catalogueDelect (data) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除${data.catalogueName}目录`,
        onOk: () => {
          this.$http.request({
            method: 'post',
            url: `/api/catalogue/delect/${data.catalogueId}`
          }).then((res) => {
            if (res.data.code === 200) {
              this.load()
              this.$Message.success('删除成功')
            }
          })
        }
      })
    },
    catalogueOk () {
      this.$refs.catalogue.validate((valid) => {
        if (!valid) return
        let url = this.catalogueEditId ? `/api/catalogue/update/${this.catalogueEditId}` : `/api/catalogue/add`
        let data = this.catalogue
        delete data.catalogueParentName
        this.$http.request({
          method: 'post',
          url: url,
          data
        }).then((res) => {
          if (res.data.code === 200) {
            this.loadCatalogue()
            this.$Message.success(this.catalogueEditId ? '编辑成功' : '添加成功')
            this.modalCancel()
          }
        })
      })
    },
    catalogueCancel () {
      this.modal = false
      this.$refs.catalogue.resetFields()
    },
    load (page) {
      this.query.pageNum = page || '1'
      let params = { ...this.query }
      this.$http.request({
        method: 'get',
        url: `/api/article/page`,
        params: { ...params, catalogueId: this.catalogueRow.catalogueId }
      }).then((res) => {
        let data = res.data.data
        this.data = data.data
        this.query.total = data.total
        this.loading = false
      })
    },
    reset () { },
    add () {
      this.modal = true
      this.modifyId = ''
      this.modalTitle = '添加资料'
    },
    edit (row) {
      this.modal = true
      this.modifyId = row.articleId
      this.modalTitle = `编辑${row.articleName}`
      for (const key in row) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = row[key]
        }
      }
    },
    delect (data) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除${data.articleName}资料`,
        onOk: () => {
          this.$http.request({
            method: 'post',
            url: `/api/article/delect/${data.articleId}`
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
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (!valid) return
        let url = this.modifyId ? `/api/article/update/${this.modifyId}` : `/api/article/add`
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
      })
    },
    modalCancel () {
      this.modal = false
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less">
.home-container .right-content .material {
  padding: 0px;
  background-color: transparent;
  box-shadow: none;
  // height: ~"calc(100% + 30px)";
  // width: ~'calc(100% + 6px)';
  // top: -30px;
  // left: -15px;
  // position: absolute;
  // overflow: hidden;
  // height: 100%;
  // margin-top: -15px;
  box-sizing: border-box;
  .ivu-row{
    height: 100%;
  }
  .first-button {
    width: 100%;
  }
  .material-tree {
    margin-top: 10px;
    height: ~'calc(100% - 45px)';
  }
  .tree-grid-list {
    padding-left: 20px;
    padding-right: 10px;
    box-sizing: border-box;
    border: none;
    .fl {
      border: none;
    }
    .b-r {
      display: none;
    }
    .mt_title {
      width: 50%;
    }
    .action {
      width: 50%;
      text-align: right;
    }
  }
  .ivu-col {
    height: 100%;
    > div {
      padding: 15px;
      box-sizing: border-box;
      border-radius: 4px;
      height: 100%;
      background-color: #fff;
      box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
