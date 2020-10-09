<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="close"
      title="添加成员"
      :close-on-click-modal="false"
    >
      <el-select
        v-model="keyword"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="filterMembers"
        :loading="loading"
        @change="changeMember"
      >
        <el-option
          v-for="item in membersList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column
              prop="name"
              label="姓名"
              min-width="140"
            ></el-table-column>
            <el-table-column prop="level" label="级别" min-width="140">
              <template slot-scope="scope">
                <el-select v-model="scope.row.level" placeholder="请选择级别">
                  <el-option
                    v-for="item in CONST.LEVEL_LIST"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="funcName" label="职能" min-width="140">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.funcName"
                  placeholder="请选择职能"
                >
                  <el-option
                    v-for="item in CONST.FUNC_LIST"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="departName"
              label="所属部门"
              min-width="140"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click="deleteMember(scope.$index)"
                  type="text"
                  class="tl-btn"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="addMembers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import CONST from '../../const';

export default {
  name: 'addMember',
  data() {
    return {
      CONST,
      visible: false,
      loading: false,
      keyword: '',
      membersList: [
        {
          value: '0', name: '赵子龙', departName: '蜀国', level: '五虎上将', time: '2020-09-10',
        },
        {
          value: '1', name: '马孟起', departName: '蜀国', level: '五虎上将', time: '2020-09-10',
        },
        {
          value: '2', name: '黄汉升', departName: '蜀国', level: '五虎上将', time: '2020-09-10',
        },
        {
          value: '3', name: '关云长', departName: '蜀国', level: '五虎上将', time: '2020-09-10',
        },
        {
          value: '4', name: '张翼德', departName: '蜀国', level: '五虎上将', time: '2020-09-10',
        },
        {
          value: '5', name: '张文远', departName: '魏国', level: '五子良将', time: '2020-09-10',
        },
        {
          value: '6', name: '于文则', departName: '魏国', level: '五子良将', time: '2020-09-10',
        },
        {
          value: '7', name: '徐公明', departName: '魏国', level: '五子良将', time: '2020-09-10',
        },
        {
          value: '8', name: '张儁乂', departName: '魏国', level: '五子良将', time: '2020-09-10',
        },
        {
          value: '9', name: '乐文谦', departName: '魏国', level: '五子良将', time: '2020-09-10',
        },
      ],
      tableData: [],
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {
    show() {
      this.visible = true;
      this.tableData = [];
    },
    close() {
      this.visible = false;
    },
    deleteMember(index) {
      this.tableData.splice(index, 1);
    },
    changeMember(data) {
      this.membersList.forEach((item) => {
        if (item.value == data) {
          this.tableData.push(item);
        }
      });
    },
    addMembers() {
      this.server.addMembers({
        addMembers: this.tableData,
      }).then((res) => {
        if (res.code == '200') {
          this.$emit('addSuccess');
          this.visible = false;
        }
      });
    },
    filterMembers(param) {
      this.membersList = [];
      this.server.queryMembers({
        param,
      }).then((res) => {
        if (res.code == '200') {
          this.membersList = res.data;
        }
      });
    },
  },
  watch: {},
};
</script>