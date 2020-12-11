<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog check-judge"
  >
    <div>
      <dl><dt>组织</dt></dl>
      <dl><dt>负责人</dt></dl>
      <dl><dt>提交时间</dt></dl>
      <dl><dt>复核结果</dt></dl>
      <dl><dt>复核人</dt></dl>
      <dl><dt>绩效复核时间</dt></dl>
    </div>
    <tl-crcloud-table :isPage="false">
      <div slot="tableContainer" class="table-container">
        <el-table :data="tableData" class="tl-table" row-key="id">
          <el-table-column prop="num" label="序号"> </el-table-column>
          <el-table-column prop="num" label="部门"> </el-table-column>
          <el-table-column prop="num" label="负责人"></el-table-column>
          <el-table-column prop="org" label="自评得分"></el-table-column>
          <el-table-column prop="user" label="OKR最终得分"> </el-table-column>
          <el-table-column prop="score" label="绩效系数分配" min-width="100">
          </el-table-column>
          <el-table-column prop="score1" label="调整原因" min-width="100">
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
    <tl-assess-person ref="assessPerson"></tl-assess-person>
  </el-dialog>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import assessPerson from './assessPerson';
import Server from '../../server';

const server = new Server();
export default {
  name: 'repalyAssessList',
  data() {
    return {
      periodIdList: [],
      periodId: '',
      server,
      visible: false,
      dialogType: 'detail',
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-assess-person': assessPerson,
  },
  mounted() {
  },
  methods: {
    show(type) {
      this.visible = true;
      this.dialogType = type;
    },
    close() {
      this.visible = false;
    },
    submit() {
      this.$xconfirm({
        title: '',
        content: '确认后，部门将按照当前绩效结果分配',
      });
    },
    assessPast() {
      this.$refs.assessPerson.show();
    },
  },
};
</script>

<style>
</style>