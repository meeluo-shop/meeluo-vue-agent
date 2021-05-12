<template>
  <div class="index-container">
    <el-row :gutter="20">
      <page-header></page-header>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <chart1></chart1>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <chart2></chart2>
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <version-information></version-information>
      </el-col>
      <icon-list></icon-list>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <chart3></chart3>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <my-project></my-project>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PageHeader from "./components/PageHeader";
  import Chart1 from "./components/Chart1";
  import Chart2 from "./components/Chart2";
  import Chart3 from "./components/Chart3";
  import MyProject from "./components/MyProject";
  import VersionInformation from "./components/VersionInformation";
  import IconList from "./components/IconList";

  export default {
    name: "Index",
    components: {
      PageHeader,
      Chart1,
      Chart2,
      Chart3,
      VersionInformation,
      IconList,
      MyProject,
    },
    data() {
      return {};
    },
    created() {},
  };
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .chart1,
      .chart2,
      .version-information {
        min-height: 268px;
      }

      .el-card {
        .el-card__header {
          position: relative;

          .card-header-tag {
            position: absolute;
            top: 15px;
            right: $base-padding;
          }

          > div > span {
            display: flex;
            align-items: center;

            i {
              margin-right: 3px;
            }
          }
        }

        .el-card__body {
          .echarts {
            width: 100%;
            height: 127px;
          }
        }
      }

      .bottom {
        padding-top: 20px;
        margin-top: 5px;
        color: #595959;
        text-align: left;
        border-top: 1px solid $base-border-color;
      }
    }
  }
</style>
