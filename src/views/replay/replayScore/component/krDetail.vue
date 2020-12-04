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
              <div v-for="file in list.attachmentList" :key="file.resourceId">
                <em>{{ file.resourceName }}</em>
                <span>
                  <span
                    v-if="CONST.IMAGES_MAP[cutType(file.resourceName)]"
                    @click="openFile(file)"
                    >预览</span
                  >
                  <span @click="downFile(file)">下载</span>
                </span>
              </div>
            </dd>
            <dd>
              <div>
                <span>自评分</span>
                <em>{{ list.score }}</em>
              </div>
            </dd>
            <dd>
              <div v-if="list.scoreRemark">
                <span>评分说明</span>
                <em>{{ list.scoreRemark }}</em>
              </div>
            </dd>
          </dl>
          <dl class="input-dl">
            <dd>
              <span>复核得分</span>
              <el-input-number
                v-model="list.score"
                controls-position="right"
                class="tl-input-number"
                :min="0"
                :max="1"
                :step="0.1"
                step-strictly
              ></el-input-number>
            </dd>
            <dd>
              <el-input
                v-model="list.communication"
                placeholder="请输入复核原因（非必填）"
                maxlength="200"
                type="textarea"
                :rows="3"
                resize="none"
                class="tl-textarea"
              ></el-input>
            </dd>
            <dd>
              <span>快捷评语：</span>
              <em
                v-for="sortComment in sortCommentList"
                :key="sortComment"
                @click="list.communication = sortComment"
              >
                {{ sortComment }}
              </em>
            </dd>
            <dd>
              <span>上传附件</span>
              <file-upload
                :actionIndex="{ oindex: index, krindex: i }"
                ref="fileUpload"
                :fileList="list.fileList"
                :limit="10"
                @change="fileChange"
                sourceType="SCORE_REVIEW"
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
        </div>
      </elcollapseitem>
    </elcollapse>
    <div>
      <div>
        <span>上级的复盘沟通结果：</span>
        <em></em>
      </div>
      <div>
        <span>沟通说明：</span>
        <em></em>
      </div>
    </div>
    <div>
      <div>
        <span>OKR自评得分</span>
        <em>{{ okrMain.okrMainVo.selfAssessmentScore }}</em>
      </div>
      <div>
        <span>OKR复核最终得分</span>
        <el-input-number
          v-model="finalScore"
          controls-position="right"
          class="tl-input-number"
          :min="0"
          :max="1"
          :step="0.01"
          step-strictly
        ></el-input-number>
      </div>
    </div>
    <div class="footer-panel">
      <el-button type="primary" class="tl-btn amt-bg-slip">复核完成</el-button>
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
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
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

    handleDeleteOne() {
      this.$router.push('/replayList');
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
  },
};
</script>