<template>
  <div class="okr-permissions">
    <div class="operating-area">
      <div class="page-title">设置OKR</div>
      <div class="operating-box"></div>
    </div>
    <div class="cont-area">
      <div class="cont-panel">
        <dl class="dl-list" v-for="(item,index) in setList" :key="item.id">
          <dt v-if="item.configTypeDetail=='O-1'">
            <em>OKR</em>
            <span>设置（OKR 的查看权限）</span>
          </dt>
          <dt v-if="item.configTypeDetail=='O-2'">
            <em>OKR</em>
            <span>是否可编辑</span>
          </dt>
          <dt v-if="item.configTypeDetail=='O-3'">
            <em>OKR</em>
            <span>是否开启OKR审核</span>
          </dt>
          <dd v-if="item.configTypeDetail=='O-1'">
            <el-radio v-model="radio[index]" label="O" class="tl-radio">整个公司的人，能够互相查看彼此的周报</el-radio>
            <el-radio
              v-model="radio[index]"
              label="S"
              class="tl-radio"
            >仅部门队友，能够互相查看彼此的周报( 部门队友=部门负责人+部门成员+直接下级部门负责人 )</el-radio>
          </dd>
          <dd v-if="item.configTypeDetail=='O-2'||item.configTypeDetail=='O-3'">
            <el-radio v-model="radio[index]" label="O" class="tl-radio">开启</el-radio>
            <el-radio v-model="radio[index]" label="S" class="tl-radio">关闭</el-radio>
          </dd>
        </dl>
      </div>
      <div class="operating-box">
        <el-button
          type="primary"
          :disabled="BtnDisabled"
          @click="getSave"
          class="tl-btn amt-bg-slip"
        >保存更改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Server from './server';

const server = new Server();
export default {
  name: 'okrPermissions',
  data() {
    return {
      ruleForm: {},
      server,
      radio: [],
      setList: [],
      sysConfigDtos: [],
      BtnDisabled: true,
    };
  },
  created() {
    this.getOkrCycle();
  },
  methods: {
    getOkrCycle() {
      this.server.configQuery({
        configType: 'OKR',
        level: 'T',
        sourceId: 'CR00110000-TEST',
      })
        .then((res) => {
          this.setList = res.data;
          this.setList.forEach((item, index) => {
            this.radio[index] = item.configItemCode;
          });
        });
    },
    getSave() {
      const sysConfigDtos = this.setList.map((item, index) => ({
        configId: item.configId,
        configItemCode: this.radio[index],
      }));
      this.server.addOrUpdate(
        sysConfigDtos,
      ).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  watch: {
    radio: {
      handler() {
        this.BtnDisabled = false;
      },
      deep: true,
    },
  },
  components: {
  },
};
</script>