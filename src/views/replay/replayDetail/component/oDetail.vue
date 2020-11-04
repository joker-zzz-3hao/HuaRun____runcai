<template>
  <div class="kr-replay">
    <elcollapse class="tl-collapse okr-change-list" v-model="activeNames">
      <elcollapseitem
        ref="o-kr-replay"
        v-for="(item, index) in okrMain.okrReviewPojoList"
        :key="index"
        :name="index"
      >
        <template slot="title">
          <dl class="is-o">
            <dt class="tag-kind">
              <span class="kind-parent">目标</span>
              <em>{{ item.o.okrDetailObjectKr }}</em>
            </dt>
            <dd>
              <div>
                <i class="el-icon-medal"></i>
                <span>权重</span>
                <em>{{ item.o.okrWeight }}%</em>
              </div>
              <div>
                <i class="el-icon-odometer"></i>
                <span>进度</span>
                <tl-process
                  :data="parseInt(item.o.okrDetailProgress, 10)"
                ></tl-process>
              </div>
              <!-- <div>
                <i class="el-icon-attract"></i>
                <span>关联父目标</span>
                <em
                  v-if="
                    oData.undertakeOkrDto &&
                    oData.undertakeOkrDto.undertakeOkrContent
                  "
                  ><em>{{ oData.undertakeOkrDto.undertakeOkrContent }}</em
                  ><em>{{ oData.cultureName }}</em></em
                >
                <em
                  v-else-if="
                    oData.undertakeOkrVo &&
                    oData.undertakeOkrVo.undertakeOkrContent
                  "
                  ><em>{{ oData.undertakeOkrVo.undertakeOkrContent }}</em
                  ><em>{{ oData.cultureName }}</em></em
                >
                <em v-else-if="oData.cultureName">{{ oData.cultureName }}</em>
                <em v-else>暂无</em>
              </div> -->
            </dd>
          </dl>
        </template>
        <dl class="is-kr" v-for="(list, i) in item.krs" :key="i">
          <dt class="tag-kind">
            <span class="kind-child">KR</span>
            <em>{{ list.okrDetailObjectKr }}</em>
          </dt>
          <dd>
            <div>
              <i class="el-icon-medal"></i>
              <span>权重</span>
              <em>{{ list.okrWeight }}%</em>
            </div>
            <div>
              <i class="el-icon-odometer"></i>
              <span>进度</span>
              <tl-process
                :data="parseInt(list.okrDetailProgress, 10)"
              ></tl-process>
            </div>
            <!-- <div>
              <i class="el-icon-bell"></i>
              <span>信心指数</span>
              <div class="state-grid">
                <div
                  :class="{
                    'is-no-risk': krData.okrDetailConfidence == 1,
                    'is-risks': krData.okrDetailConfidence == 2,
                    'is-uncontrollable': krData.okrDetailConfidence == 3,
                  }"
                ></div>
                <div
                  :class="{
                    'is-risks': krData.okrDetailConfidence == 2,
                    'is-uncontrollable': krData.okrDetailConfidence == 3,
                  }"
                ></div>
                <div
                  :class="{
                    'is-uncontrollable': krData.okrDetailConfidence == 3,
                  }"
                ></div>
              </div>
              <div class="state-txt">
                {{ CONST.CONFIDENCE_MAP[krData.okrDetailConfidence] }}
              </div>
            </div> -->
          </dd>
        </dl>
        <dd>
          <dl>
            <dt>价值与收获</dt>
            <dd>{{ item.o.advantage }}</dd>
          </dl>
          <dl>
            <dt>问题与不足</dt>
            <dd>{{ item.o.disadvantage }}</dd>
          </dl>
          <dl>
            <dt>改进措施</dt>
            <!-- <dd>{{ list.disadvantage }}</dd> -->
          </dl>
          <dl v-if="okrMain.okrMainVo.reviewStatus == 3">
            <dt>复盘沟通</dt>
            <dd>
              {{ item.o.communication }}
            </dd>
          </dl>
          <dl v-if="okrMain.okrMainVo.reviewStatus == 3">
            <dt>描述</dt>
            <dd>
              <el-button :type="'primary'">{{
                item.o.communication
              }}</el-button>
            </dd>
          </dl>
        </dd>
      </elcollapseitem>
    </elcollapse>
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
      const CheckNull = this.list.some((item) => item.advantage == '' || item.disadvantage == '' || item.measure.length == 0);
      if (CheckNull) {
        this.$message.error('未复盘完毕，请检查');
        return false;
      }
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