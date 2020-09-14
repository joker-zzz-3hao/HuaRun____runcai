<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible.sync="visible"
      :before-close="close"
      @closed="closed"
      title="支撑OKR/价值观"
      :close-on-click-modal="false"
    >
      <div>
        <!-- <span>选择团队</span>
        <el-select v-model="team">
          <el-option v-for="item in " :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>-->
        <span>
          <span>团队：</span>
          <span>{{userInfo.orgName}}</span>
        </span>
        <span style="marginLeft:100px">
          <span>个人：</span>
          <span>{{userInfo.userName}}</span>
        </span>
      </div>
      <div>
        <h4>团队目标</h4>
        <el-checkbox-group v-model="orgSelectData" :min="0" :max="1">
          <el-checkbox
            :class="{'move-to-right':teamTarget.okrType = 'KR'}"
            v-for="teamTarget in orgOkrList"
            :label="teamTarget.okrDetailId"
            :key="teamTarget.okrDetailId"
            @change="orgOkrChange"
          >
            {{teamTarget.indexText}}
            {{teamTarget.okrDetailObjectKr}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <h4>个人目标</h4>
        <el-checkbox-group v-model="personalSelectData" :min="0" :max="1">
          <el-checkbox
            v-for="personalTarget in myOkrList"
            :label="personalTarget.okrDetailId"
            :key="personalTarget.okrDetailId"
            @change="personalOkrChange"
          >
            {{personalTarget.indexText}}
            {{personalTarget.okrDetailObjectKr}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <h4>公司价值观</h4>
        <el-checkbox-group v-model="valueSelectData">
          <el-checkbox
            v-for="culture in cultureList"
            :label="culture.id"
            :key="culture.id"
            @change="cultureChange"
          >{{culture.cultureName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <el-button @click="confirm">确认</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'addOkr',
  components: {
  },
  props: {
    server: {
      type: Object,
      default() {
        return { };
      },
    },
    currenItemrandomId: {
      type: String,
      default() {
        return '';
      },
    },
    selectedOkr: {
      type: Array,
      default() {
        return [];
      },
    },
    myOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    orgOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    originalMyOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    originalOrgOkrList: {
      type: Array,
      default() {
        return [];
      },
    },
    cultureList: {
      type: Array,
      default() {
        return [];
      },
    },

  },
  data() {
    return {
      visible: false,
      loading: false,
      initUserAccount: '',
      selectedOkrList: [],
      // cultureList: [],
      selectedCultureList: [],
      supportMyOkrObj: {},
      selectOkrList: [],
      orgSelectData: [], // 团队目标
      personalSelectData: [], // 个人目标
      valueSelectData: [], // 价值观
      orgOkr: [],
      personalOkr: [],
    };
  },
  created() {

  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    init() {
      this.initSelectedData();
    },
    show() {
      this.visible = true;
    },
    confirm() {
      this.visible = false;
      this.$emit('closeOkrDialog', {
        selectedOkrAndCulture: [...this.orgOkr, ...this.personalOkr, ...this.selectedCultureList],
        selectedOkr: [...this.orgOkr, ...this.personalOkr],
        selectedCulture: [...this.selectedCultureList],
        currenItemrandomId: this.currenItemrandomId,
        supportMyOkrObj: this.supportMyOkrObj,
      });
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:showAddOkr', false);
    },
    initSelectedData() {
      this.valueSelectData = [];
      for (const item of this.selectedOkr) {
        // 匹配个人okr
        for (const okr of this.myOkrList) {
          if (item.okrDetailId == okr.okrDetailId) {
            // 反显
            this.personalSelectData = [okr.okrDetailId];
            // 赋值已选项
            this.personalOkr = [okr];
            // ************支撑项初始化*****************
            for (const o of this.originalMyOkrList) {
              if (okr.okrDetailId == o.okrDetailId) {
                this.supportMyOkrObj = { o };
              }
              for (const kr of o.krList) {
                if (kr.okrDetailId == okr.okrDetailId) {
                  this.supportMyOkrObj = { o, kr };
                }
              }
            }
          }
        }
        // 匹配团队okr
        for (const okr of this.orgOkrList) {
          if (item.okrDetailId == okr.okrDetailId) {
            // 反显
            this.orgSelectData = [okr.okrDetailId];
            // 赋值已选项
            this.orgOkr = [okr];
          }
        }
        // 匹配价值观
        for (const culture of this.cultureList) {
          if (item.okrDetailId == culture.id) {
            // 反显
            this.valueSelectData.push(item.okrDetailId);
            // 赋值已选项
            this.selectedCultureList.push({
              okrDetailId: culture.id,
              okrDetailObjectKr: culture.cultureName,
            });
          }
        }
      }

      this.$forceUpdate();
    },
    orgOkrChange(isSelected) {
      if (isSelected) {
        this.orgOkrList.forEach((element) => {
          if (element.okrDetailId == this.orgSelectData) {
            this.orgOkr = [element];
          }
        });
      } else {
        this.orgOkr = [];
      }
    },
    personalOkrChange(isSelected) {
      if (isSelected) {
        this.myOkrList.forEach((element) => {
          if (element.okrDetailId == this.personalSelectData) {
            this.personalOkr = [element];
          }
        });
        // 如果是选中kr，则需要将父级目标带到周报页面，用于展示在个人okr完成度部分
        for (const o of this.originalMyOkrList) {
          if (this.personalOkr[0].okrDetailId == o.okrDetailId) {
            this.supportMyOkrObj = { o };
          }
          for (const kr of o.krList) {
            if (kr.okrDetailId == this.personalOkr[0].okrDetailId) {
              this.supportMyOkrObj = { o, kr };
            }
          }
        }
      } else {
        this.personalOkr = [];
        this.supportMyOkrObj = {};
      }
    },
    cultureChange() {
      this.selectedCultureList = [];
      this.valueSelectData.forEach((element) => {
        this.cultureList.forEach((item) => {
          if (element == item.id) {
            this.selectedCultureList.push({
              okrDetailId: item.id,
              okrDetailObjectKr: item.cultureName,
            });
          }
        });
      });
      this.$forceUpdate();
    },
  },
  watch: {
  },
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
/* .move-to-right {
  margin-left: 100px;
} */
</style>