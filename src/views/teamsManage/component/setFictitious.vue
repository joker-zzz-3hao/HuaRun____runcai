<template>
  <div>
    <el-drawer
      :visible.sync="showSetManager"
      @closed="closed"
      :wrapperClosable="false"
      :modal-append-to-body="true"
      :append-to-body="true"
      custom-class="custom-drawer set-fictitious"
      class="tl-drawer"
      :before-close="close"
    >
      <div slot="title" class="flex-sb">
        <div class="drawer-title">{{ drawerTitle }}</div>
      </div>
      <el-scrollbar>
        <div class="cont-box">
          <div class="tips-info">
            提示：如果您与对方团队的负责人沟通好之后，可以直接设置该成员的虚线汇报关系。
          </div>
          <tl-svgtree
            fatherId="parentId"
            childId="userId"
            :treeData="treeData"
            direction="col"
            svgId="svg01"
            :middlePoint="cardHight"
            :blockHeight="blockHeight"
            :canOpen="false"
          >
            <template slot="treecard" slot-scope="node">
              <tl-card
                :node="node"
                @deleteSuccess="deleteSuccess"
                :userData="userData"
                :orgData="orgData"
                :orgList="orgList"
                @addFictitiousSuccess="addFictitiousSuccess"
              ></tl-card>
            </template>
          </tl-svgtree>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import svgtree from '@/components/svgtree';
import card from './card';

export default {
  name: 'setFictitious',
  components: {
    'tl-svgtree': svgtree,
    'tl-card': card,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    drawerTitle: {
      type: String,
      default: '设置虚线汇报',
    },
  },
  data() {
    return {
      showSetManager: false,
      treeData: [],
      userData: {},
      orgData: [],
      orgList: [],
      cardHight: 50, // 线的位置
      blockHeight: 140,
    };
  },
  mounted() {
    this.server.getOrg().then((res) => {
      if (res.code == '200') {
        this.orgData = res.data;
      }
    });
  },
  computed: {},
  methods: {
    show(data) {
      const self = this;
      self.userData = data;
      self.treeData = [];
      self.showSetManager = true;
      data.parentId = null;
      self.treeData.push(data);
      self.getTreeData(data);
    },
    getTreeData(data) {
      const self = this;
      self.server.listUserAllOrg({ userId: data.userId, orgId: data.orgId }).then((res) => {
        if (res.code == '200') {
          res.data.forEach((item) => {
            item.parentId = data.userId;
            item.userName = item.orgLeader;
            if (item.orgType == '0') {
              self.treeData.unshift(item);
            } else {
              self.treeData.push(item);
            }
          });
          self.orgList = self.treeData;
          if (self.treeData.length < 3) {
            self.treeData.push({
              parentId: data.userId,
              userId: null,
              add: true,
            });
          }
        }
      });
    },
    deleteSuccess() {
      this.treeData = [];
      this.treeData.push(this.userData);
      this.getTreeData(this.userData);
    },
    closed() {
      this.showSetManager = false;
      this.$emit('closed');
    },
    addFictitiousSuccess() {
      this.treeData = [];
      this.treeData.push(this.userData);
      this.getTreeData(this.userData);
    },
  },
  watch: {},
};
</script>