<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="580px"
    @close="close"
  >
    <div style="padding: 0 40px">
      <el-divider>
        <vab-remix-icon icon-class="community-line"></vab-remix-icon>
        商户信息
      </el-divider>
      <!-- <div class="text item">
        <span class="item-title">商户ID：</span>
        {{ merchant.id }}
      </div> -->
      <div class="text item">
        <span class="item-title">商户名称：</span>
        {{ merchant.name }}
      </div>
      <div class="text item">
        <span class="item-title">商户描述：</span>
        <span v-if="merchant.remark">{{ merchant.remark }}</span>
        <el-tag v-else type="danger">无</el-tag>
      </div>
      <div class="text item">
        <span class="item-title">商户类型：</span>
        <el-tag :type="merchant.type === 10 ? 'primary' : 'success'">
          {{ merchant.type === 10 ? "商城" : "餐饮" }}
        </el-tag>
      </div>
      <div class="text item">
        <span class="item-title">过期时间：</span>
        <span v-if="merchant.expire_time">
          {{ formatTime(merchant.expire_time, "YYYY-MM-DD") }}
        </span>
        <el-tag v-else>无限制</el-tag>
      </div>
      <div class="text item">
        <span class="item-title">联系人：</span>
        {{ merchant.liaison }}
      </div>
      <div class="text item">
        <span class="item-title">联系电话：</span>
        {{ merchant.phone }}
      </div>
      <div class="text item">
        <span class="item-title">联系地址：</span>
        {{ merchant.address }}
      </div>
      <div class="text item">
        <span class="item-title">独立公众号</span>
        <el-tag v-if="merchant.allow_private_wechat === 1" type="success">
          是
        </el-tag>
        <el-tag v-else type="danger">否</el-tag>
      </div>
      <div class="text item">
        <span class="item-title">是否启用：</span>
        <el-tag v-if="merchant.is_active === 1" type="success">是</el-tag>
        <el-tag v-else type="danger">否</el-tag>
      </div>

      <!-- <el-divider>
        <vab-remix-icon icon-class="store-2-line"></vab-remix-icon>
        商户信息
      </el-divider>
      <div class="text item">
        <span class="item-title">名称：</span>
        {{ merchant.store_name }}
      </div>
      <div class="text item">
        <span class="item-title">描述：</span>
        {{ merchant.store_desc }}
      </div>
      <div class="text item">
        <span class="item-title">经纬度：</span>
        ({{ merchant.longitude }}, {{ merchant.latitude }})
      </div> -->
      <div style="height: 18px"></div>
      <el-divider>
        <vab-remix-icon icon-class="user-3-line"></vab-remix-icon>
        管理员信息
      </el-divider>
      <div class="text item">
        <span class="item-title">管理员姓名</span>
        {{ admin.nickname }}
      </div>
      <div class="text item">
        <span class="item-title">手机号：</span>
        {{ admin.phone }}
      </div>
      <div class="text item">
        <span class="item-title">电子邮箱：</span>
        {{ admin.email }}
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getDetail } from "@/api/merchant";
  import dayjs from "dayjs";

  export default {
    name: "MerchantManagementDetail",
    data() {
      return {
        merchant: {},
        admin: {},
        title: "",
        dialogFormVisible: false,
        businessLicensePhotoList: [],
        legalPersonIdCardPhotoList: [],
      };
    },
    methods: {
      formatTime(cellValue, format = "YYYY-MM-DD HH:mm:ss") {
        return dayjs(cellValue).format(format);
      },
      async showDetail(row) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        const { data } = await getDetail(row.id);
        loading.close();
        this.merchant = data.merchant;
        this.admin = data.admin;
        this.businessLicensePhotoList = [this.merchant.business_license_photo];
        this.legalPersonIdCardPhotoList = [
          this.merchant.legal_person_id_card_photo,
        ];
        console.log(data);
        this.title = row.name;
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .el-card {
    border: none;
  }
  .text {
    line-height: 42px;
  }
  .item-title {
    display: inline-block;
    width: 86px;
    margin-right: 16px;
  }
  .demo-image__preview {
    display: inline-block;
    vertical-align: top;
  }
</style>
