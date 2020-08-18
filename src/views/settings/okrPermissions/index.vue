<template>
  <div class="okr-permissions">
    <div class="operating-area">
      <div class="page-title">设置OKR</div>
      <div class="operating-panel"></div>
    </div>
    <div class="cont-area">
      <dl>
        <dt></dt>
        <dd></dd>
        <dd></dd>
      </dl>
      <!-- <div class="setmodel" v-for="(item,index) in setList" :key="index">
        <div v-if="item.configTypeDetail=='O-1'">OKR 设置 (OKR 的查看权限)</div>
        <div v-if="item.configTypeDetail=='O-2'">OKR 是否可编辑</div>
        <div v-if="item.configTypeDetail=='O-3'">OKR 是否开启OKR审核</div>
        <div v-if="item.configTypeDetail=='O-1'" class="setRadio">
          <el-radio v-model="radio[index]" label="O">整个公司的人，能够互相查看彼此的周报</el-radio>
          <el-radio v-model="radio[index]" label="S">仅部门队友，能够互相查看彼此的周报( 部门队友=部门负责人+部门成员+直接下级部门负责人 )</el-radio>
        </div>
        <div v-if="item.configTypeDetail=='O-2'||item.configTypeDetail=='O-3'" class="setRadio">
          <el-radio v-model="radio[index]" label="O">开启</el-radio>
          <el-radio v-model="radio[index]" label="S">关闭</el-radio>
        </div>
      </div>

      <div class="setsave">
        <el-button type="primary" @click="getSave">保存更改</el-button>
      </div>-->
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
  components: {
  },
};
</script>