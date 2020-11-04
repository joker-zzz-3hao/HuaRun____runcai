<template>
  <div class="o-replay">
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

        <dl class="is-kr">
          <dd>
            <div>
              <span>考核指标</span>
              <em> {{ item.o.checkQuota }}</em>
            </div>
          </dd>
          <dd>
            <div>
              <span>衡量方法</span>
              <em> {{ item.o.judgeMethod }}</em>
            </div>
          </dd>
          <dd></dd>
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
              <dd v-for="(li, d) in item.o.measure" :key="d">
                {{ li }}
              </dd>
            </dl>
            <dl>
              <dt>复盘沟通</dt>
              <dd>
                <el-input
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  type="textarea"
                  placeholder="不超过1000字符"
                  maxlength="1000"
                  v-model="item.o.communication"
                  class="tl-textarea"
                ></el-input>
              </dd>
            </dl>
            <dl>
              <dt>评论</dt>
              <dd>
                <dl class="tag-lists">
                  <dd
                    @click="selectCommunicationLabel(btnText.txt, index, i)"
                    v-for="(btnText, key) in listBtn"
                    :key="key"
                    :class="[
                      {
                        'is-selected': item.o.communicationLabel == btnText.txt,
                      },
                      btnText.clsName,
                    ]"
                  >
                    <em>{{ btnText.txt }}</em>
                  </dd>
                </dl>
              </dd>
            </dl>
          </dd>
        </dl>
      </elcollapseitem>
    </elcollapse>

    <tl-footer
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
import replayFoot from '../../component/replayFoot';
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  data() {
    return {
      form: {},
      activeNames: [0],
      server,
      submitLoad: false,
      saveLoad: false,
      oldList: [],
      active: {},
      communication: {},
      communicationLabel: {},
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
    elcollapse,
    elcollapseitem,
    'tl-process': process,
    'tl-footer': replayFoot,
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
          this.$emit('getView');
          this.getOldList();
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
        console.log(this.list);
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