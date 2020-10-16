<template>
  <div>
    <div v-for="(item, index) in okrMain.okrReviewPojoList" :key="index">
      <el-collapse v-model="activeNames">
        <el-collapse-item :name="index + 1">
          <template slot="title">
            <div class="title-row">
              <div>
                <em>目标{{ index + 1 }}</em
                ><em>{{ item.o.okrDetailObjectKr }}</em>
              </div>
              <div style="width: 200px">
                <div style="width: 100px; float: left">
                  <span>权重</span>

                  <el-progress
                    :width="50"
                    :percentage="parseInt(item.o.okrWeight) || 0"
                    :show-text="true"
                  ></el-progress>
                </div>
                <div style="width: 100px; float: left">
                  <span>进度</span>
                  <el-progress
                    :width="50"
                    :percentage="parseInt(item.o.okrDetailProgress) || 0"
                    :show-text="true"
                  ></el-progress>
                </div>
              </div>
            </div>
          </template>
          <div v-for="(list, i) in item.krs" :key="i + 'k'">
            <div>
              <em>KR{{ i + 1 }} </em><em>{{ list.okrDetailObjectKr }}</em>
              <div class="right" style="width: 200px">
                <em style="float: left; width: 100px"
                  >权重
                  <el-progress
                    :width="50"
                    :percentage="parseInt(list.okrWeight) || 0"
                    :show-text="true"
                  ></el-progress>
                </em>
                <em style="float: left; width: 100px"
                  >进度
                  <el-progress
                    :width="50"
                    :percentage="parseInt(list.okrDetailProgress) || 0"
                    :show-text="true"
                  ></el-progress>
                </em>
              </div>
            </div>

            <div>
              考核指标
              {{ list.checkQuota }}
            </div>
            <div>
              <div>衡量办法 {{ list.judgeMethod }}</div>
              <div>
                <div>价值与收获</div>

                <div>{{ list.advantage }}</div>
              </div>
              <div>
                <div>问题与不足</div>

                <div>{{ list.disadvantage }}</div>
              </div>
              <div>
                <div>改进措施</div>
                <div>
                  <div v-for="(li, i) in list.measure || []" :key="i">
                    <em> {{ i + 1 }}.{{ li }} </em>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="okrMain.okrMainVo.reviewStatus == 3">
              <div>复盘沟通</div>

              <div>{{ list.communication }}</div>

              <div>
                <!-- <em>请选择：</em> -->
                <el-button :type="'primary'">{{
                  list.communicationLabel
                }}</el-button>
              </div>
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
      reviewType: 1,
      form: {},
      activeNames: [1],
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
      this.okrMain.okrReviewPojoList[index].krs[i].measure.splice(i, 1);
    },
    addDefic(value, index, i) {
      if (!this.okrMain.okrReviewPojoList[index].krs[i].measure) {
        this.okrMain.okrReviewPojoList[index].krs[i].measure = [];
      }
      this.okrMain.okrReviewPojoList[index].krs[i].measure.push(value);
      console.log(this.okrMain.okrReviewPojoList[index].krs[i].measure);
    },
    checkDatakrs(clear) {
      const krsData = this.okrMain.okrReviewPojoList.map((item) => item.krs);
      const krs = [];

      krsData.forEach((item) => {
        // eslint-disable-next-line prefer-spread
        krs.push.apply(krs, item);
      });
      const krsList = krs;
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
      this.$xconfirm({ title: '关闭后您填写内容将被清除，请确认是否关闭?', content: '' })
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
          this.$route.push('/replayList');
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

.rightweight {
  width: 200px;
  display: flex;
  flex-direction: row;
}

.title-row {
  display: flex;
  width: 100%;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
}

.flex {
  display: flex;
  width: 50%;
  flex-direction: row;
}
</style>