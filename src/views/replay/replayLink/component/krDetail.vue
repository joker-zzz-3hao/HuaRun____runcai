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
              <dd>{{ list.score }}</dd>
            </dl>
            <dl v-if="list.scoreRemark">
              <dt>评分说明</dt>
              <dd>{{ list.scoreRemark }}</dd>
            </dl>
            <dl v-if="list.attachmentList">
              <dt>佐证材料</dt>
              <dd v-for="file in list.fileList" :key="file.resourceId">
                <em>{{ file.resourceName }}</em>
                <span>
                  <span
                    v-if="CONST.IMAGES_MAP[cutType(file.resourceName)]"
                    @click="openFile(file)"
                    >预览</span
                  >
                  <span @click="downFile(file)">下载</span>
                </span>
              </dd>
            </dl>
          </dd>
          <!-- 复盘详情 -->
          <div @click="openMore(list)">展开</div>
          <dd v-show="list.openAdvantage">
            <dl v-if="list.advantage">
              <dt>价值与收获</dt>
              <dd>{{ list.advantage }}</dd>
            </dl>
            <dl v-if="list.disadvantage">
              <dt>问题与不足</dt>
              <dd>{{ list.disadvantage }}</dd>
            </dl>
            <dl v-if="list.measure.length">
              <dt>改进措施</dt>
              <dd v-for="(li, d) in list.measure || []" :key="d">{{ li }}</dd>
            </dl>
          </dd>
        </dl>
      </elcollapseitem>
    </elcollapse>
    <div>
      <span>OKR得分</span>
      <em>{{ okrMain.okrMainVo.selfAssessmentScore }}</em>
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
          <div v-if="ruleForm.replayStatus == '1'">
            <span>快捷评语：</span>
            <em
              v-for="sortComment in sortCommentList"
              :key="sortComment"
              @click="ruleForm.communication = sortComment"
            >
              {{ sortComment }}
            </em>
          </div>
        </el-form>
      </dd>
    </dl>
    <div class="footer-panel">
      <el-button
        type="primary"
        @click="submit"
        :loading="submitLoad"
        class="tl-btn amt-bg-slip"
        >确认沟通
      </el-button>
      <el-button
        plain
        @click="handleDeleteOne"
        class="tl-btn amt-border-fadeout"
        >关闭
      </el-button>
    </div>
    <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import CONST from '@/lib/const';
import imgDialog from '@/components/imgDialog';
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  components: {
    elcollapse,
    elcollapseitem,
    'tl-process': process,
    'img-dialog': imgDialog,
  },
  data() {
    return {
      CONST,
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
        replayStatus: '1',
        communication: '',
        refuseInfo: '',
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          debugger;
          this.submitLoad = true;
          this.checkDatakrs(false);
          const params = {
            okrMainVo: {
              okrId: this.okrMain.okrMainVo.okrId,
            },
            list: this.list,
          };
          this.server.okrReviewCommunicationSubmit(params).then((res) => {
            this.submitLoad = false;
            if (res.code == 200) {
              this.$message.success('提交成功');
              this.$router.push('/replayList');
            } else {
              this.$message.error(res.msg);
            }
          });
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
    // 折叠展开
    openMore(list) {
      list.openAdvantage = !list.openAdvantage;
      this.$forceUpdate();
    },
    // -------------文件-------------
    // 截取文件类型
    cutType(name) {
      console.log(name);
      if (name && name.indexOf('.') > -1) {
        return name.split('.')[1];
      } return '';
    },
    // 预览
    openFile(fileObj) {
      this.$refs.imgDialog.show(fileObj.resourceUrl);
    },
    // 下载
    downFile(fileObj) {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      const url = `${origin}/gateway/system-service/sys/attachment/outside/download?resourceId=${fileObj.resourceId}&sourceType=OKR_REVIEW&sourceKey=${this.$route.query.okrId}`;
      window.open(url);
    },
  },
  watch: {
    'ruleForm.replayStatus': {
      handler() {
        console.log(this.$refs.ruleForm.fields);
        const fields = this.$refs.ruleForm.fields || [];
        fields.forEach((i) => {
          if (i.prop === 'refuseInfo' || i.prop === 'communication') { // 通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
            i.resetField();
          }
        });
      },
    },
  },
};
</script>