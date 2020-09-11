<template>
  <div>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="myokrDrawer"
      :wrapperClosable="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      class="tl-drawer"
      @closed="closed"
      :before-close="close"
    >
      <el-form :model="formData" ref="dataForm">
        <dl class="okuang">
          <dt>目标O</dt>
          <dd class="objectdd">
            <el-form-item>
              <span>{{formData.okrDetailObjectKr}}</span>
            </el-form-item>
            <!-- <el-form-item label="权重">
            <span>{{formData.okrWeight}}%</span>
            </el-form-item>-->
            <el-form-item label="当前进度">
              <el-slider v-model="formData.okrDetailProgress" show-input :step="1"></el-slider>
            </el-form-item>
          </dd>
          <dd>
            <dl v-for="(kitem, kindex) in formData.krList" :key="kindex">
              <dt>关键结果{{kindex+1}}</dt>
              <dd class="objectdd">
                <el-form-item>
                  <span>{{kitem.okrDetailObjectKr}}</span>
                </el-form-item>
                <!-- <el-form-item label="权重">
                <span>{{kitem.okrWeight}}%</span>
                </el-form-item>-->
                <el-form-item label="当前进度">
                  <el-slider v-model="kitem.okrDetailProgress" show-input :step="1"></el-slider>
                </el-form-item>
                <el-form-item label="风险状态">
                  <tl-confidence v-model="kitem.okrDetailConfidence"></tl-confidence>
                </el-form-item>
              </dd>
            </dl>
          </dd>
        </dl>
        <dl>
          <dd>
            <el-form-item label="更新说明">
              <el-input maxlength="200" v-model="formData.updateexplain"></el-input>
            </el-form-item>
          </dd>
        </dl>
      </el-form>
      <el-button @click="summitUpdate">确定</el-button>
      <el-button @click="close">取消</el-button>
    </el-drawer>
  </div>
</template>

<script>
import confidenceSelect from '@/components/confidenceSelect';
import { mapMutations } from 'vuex';

export default {
  name: 'okrUpdate',
  components: {
    'tl-confidence': confidenceSelect,
  },
  data() {
    return {
      dialogTitle: '更新OKR', // 弹框标题
      dialogDetailVisible: false,
      formData: {
        updateexplain: '',
      },
      myokrDrawer: false,
      drawerTitle: '更新进度',
    };
  },
  props: {
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
    },
    dialogExist: {
      type: Boolean,
      default: true,
    },
    okrItem: {
      type: Object,
      required: true,
    },
    periodId: {
      type: String,
      default: '',
    },
  },
  created() {
  },

  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    // 控制弹窗
    showOkrDialog() {
      this.getokrDetail();
      this.myokrDrawer = true;
    },

    closed() {
      this.$emit('update:exist', false);
    },
    close() {
      this.myokrDrawer = false;
    },
    getokrDetail() {
      if (this.okrItem) {
        this.formData = JSON.parse(JSON.stringify(this.okrItem));
        console.log('periodId', this.periodId);
      }
    },
    summitUpdate() {
      this.summitForm = {
        oupdateProcessDto: {
          detailId: this.formData.detailId,
          okrDetailProgress: this.formData.okrDetailProgress,
        },
        remark: this.formData.updateexplain,
        periodId: this.periodId,
      };
      if (this.formData.krList && this.formData.krList.length > 0) {
        this.summitForm.krUpdateProcessDtos = [];
        this.formData.krList.forEach((item) => {
          this.summitForm.krUpdateProcessDtos.push({
            detailId: item.detailId,
            okrDetailConfidence: item.okrDetailConfidence,
            okrDetailProgress: item.okrDetailProgress,
          });
        });
      }

      this.server.summitUpdate(this.summitForm).then((res) => {
        console.log('detail', res.code);
        if (res.code == 200) {
          this.$message('更新成功');
          this.$emit('success');
          this.close();
        }
      });
    },

  },
  watch: {
  },
};
</script>