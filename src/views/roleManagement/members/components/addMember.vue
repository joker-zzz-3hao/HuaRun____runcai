<!--
 * @Author: 许志鹏
 * @Date: 2020-08-04 18:02:57
 * @Description: file content
-->
<template>
  <el-dialog
    @click.native="closeshowMember"
    :modal-append-to-body="false"
    :before-close="close"
    @closed="closed"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogTableVisible"
    center
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input style="width:320px" v-model="form.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="选择成员" class="addMember">
        <div class="roulemember">
          <tl-select-member @click.native.stop></tl-select-member>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="innerVisible = true">确定</el-button>
      <el-button @click="close()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import selectMember from './selectMember';

export default {
  name: 'home',
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
      form: {
        region: [],
      },
      dialogTableVisible: false,
      dialogVisible: false,
      data: [{
        id: 1,
        label: '企业管理',
        children: [{
          id: 4,
          label: '租户管理',
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
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  components: {
    'tl-select-member': selectMember,
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
    closeshowMember() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style  scoped>
.addMember {
  position: relative;
}
.roulemember {
  width: 100%;
}
</style>
