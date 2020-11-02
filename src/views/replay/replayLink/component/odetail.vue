<template>
  <div>
    <div v-for="(item, index) in okrMain.okrReviewPojoList" :key="index">
      <el-collapse v-model="activeNames">
        <el-collapse-item :name="index + 1">
          <template slot="title">
            <div class="title-row">
              <div>
                <em>目标{{ index + 1 }}</em
                ><em
                  >{{ item.o.okrDetailObjectKr
                  }}{{ item.o.startTime + "-" + item.o.endTime }}</em
                >
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
          <div v-for="(list, i) in item.krs" :key="i">
            <div style="width: 100%">
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
            <div>衡量办法 {{ list.judgeMethod }}</div>
            <div>
              <div>价值与收获</div>
              <div>
                {{ list.advantage }}
              </div>
              <div>
                <div>问题与不足</div>
                <div>
                  {{ list.disadvantage }}
                </div>
              </div>
              <div>
                <div>改进措施</div>
                <div>
                  <div v-for="(li, d) in list.measure" :key="d">
                    <em>
                      {{ li }}
                    </em>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>复盘沟通</div>
            <el-input
              type="textarea"
              placeholder="不超过1000字符"
              v-model="item.o.communication"
            ></el-input>
            <div>
              <em>请选择：</em>
              <el-button
                :type="btnText == item.o.communicationLabel ? 'primary' : ''"
                @click="selectCommunicationLabel(btnText, index, i)"
                v-for="(btnText, key) in listBtn"
                :key="key"
                >{{ btnText }}</el-button
              >
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-button type="primary" @click="submit" :loading="submitLoad"
        >确认沟通</el-button
      >
      <el-button type="primary" @click="save" :loading="saveLoad"
        >保存</el-button
      >

      <el-button type="primary" @click="handleDeleteOne">关闭</el-button>
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
      form: {},
      activeNames: [1],
      server,
      submitLoad: false,
      saveLoad: false,
      oldList: [],
      active: {},
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
  created() {
    this.getOldList();
  },

  methods: {
    getOldList() {
      const krsData = this.okrMain.okrReviewPojoList.map((item) => item.o);
      const krsList = krsData;

      this.oldList = krsList.map((item) => ({
        detailId: item.detailId,
        okrDetailId: item.okrDetailId,
        communication: item.communication,
        communicationLabel: item.communicationLabel,
        advantage: item.advantage,
        disadvantage: item.disadvantage,
        measure: item.measure || [],
      }));
    },
    checkDatakrs(clear) {
      const krsData = this.okrMain.okrReviewPojoList.map((item) => item.o);

      const krsList = krsData;

      if (clear) {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: '',
          communicationLabel: '',
        }));
      } else {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: item.communication,
          communicationLabel: item.communicationLabel,
          advantage: item.advantage,
          disadvantage: item.disadvantage,
          measure: item.measure || [],
        }));
      }
    },
    inputCommunication(value, index) {
      this.okrMain.okrReviewPojoList[index].o.communication = value;
    },
    selectCommunicationLabel(value, index) {
      const mainData = this.okrMain.okrReviewPojoList[index].o;
      mainData.communicationLabel = value;
    },
    save() {
      this.saveLoad = true;
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: this.okrMain.okrMainVo.reviewType,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
        this.saveLoad = false;
        if (res.code == 200) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleDeleteOne() {
      this.checkDatakrs(false);
      const CheckNull = this.list.every((item) => !item.communication && !item.communicationLabel);
      if (CheckNull) {
        this.$router.push('/replayList');
        return false;
      }
      if (JSON.stringify(this.oldList) == JSON.stringify(this.list)) {
        this.$router.push('/replayList');
        return false;
      }
      this.$confirm('关闭后您填写内容将被清除，请确认是否关闭?', {
        confirmButtonText: '确定保存',
        cancelButtonText: '关闭',
      })
        .then(() => {
          this.save();
          this.$router.push('/replayList');
        })
        .catch(() => {
          this.clearClose();
          this.$router.push('/replayList');
        });
    },
    clearClose() {
      this.checkDatakrs(true);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: this.okrMain.okrMainVo.reviewType,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
        if (res.code == 200) {
          this.$router.push('/replayList');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    submit() {
      this.submitLoad = true;
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: this.okrMain.okrMainVo.reviewType,
        },
        list: this.list,
      };
      const CheckNull = this.list.some((item) => !item.communication || !item.communicationLabel);
      if (CheckNull) {
        this.submitLoad = false;
        this.$message.error('未完成复盘沟通完毕，尚有未填写内容，请检查');
        return false;
      }
      this.server.okrReviewCommunicationSubmit(params).then((res) => {
        this.submitLoad = false;
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.$router.push('/replayList');
        } else {
          this.$message.error(res.msg);
        }
      });
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