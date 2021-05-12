<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="580px"
    @close="close"
  >
    <el-divider>
      <vab-remix-icon icon-class="community-line"></vab-remix-icon>
      商户信息
    </el-divider>
    <el-form ref="form" :model="form" :rules="rules" label-width="108px">
      <el-form-item label="商户名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="liaison">
        <el-input v-model.trim="form.liaison" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model.trim="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model.trim="form.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="到期时间" prop="expire_time">
        <el-date-picker
          v-model="expire_time"
          type="date"
          placeholder="选择到期时间"
        ></el-date-picker>
        <span style="font-size: 13px; color: #8c9098; padding-left: 4px">
          注:不设置时间为永不过期
        </span>
      </el-form-item>
      <el-form-item required label="商户类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="10">商城</el-radio>
          <el-radio :label="20">餐饮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否启用" prop="is_active">
        <el-switch
          v-model="isActive"
          active-text=""
          inactive-text=""
          @change="handlerChange"
        ></el-switch>
      </el-form-item>
      <el-form-item label="独立公众号" prop="is_active">
        <el-switch
          v-model="allowPrivateWechat"
          active-text=""
          inactive-text=""
          @change="handlerPrivateWechatChange"
        ></el-switch>
        <span style="font-size: 13px; color: #8c9098; padding-left: 4px">
          注: 开启后商户可以单独配置微信公众号和微信支付
        </span>
      </el-form-item>
      <el-form-item label="商户备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          autocomplete="off"
          rows="3"
        ></el-input>
      </el-form-item>

      <el-divider>
        <vab-remix-icon icon-class="user-3-line"></vab-remix-icon>
        管理员信息
      </el-divider>
      <el-form-item label="管理员姓名" prop="admin_nickname">
        <el-input
          v-model.trim="form.admin_nickname"
          autocomplete="off"
          @input="inputChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱账号" prop="admin_email">
        <el-input
          v-model="form.admin_email"
          autocomplete="off"
          @input="inputChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="admin_phone">
        <el-input
          v-model.trim="form.admin_phone"
          autocomplete="off"
          @input="inputChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="admin_password">
        <el-input
          v-model.trim="form.admin_password"
          type="password"
          autocomplete="off"
          @input="inputChange"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doCreate, doEdit, getDetail } from "@/api/merchant";

  export default {
    name: "MerchantManagementEdit",
    data() {
      return {
        expire_time: null,
        isActive: true,
        allowPrivateWechat: true,
        roles: [],
        form: {
          name: "",
          remark: "",
          company_name: "",
          legal_person_name: "",
          liaison: "",
          phone: "",
          type: 10,
          address: "",
          wechat_open_id: "",
          is_active: 1, // 默认启用
          admin_email: "",
          admin_phone: "",
          admin_password: "",
          admin_nickname: "",
          allow_private_wechat: 1,
        },
        rules: {
          name: [{ required: true, trigger: "blur", message: "请输入名称" }],
          liaison: [
            { required: true, trigger: "blur", message: "请输入联系人" },
          ],
          phone: [
            { required: true, trigger: "blur", message: "请输入联系电话" },
          ],
          address: [
            { required: true, trigger: "blur", message: "请输入联系地址" },
          ],
          admin_email: [
            { required: true, trigger: "blur", message: "请输入管理员邮箱" },
          ],
          admin_phone: [
            { required: true, trigger: "blur", message: "请输入管理员手机号" },
          ],
          admin_password: [
            { required: true, trigger: "blur", message: "请输入管理密码" },
          ],
          type: [
            { required: true, trigger: "blur", message: "请选择商户类型" },
          ],
        },
        title: "",
        dialogFormVisible: false,
        type: 1,
      };
    },
    methods: {
      inputChange() {
        this.$forceUpdate();
      },
      async showEdit(row) {
        if (!row) {
          this.title = "添加";
          this.type = 1;
          this.isActive = true;
        } else {
          this.title = "编辑";
          this.type = 2;
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          const { data } = await getDetail(row.id);
          loading.close();
          const admin = Object.assign({}, data.admin);
          this.form = Object.assign({}, data.merchant);
          this.form.admin_email = admin.email || "";
          this.form.admin_phone = admin.phone || "";
          this.form.admin_password = admin.password || "";
          this.form.admin_nickname = admin.nickname || "";
          this.expire_time = new Date(data.merchant.expire_time);
          this.isActive = !!this.form.is_active;
          this.allowPrivateWechat = !!this.form.allow_private_wechat;
        }
        this.dialogFormVisible = true;
      },
      close() {
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.dialogFormVisible = false;
      },
      handlerChange(val) {
        if (val) this.form.is_active = 1;
        else this.form.is_active = 0;
      },
      handlerPrivateWechatChange(val) {
        if (val) this.form.allow_private_wechat = 1;
        else this.form.allow_private_wechat = 0;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            let data = {
              name: this.form.name,
              remark: this.form.remark,
              company_name: this.form.company_name,
              legal_person_name: this.form.legal_person_name,
              liaison: this.form.liaison,
              phone: this.form.phone,
              address: this.form.address,
              type: this.form.type,
              wechat_open_id: this.form.wechat_open_id,
              is_active: this.form.is_active,
              allow_private_wechat: this.form.allow_private_wechat,
              expire_time: this.expire_time ? this.expire_time.getTime() : null,
              admin_user: {
                email: this.form.admin_email,
                phone: this.form.admin_phone,
                password: this.form.admin_password,
                nickname: this.form.admin_nickname,
              },
            };
            if (this.type === 1) {
              const { msg } = await doCreate(data);
              this.$baseMessage(msg, "success");
            } else if (this.type === 2) {
              const { msg } = await doEdit(this.form.id, data);
              this.$baseMessage(msg, "success");
            }
            this.$emit("fetchData");
            this.close();
          } else {
            return false;
          }
        });
      },
    },
  };
</script>
