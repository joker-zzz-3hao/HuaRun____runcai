<!--
 * @Author: 许志鹏
 * @Date: 2020-08-05 18:44:17
 * @Description: file content
-->
<template>
  <el-dialog
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    center
  >
    <div class="modelCreate">
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="租户名称">
          <el-input style="width:320px" v-model="form.name" placeholder="请输入租户名称"></el-input>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input style="width:320px" v-model="form.name" placeholder="请输入申请人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input style="width:320px" v-model="form.name" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="开放菜单功能">
          <el-tree :data="data" show-checkbox node-key="id"></el-tree>
        </el-form-item>
        <el-form-item label="使用时间">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="innerVisible = true">确定</el-button>
      <el-button @click="close()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  name: 'createTenant',
  props: {
    title: {
      type: String,
      required: true,
    },
    rouleType: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {},
      dialogTableVisible: false,
      dialogVisible: false,
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1',
          }, {
            id: 10,
            label: '三级 1-1-2',
          }],
        }],
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1',
        }, {
          id: 6,
          label: '二级 2-2',
        }],
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1',
        }, {
          id: 8,
          label: '二级 3-2',
        }],
      }],
    };
  },

  mounted() {
    this.dialogTableVisible = true;
  },
  methods: {
    close() {
      this.dialogTableVisible = false;
    },
    closed() {
      this.$emit('update:exist', false);
    },
    showMember() {
      this.dialogVisible = !this.dialogVisible;
    },
  },
};
</script>
<style  scoped>
.modelCreate {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
