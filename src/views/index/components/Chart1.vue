<template>
  <el-card class="chart1" shadow="hover">
    <div slot="header">
      <span>
        <vab-remix-icon icon-class="line-chart-line"></vab-remix-icon>
        访问量
      </span>
      <el-tag class="card-header-tag" type="success">日</el-tag>
    </div>
    <vab-chart
      :autoresize="true"
      :options="options"
      theme="vab-echarts-theme"
    />
    <div class="bottom">
      <span>
        日均访问量:

        <vab-count
          :decimals="countConfig.decimals"
          :duration="countConfig.duration"
          :end-val="countConfig.endVal"
          :prefix="countConfig.prefix"
          :separator="countConfig.separator"
          :start-val="countConfig.startVal"
          :suffix="countConfig.suffix"
        />
      </span>
    </div>
  </el-card>
</template>
<script>
  import VabChart from "@/extra/vabCharts";
  import VabCount from "@/extra/vabCount";

  export default {
    components: {
      VabChart,
      VabCount,
    },
    data() {
      return {
        timer: 0,
        countConfig: {
          startVal: 0,
          endVal: this.$baseLodash.random(20000, 60000),
          decimals: 0,
          prefix: "",
          suffix: "",
          separator: ",",
          duration: 8000,
        },
        //访问量
        options: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: [],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "访问量",
              type: "line",
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
      };
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    mounted() {
      let base = +new Date(2020, 1, 1);
      let oneDay = 24 * 3600 * 1000;
      let date = [];

      let data = [Math.random() * 1500];
      let now = new Date(base);

      const addData = (shift) => {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/");
        date.push(now);
        data.push(this.$baseLodash.random(20000, 60000));

        if (shift) {
          date.shift();
          data.shift();
        }

        now = new Date(+new Date(now) + oneDay);
      };

      for (let i = 1; i < 6; i++) {
        addData();
      }
      addData(true);
      this.options.xAxis[0].data = date;
      this.options.series[0].data = data;
      this.timer = setInterval(() => {
        addData(true);
        this.options.xAxis[0].data = date;
        this.options.series[0].data = data;
      }, 3000);
    },
  };
</script>
