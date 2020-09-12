<template>
  <el-scrollbar>
    <div class="cont-box">
      <dl v-if="showPhil" class="dl-list">
        <dt class="list-title">
          <em>{{departmentName}}{{periodName}}</em>
          <span>(单选)</span>
        </dt>
        <dd class="tag-kind">
          <el-radio-group v-model="modelDepart">
            <el-radio
              @click.native="selectDepartokr($event,index,item)"
              class="tl-radio"
              :label="item.okrDetailId"
              v-for="(item,index) in departokrList"
              :key="item.okrDetailId"
            >
              <span :class="item.okrKind == 'o' ? 'kind-parent':'kind-child'">{{item.typeName}}</span>
              <em>{{item.okrDetailObjectKr}}</em>
            </el-radio>
          </el-radio-group>
        </dd>
        <dd class="tag-kind" v-if="departokrList.length < 1">暂无可承接的父目标</dd>
      </dl>
      <dl v-if="showPhil" class="dl-list">
        <dt class="list-title">
          <em>公司管理价值观</em>
          <span>(单选)</span>
        </dt>
        <dd>
          <el-radio-group v-model="modelPhil">
            <el-radio
              @click.native="selectphilosophy($event,index,item)"
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
          <em>{{departmentName}}{{periodName}}</em>
          <span>(单选)</span>
        </dt>
        <dd>
          <el-radio-group v-model="selectRadioDepart">
            <el-radio
              @change="selectDepartokr(index,item)"
              class="tl-radio"
              :label="item.okrDetailId+item.okrDetailVersion"
              v-for="(item,index) in departokrList"
              :key="item.okrDetailId+index"
            >
              <em :class="item.okrKind == 'o' ? 'kind-o':'kind-k'">{{item.typeName}}</em>
              <em v-if="item.currentOption">「历史版本{{item.okrDetailVersion}}」(当前选择)</em>
              <em v-else-if="currentOption.includes(item.okrDetailId)">「最新版本」</em>
              <em>{{item.okrDetailObjectKr}}</em>
              <em v-if="item.modifyReason">变更原因：{{item.modifyReason}}</em>
            </el-radio>
          </el-radio-group>
        </dd>
      </dl>
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
    currentOption: {
      type: String,
      default: '',
    },

  },
  data() {
    return {
      selectDepartRow: {}, // 选择的部门okr
      selectDepartIndex: '', // 当前选择的序号
      selectPhilRow: {}, // 选择的价值观
      selectPhilIndex: '', // 当前价值观序号
      departmentName: '',
      modelDepart: '', // 中转prop
      modelPhil: '', // 中转prop
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
    selectDepartokr(e, index, row) {
      // 原生click会执行两次，第一次在label等，第二次在input
      if (e.target.tagName != 'INPUT') return;
      if (this.selectDepartIndex === index) {
        this.selectDepartIndex = '';
        this.modelDepart = '';
        this.selectDepartRow = '';
      } else {
        this.selectDepartIndex = index;
        this.selectDepartRow = row;
      }
    },

    // 选择关联的价值观
    selectphilosophy(e, index, row) {
      // 原生click会执行两次，第一次在label等，第二次在input
      if (e.target.tagName != 'INPUT') return;
      if (this.selectPhilIndex === index) {
        this.selectPhilIndex = '';
        this.modelPhil = '';
        this.selectPhilRow = '';
      } else {
        this.selectPhilIndex = index;
        this.selectPhilRow = row;
      }
    },
  },
  watch: {
    selectRadioDepart: {
      handler() {
        this.modelDepart = this.selectRadioDepart;
        console.log('如果为空会触发吗', this.selectRadioDepart);
      },
    },
    selectRadioPhil: {
      handler() {
        this.modelPhil = this.selectRadioPhil;
      },
    },
  },
};
</script>