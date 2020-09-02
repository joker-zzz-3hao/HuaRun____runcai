<template>
  <div class="okr-permissions">
    <div class="operating-area">
      <div class="page-title">设置公司价值观</div>
      <div class="operating-panel"></div>
    </div>
    <div class="cont-area">
      <div class="cont-panel">
        <el-button type="primary" @click="createOrEdit('0',{})" class="tl-btn amt-bg-slip">创建</el-button>
        <div style="display: flex;">
          <div class="header-class">公司价值观</div>
          <div class="header-class">价值观详情</div>
          <div class="header-class">更新时间</div>
          <div class="header-class">操作</div>
        </div>
        <div v-for="item in tableData" :key="item.id" style="display: flex;">
          <div class="header-class">{{item.cultureName}}</div>
          <div class="header-class">{{item.cultureDesc}}</div>
          <div class="header-class">{{item.updateTime}}</div>
          <div class="header-class">
            <el-button @click="createOrEdit('1',item)" type="text" class="tl-btn">编辑</el-button>
            <el-button @click="deleteWorth(item)" type="text" class="tl-btn">删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <tl-addOrEditWorth v-if="exist" ref="addOrEditWorth" :exist="exist" @success="addOrEditSuccess"></tl-addOrEditWorth>
  </div>
</template>

<script>
import addOrEditWorth from './components/addOrEditWorth';
import Server from './server';

const server = new Server();
export default {
  name: 'setWorth',
  data() {
    return {
      server,
      exist: false,
      tableData: [],
    };
  },
  components: {
    'tl-addOrEditWorth': addOrEditWorth,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.server.queryCultureList().then((res) => {
        if (res.code == '200') {
          this.tableData = res.data;
        }
      });
    },
    addOrEditSuccess() {
      this.exist = false;
      this.init();
    },
    createOrEdit(type, data) {
      this.exist = true;
      this.$nextTick(() => {
        this.$refs.addOrEditWorth.show(type, data);
      });
    },
    deleteWorth(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该数据，删除将无法恢复',

      }).then(() => {
        this.server.deleteCulture({
          id: data.id,
        }).then((res) => {
          if (res.code == '200') {
            this.init();
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.header-class {
  width: 200px;
  height: 80px;
  border-top: 1px solid #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>