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
              <em>{{ list.checkQuota }}</em>
            </div>
          </dd>
          <dd>
            <div>
              <span>衡量方法</span>
              <em>{{ list.judgeMethod }}</em>
            </div>
          </dd>
          <dd>
            <dl>
              <dt>自评分</dt>
              <dd></dd>
            </dl>
            <dl>
              <dt>自评说明</dt>
              <dd></dd>
            </dl>
            <dl>
              <dt>佐证材料</dt>
              <dd></dd>
            </dl>
          </dd>
          <!-- 复盘详情 -->
          <dd>
            <dl>
              <dt>价值与收获</dt>
              <dd>{{ list.advantage }}</dd>
            </dl>
            <dl>
              <dt>问题与不足</dt>
              <dd>{{ list.disadvantage }}</dd>
            </dl>
            <dl>
              <dt>改进措施</dt>
              <dd v-for="(li, d) in list.measure || []" :key="d">{{ li }}</dd>
            </dl>
            <!-- <dl>
              <dt>复盘沟通</dt>
              <dd>
                <el-input
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  type="textarea"
                  placeholder="不超过1000字符"
                  maxlength="1000"
                  v-model="list.communication"
                  class="tl-textarea"
                ></el-input>
              </dd>
            </dl> -->
            <!-- <dl>
              <dt>评定</dt>
              <dd>
                <dl class="tag-lists">
                  <dd
                    @click="selectCommunicationLabel(btnText.txt, index, i)"
                    v-for="(btnText, key) in listBtn"
                    :key="key"
                    :class="[
                      {
                        'is-selected': list.communicationLabel == btnText.txt,
                      },
                      btnText.clsName,
                    ]"
                  >
                    <em>{{ btnText.txt }}</em>
                  </dd>
                </dl>
              </dd>
            </dl> -->
          </dd>
        </dl>
      </elcollapseitem>
    </elcollapse>
    <div>
      <span>OKR得分</span>
      <em></em>
    </div>
    <dl>
      <dd>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="100px"
          class="el-form"
        >
          <el-form-item label="复盘沟通结果" prop="replayStatus">
            <el-radio-group
              v-model.trim="ruleForm.replayStatus"
              class="tl-radio-group"
            >
              <el-radio label="1" class="tl-radio">通过</el-radio>
              <el-radio label="2" class="tl-radio">退回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.replayStatus == '1'"
            label="复盘沟通"
            prop="communication"
          >
            <el-input
              type="textarea"
              placeholder="不超过500个字符"
              v-model.trim="ruleForm.communication"
              :maxlength="500"
              class="tl-textarea"
              :rows="3"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.replayStatus == '2'"
            label="驳回原因"
            prop="refuseInfo"
            :rules="[
              {
                required: ruleForm.replayStatus == '2',
                message: '请输入驳回原因',
              },
            ]"
          >
            <el-input
              type="textarea"
              placeholder="请输入驳回原因，不超过100个字符"
              v-model.trim="ruleForm.refuseInfo"
              :maxlength="100"
              class="tl-textarea"
              :rows="3"
              resize="none"
            ></el-input>
          </el-form-item>
          <div>
            <span>快捷评语：</span>
            <em
              v-for="sortComment in sortCommentList"
              :key="sortComment"
              @click="fastWrite(sortComment)"
            >
              {{ sortComment }}
            </em>
          </div>
        </el-form>
      </dd>
    </dl>
    <tl-footer
      :btnText="'确认沟通'"
      :saveLoad="saveLoad"
      :submitLoad="submitLoad"
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
  components: {
    elcollapse,
    elcollapseitem,
    'tl-process': process,
    'tl-footer': replayFoot,
  },
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
      ruleForm: {
        replayStatus: 1,
      },
      sortCommentList: ['无异意', '已线下沟通', '已知晓'],
    };
  },
  created() {
    this.getOldList();
  },
  methods: {
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
        advantage: item.advantage,
        disadvantage: item.disadvantage,
        measure: item.measure || [],
        okrDetailId: item.okrDetailId,
        communication: item.communication,
        communicationLabel: item.communicationLabel,
      }));
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
        }));
      } else {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          advantage: item.advantage,
          disadvantage: item.disadvantage,
          measure: item.measure || [],
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
        }).then(() => { this.$router.push('/replayList'); })
        .catch(() => {
          this.$router.push('/replayList');
        });
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
          this.$router.push('/replayList');
        } else {
          this.$$message.error(res.msg);
        }
      });
    },
    submit() {
      this.submitLoad = true;
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          okrId: this.okrMain.okrMainVo.okrId,
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
    fastWrite(text) {
      this.ruleForm.communication = text;
    },
  },
};
</script>