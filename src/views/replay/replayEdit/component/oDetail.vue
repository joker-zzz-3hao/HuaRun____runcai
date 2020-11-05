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
          </dd>

          <dd>
            <div>
              <span>考核指标</span>
              <em> {{ list.checkQuota }}</em>
            </div>
          </dd>
          <dd>
            <div>
              <span>衡量方法</span>
              <em> {{ list.judgeMethod }}</em>
            </div>
          </dd>
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
        </dl>
        <dl class="is-kr">
          <dd v-show="false"></dd>
          <dd v-show="false"></dd>
          <dd v-show="false"></dd>
          <dd>
            <dl>
              <dt>价值与收获</dt>
              <dd>
                <el-input
                  maxlength="2000"
                  v-model="item.o.advantage"
                  type="textarea"
                  class="tl-textarea"
                  placeholder="事情完成情况说明，这件事的价值与意义，亮点如何？"
                ></el-input>
              </dd>
            </dl>
            <dl>
              <dt>问题与不足</dt>
              <dd>
                <el-input
                  maxlength="2000"
                  v-model="item.o.advantage"
                  type="textarea"
                  class="tl-textarea"
                  placeholder="事情做的有那些不足，自己表现有哪些不足？"
                ></el-input>
              </dd>
            </dl>
            <dl>
              <dt>改进措施</dt>

              <template v-if="item.o.measure.length > 1">
                <dd v-for="(li, d) in item.o.measure || []" :key="d">
                  <el-input
                    type="textarea"
                    placeholder="请针对问题与不足进行改进措施陈述。"
                    v-model="item.o.measure[d]"
                  ></el-input>

                  <!-- <el-button
                    v-if="item.o.measure.length == d + 1"
                    type="text"
                    @click="addDefic(index, i)"
                    >添加</el-button
                  >
                  <el-button v-else type="text" @click="deleteProduce(index, i)"
                    >删除</el-button
                  > -->
                </dd>
              </template>
              <template v-else>
                <dd>
                  <el-input
                    type="textarea"
                    placeholder="请针对问题与不足进行改进措施陈述。"
                    v-model="item.o.measure[0]"
                  ></el-input>
                </dd>
                <!-- <el-button type="text" @click="addDefic(index)">添加</el-button> -->
              </template>
            </dl>
            <dl></dl>
          </dd>
        </dl>
      </elcollapseitem>
    </elcollapse>

    <tl-footer
      :btnText="'提交复盘'"
      @submit="submit"
      @save="save"
      @handleDeleteOne="handleDeleteOne"
    ></tl-footer>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import Server from '../../server';
import replayFoot from '../../component/replayFoot';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  data() {
    return {
      reviewType: 0,
      submitLoad: false,
      saveLoad: false,
      form: {},
      activeNames: [0],
      server,
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      oldList: [],
      list: [],
      listBtn: [
        {
          txt: '超级优秀',
          clsName: 'super-good',
        },
        {
          txt: '优秀',
          clsName: 'good',
        },
        {
          txt: '继续努力',
          clsName: 'work-hard',
        },
        {
          txt: '要加油哦',
          clsName: 'refuel',
        },
      ],
    };
  },
  components: {
    'tl-footer': replayFoot,
    elcollapse,
    elcollapseitem,
    'tl-process': process,
  },
  created() {
    this.getOldList();
  },
  methods: {
    deleteProduce(index, i) {
      this.okrMain.okrReviewPojoList[index].o.measure.splice(i, 1);
    },
    addDefic(index) {
      if (this.okrMain.okrReviewPojoList[index].o.measure.length == 0) {
        this.okrMain.okrReviewPojoList[index].o.measure = [''];
      }
      this.okrMain.okrReviewPojoList[index].o.measure.push('');
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
          measure: item.measure || [],
          communicationLabel: item.communicationLabel,
        }));
      }
    },

    save() {
      this.saveLoad = true;
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewSave(params).then((res) => {
        this.saveLoad = false;
        if (res.code == 200) {
          this.$emit('getView');
          this.getOldList();
          this.$message.success('保存成功');
        }
      });
    },
    getOldList() {
      const oList = JSON.parse(JSON.stringify(this.okrMain.okrReviewPojoList));
      const krsData = oList.map((item) => item.o);
      const krsList = krsData;

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
    handleDeleteOne() {
      this.checkDatakrs(false);
      const CheckNull = this.list.every((item) => !item.advantage && !item.disadvantage && item.measure.length == 0);
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
          this.$router.push('/replayList');
        });
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
        }
      });
    },
    submit() {
      this.submitLoad = true;
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrBelongType: this.okrMain.okrMainVo.okrBelongType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      const CheckNull = this.list.some((item) => !item.advantage || !item.disadvantage || item.measure.length == 0);

      if (CheckNull) {
        this.submitLoad = false;
        this.$message.error('未完成复盘，尚有未填写内容，请检查');
        return false;
      }
      this.server.okrReviewSubmit(params).then((res) => {
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
