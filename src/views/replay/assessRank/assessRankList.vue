<template>
   <div class="replay-list">
    <div class="operating-box">
      <dl class="dl-item">
        <dt>周期</dt>
        <dd>
          <el-select
            :disabled="periodIdList.length == 0"
            v-model.trim="periodId"
            placeholder="用户类型"
            :popper-append-to-body="false"
            @change="okrReviewList"
            popper-class="tl-select-dropdown"
            class="tl-select"
          >
            <el-option
              :label="item.periodName"
              :value="item.periodId"
              v-for="(item, index) in periodIdList"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>

    </div>
    <div class="cont-area">
      <div>部门总数：11</div>
       <div>待复核：11</div>
       <div>绩效符合状态：驳回</div>
          <div>驳回原因：XXXXXXXXXXXXXXXX</div>
       <div>复合时间：2020-10-11</div>
        <div>绩效系数：1.5分3个 1.25分4个</div>
         <div>复合时间：2020-10-11</div>
         <el-button type="text" @click="showbeforeList">查看历史提交记录</el-button>
    </div>
    <div>调整，你好部门绩效需等到整体符合结束后，您才可以进行调整，请等待，谢谢</div>
      <div class="cont-area">
               <tl-crcloud-table
               :isPage="false"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table tableSort" row-key="id" >
             <el-table-column
              prop="num"
              label="排序"
              min-width="165"
            >
            <template slot-scope="scope">
              <el-button type="text" @click="upGo(tableData,scope.$index)">向上</el-button>
                 <el-button type="text" @click="downGo(tableData,scope.$index)">向下</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="num"
              label="序号"
              min-width="165"
            ></el-table-column>
            <el-table-column
              prop="org"
              label="部门"
              min-width="170"
            ></el-table-column>

            <el-table-column
              prop="user"
              label="负责人"
              min-width="100"
            >
            </el-table-column>
             <el-table-column
              prop="score"
              label="自评得分"
              min-width="100"
            >
            </el-table-column>
               <el-table-column
              prop="score1"
              label="复合得分"
              min-width="100"
            >
            </el-table-column>
              <el-table-column
              prop="scorelist"
              label="绩效系数分配"
              min-width="100"
            >
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <rank-before-list ref="beforeList"></rank-before-list>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
// eslint-disable-next-line import/no-extraneous-dependencies
import Sortable from 'sortablejs';
import Server from '../server';
import RankBeforeList from './components/RankBeforeList';

const server = new Server();
export default {
  name: 'repalyAssessList',
  components: {
    'tl-crcloud-table': crcloudTable,
    'rank-before-list': RankBeforeList,
  },
  data() {
    return {
      periodIdList: [],
      server,
      periodId: '',
      tableData: [{
        id: 1,
        num: 1,
        org: '行云',
        user: '大哥',
        score: '1',
        score1: '22',
        scorelist: 'A',
      }, {
        id: 2,
        num: 2,
        org: '盘云',
        user: '大的哥',
        score: '1',
        score1: '22',
        scorelist: 'B',
      }, {
        id: 3,
        num: 3,
        org: '牛云',
        user: '大小哥',
        score: '1',
        score1: '22',
        scorelist: 'C',
      }, {
        id: 4,
        num: 4,
        org: '海云',
        user: '大哥',
        score: '1',
        score1: '22',
        scorelist: 'D',
      }, {
        id: 5,
        num: 5,
        org: '熊云',
        user: '大哥为',
        score: '1',
        score1: '22',
        scorelist: 'E',
      }],
    };
  },
  mounted() {
    this.getSort();
    this.getOkrCycleList();
  },
  methods: {
    getSort() {
      const table = document.querySelector('.el-table__body-wrapper tbody');
      const self = this;
      Sortable.create(table, {
        onEnd({ newIndex, oldIndex }) {
        //  console.log(newIndex, oldIndex);
          const targetRow = self.tableData.splice(oldIndex, 1)[0];
          self.tableData.splice(newIndex, 0, targetRow);

          self.setNewList(self.tableData);
        },
      });
    },
    setNewList(tableData) {
      tableData.forEach((item, index) => {
        this.$set(tableData[index], 'num', index + 1);
      });
    },
    setSort() {
      // 表格中需要实现行拖动，所以选中tr的父级元素
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]; // table
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData(dataTransfer) {
          dataTransfer.setData('Text', '');
        },
        onEnd: (evt) => {
          // console.log(this.data) //:data="data" 所有数据
          const targetRow = this.data.splice(evt.oldIndex, 1)[0]; // this.data是表格所有数据
          // console.log(targetRow) // 挪动是单个数据
          this.data.splice(evt.newIndex, 0, targetRow);
          console.log(this.tableData);
        },
      });
    },
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;

        this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
      });
    },
    okrReviewList() {},
    // 向上移动
    upGo(fieldData, index) {
      if (index != 0) {
        // eslint-disable-next-line prefer-destructuring
        fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
      } else {
        fieldData.push(fieldData.shift());
      }
      this.setNewList(fieldData);
    },
    // 向下移动
    downGo(fieldData, index) {
      if (index != fieldData.length - 1) {
        // eslint-disable-next-line prefer-destructuring
        fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
      } else {
        fieldData.unshift(fieldData.splice(index, 1)[0]);
      }
      this.setNewList(fieldData);
    },
    showbeforeList() {
      this.$refs.beforeList.show();
    },

  },

};
</script>

<style>
</style>