<template>
  <div class="my-okr">
    <router-view class="cont-area"></router-view>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="tl-diy-tabs">
          <ul class="tab-list">
            <li
              v-for="(item,idx) in tabsList"
              :key="item.menuTitle"
              @click="borderSlip(item,idx,item.toName)"
              :class="{'is-focus': currentIndex === idx}"
            >{{item.menuTitle}}</li>
          </ul>
          <div class="border-slip"></div>
        </div>
        <div class="operating-panel">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="goWriteOkr"
            class="tl-btn amt-bg-slip"
          >创建OKR</el-button>
        </div>
      </div>
    </div>
    <el-drawer
      :wrapperClosable="false"
      :modal-append-to-body="true"
      :append-to-body="true"
      :visible.sync="createokrDrawer"
      :before-close="handleClose"
      custom-class="diy-drawer create-okr"
      class="tl-drawer"
    >
      <div slot="title" class="flex-sb">
        <div class="drawer-title">创建OKR</div>
        <div class="icon-save">
          <i></i>
          <em>已自动保存</em>
        </div>
      </div>
      <tl-writeokr v-if="createokrDrawer" :userName="userInfo.userName"></tl-writeokr>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import writeOkr from './component/writeOkr/index';
import Server from './server';

const server = new Server();

export default {
  name: 'okr',
  components: {
    'tl-writeokr': writeOkr,
  },
  data() {
    return {
      server,
      currentIndex: 0,
      tabsList: [
        {
          menuTitle: '我的OKR',
          toName: 'myOkr',
        },
        {
          menuTitle: '部门OKR',
          toName: 'departmentOkr',
        },
      ],
    };
  },
  computed: {
    ...mapState('common', {
      createokrDrawer: (state) => state.createokrDrawer,
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  created() {
    if (this.roleCode.includes('ORG_ADMIN')) {
      this.departmentName = this.userInfo.orgParentName || '部门';
    } else {
      this.departmentName = this.userInfo.orgName || '部门';
    }
    this.tabsList.forEach((item) => {
      if (item.toName == 'departmentOkr') {
        item.menuTitle = `${this.departmentName}OKR`;
      }
    });
  },
  mounted() {
    const liWidth = document.querySelectorAll('.tab-list li');
    const borderWidth = document.querySelector('.border-slip');
    borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
  },
  methods: {
    ...mapMutations('common', ['setCreateokrDrawer']),
    goRoutesss(tab, event) {
      console.log(tab);
      console.log(event);
      this.go(this.activeName);
    },
    goWriteOkr() {
      this.setCreateokrDrawer(true);
    },
    handleClose() {
      this.setCreateokrDrawer(false);
    },
    borderSlip(item, index, name) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      this.currentIndex = index;
      this.go(name);
    },
  },
  watch: {
  },
};
</script>