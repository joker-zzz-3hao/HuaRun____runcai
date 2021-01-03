<!--
 * @Author: your name
 * @Date: 2020-12-28 14:31:04
 * @LastEditTime: 2021-01-03 22:30:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cr-talent-web\src\views\login\transfer.vue
-->
<template>
  <section class="login-layout">
    <div class="loading-box">
      <div>
        <!-- <el-form ref="dataForm" :model="formData" label-width="120px">
            <el-form-item
              label="租户群组名称"
              prop="groupName"
              :rules="[
                { required: true, message: '请填写群组名称', trigger: blur },
              ]"
            >
              <el-input v-model="formData.groupName" maxlength="50"></el-input
            ></el-form-item>
          </el-form> -->
        <span>{{ tipContent }}</span>

        <el-radio-group v-model="tenantId">
          <el-radio
            v-for="tenant in tenantList"
            :key="tenant.tenantId"
            :label="tenant.tenantId"
            >{{ tenant.tenantName }}</el-radio
          >
        </el-radio-group>
        <div class="operating-box">
          <el-button
            :loading="loading"
            type="primary"
            class="tl-btn amt-bg-slip"
            @click="save"
            >确认</el-button
          >
          <el-button
            :disabled="loading"
            plain
            class="tl-btn amt-border-fadeout"
            @click="close"
            >取消</el-button
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import {
  localSave,
} from '@/lib/util';
import Server from './server';

const server = new Server();
export default {
  name: 'transfer',
  components: {
  },
  data() {
    return {
      server,
      adminFlag: false,
      loading: false,
      visible: false,
      tipContent: '',
      tenantList: [],
      tenantId: '',
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.server.getTenantList(localStorage.getItem('tag')).then((res) => {
      if (res.code == 200) {
        // eslint-disable-next-line prefer-destructuring
        this.tenantList = res.data[0];
        this.$forceUpdate();
      }
    });
    this.tipContent = '因组织架构调整，请选择默认组织架构';
  },
  methods: {
    save() {
      // 切换租户
      this.server.selectTenant({
        tenantId: this.tenantId,
        loginName: localStorage.getItem('loginName'),
        loginPwd: localStorage.getItem('loginPwd'),
        tag: localStorage.getItem('tag'),
      }).then((res) => {
        if (res.code == 200) {
          localSave('token', res.data);
          this.$router.push({
            name: 'transfer',
            query: {
              token: res.data,
            },
          });
        }
      });
      // 请求结束后，跳转默认的路由
      // this.visible = false;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>