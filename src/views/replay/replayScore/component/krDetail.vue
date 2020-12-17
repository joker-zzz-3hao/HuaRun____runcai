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
        <div v-for="(list, i) in item.krs" :key="i">
          <dl class="is-kr">
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
                <em>{{ list.checkQuota || "暂无" }}</em>
              </div>
            </dd>
            <dd>
              <div>
                <span>衡量方法</span>
                <em>{{ list.judgeMethod || "暂无" }}</em>
              </div>
            </dd>
            <dd>
              <dl>
                <dt>自评分</dt>
                <dd>{{ list.score }}</dd>
              </dl>
              <dl v-if="list.scoreRemark">
                <dt>自评说明</dt>
                <dd>{{ list.scoreRemark }}</dd>
              </dl>
              <dl>
                <dt>佐证材料</dt>
                <dd
                  v-for="file in list.attachmentDtoList"
                  :key="file.resourceId"
                >
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
              <dl>
                <dt>复核得分</dt>
                <dd v-if="isdetail == 'isdetail'">
                  <em>{{ list.finalScore }}</em>
                </dd>
                <dd v-else>
                  <el-form :model="list" :ref="i + 'dataForm'">
                    <el-form-item
                      prop="finalScore"
                      :rules="[
                        {
                          trigger: 'blur',
                          required: true,
                          validator: validateScore,
                        },
                      ]"
                    >
                      <el-input-number
                        v-model="list.finalScore"
                        controls-position="right"
                        class="tl-input-number"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        step-strictly
                        @change="showscore(list)"
                      ></el-input-number>
                    </el-form-item>
                  </el-form>
                </dd>
              </dl>
              <dl>
                <dt>复核说明</dt>
                <dd v-if="isdetail == 'isdetail'">
                  <em>{{ list.finalRemark }}</em>
                </dd>
                <dd v-else>
                  <el-input
                    v-model="list.remark"
                    placeholder="请输入复核原因（非必填）"
                    maxlength="200"
                    type="textarea"
                    resize="none"
                    class="tl-textarea"
                  ></el-input>
                  <em
                    v-for="sortComment in sortCommentList"
                    :key="sortComment"
                    @click="addSortComment(list, sortComment)"
                    :class="{
                      'high-light': list.remark.indexOf(sortComment) >= 0,
                    }"
                  >
                    {{ sortComment }}
                  </em>
                </dd>
              </dl>
              <dl v-if="isdetail == 'isdetail'">
                <dt>复核材料</dt>
                <dd
                  v-for="file in list.finalAttachmentList"
                  :key="file.resourceId"
                >
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
                <dd v-if="!list.finalAttachmentList">暂无</dd>
              </dl>
              <dl v-else>
                <dt>上传附件</dt>
                <dd>
                  <file-upload
                    :actionIndex="{ oindex: index, krindex: i }"
                    ref="fileUpload"
                    :fileList="list.fileList"
                    :limit="10"
                    @change="fileChange"
                    sourceType="SCORE_REVIEW"
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
            </dd>
          </dl>
        </div>
      </elcollapseitem>
    </elcollapse>
    <div v-if="okrMain.okrReviewCommunicationDetailEntity">
      <div>
        <span>上级的复盘沟通结果：</span>
        <em>通过</em>
      </div>
      <div>
        <span>复盘沟通说明：</span>
        <em>{{ okrMain.okrReviewCommunicationDetailEntity.communication }}</em>
      </div>
    </div>
    <div v-if="okrMain.okrMainVo">
      <div>
        <span>OKR自评得分</span>
        <em>{{ okrMain.okrMainVo.selfAssessmentScore }}</em>
      </div>
      <div>
        <span>OKR复核最终得分</span>
        <em>{{ okrMain.okrMainVo.finalScore }}</em>
      </div>
    </div>
    <div class="footer-panel">
      <el-button
        v-if="isdetail === 'edit'"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="submit"
        >复核完成</el-button
      >
      <el-button
        plain
        @click="handleDeleteOne"
        class="tl-btn amt-border-fadeout"
        >关闭</el-button
      >
    </div>
    <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import fileUpload from '@/components/fileUpload/index';
import CONST from '@/lib/const';
import imgDialog from '@/components/imgDialog';
import validateMixin from '@/mixin/validateMixin';
import Server from '../../server';

const server = new Server();
export default {
  name: 'replayScoreKr',
  mixins: [validateMixin],
  props: {
    okrMain: {
      type: Object,
      required: true,
    },
    isdetail: {
      type: String,
      default: 'isdetail',
    },
  },
  components: {
    elcollapse,
    elcollapseitem,
    'tl-process': process,
    'file-upload': fileUpload,
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
      sortCommentList: ['举证充分', '情况属实', '些许争议'],
      finalScore: 0,
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
          okrDetailId: item.okrDetailId,
          remark: '',
          finalScore: '',
          attachmentList: [],
        }));
      } else {
        this.list = krsList.map((item) => ({
          okrDetailId: item.okrDetailId,
          remark: item.remark,
          finalScore: item.finalScore,
          attachmentList: item.attachmentList,
        }));
      }
    },

    handleDeleteOne() {
      this.$router.push('/replayScore');
    },
    submit() {
      this.submitLoad = true;
      this.checkDatakrs(false);
      const params = {

        okrMainId: this.okrMain.okrMainVo.okrId,
        finalScore: this.okrMain.okrMainVo.finalScore,

        okrCheckDetailDtoList: this.list,
      };
      Promise.all(this.$refs[`${0}dataForm`].map(this.getFormPromise)).then((res) => {
        const validateResult = res.every((item) => !!item);
        if (validateResult) {
          this.server.okrCheckSubmit(params).then((response) => {
            this.submitLoad = false;
            if (response.code == 200) {
              this.$message.success('提交成功');
              this.$router.push('/replayScore');
            } else {
              this.$message.error(response.msg);
            }
          });
        } else {
          this.$message.error('您有必填项「复核得分」未填，请检查');
        }
      });
    },
    // 校验
    getFormPromise(form) {
      return new Promise((resolve) => {
        form.validate((res) => {
          console.log('校验', res);
          resolve(res);
        });
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
    showscore() {
      this.okrMain.okrMainVo.finalScore = Math.floor(this.computeScore() / 100) / 100;
    },
    computeScore() {
      let score = 0;
      this.okrMain.okrReviewPojoList.forEach((item) => {
        // o的权重
        const oWeight = item.o.okrWeight;
        let krscore = 0;
        // kr
        item.krs.forEach((list) => {
          krscore += (list.finalScore || 0) * list.okrWeight;
        });
        score += krscore * oWeight;
        console.log('krscore', score);
      });
      return score;
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
    addSortComment(list, text) {
      if (list.remark.indexOf(text) == -1) {
        list.remark += text;
      }
    },
    // -------------文件-------------
    fileChange(fileobject) {
      console.log(fileobject.list, fileobject.action);
      this.okrMain.okrReviewPojoList[fileobject.action.oindex]
        .krs[fileobject.action.krindex].attachmentList = fileobject.list;
    },
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
      const url = `${origin}/gateway/system-service/sys/attachment/outside/download?resourceId=${fileObj.resourceId}&sourceType=SCORE_REVIEW&sourceKey=${this.$route.query.okrId}`;
      window.open(url);
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