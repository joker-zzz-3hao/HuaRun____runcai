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
              <!-- TODO: -->
              <em>{{ list.judgeMethod }}</em>
            </div>
          </dd>
          <dd>
            <div>
              <span>评分说明</span>
              <!-- TODO: -->
              <em>{{ list.judgeMethod }}</em>
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
            <em v-for="sortComment in sortCommentList" :key="sortComment">
              {{ sortComment }}
            </em>
          </dd>
          <dd>
            <span>上传附件</span>
            <file-upload
              ref="fileUpload"
              :fileList="fileList"
              :limit="10"
              @change="fileChange"
              :sourceKey="formData.okrMainId"
              sourceType="OKRMODIFY"
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
        <em></em>
      </div>
      <div>
        <span>OKR复核最终得分</span>
        <el-input></el-input>
      </div>
    </div>
    <div class="footer-panel">
      <el-button>复核完成</el-button>
    </div>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import fileUpload from '@/components/fileUpload/index';
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
      sortCommentList: ['举证充分', '情况属实', '些许争议'],
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
  },
};
</script>