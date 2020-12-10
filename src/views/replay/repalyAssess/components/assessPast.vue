<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @closed="closed"
    :before-close="close"
    :close-on-click-modal="false"
    class="tl-dialog check-judge"
  >
    <div>
      <dl><dt>组织</dt></dl>
      <dl><dt>负责人</dt></dl>
      <dl><dt>提交时间</dt></dl>
    </div>
    <div>是否已确认沟通:已沟通</div>
    <div>
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table" row-key="id">
            <el-table-column prop="num" label="部门" min-width="165">
            </el-table-column>

            <el-table-column
              prop="num"
              label="负责人"
              min-width="165"
            ></el-table-column>
            <el-table-column
              prop="org"
              label="提交时间"
              min-width="170"
            ></el-table-column>

            <el-table-column prop="user" label="复核时间" min-width="100">
            </el-table-column>
            <el-table-column
              prop="score"
              label="是否已经确认沟通"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="score1"
              label="操作"
              min-width="100"
            >
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <div>
      <el-button @click="submit">提交</el-button>
      <el-button @click="assessPast">驳回</el-button>
    </div>
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
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-assess-person': assessPerson,
  },
  mounted() {
  },
  methods: {

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