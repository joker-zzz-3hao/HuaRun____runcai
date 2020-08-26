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
        <div v-for="teamTarget in orgOkrList" :key="teamTarget.okrDetailId">
          <el-checkbox v-model="teamTarget.checked" @change="orgOkrChange(teamTarget)">
            <span>{{teamTarget.indexText}}</span>
            {{teamTarget.okrDetailObjectKr}}
          </el-checkbox>
        </div>
      </div>
      <div>
        <h4>个人目标</h4>
        <div v-for="personalTarget in myOkrList" :key="personalTarget.okrDetailId">
          <el-checkbox v-model="personalTarget.checked" @change="orgOkrChange(personalTarget)">
            <span>{{personalTarget.indexText}}</span>
            {{personalTarget.okrDetailObjectKr}}
          </el-checkbox>
        </div>
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

  },
  data() {
    return {
      visible: false,
      loading: false,
      initUserAccount: '',
      myOkrList: [],
      orgOkrList: [],
      okrIdList: [],
      cultureList: [],
      cultureIdList: [],
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
    close(status) {
      this.visible = false;
      this.$emit('closeOkrDialog', { refreshPage: status == 'refreshPage' });
    },
    cancel() {
      this.close();
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
            this.setMyOrOrgOkrList(res.data.okrDetails, 'my');
          } else {
            // 团队目标
            this.orgOkrList = [];
            this.setMyOrOrgOkrList(res.data.okrDetails, 'org');
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
        this.orgOkrList = tempResult;
      } else {
        this.myOkrList = tempResult;
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
      if (okr.checked) {
        this.okrIdList.push(okr.okrDetailId);
      } else {
        this.okrIdList = this.okrIdList.filter((orgId) => orgId != okr.okrDetailId);
      }
      this.$forceUpdate();
      console.log(this.okrIdList);
    },
    cultureChange(culture) {
      if (culture.checked) {
        this.cultureIdList.push(culture.id);
      } else {
        this.cultureIdList = this.cultureIdList.filter((cultureId) => cultureId != culture.id);
      }
      console.log(this.cultureIdList);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>