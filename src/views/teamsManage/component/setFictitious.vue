<template>
  <div>
    <el-drawer
      title="设置虚拟汇报"
      :visible.sync="showSetManager"
      :with-header="true"
      @closed="closed"
      :modal="false"
      :append-to-body="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="true"
      class="tl-drawer"
    >
      <div>
        <tl-svgtree
          fatherId="parentId"
          childId="userId"
          :treeData="treeData"
          direction="col"
          svgId="svg01"
        >
          <template slot="treecard" slot-scope="node">
            <tl-card
              :node="node"
              @deleteSuccess="deleteSuccess"
              :userData="userData"
              :orgData="orgData"
              @addFictitiousSuccess="addFictitiousSuccess"
            ></tl-card>
          </template>
        </tl-svgtree>
      </div>
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
  },
  data() {
    return {
      showSetManager: true,
      treeData: [],
      userData: {},
      orgData: [],
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
            self.treeData.push(item);
          });
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