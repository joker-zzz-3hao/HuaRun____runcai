<!--
  功能：
  作者：王志任
  时间：2020年08月04日 15:38:15
  备注：
-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      v-if="visible"
      @close="close"
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
            v-for="teamTarget in orgOkrList"
            :label="teamTarget.okrDetailId"
            :key="teamTarget.okrDetailId"
            @change="orgOkrChange(teamTarget)"
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
            @change="personalOkrChange(personalTarget)"
          >
            {{personalTarget.indexText}}
            {{personalTarget.okrDetailObjectKr}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <h4>公司价值观</h4>
        <div v-for="culture in cultureList" :key="culture.id">
          <el-checkbox
            v-model="culture.checked"
            @change="cultureChange(culture)"
          >{{culture.cultureName}}</el-checkbox>
        </div>
      </div>
      <div>
        <el-button @click="confirm">确认</el-button>
        <el-button @click="cancel">取消</el-button>
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

  },
  data() {
    return {
      visible: false,
      loading: false,
      initUserAccount: '',
      myOkrList: [],
      orgOkrList: [],
      originalMyOkrList: [],
      originalOrgOkrList: [],
      selectedOkrList: [],
      cultureList: [],
      selectedCultureList: [],
      supportMyOkrObj: {},
      selectOkrList: [],
      orgSelectData: [],
      personalSelectData: [],
      orgOkr: [],
      personalOkr: [],
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    okrAndCulture() {
      return [...this.myOkrList, ...this.orgOkrList];
    },
  },
  methods: {
    init() {
      this.queryTeamOrPersonalTarget('my');
      this.queryTeamOrPersonalTarget('org');
      this.getValues();
    },
    show() {
      this.visible = true;
    },
    confirm() {
      this.close();
    },
    close() {
      this.visible = false;
      this.$emit('closeOkrDialog', {
        selectedOkrAndCulture: [...this.orgOkr, ...this.personalOkr, ...this.selectedCultureList],
        selectedOkr: [...this.orgOkr, ...this.personalOkr],
        selectedCulture: [...this.selectedCultureList],
        currenItemrandomId: this.currenItemrandomId,
        supportMyOkrObj: this.supportMyOkrObj,
      });
    },
    cancel() {
      this.close();
    },
    initSelectedData() {
      for (const item of this.selectedOkr) {
        // 匹配个人okr
        for (const okr of this.myOkrList) {
          if (item.okrDetailId == okr.okrDetailId) {
            // 反显
            this.personalSelectData = [okr.okrDetailId];
            // 赋值已选项
            this.personalOkr = [okr];
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
            culture.checked = true;
            // 赋值已选项
            this.selectedCultureList.push({
              okrDetailId: culture.id,
              okrDetailObjectKr: culture.cultureName,
            });
          }
        }
      }
    },
    queryTeamOrPersonalTarget(myOrOrg) {
      const params = {
        myOrOrg,
        status: '1',
        orgId: this.userInfo.orgId,
      };
      this.server.queryTeamOrPersonalTarget(params).then((res) => {
        if (res.code == 200) {
          if (myOrOrg == 'my') {
            // 我的目标
            this.myOkrList = [];
            this.originalMyOkrList = res.data.okrDetails;
            this.setMyOrOrgOkrList(this.originalMyOkrList, 'my');
          } else {
            // 团队目标
            this.orgOkrList = [];
            this.originalOrgOkrList = res.data.okrDetails;
            this.setMyOrOrgOkrList(this.originalOrgOkrList, 'org');
          }
        }
      });
    },
    setMyOrOrgOkrList(okrDetails, orgOrMy) {
      let tempResult = this.myOkrList;
      if (orgOrMy == 'org') {
        tempResult = this.orgOkrList;
      }
      let oIndex = 0;
      for (const okr of okrDetails) {
        oIndex += 1;
        okr.indexText = `目标O${oIndex}`;
        okr.checked = false;
        tempResult.push(okr);
        if (okr.krList && okr.krList.length > 0) {
          let krIndex = 0;
          for (const kr of okr.krList) {
            krIndex += 1;
            kr.indexText = `KR${krIndex}`;
            kr.checked = false;
            tempResult.push(kr);
          }
        }
      }
      if (orgOrMy == 'org') {
        this.orgOkrList = [...tempResult];
      } else {
        this.myOkrList = [...tempResult];
      }
    },
    getValues() {
      this.server.getValues().then((res) => {
        if (res.code == 200) {
          this.cultureList = res.data;
        }
      });
    },
    orgOkrChange(okr) {
      this.orgOkr = this.orgSelectData.length > 0 ? [okr] : [];
    },
    personalOkrChange(okr) {
      this.personalOkr = this.personalSelectData.length > 0 ? [okr] : [];
      // 如果是选中kr，则需要将父级目标带到周报页面，用于展示在个人okr完成度部分
      for (const o of this.originalMyOkrList) {
        if (okr.okrDetailId == o.okrDetailId) {
          this.supportMyOkrObj = { o };
        }
        for (const kr of o.krList) {
          if (kr.okrDetailId == okr.okrDetailId) {
            this.supportMyOkrObj = { o, kr: okr };
          }
        }
      }
    },
    cultureChange(culture) {
      if (culture.checked) {
        this.selectedCultureList.push({
          okrDetailId: culture.id,
          okrDetailObjectKr: culture.cultureName,
        });
      } else {
        this.selectedCultureList = this.selectedCultureList.filter((item) => item.okrDetailId != culture.id);
      }
      this.$forceUpdate();
    },
  },
  watch: {
    okrAndCulture: {
      handler(val) {
        if (val && this.myOkrList.length > 0 && this.orgOkrList.length > 0 && this.cultureList.length > 0) {
          if (this.selectedOkr.length > 0) {
            this.initSelectedData();
          }
        }
      },
    },
  },
  updated() {},
  beforeDestroy() {},
};
</script>