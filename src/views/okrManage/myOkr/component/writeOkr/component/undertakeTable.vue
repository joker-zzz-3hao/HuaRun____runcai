<template>
  <el-scrollbar>
    <div class="cont-box">
      <dl v-if="showPhil" class="dl-list">
        <dt class="list-title">
          <em>{{departmentName}}{{periodName}}OKR</em>
          <span>(单选)</span>
        </dt>
        <dd>
          <el-radio-group v-model="selectRadioDepart">
            <el-radio
              @change="selectDepartokr(index,item)"
              class="tl-radio"
              :label="item.okrDetailId"
              v-for="(item,index) in departokrList"
              :key="item.okrDetailId"
            >
              <em :class="item.okrKind == 'o' ? 'kind-o':'kind-k'">{{item.typeName}}</em>
              <em>{{item.okrDetailObjectKr}}</em>
            </el-radio>
          </el-radio-group>
        </dd>
      </dl>

      <dl v-if="showPhil" class="dl-list">
        <dt class="list-title">
          <em>公司管理价值观</em>
          <span>(单选)</span>
        </dt>
        <dd>
          <el-radio-group v-model="selectRadioPhil">
            <el-radio
              @change="selectphilosophy(index,item)"
              class="tl-radio"
              :label="item.id"
              v-for="(item,index) in philosophyList"
              :key="item.id"
            >{{item.cultureDesc}}</el-radio>
          </el-radio-group>
        </dd>
      </dl>
      <dl v-else class="dl-list">
        <dt class="list-title">
          <em>{{departmentName}}{{periodName}}OKR</em>
          <span>(单选)</span>
        </dt>
        <dd>
          <el-radio-group v-model="selectRadioDepart">
            <el-radio
              @change="selectDepartokr(index,item)"
              class="tl-radio"
              :label="item.okrDetailId+item.okrDetailVersion"
              v-for="(item,index) in departokrList"
              :key="item.okrDetailId"
            >
              <em :class="item.okrKind == 'o' ? 'kind-o':'kind-k'">{{item.typeName}}</em>
              <em v-if="item.currentOption">「历史版本{{item.okrDetailVersion}}」(当前选择)</em>
              <em v-else>「最新版本」</em>
              <em>{{item.okrDetailObjectKr}}</em>
              <em v-if="item.modifyReason">变更原因：{{item.modifyReason}}</em>
            </el-radio>
          </el-radio-group>
        </dd>
      </dl>
      <!--
    <el-table :data="departokrList">
      <el-table-column>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checkFlag"
            @change="selectDepartokr(scope.$index, scope.row)"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column width="150" prop="typeName"></el-table-column>
      <el-table-column v-if="!showPhil" width="150" prop="okrDetailVersion">
        <template slot-scope="scope">
          <div v-if="scope.row.currentOption">「历史版本{{scope.row.okrDetailVersion}}」</div>
          <div v-else>「最新版本」</div>
        </template>
      </el-table-column>
      <el-table-column width="150" prop="okrDetailObjectKr">
        <template slot-scope="scope">
          <div>{{scope.row.okrDetailObjectKr}}</div>
          <div v-if="!scope.row.showPhil && scope.row.modifyReason">变更原因：{{scope.row.modifyReason}}</div>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="showPhil" :data="philosophyList">
      <el-table-column>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checkFlag"
            @change="selectphilosophy(scope.$index, scope.row)"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column width="300" prop="cultureDesc"></el-table-column>
      </el-table>-->
    </div>
  </el-scrollbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'undertakeTable',
  props: {
    departokrList: {
      type: Array,
    },
    philosophyList: {
      type: Array,
    },
    showPhil: {
      type: Boolean,
      default: true,
    },
    periodName: {
      type: String,
      default: '',
    },
    selectRadioDepart: {
      type: String,
      default: '',
    },
    selectRadioPhil: {
      type: String,
      default: '',
    },

  },
  data() {
    return {
      selectDepartRow: {},
      selectPhilRow: {},
      departmentName: '',
    };
  },
  created() {
    if (this.roleCode.includes('ORG_ADMIN')) {
      this.departmentName = this.userInfo.orgParentName || '部门';
    } else {
      this.departmentName = this.userInfo.orgName || '部门';
    }
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  methods: {
    // 选择关联的okr
    selectDepartokr(index, row) {
      this.selectDepartRow = row;
    },
    // 选择关联的价值观
    selectphilosophy(index, row) {
      this.selectPhilRow = row;
    },
  },
  watch: {
  },
};
</script>

<style>
</style>