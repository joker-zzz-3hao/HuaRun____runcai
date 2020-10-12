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
        <el-radio label="以关键结果KR复盘"></el-radio>
        <el-radio label="以目标O复盘"></el-radio>
      </el-radio-group>
    </div>
    <div v-for="(item, index) in okrMain.okrReviewPojoList" :key="index">
      <el-collapse accordion v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1">
          <template slot="title">
            <div style="width: 100%">
              <em>目标1</em><em>{{ item.o.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 {{ item.o.okrWeight }}%</em>
                <em>进度 {{ item.o.okrDetailProgress }}%</em>
              </div>
            </div>
          </template>
          <div v-for="(list, i) in item.krs" :key="i">
            <div style="width: 100%">
              <em>KR1 </em><em>{{ list.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 {{ list.okrWeight }}%</em>
                <em>进度 {{ item.okrDetailProgress }}%</em>
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
              <div>
                <div>复盘沟通</div>
                <el-input
                  type="textarea"
                  placeholder="不超过1000字符"
                  v-model="list.communication"
                  @input="inputCommunication($event, index, i)"
                ></el-input>
                <div>
                  <em>请选择：</em>
                  <el-button
                    :type="btnText == list.communicationLabel ? 'primary' : ''"
                    @click="selectCommunicationLabel(btnText, index, i)"
                    v-for="(btnText, key) in listBtn"
                    :key="key"
                    >{{ btnText }}</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="submit">确认沟通</el-button>
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