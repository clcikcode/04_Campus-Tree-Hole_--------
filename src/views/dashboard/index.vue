<template>
  <div class="dashboard-container">
    <div class="top">
      <div class="zhuce">
        <span class="num">{{ todayUserCount }}</span>
        <span class="text">位今日注册人数</span>
      </div>
      <div class="publish">
        <span class="num">{{ todayDynamicCount }}</span>
        <span class="text">份今日动态发布</span>
      </div>
      <div class="pub_count">
        <span class="num">{{ allDynamicCount }}</span>
        <span class="text">总动态数量</span>
      </div>
      <div class="zhuce_count">
        <span class="num">{{ allUserCount }}</span>
        <span class="text">总注册人数</span>
      </div>
    </div>
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <div class="Echarts">
      <div class="TU">
        <div id="mychart" :style="myChartStyle" v-show="show"></div>
        <span>7个月内动态发布折线图</span>
      </div>
      <div class="TU">
        <div id="bingtu" :style="myChartStyle"></div>
        <span>动态类型饼图</span>
      </div>
      <div class="TU">
        <div id="zhutu" :style="myChartStyle"></div>
        <span>7个月内注册人数柱状图</span>
      </div>
    </div>

    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%; margin-top: 10px">
      <el-table-column type="selection" />

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- <el-table-column prop="commentId" label="动态类型" /> -->
      <el-table-column prop="adminName" label="管理员" />
      <el-table-column prop="action" label="操作" />
      <el-table-column prop="createTime" label="日期" />
    </el-table>

    <!-- 分页组件 -->
    <el-pagination :current-page="page" :total="total" :page-size="limit" :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center" layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData" @size-change="changeSize" />


  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
import apiDynamic from "@/api/system/dynamic";
import apiType from "@/api/system/type";
import apiLog from "@/api/system/log";

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      myChart: {},
      xData: [], //横坐标
      yData: [], //人数数据
      myChartStyle: { float: "left", width: "400px", height: "400px", }, //图表样式
      myBing: {},
      myzhu: {},
      list: [],
      todayDynamicCount: 0,
      allDynamicCount: 0,
      monthDynamicCount: {},
      show: true,
      todayUserCount: 0,
      allUserCount: 0,
      typeCount: {},
      BingTu: [],
      monthUserCount: {},
      xA: [],
      yA: [],
      page: 1,
      total: 0,
      listLoading: false,
      limit: 5
    };
  },
  mounted() {
    this.initTodayDynamicCount();
    this.initAllDynamicCount();
    this.initMonthDynamicCount();
    this.initAllUserCount();
    this.initTodayUserCount();
    this.initTypeCount();
    this.initMonthUserCount();
    this.getLogList();
  },
  methods: {
    initEcharts() {

      const option = {
        xAxis: {
          data: this.xData
        },
        yAxis: {},
        series: [
          {
            data: this.yData,
            type: "line" // 类型设置为折线图
          }
        ]
      };
      this.myChart = echarts.init(document.getElementById("mychart"));
      this.myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
    initBingtu() {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.BingTu
          }
        ]
      };
      this.myBing = echarts.init(document.getElementById("bingtu"));
      this.myBing.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.myBing.resize();
      });
    },
    initzhutu() {
      const option = {
        xAxis: {
          type: 'category',
          data: this.xA
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.yA,
          type: 'bar'
        }]
      };
      this.myzhu = echarts.init(document.getElementById("zhutu"));
      this.myzhu.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
    initTodayDynamicCount() {
      apiDynamic.getTodaydynamicCount().then(res => {
        this.todayDynamicCount = res.data;
      });
    },
    initAllDynamicCount() {
      apiDynamic.getAllCount().then(res => {
        this.allDynamicCount = res.data;
      });
    },
    initMonthDynamicCount() {
      apiDynamic.getmonthdynamicCount().then(res => {
        this.monthDynamicCount = res.data;
        for (let key in this.monthDynamicCount) {
          if (this.monthDynamicCount.hasOwnProperty(key)) {
            this.xData.push(key);
            this.yData.push(this.monthDynamicCount[key]);
          }
        }
        this.initEcharts();
      });
    },
    initTodayUserCount() {
      apiDynamic.getTodayUser().then(res => {
        this.todayUserCount = res.data;
      });
    },
    initAllUserCount() {
      apiDynamic.getAllUserCount().then(res => {
        this.allUserCount = res.data;
      })
    },
    initTypeCount() {
      apiType.getAllCount().then(res => {
        this.typeCount = res.data.data;
        for (let key in this.typeCount) {
          if (this.typeCount.hasOwnProperty(key)) {
            this.BingTu.push({ value: this.typeCount[key], name: key });
          }
        }
        this.initBingtu();
      })
    },
    initMonthUserCount() {
      apiDynamic.getMonthUserCount().then(res => {
        this.monthUserCount = res.data;
        for (let key in this.monthUserCount) {
          if (this.monthUserCount.hasOwnProperty(key)) {
            this.xA.push(key);
            this.yA.push(this.monthUserCount[key]);
          }
        }
        this.initzhutu();
      })
    },
    getLogList() {
      apiLog.getLogList(this.page, this.limit).then(res => {
        this.list = res.data.records;
        this.total = res.data.total;
      })
    },
    fetchData(page = 1) {
      this.page = page;
      console.log("翻页。。。" + this.page);
      this.getLogList();
    },
    changeSize(size) {
      console.log("size:" + size);
      this.limit = size;
      this.fetchData(1);
    },
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    display: flex;
    flex-direction: column;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.Echarts {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 400px;
  border: 1px solid #ccc;
}

.top {
  height: 150px;
  width: 100%;
  background-color: #304156;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}

// .top span {
//   color: #fff;
//   font-size: 25px;
//   margin: 0 20px;
//   line-height: 150px;
// }
.num {
  font-size: 40px;
  color: #fff;
  line-height: 150px;
  margin: auto 20px;
}

.text {
  font-size: 20px;
  color: #fff;
  line-height: 150px;
  margin: auto 10px;
}
.TU{
  display: flex; 
  flex-direction: column;
}

 .TU span {
  color: #304156;
  font-size: 20px;
  margin: 10px 0;
  text-align: center;
 }
</style>
