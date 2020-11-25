<template>
  <el-drawer
    :visible.sync="myokrDrawer"
    :wrapperClosable="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    class="tl-drawer"
    custom-class="custom-drawer okr-change"
    @closed="closed"
    :before-close="close"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">{{ drawerTitle }}</div>
    </div>
    <el-scrollbar>
      <div class="cont-box">
        <div class="dl-list">
          <dl>
            <dt>
              <i class="el-icon-s-flag"></i>
              <em>OKR类型</em>
            </dt>
            <dd>{{ CONST.OKR_TYPE_MAP[okrmain.okrBelongType] }}</dd>
          </dl>
          <dl>
            <dt>
              <i class="el-icon-s-custom"></i>
              <em>负责人</em>
            </dt>
            <dd>{{ okrmain.userName }}</dd>
          </dl>
          <dl>
            <dt>
              <i class="el-icon-timer"></i>
              <em>更新时间</em>
            </dt>
            <dd>{{ okrmain.updateTime || okrmain.createTime }}</dd>
          </dl>
          <dl>
            <dt>
              <i class="el-icon-odometer"></i>
              <em>进度</em>
            </dt>
            <dd>
              <tl-process :data="okrmain.okrProgress"></tl-process>
            </dd>
          </dl>
        </div>
        <tl-okrcollapse
          ref="okrCollapse"
          :tableList="tableList"
          :canWrite="true"
          @openUndertake="openUndertakepage"
        >
          <template slot="head-bar" slot-scope="props">
            <el-tooltip
              v-if="props.okritem.versionCount > 1"
              class="history-version"
              effect="dark"
              content="历史版本"
              placement="top"
              popper-class="tl-tooltip-popper"
              @click.native="
                openHistory(
                  props.okritem.okrDetailId,
                  props.okritem.okrDetailObjectKr
                )
              "
            >
              <i class="el-icon-time"></i>
            </el-tooltip>
          </template>
          <template slot="body-bar" slot-scope="props">
            <el-tooltip
              v-if="props.okritem.versionCount > 1"
              class="history-version"
              effect="dark"
              content="历史版本"
              placement="top"
              popper-class="tl-tooltip-popper"
              @click.native="
                openHistory(
                  props.okritem.okrDetailId,
                  props.okritem.okrDetailObjectKr
                )
              "
            >
              <i class="el-icon-time"></i>
            </el-tooltip>
          </template>
        </tl-okrcollapse>
        <tl-okrform
          ref="okrform"
          :searchForm="searchForm"
          :server="server"
          :canWrite="true"
          :isnew="false"
          :periodId="searchForm.periodId"
          :preIndex="preIndex"
        ></tl-okrform>
        <dl class="change-reason">
          <dt>变更原因</dt>
          <dd>
            <el-form :model="reason" ref="reasonForm">
              <el-form-item
                prop="modifyReason"
                :rules="[
                  {
                    trigger: 'blur',
                    message: '变更原因不能为空',
                    required: true,
                  },
                ]"
              >
                <el-input
                  maxlength="200"
                  type="textarea"
                  v-model="reason.modifyReason"
                  :rows="3"
                  resize="none"
                  class="tl-textarea"
                ></el-input>
              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="upload-file">
          <dt>附件上传</dt>
          <dd>
            <file-upload
              ref="fileUpload"
              :fileList="fileList"
              :limit="10"
              @change="fileChange"
              :sourceKey="writeInfo.okrId"
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
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <el-button
        :disabled="!hasPower('okr-change')"
        type="primary"
        @click="validateForm"
        class="tl-btn amt-bg-slip"
        :loading="loading"
        >提交</el-button
      >
      <el-button plain @click="close" class="tl-btn amt-border-fadeout"
        >取消</el-button
      >
    </div>
    <el-drawer
      :visible.sync="innerDrawer"
      :modal="false"
      :wrapperClosable="false"
      :append-to-body="true"
      custom-class="custom-drawer associated-undertaking"
      class="tl-drawer"
    >
      <div slot="title" class="flex-sb">
        <div class="drawer-title">关联父目标</div>
      </div>
      <tl-undertaketable
        v-if="selectIndex !== '' && innerDrawer"
        ref="undertake"
        :departokrList="tableList[this.selectIndex].departokrList"
        :selectRadioDepart.sync="selectRadioDepart"
        :selectRadioPhil.sync="tableList[this.selectIndex].cultureId"
        :periodName="writeInfo.periodName"
        :periodId="writeInfo.periodId"
        :server="server"
        :okrBelongType="okrmain.okrBelongType"
        :parentUpdate="tableList[this.selectIndex].parentUpdate"
        :row="tableList[this.selectIndex]"
      ></tl-undertaketable>
      <div class="operating-box">
        <div class="flex-auto">
          <el-button
            plain
            @click="summitIgnore"
            v-if="undertakeType == 'change'"
            class="tl-btn amt-border-fadeout"
            >忽略</el-button
          >
        </div>
        <el-button
          type="primary"
          @click="summitUndertake"
          class="tl-btn amt-bg-slip"
          >确定</el-button
        >
        <el-button
          plain
          @click="innerDrawer = false"
          class="tl-btn amt-border-fadeout"
          >取消</el-button
        >
      </div>
    </el-drawer>
    <tl-okr-history
      v-if="hasValue(historyDrawer)"
      :exist.sync="historyDrawer"
      ref="okrhistory"
      :server="server"
      :okrDetailId="okrDetailId"
      :okrmain="okrmain"
    ></tl-okr-history>
  </el-drawer>
</template>

<script>
import process from '@/components/process';
import validateMixin from '@/mixin/validateMixin';
import { mapMutations } from 'vuex';
import okrCollapse from '@/components/okrCollapse';
import okrHistory from '@/components/okrHistory';
import fileUpload from '@/components/fileUpload/index';
import okrForm from './writeOkr/component/okrForm';
import undertakeTable from './writeOkr/component/undertakeTable';
import CONST from '../const';
import Server from '../server';

const server = new Server();

export default {
  name: 'changeOKR',
  mixins: [validateMixin],
  data() {
    return {
      CONST,
      server,
      tableList: [], // okr列表
      okrmain: {}, // 公共信息
      departokrList: [], // 可关联承接的okr
      departokrObject: '{}',
      philosophyList: [], // 价值观
      philosophyObject: '{}',
      selectDeletedId: '',
      reason: {
        modifyReason: '', // 变更原因
      },
      formData: {}, // 提交表单
      innerDrawer: false, // 承接项抽屉
      selectDepartRow: {},
      selectIndex: '', // 当前选择的
      okrMainId: '',
      searchForm: {
        okrStatus: '1',
        periodId: '',
      },
      undertakeType: 'new', // 关联承接类型 new 新加关联 change 变更关联
      okrPeriod: {},
      selectRadioDepart: '',
      myokrDrawer: false,
      detialP: {},
      undertakeP: {},
      originalObject: '{}',
      okrParentId: '',
      historyDrawer: false,
      loading: false,
      fileList: [], // 文件列表
    };
  },
  components: {
    'tl-okrcollapse': okrCollapse,
    'tl-undertaketable': undertakeTable,
    'tl-okrform': okrForm,
    'tl-process': process,
    'tl-okr-history': okrHistory,
    'file-upload': fileUpload,
  },
  props: {
    writeInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    drawerTitle: {
      type: String,
      default: 'OKR变更',
    },
  },
  computed: {
    preIndex() {
      return this.tableList.length;
    },
  },
  mounted() {
    this.searchForm.okrId = this.writeInfo.okrId || '';
    this.searchForm.periodId = this.writeInfo.periodId;
  },
  created() {
  },
  methods: {
    ...mapMutations('common', ['setMyokrDrawer']),
    showOkrDialog() {
      this.searchForm.okrId = this.writeInfo.okrId || '';
      this.searchForm.periodId = this.writeInfo.periodId;
      this.getokrDetail();
      this.myokrDrawer = true;
    },
    closed() {
      if (this.selectIndex != '' && this.tableList[this.selectIndex].hasUpdate) {
        this.$emit('success');
      }
      this.$emit('update:exist', false);
    },
    close() {
      this.myokrDrawer = false;
    },
    // 查okr详情
    getokrDetail() {
      if (this.searchForm.okrId) {
        this.server.getokrDetail({ okrId: this.searchForm.okrId }).then((res) => {
          if (res.code == 200) {
            this.originalObject = JSON.stringify(res.data.okrDetails);
            this.tableList = res.data.okrDetails || [];
            this.okrmain = res.data.okrMain || {};
            this.okrMainId = res.data.okrMain.okrId;
            this.searchForm.okrType = this.okrmain.okrBelongType;
            // this.voteUser = res.data.voteUser;
            // this.tableList.forEach((item) => {
            //   if (item.parentUpdate) {
            //     // 关联承接变更接口
            //     this.getOkrModifyUndertakeOkrList(item);
            //   }
            // });
          }
        });
      }
    },
    // 可变更的关联承接项
    getOkrModifyUndertakeOkrList(okritem) {
      const formData = {
        periodId: this.searchForm.periodId,
        detailId: okritem.detailId,
        okrDetailId: okritem.okrDetailId,
        okrParentId: okritem.okrParentId,
        okrDetailParentVersion: okritem.okrDetailParentVersion,
      };
      this.server.getOkrModifyUndertakeOkrList(formData).then((res) => {
        if (res.code == 200) {
          const modifyUndertakeList = res.data.modifyUndertakeList || [];
          modifyUndertakeList.forEach((item) => {
            item.typeName = item.okrDetailType === 1 ? 'KR' : '目标';
            item.okrKind = item.okrDetailType === 1 ? 'k' : 'o';
            // 是否为当前选中
            if (item.currentOption) {
              okritem.currentOption = item.okrDetailId + item.okrDetailVersion;
            }
          });
          // 将承接项添加到列表里
          okritem.departokrList = res.data.modifyUndertakeList;
        }
      });
    },
    // 打开承接弹窗
    openUndertakepage(data) {
      // 选择o的序号，打开关联承接弹框
      this.selectIndex = parseInt(data.num, 10);
      this.undertakeType = data.type;

      if (!this.tableList[this.selectIndex].undertakeOkrVo) {
        this.tableList[this.selectIndex].undertakeOkrVo = {
          undertakeOkrDetailId: '',
          undertakeOkrVersion: '',
        };
      }
      if (this.tableList[this.selectIndex].currentOption) {
        this.selectRadioDepart = this.tableList[this.selectIndex].currentOption;
      } else if (this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId) {
        // eslint-disable-next-line max-len
        this.selectRadioDepart = this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId + this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion;
      } else {
        // eslint-disable-next-line max-len
        this.selectRadioDepart = this.tableList[this.selectIndex].okrParentId + this.tableList[this.selectIndex].okrDetailParentVersion;
      }
      this.okrParentId = this.tableList[this.selectIndex].okrParentId || '';
      console.log('打开承接弹窗', this.selectRadioDepart);
      this.innerDrawer = true;
    },
    // 忽略
    summitIgnore() {
      // 选择原承接的
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.tableList[this.selectIndex].okrParentId || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrContent = this.tableList[this.selectIndex].parentObjectKr || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.tableList[this.selectIndex].okrDetailParentVersion || '';
      // 清除小叹号
      this.tableList[this.selectIndex].hasUpdate = true;
      // 选中
      this.tableList[this.selectIndex].currentOption = this.tableList[this.selectIndex].okrParentId
      + this.tableList[this.selectIndex].okrDetailParentVersion;
      // 关闭关联承接抽屉并刷新

      this.innerDrawer = false;
      this.$refs.okrCollapse.updateokrCollapse();
      // 取忽略的最新版本
      // let newVersion = '';
      // this.tableList[this.selectIndex].departokrList.forEach((item) => {
      //   if (item.okrDetailId == this.tableList[this.selectIndex].okrParentId && !item.currentOption) {
      //     newVersion = item.okrDetailVersion;
      //   }
      // });
      const undertakeOkrVo = {
        okrDetailId: this.tableList[this.selectIndex].okrDetailId,
        undertakeOkrDetailId: this.tableList[this.selectIndex].okrParentId,
        // undertakeOkrVersion: this.$refs.undertake.newVersion,
      };
      this.server.ignoreUndertake(undertakeOkrVo).then((res) => {
        if (res.code == 200) {
          this.$message.success('忽略成功');
        }
      });
    },
    // 提交关联，给选中的o加上承接项
    summitUndertake() {
      this.selectDepartRow = this.$refs.undertake.selectDepartRow;
      this.selectPhilRow = this.$refs.undertake.selectPhilRow;
      console.log('选择', this.selectPhilRow);
      // eslint-disable-next-line max-len
      // 承接项id、版本、名称
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrDetailId = this.selectDepartRow.okrDetailId || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrContent = this.selectDepartRow.okrDetailObjectKr || '';
      this.tableList[this.selectIndex].undertakeOkrVo.undertakeOkrVersion = this.selectDepartRow.okrDetailVersion || '';

      this.tableList[this.selectIndex].cultureId = this.selectPhilRow.id || '';
      this.tableList[this.selectIndex].cultureName = this.selectPhilRow.cultureName || '';
      // 清除小叹号
      this.tableList[this.selectIndex].hasUpdate = true;
      // 选中
      this.tableList[this.selectIndex].currentOption = this.selectDepartRow.okrDetailId
      + this.selectDepartRow.okrDetailVersion;
      // 关闭关联承接抽屉并刷新
      this.innerDrawer = false;
      this.$refs.okrCollapse.updateokrCollapse();
    },

    validateForm() {
      // 校验是否有更改
      let hasChange = true;
      const originalList = JSON.parse(this.originalObject);
      for (let index = 0; index < originalList.length; index += 1) {
        if (originalList[index].okrDetailObjectKr != this.tableList[index].okrDetailObjectKr) {
          hasChange = false;
          break;
        }
        if (originalList[index].okrWeight != this.tableList[index].okrWeight) {
          hasChange = false;
          break;
        }
        if (this.tableList[index].undertakeOkrVo) {
          hasChange = false;
          break;
        }
        if (this.tableList[index].newkrList && this.tableList[index].newkrList.length > 0) {
          hasChange = false;
          break;
        }
        if (this.$refs.okrform.formData.okrInfoList.length > 0) {
          hasChange = false;
          break;
        }
        for (let krindex = 0; krindex < originalList[index].krList.length; krindex += 1) {
          if (originalList[index].krList[krindex].okrDetailObjectKr
          != this.tableList[index].krList[krindex].okrDetailObjectKr) {
            hasChange = false;
            break;
          }
          if (originalList[index].krList[krindex].okrWeight
          != this.tableList[index].krList[krindex].okrWeight) {
            hasChange = false;
            break;
          }
          if (originalList[index].krList[krindex].checkQuota
          != this.tableList[index].krList[krindex].checkQuota) {
            hasChange = false;
            break;
          }
          if (originalList[index].krList[krindex].judgeMethod
          != this.tableList[index].krList[krindex].judgeMethod) {
            hasChange = false;
            break;
          }
        }
      }

      if (hasChange) {
        this.$xwarning({
          title: '没有已修改的变更项，请勿提交',
          content: '',
        });
        return;
      }
      if (!this.reason.modifyReason) {
        this.$message.error('请填写变更原因');
        return;
      }
      // 校验表单
      const okrformValid = this.$refs.okrform.$refs.dataForm;
      const okrCollapseValid = this.$refs.okrCollapse.$refs.changeForm;
      const reasonValid = this.$refs.reasonForm;
      Promise.all([okrformValid, okrCollapseValid, reasonValid].map(this.getFormPromise)).then((res) => {
        const validateResult = res.every((item) => !!item);
        if (validateResult) {
          console.log('表单都校验通过', validateResult);
          this.summit();
        } else {
          this.$message.error('您有必填项未填');
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
    // 提交更改
    summit() {
      console.log('原来的', this.tableList);
      console.log('新增的', this.$refs.okrform.formData);
      const addList = this.$refs.okrform.formData.okrInfoList;
      const okrInfoList = [];
      this.tableList.forEach((item, index) => {
        let undertakeOkr = {};
        // 新增或变更承接项
        if (item.undertakeOkrVo) {
          undertakeOkr = item.undertakeOkrVo;
          // 原有承接不改变
        } else if (item.okrParentId) {
          undertakeOkr = {
            undertakeOkrDetailId: item.okrParentId,
            undertakeOkrContent: item.parentObjectKr,
            undertakeOkrVersion: item.okrDetailParentVersion,
          };
          console.log('原有承接', undertakeOkr);
          // 无承接
        } else {
          undertakeOkr = null;
        }
        // 整理入参
        okrInfoList.push({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          okrDetailObjectKr: item.okrDetailObjectKr,
          okrWeight: item.okrWeight,
          okrDetailProgress: item.okrDetailProgress,
          cultureId: item.cultureId,
          cultureName: item.cultureName,
          undertakeOkrDto: undertakeOkr,
          krList: [],
        });
        item.krList.forEach((kritem) => {
          okrInfoList[index].krList.push({
            detailId: kritem.detailId,
            okrDetailObjectKr: kritem.okrDetailObjectKr,
            okrWeight: kritem.okrWeight,
            okrDetailProgress: kritem.okrDetailProgress,
            okrDetailConfidence: kritem.okrDetailConfidence,
            checkQuota: kritem.checkQuota,
            judgeMethod: kritem.judgeMethod,
          });
        });
        // 合并新增kr
        if (item.newkrList && item.newkrList.length > 0) {
          okrInfoList[index].krList = okrInfoList[index].krList.concat(item.newkrList);
        }
      });
      // 新增的okr中的支撑项
      addList.forEach((additem) => {
        if (additem.undertakeOkrVo && additem.undertakeOkrVo.undertakeOkrDetailId) {
          additem.undertakeOkrDto = additem.undertakeOkrVo;
        } else {
          additem.undertakeOkrDto = null;
        }
        delete additem.undertakeOkrVo;
      });
      // 拼入参
      this.formData = {
        okrInfoList: okrInfoList.concat(addList),
        periodId: this.searchForm.periodId,
        okrProgress: this.okrmain.okrProgress,
        modifyReason: this.reason.modifyReason,
        okrMainId: this.okrMainId,
        okrBelongType: this.okrmain.okrBelongType,
        attachmentList: this.attachmentList,
      };
      // 校验权重比例
      let opercent = 0;
      let keypercent = 0;
      try {
        this.formData.okrInfoList.forEach((oitem) => {
          opercent += oitem.okrWeight;
          keypercent = 0;
          oitem.krList.forEach((kitem) => {
            // if (!kitem.checkQuota) {
            //   this.$message.error('请填写考核指标');
            //   throw Error();
            // }
            // if (!kitem.judgeMethod) {
            //   this.$message.error('请填写衡量办法');
            //   throw Error();
            // }
            keypercent += kitem.okrWeight;
          });
          if (keypercent != 100) {
            this.$message.error('结果KR权重值总和必须为100');
            throw Error();
          }
        });
        if (opercent != 100) {
          this.$message.error('目标O权重值总和必须为100');
          throw Error();
        }
      } catch (e) {
        return;
      }

      console.log('拼起来后', this.formData);
      this.loading = true;
      this.server.modifyOkrInfo(this.formData).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.updateFile();
          this.$message.success('提交成功，请等待上级领导审批');
          this.close();
          this.$emit('success');
        } else if (res.code === 30000) {
          this.$message.warning('变更申请正在审批中，请勿重复提交');
        }
      });
    },
    // 打开历史版本
    openHistory(id, name) {
      console.log(name);
      this.okrDetailId = id;
      this.historyDrawer = true;
      this.$nextTick(() => {
        this.$refs.okrhistory.show();
      });
    },
    // 文件
    fileChange(data) {
      this.attachmentList = data.list;
      console.log(data);
    },
    // 更新文件状态
    updateFile() {
      const files = this.attachmentList.map((file) => file.resourceId).toString();
      this.server.updateResource({ resourceId: files, sourceType: 'OKRMODIFY' });
    },
  },
  watch: {
  },
};
</script>