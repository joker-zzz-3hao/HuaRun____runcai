<template>
  <div>
    <div>复盘对象：{{ okrMain.okrMainVo.periodName }}</div>
    <div class="replay-user">
      <div class="list">姓名：{{ okrMain.okrMainVo.userName }}</div>
      <div class="list">OKR进度： {{ okrMain.okrMainVo.okrProgress }}%</div>
      <div class="list">
        复盘时间： {{ okrMain.okrMainVo.reviewCommitTime }}
      </div>
    </div>
    <div>
      <el-radio-group v-model="form.resource">
        <el-radio label="kr">以关键结果KR复盘</el-radio>
        <el-radio label="o">以目标O复盘</el-radio>
      </el-radio-group>
    </div>
    <div v-for="(item, index) in okrMain.okrReviewPojoList" :key="index">
      <el-collapse accordion v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1">
          <template slot="title">
            <div style="width: 100%">
              <em>目标1</em><em>{{ item.o.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 {{ item.okrWeight }}%</em>
                <em>进度 {{ item.okrDetailProgress }}%</em>
              </div>
            </div>
          </template>
          <div v-for="(list, i) in item.krs" :key="i + 'k'">
            <div style="width: 100%">
              <em>KR1 </em><em>{{ list.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 30%</em>
                <em>进度 100%</em>
              </div>
            </div>

            <div>
              考核指标
              {{ list.checkQuota }}
            </div>
            <el-form ref="form" :model="form" :rules="rules">
              <div>衡量办法 {{ list.judgeMethod }}</div>
              <div>
                <div>价值与收获</div>
                <el-form-item>
                  <el-input
                    maxlength="2000"
                    v-model="advantage"
                    type="textarea"
                    placeholder="事情完成情况说明，这件事的价值与意义，亮点如何？"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <div>问题与不足</div>

                <el-form-item>
                  <el-input
                    v-model="disadvantage"
                    type="textarea"
                    maxlength="1000"
                    placeholder="事情做的有那些不足，自己表现有哪些不足？"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <div>改进措施</div>
                <div>
                  <div v-for="(item, index) in produceList" :key="index">
                    <em>
                      {{ item.desc }}
                    </em>
                    <el-button type="text" @click="deleteProduce(index)"
                      >删除</el-button
                    >
                  </div>

                  <el-form-item>
                    <el-input
                      type="textarea"
                      placeholder="事情做的有那些不足，自己表现有哪些不足？"
                      v-model="deficiency"
                    ></el-input>
                  </el-form-item>
                  <el-button type="text" @click="addproduceList"
                    >添加</el-button
                  >
                </div>
              </div>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="submit">提交复盘</el-button>
      <el-button type="primary" @click="handleDeleteOne">关闭</el-button>
    </div>
  </div>
</template>

<script>
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  data() {
    return {
      form: {},
      activeNames: ['1'],
      server,
      okrMain: {
        okrMainVo: {},
      },
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
    this.getOkrReviewDetail();
  },

  methods: {
    checkDatakrs(clear) {
      const krsData = this.okrMain.okrReviewPojoList.map((item) => item.krs);
      const krs = [];
      let krsList;
      krsData.forEach((item) => {
        krsList = krs.concat(item);
      });
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
        }));
      }
    },
    inputCommunication(value, index, i) {
      this.okrMain.okrReviewPojoList[index].krs[i].communication = value;
    },
    selectCommunicationLabel(value, index, i) {
      const mainData = this.okrMain.okrReviewPojoList[index].krs[i];
      mainData.communicationLabel = value;
    },
    save() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
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
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        }
      });
    },
    submit() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSubmit(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
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