<template>
  <div class="user-management">
    <div class="tool">
      <Button type="primary" @click="add()">添加用户</Button>
    </div>
    <Table stripe :columns="columns" :data="data"></Table>
    <Modal v-model="modal" :title="modalTitle" @on-ok="modalOk" @on-cancel="modalCancel">
      <div class="modal-content">
        <Form ref="form" :model="form" :rules="formRules" :label-width="80">
          <FormItem label="用户名" prop="name">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.name"></Input>
          </FormItem>
          <FormItem label="登录名" prop="userName">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="10" v-model="form.userName"></Input>
          </FormItem>
          <FormItem v-if="!modifyId" label="密码" prop="password">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input v-model="form.password"></Input>
          </FormItem>
          <FormItem label="手机号" prop="mobile">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="11" v-model="form.mobile"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <!--eslint-disable-next-line vue/no-parsing-error -->
            <Input :maxlength="50" v-model="form.email"></Input>
          </FormItem>
          <FormItem label="头像" prop="avatar">
            <image-uploader :limit="1" v-model="form.avatar"></image-uploader>
          </FormItem>
          <FormItem label="性别" prop="gender">
            <Select style="width: 100%" v-model="form.gender" placeholder="用户角色">
              <Option v-for="(label,value) in genderMap" :key="value" :value="value">{{label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="角色" prop="roleId">
            <Select style="width: 100%" v-model="form.roleId" placeholder="用户角色">
              <Option v-for="(label,value) in roleMap" :key="value" :value="value">{{label}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="modalCancel()">取消</Button>
        <Button type="primary" @click="modalOk()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { validatePhone, validateEmail, validatePassword, validateUserName } from '../../utils/validate'

export default {

  data () {
    return {
      getCatch: true,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '用户姓名',
          key: 'name',
          align: 'center'
        },
        {
          title: '登录名',
          key: 'userName',
          align: 'center'
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'center'
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center'
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center',
          render: (h, params) => {
            return h('p', this.genderMap[params.row.gender])
          }
        },
        {
          title: '用户角色',
          key: 'roleId',
          align: 'center',
          render: (h, params) => {
            return h('p', this.roleMap[params.row.roleId])
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
                    this.updatePW(params.row)
                  }
                }
              }, '修改密码')
            ])
          }
        }
      ],
      data: [],
      modal: false,
      modalTitle: '添加用户',
      modifyId: '',
      form: {
        userName: '',
        name: '',
        mobile: '',
        email: '',
        gender: '',
        roleId: '',
        password: '',
        avatar: ''
      },
      formRules: {
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '头像不能为空', trigger: 'change' }
        ]
      },
      roleList: [],
      roleMap: {},
      genderMap: {
        1: '男',
        2: '女'
      },
      newPassword: ''
    }
  },

  created () {
    this.load()
    this.getRole()
  },
  methods: {
    load () {
      this.$http.request({
        method: 'get',
        url: `/api/user/list`
      }).then((res) => {
        this.data = res.data.data
      })
    },
    add () {
      this.modal = true
      this.modifyId = ''
      this.modalTitle = '添加角色'
    },
    edit (row) {
      this.modal = true
      this.modifyId = row.userId
      this.modalTitle = `编辑${row.userName}`
      for (const key in row) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = String(row[key])
        }
      }
    },
    delect (data) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除${data.userName}角色`,
        onOk: () => {
          this.$http.request({
            method: 'post',
            url: `/api/user/delect/${data.userId}`
          }).then((res) => {
            if (res.data.code === 200) {
              this.load()
              this.$Message.success('删除成功')
            }
          })
        }
      })
    },
    updatePW (data) {
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
            props: {
              value: this.newPassword,
              autofocus: true,
              placeholder: '请输入密码'
            },
            on: {
              input: (val) => {
                this.newPassword = val
              }
            }
          })
        },
        onOk: () => {
          if (!this.newPassword) {
            this.$Message.info('请填写密码')
            return
          }
          this.$http.request({
            method: 'post',
            url: `/api/user/password/${data.userId}`,
            data: {
              password: md5(this.newPassword)
            }
          }).then((res) => {
            if (res.data.code === 200) {
              this.load()
              this.newPassword = ''
              this.$Message.success('修改成功')
            }
          })
        }
      })
    },
    modalOk () {
      console.log(this.form.avatar)
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = this.modifyId ? `/api/user/update/${this.modifyId}` : `/api/user/add`
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
    getRole () {
      this.$http.request({
        method: 'get',
        url: `/api/role/list`
      }).then((res) => {
        this.roleList = res.data.data
        for (const role of this.roleList) {
          this.$set(this.roleMap, role.roleId, role.roleName)
        }
      })
    }
  }
}
</script>
