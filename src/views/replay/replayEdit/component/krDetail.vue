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
          <el-form :model="list" :ref="i + 'dataForm'">
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
                <em>{{ list.checkQuota || "--" }}</em>
              </div>
            </dd>
            <dd>
              <div>
                <span>衡量方法</span>
                <em>{{ list.judgeMethod || "--" }}</em>
              </div>
            </dd>
            <dd>
              <dl>
                <dt>评分</dt>
                <dd>
                  <el-form-item
                    prop="score"
                    :rules="[
                      {
                        trigger: 'blur',
                        required: true,
                        message: '请输入评分',
                      },
                    ]"
                  >
                    <el-input-number
                      v-model="list.score"
                      controls-position="right"
                      class="tl-input-number"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      step-strictly
                      @change="showscore(list)"
                    ></el-input-number>
                  </el-form-item>

                  <span>
                    如您输入的评分与KR进度分数不一致，则需要给出解释，如：KR进度90%，评分应该是0.9，如不一样，请说明原因。
                  </span>
                </dd>
              </dl>
              <dl v-if="list.score * 100 != list.okrDetailProgress">
                <dt>评分说明</dt>
                <dd>
                  <el-form-item
                    prop="scoreRemark"
                    :rules="[
                      {
                        trigger: 'blur',
                        required: true,
                        message: '请输入评分说明',
                      },
                    ]"
                  >
                    <el-input
                      v-model="list.scoreRemark"
                      placeholder="请输入评分说明"
                      maxlength="200"
                      type="textarea"
                      resize="none"
                      class="tl-textarea"
                    ></el-input>
                  </el-form-item>
                </dd>
              </dl>
              <dl>
                <dt>上传佐证材料</dt>
                <dd>
                  <file-upload
                    :actionIndex="{ oindex: index, krindex: i }"
                    ref="fileUpload"
                    :fileList="list.fileList"
                    :limit="10"
                    @change="fileChange"
                    sourceType="OKR_REVIEW"
                    :sourceKey="$route.query.okrId"
                    accept="
              .jpg,
              .jpeg,
              image/png,
              application/msword,
              application/vnd.openxmlformats-officedocument.wordprocessingml.document,
              .pptx,
              .xlsx"
                    tips="支持jpg、jpeg、png、doc、docx、xslx、pptx，最多上传10个文件，单个文件不超过30M"
                  ></file-upload>
                </dd>
              </dl>
              <div v-if="list.openAdvantage">
                <dl>
                  <dt>价值与收获</dt>
                  <dd>
                    <el-input
                      maxlength="2000"
                      :autosize="{ minRows: 1, maxRows: 8 }"
                      v-model="list.advantage"
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
                      :autosize="{ minRows: 1, maxRows: 8 }"
                      maxlength="2000"
                      v-model="list.disadvantage"
                      type="textarea"
                      class="tl-textarea"
                      placeholder="事情做的有那些不足，自己表现有哪些不足？"
                    ></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>改进措施</dt>
                  <template v-if="list.measure.length > 1">
                    <dd v-for="(li, d) in list.measure || []" :key="d">
                      <el-input
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        type="textarea"
                        class="tl-textarea"
                        placeholder="请针对问题与不足进行改进措施陈述。"
                        v-model="list.measure[d]"
                      ></el-input>
                    </dd>
                  </template>
                  <template v-else>
                    <dd>
                      <el-input
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        type="textarea"
                        placeholder="请针对问题与不足进行改进措施陈述。"
                        v-model="list.measure[0]"
                        class="tl-textarea"
                      ></el-input>
                    </dd>
                  </template>
                </dl>
              </div>
              <div @click="openMore(list)">
                <i :class="list.openAdvantage === true ? 'close' : 'open'"></i>
                <span v-if="list.openAdvantage">收起</span>
                <span v-else>展开</span>
              </div>
            </dd>
          </el-form>
        </dl>
      </elcollapseitem>
    </elcollapse>
    <div>
      <span>最终得分</span>
      <em>{{ okrMain.okrMainVo.selfAssessmentScore }}</em>
    </div>
    <tl-footer
      :btnText="'提交复盘'"
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
import fileUpload from '@/components/fileUpload/index';
import replayFoot from '../../component/replayFoot';
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  data() {
    return {
      reviewType: 1,
      form: {},
      submitLoad: false,
      saveLoad: false,
      activeNames: [0],
      server,
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      list: [],
      oldList: [],
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
      selfAssessmentScore: 0,
    };
  },
  created() {
    this.getOldList();
  },
  components: {
    elcollapse,
    elcollapseitem,
    'tl-process': process,
    'tl-footer': replayFoot,
    'file-upload': fileUpload,
  },
  computed: {

  },
  methods: {

    deletedProduce(index, i, d) {
      this.okrMain.okrReviewPojoList[index].krs[i].measure.splice(d, 1);
    },
    addDefic(index, i) {
      // if (!value) {
      //   this.$message.error('请填写改进措施');
      //   return false;
      // }
      if (this.okrMain.okrReviewPojoList[index].krs[i].measure.length == 0) {
        this.okrMain.okrReviewPojoList[index].krs[i].measure = [''];
      }
      this.okrMain.okrReviewPojoList[index].krs[i].measure.push('');
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
          attachmentList: item.attachmentList,
          score: item.score,
          remark: item.scoreRemark,
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
          selfAssessmentScore: this.okrMain.okrMainVo.selfAssessmentScore,
        },
        list: this.list,
      };
      this.server.okrReviewSave(params).then((res) => {
        this.saveLoad = false;
        if (res.code == 200) {
          this.$emit('getView');
          this.updateFile();
          this.getOldList();
          this.$message.success('保存成功');
        } else {
          this.$$message.error(res.msg);
        }
      });
    },
    handleDeleteOne() {
      this.checkDatakrs(false);
      const CheckNull = this.list.every((
        item,
      ) => !item.score && !item.remark && !item.advantage && !item.disadvantage && item.measure.length == 0);
      if (CheckNull) {
        console.log(this.list);
        this.$router.push('/replayList');
        return false;
      }

      console.log(JSON.stringify(this.oldList), JSON.stringify(this.list));
      if (JSON.stringify(this.oldList) == JSON.stringify(this.list)) {
        this.$router.push('/replayList');
      } else {
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
      }
    },
    clearClose() {
      this.checkDatakrs(true);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrId: this.okrMain.okrMainVo.okrId,
          selfAssessmentScore: this.okrMain.okrMainVo.selfAssessmentScore,
        },
        list: this.list,
      };

      this.server.okrReviewSave(params).then((res) => {
        if (res.code == 200) {
          this.$router.push('/replayList');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getFormPromise(form) {
      return new Promise((resolve) => {
        form.validate((res) => {
          resolve(res);
        });
      });
    },
    submit() {
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrBelongType: this.okrMain.okrMainVo.okrBelongType,
          okrId: this.okrMain.okrMainVo.okrId,
          selfAssessmentScore: this.okrMain.okrMainVo.selfAssessmentScore,
        },
        list: this.list,
      };
      // for (let i = 0; i < oLength; i += 1) {
      //   formValidate[i] = this.$refs[`${i}dataForm`];
      //   console.log('校验', i, this.$refs[`${i}dataForm`]);
      // }
      Promise.all(this.$refs[`${0}dataForm`].map(this.getFormPromise)).then((res) => {
        const validateResult = res.every((item) => !!item);
        if (validateResult) {
          console.log('表单都校验通过', validateResult);
          this.submitLoad = true;
          this.server.okrReviewSubmit(params).then((response) => {
            this.submitLoad = false;
            if (response.code == 200) {
              this.$message.success('提交成功');
              this.$router.push('/replayList');
              this.updateFile();
            } else {
              this.$message.error(response.msg);
            }
          });
        } else {
          this.$message.error('您有必填项未填');
        }
      });
      // const CheckNull = this.list.some((item) => !item.advantage || !item.disadvantage || item.measure.length == 0);
      // if (CheckNull) {
      //   this.submitLoad = false;
      //   this.$message.error('未完成复盘，尚有未填写内容，请检查');
      //   return false;
      // }
    },
    getOldList() {
      const KrList = JSON.parse(JSON.stringify(this.okrMain.okrReviewPojoList));
      const krsData = KrList.map((item) => item.krs);
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
        attachmentList: item.attachmentList,
        score: item.score,
        remark: item.scoreRemark,
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
    // 折叠展开
    openMore(list) {
      list.openAdvantage = !list.openAdvantage;
      this.$forceUpdate();
    },
    showscore() {
      this.okrMain.okrMainVo.selfAssessmentScore = Math.floor(this.computeScore() / 100) / 100;
    },
    fileChange(fileobject) {
      console.log(fileobject.list, fileobject.action);
      this.okrMain.okrReviewPojoList[fileobject.action.oindex]
        .krs[fileobject.action.krindex].attachmentList = fileobject.list;
    },

    computeScore() {
      let score = 0;
      this.okrMain.okrReviewPojoList.forEach((item) => {
        // o的权重
        const oWeight = item.o.okrWeight;
        let krscore = 0;
        // kr
        item.krs.forEach((list) => {
          krscore += (list.score || 0) * list.okrWeight;
        });
        score += krscore * oWeight;
        console.log('krscore', score);
      });
      return score;
    },
    // 更新文件状态
    updateFile() {
      this.list.forEach((item) => {
        if (item.attachmentList && item.attachmentList.length > 0) {
          const files = item.attachmentList.map((file) => file.resourceId).toString();
          this.server.updateResource({ resourceId: files, sourceType: 'OKR_REVIEW' });
        }
      });
    },
  },
};
</script>
