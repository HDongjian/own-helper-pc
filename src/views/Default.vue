<template>
  <div class="home po-re">
    <div class="datalogue-echarts" ref="datalogue"></div>
    <Spin size="large" fix v-if="loading"></Spin>
    <!-- <div class="datalogue" v-for="key in Object.keys(dealDatalogueData)" :key="key">
      <div class="datalogue-item" v-for="item in dealDatalogueData[key]" :key="item.catalogueId">
        <h4>{{item.catalogueName}}</h4>
      </div>
    </div> -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {
      loading: false,
      catalogueData: []
    }
  },
  computed: {
    dealDatalogueData () {
      let result = {}
      for (const item of this.catalogueData) {
        if (!Object.hasOwnProperty.call(result, item.count)) {
          result[item.count] = []
        }
        result[item.count].push(item)
      }
      return result
    }
  },
  created () {
    this.loadCatalogue()
  },
  methods: {
    loadCatalogue () {
      this.loading = true
      this.$http.request({
        method: 'get',
        url: `/api/catalogue/list`
      }).then((res) => {
        let data = res.data.data.map(item => {
          item.id = Number(item.catalogueId)
          item.name = item.articleCount ? `${item.catalogueName}（${item.articleCount}）` : item.catalogueName
          item.value = item.articleCount
          item.parentId = item.catalogueParentId
          return item
        })
        this.catalogueData = this.$lib.dealTreeList(data)
        // let data = [...res.data.data, { catalogueParentId: '-1', catalogueId: '0', catalogueName: '雅思小能手' }]
        // this.catalogueData = data.map(item => {
        //   item.count = 0
        //   if (String(item.catalogueParentId) === '-1') {
        //     return item
        //   }
        //   let parent = item
        //   while (String(parent.catalogueParentId) !== '-1') {
        //     parent = data.find(fitem => String(fitem.catalogueId) === String(parent.catalogueParentId))
        //     item.count++
        //   }
        //   return item
        // })
        this.loading = false
        this.$nextTick(() => {
          this.getDataCount()
        })
      })
    },
    getDataCount () {
      let myChart = echarts.init(this.$refs.datalogue)
      let option = {
        title: {
          show: true,
          text: '雅思小助手文章全览',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            id: 0,
            name: '雅思小帮手',
            data: [{ name: '雅思小帮手', children: this.catalogueData }],
            top: '10%',
            left: '10%',
            bottom: '10%',
            right: '10%',
            symbolSize: 7,
            // edgeShape: 'polyline',
            // edgeForkPosition: '63%',
            initialTreeDepth: 10,
            lineStyle: {
              color: '#74bef8',
              width: 2
            },
            label: {
              backgroundColor: '#fff',
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 16,
              borderWidth: '1',
              padding: [12, 16, 10, 16],
              borderRadius: 8,
              borderColor: '#74bef8'
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
      myChart.setOption(option)
      console.log(myChart)
      myChart.on('click', function (params) {
        window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name))
      })
    }
  }
}
</script>

<style lang="less">
.home {
  .datalogue-echarts {
    height: 100%;
  }
  .datalogue {
    margin: 30px 0;
    &:first-child {
      margin-top: 0;
    }
    .datalogue-item {
      display: inline-block;
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      & + .datalogue-item {
        margin-left: 20px;
      }
    }
  }
}
</style>
