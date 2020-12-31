<template>
  <div class="kr-replay">
    <elcollapse
      class="tl-collapse okr-change-list"
      v-model="activeNames"
      @change="expand"
    >
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
                :ref="'process' + index + i"
                :data="parseInt(list.okrDetailProgress, 10)"
              ></tl-process>
            </div>
          </dd>
          <dd>
            <div>
              <span>考核指标</span>
              <em>{{ list.checkQuota || "未填写" }}</em>
            </div>
          </dd>
          <dd>
            <div>
              <span>衡量方法</span>
              <em>{{ list.judgeMethod || "未填写" }}</em>
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
            <dl v-if="list.attachmentDtoList">
              <dt>佐证材料</dt>
              <dd v-for="file in list.attachmentDtoList" :key="file.resourceId">
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
            <!-- 复盘详情 -->
            <template v-if="list.openAdvantage">
              <dl>
                <dt>价值与收获</dt>
                <dd>{{ list.advantage || "未填写" }}</dd>
              </dl>
              <dl>
                <dt>问题与不足</dt>
                <dd>{{ list.disadvantage || "未填写" }}</dd>
              </dl>
              <dl>
                <dt>改进措施</dt>
                <dd v-for="(li, d) in list.measure || []" :key="d">{{ li }}</dd>
                <dd v-if="list.measure.length == 0">未填写</dd>
              </dl>
            </template>
            <div @click="openMore(list)">
              <i :class="list.openAdvantage === true ? 'close' : 'open'"></i>
              <span v-if="list.openAdvantage">收起</span>
              <span v-else>展开</span>
            </div>
          </dd>
        </dl>
      </elcollapseitem>
    </elcollapse>
    <div class="final-score">
      <span>OKR自评得分</span>
      <em>{{ okrMain.okrMainVo.selfAssessmentScore || 0}}</em>
      <span>分</span>
    </div>
    <dl class="dl-card-panel replay-communicate">
      <dt><em>复盘审批</em></dt>
      <dd>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="100px"
          class="el-form"
        >
          <el-form-item label="复盘审批结果" prop="passFlag">
            <el-radio-group
              v-model.trim="ruleForm.passFlag"
              class="tl-radio-group"
            >
              <el-radio label="1" class="tl-radio">通过</el-radio>
              <el-radio label="2" class="tl-radio">驳回</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="ruleForm.passFlag == '2'"
            label="驳回原因"
            prop="refuseInfo"
            :rules="[
              {
                required: ruleForm.passFlag == '2',
                message: '请输入驳回原因',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              type="textarea"
              placeholder="请输入驳回原因，不超过500个字符"
              v-model.trim="ruleForm.refuseInfo"
              :maxlength="500"
              class="tl-textarea"
              :rows="3"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
      </dd>
    </dl>
    <div class="footer-panel">
      <el-button
        type="primary"
        @click="submit"
        :loading="submitLoad"
        class="tl-btn amt-bg-slip"
        >确认
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
        passFlag: '1',
        communication: '',
        refuseInfo: '',
      },
      sortCommentList: ['无异意', '已线下沟通', '已知晓'],
      commentList: [],
    };
  },
  created() {
  },
  methods: {

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
    handleDeleteOne() {
      this.$router.push('/replayList');
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 驳回不需要二次确认？
          // nextApproveUserName
          this.$xconfirm({
            content: '',
            title: this.ruleForm.passFlag == '1' ? '确认复盘审批通过吗？' : '确认驳回吗？',
          }).then(() => {
            this.submitLoad = true;
            const params = {
              okrMainId: this.okrMain.okrMainVo.okrId,
              pass: this.ruleForm.passFlag == '1',
              remark: this.ruleForm.passFlag == '1' ? '' : this.ruleForm.refuseInfo,
            };
            this.server.okrReviewApprove(params).then((res) => {
              this.submitLoad = false;
              if (res.code == 200) {
                this.$message.success('提交成功');
                this.$router.push('/replayList');
              } else {
                this.$message.error(res.msg);
              }
            });
          }).catch(() => {});
        } else {
          this.$message.error('您有必填项未正确填写，请检查');
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
    // 重新触发进度条计算
    expand(activeList) {
      activeList.forEach((item) => {
        this.okrMain.okrReviewPojoList[item].krs.forEach((kritem, krIndex) => {
          this.$nextTick(() => {
            this.$refs[`process${item}${krIndex}`][0].changeWidth();
          });
        });
      });
    },
    addSortComment(text) {
      if (this.ruleForm.communication.indexOf(text) == -1) {
        this.ruleForm.communication += text;
      }
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
    'ruleForm.passFlag': {
      handler(newVal) {
        if (newVal == '1' && this.ruleForm.refuseInfo == '') {
          const fields = this.$refs.ruleForm.fields || [];
          fields.forEach((i) => {
            if (i.prop === 'refuseInfo') { // 通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
              i.resetField();
            }
          });
        }
        if (newVal == '2' && this.ruleForm.communication == '') {
          const fields = this.$refs.ruleForm.fields || [];
          fields.forEach((i) => {
            if (i.prop === 'communication') { // 通过prop属性值相同来判断是哪个输入框，比如：要移除prop为'user'
              i.resetField();
            }
          });
        }
        console.log(this.ruleForm.refuseInfo == '');
        console.log(this.ruleForm.communication);
      },
    },
  },
};
</script>