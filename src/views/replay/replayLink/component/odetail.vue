<template>
  <div>
    <div v-for="(item, index) in okrMain.okrReviewPojoList" :key="index">
      <el-collapse v-model="activeNames">
        <el-collapse-item :name="index + 1">
          <template slot="title">
            <div style="width: 100%">
              <em>目标{{ index + 1 }}</em
              ><em>{{ item.o.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 {{ item.o.okrWeight ? item.o.okrWeight : 0 }}% </em>
                <em
                  >进度
                  {{
                    item.o.okrDetailProgress ? item.o.okrDetailProgress : 0
                  }}%</em
                >
              </div>
            </div>
          </template>
          <div v-for="(list, i) in item.krs" :key="i">
            <div style="width: 100%">
              <em>KR{{ i + 1 }} </em><em>{{ list.okrDetailObjectKr }}</em>
              <div class="right">
                <em>权重 {{ list.okrWeight ? list.okrWeight : 0 }}%</em>
                <em
                  >进度
                  {{ item.okrDetailProgress ? item.okrDetailProgress : 0 }}%</em
                >
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
              @input="inputCommunication($event, index, i)"
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
      activeNames: [1],
      server,
      okrMain: {
        okrMainVo: {
          reviewType: 0,
        },
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
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: this.okrMain.okrMainVo.reviewType,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        } else {
          this.$$message.error(res.msg);
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
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: this.okrMain.okrMainVo.reviewType,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSave(params).then((res) => {
        if (res.code == 200) {
          this.$route.push('/replayList');
        } else {
          this.$$message.error(res.msg);
        }
      });
    },
    submit() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
          reviewType: this.okrMain.okrMainVo.reviewType,
        },
        list: this.list,
      };
      this.server.okrReviewCommunicationSubmit(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.$route.push('/replayList');
        } else {
          this.$$message.error(res.msg);
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
</style>