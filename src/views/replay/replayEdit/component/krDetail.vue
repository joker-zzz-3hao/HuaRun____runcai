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
            <el-form ref="form">
              <div>衡量办法 {{ list.judgeMethod }}</div>
              <div>
                <div>价值与收获</div>
                <el-form-item>
                  <el-input
                    maxlength="2000"
                    v-model="list.advantage"
                    type="textarea"
                    placeholder="事情完成情况说明，这件事的价值与意义，亮点如何？"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <div>问题与不足</div>

                <el-form-item>
                  <el-input
                    v-model="list.disadvantage"
                    type="textarea"
                    maxlength="1000"
                    placeholder="事情做的有那些不足，自己表现有哪些不足？"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <div>改进措施</div>
                <div>
                  <div v-for="(li, d) in list.measure || []" :key="d">
                    <el-input
                      type="textarea"
                      placeholder="事情做的有那些不足，自己表现有哪些不足？"
                      v-model="deficiency[list.detailId]"
                    ></el-input>

                    <el-button type="text" @click="deletedProduce(index, i, d)"
                      >删除</el-button
                    >
                  </div>
                  <template>
                    <div>
                      <el-input
                        type="textarea"
                        placeholder="事情做的有那些不足，自己表现有哪些不足？"
                        v-model="deficiency[list.detailId]"
                      ></el-input>
                    </div>
                    <el-button
                      type="text"
                      @click="addDefic(deficiency[list.detailId], index, i)"
                      >添加</el-button
                    >
                  </template>
                </div>
              </div>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-button type="primary" @click="submit">提交复盘</el-button>
      <el-button type="primary" @click="save">保存</el-button>

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
      reviewType: 1,
      form: {},
      activeNames: [1],
      server,
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      list: [],
      oldList: [],
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
    deletedProduce(index, i, d) {
      this.okrMain.okrReviewPojoList[index].krs[i].measure.splice(d, 1);
    },
    addDefic(value, index, i) {
      if (!value) {
        this.$message.error('请填写改进措施');
        return false;
      }
      if (!this.okrMain.okrReviewPojoList[index].krs[i].measure) {
        this.okrMain.okrReviewPojoList[index].krs[i].measure = [];
      }
      this.okrMain.okrReviewPojoList[index].krs[i].measure.push(value);
      this.deficiency[this.okrMain.okrReviewPojoList[index].krs[i].detailId] = '';
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
          measure: item.measure || [],
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
          this.$emit('getView');
          this.getOldList();
          this.$message.success('保存成功');
        } else {
          this.$$message.error(res.msg);
        }
      });
    },
    handleDeleteOne() {
      this.checkDatakrs(false);
      const CheckNull = this.list.every((item) => !item.advantage && !item.disadvantage && item.measure.length == 0);
      if (CheckNull) {
        this.$router.push('/replayList');
        return false;
      }

      if (JSON.stringify(this.oldList) == JSON.stringify(this.list)) {
        this.$router.push('/replayList');
      } else {
        this.$confirm('关闭后您填写内容将被清除，请确认是否关闭?', {
          confirmButtonText: '确定保存',
          cancelButtonText: '关闭',
        })
          .then(() => {
            this.save();
            this.$router.push('/replayList');
          })
          .catch(() => {
            this.$router.push('/replayList');
          });
      }
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
          this.$router.push('/replayList');
        } else {
          this.$$message.error(res.msg);
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
      const CheckNull = this.list.some((item) => !item.advantage || !item.disadvantage || item.measure.length == 0);
      if (CheckNull) {
        this.$message.error('未完成复盘，尚有未填写内容，请检查');
        return false;
      }
      this.server.okrReviewSubmit(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.$router.push('/replayList');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getOldList() {
      const krsData = this.okrMain.okrReviewPojoList.map((item) => item.krs);
      const krs = [];

      krsData.forEach((item) => {
        // eslint-disable-next-line prefer-spread
        krs.push.apply(krs, item);
      });
      const krsList = krs;

      this.oldList = krsList.map((item) => ({
        detailId: item.detailId,
        okrDetailId: item.okrDetailId,
        communication: item.communication,
        advantage: item.advantage,
        disadvantage: item.disadvantage,
        measure: item.measure || [],
        communicationLabel: item.communicationLabel,
      }));
    },
    getOkrReviewDetail() {
      this.server.getOkrReviewDetail({
        okrMainId: this.$route.query.okrId,
      }).then((res) => {
        this.okrMain = res.data;
        this.checkDatakrs(false);
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
