import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    ...mapState({ account: 'account' }),
    isStudent () {
      return !!this.account.studentId
    },
    orderStudentType () {
      let result = {}
      for (const item of this.studentList) {
        if (Object.hasOwnProperty.call(this.orderCompanyType, item.companyId)) {
          result[item.studentId] = item.studentName
        }
      }
      return result
    }
  },
  methods: {
    getSETime (row) {
      return this.$lib.myMoment(row.startTime).formate('HH:mm') + '-' + this.$lib.myMoment(row.endTime).formate('HH:mm')
    },
    GW (d) {
      return new Date(d).getDay()
    },
    GT () {
      let t = new Date()
      return this.$lib.myMoment(t).formate('YYYY-MM-DD')
    },
    SD (t) {
      return this.$lib.myMoment(t).formate('YYYY-MM-DD')
    },
    GS (t) {
      t = t || new Date()
      return new Date(t).getTime()
    }
  }
}
