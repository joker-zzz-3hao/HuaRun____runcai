<template>
  <div>
    <div v-for="(item, index) in okrMain.okrReviewPojoList" :key="index">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <div style="width: 100%">
              <em>目标{{ index + 1 }}</em
              ><em>{{ item.o.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 {{ item.okrWeight ? item.okrWeight : 0 }}%</em>
                <em>进度 {{ item.okrDetailProgress ? item.okrWeight : 0 }}%</em>
              </div>
            </div>
          </template>
          <div v-for="(list, i) in item.krs" :key="i + 'k'">
            <div style="width: 100%">
              <em>KR{{ i + 1 }}</em
              ><em>{{ list.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 {{ list.okrWeight }}%</em>
                <em>进度 {{ list.okrDetailProgress }}%</em>
              </div>
            </div>

            <div>
              考核指标
              {{ list.checkQuota }}
            </div>
            <div>衡量办法 {{ list.judgeMethod }}</div>
          </div>
          <div>
            <div>
              <div>价值与收获</div>
              <div>{{ item.o.advantage }}</div>
            </div>
            <div>
              <div>问题与不足</div>

              <div>{{ item.o.disadvantage }}</div>
            </div>
            <div>
              <div>改进措施</div>
              <div>
                <div v-for="(li, i) in item.o.measure || []" :key="i">
                  <em> {{ i + 1 }}. {{ li }} </em>
                </div>
              </div>
            </div>
          </div>
          <div v-if="okrMain.okrMainVo.reviewStatus == 3">
            <div>复盘沟通</div>

            <div>{{ item.o.communication }}</div>

            <div>
              <em>请选择：</em>
              <el-button :type="'primary'">{{
                item.o.communicationLabel
              }}</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  data() {
    return {
      reviewType: 0,
      form: {},
      activeNames: ['1'],
      server,
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      list: [],
      listBtn: [
        '超级优秀',
        '优秀',
        '继续努力',
        '要加油哦',
      ],
    };
  },

  methods: {
    deleteProduce(index, i) {
      this.okrMain.okrReviewPojoList[index].o.measure.splice(i, 1);
    },
    addDefic(value, index) {
      if (!this.okrMain.okrReviewPojoList[index].o.measure) {
        this.okrMain.okrReviewPojoList[index].o.measure = [];
      }
      this.okrMain.okrReviewPojoList[index].o.measure.push(value);
    },
    checkDatakrs(clear) {
      const krsList = this.okrMain.okrReviewPojoList.map((item) => item.o);
      if (clear) {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: '',
          communicationLabel: '',
          advantage: '',
          disadvantage: '',
          measure: [],
        }));
      } else {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: item.communication,
          advantage: item.advantage,
          disadvantage: item.disadvantage,
          measure: item.measure,
          communicationLabel: item.communicationLabel,
        }));
      }
    },

    save() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewSave(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        }
      });
    },
    handleDeleteOne() {
      this.$xconfirm({ title: '该数据删除将无法恢复，确认要删除吗？', content: '' })
        .then(() => {
          this.clearClose();
        })
        .catch(() => {});
    },
    clearClose() {
      this.checkDatakrs(true);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewSave(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        }
      });
    },
    submit() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewSubmit(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.$router.push('/replayList');
        }
      });
    },
    handleChange(val) {
      console.log(val);
    },
    getOkrReviewDetail() {
      this.server.getOkrReviewDetail({
        okrMainId: this.$route.query.okrId,
      }).then((res) => {
        this.okrMain = res.data;
        this.checkDatakrs();
      });
    },
  },
};
</script>
<style  scoped>
.replay-user {
  display: flex;
  flex-direction: row;
}
.replay-user .list {
  margin-right: 40px;
}
.right {
  float: right;
}
</style>