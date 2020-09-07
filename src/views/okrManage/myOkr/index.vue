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
        <div class="operating-box">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="goWriteOkr"
            class="tl-btn amt-bg-slip"
          >创建OKR</el-button>
        </div>
      </div>
    </div>
    <tl-writeokr
      ref="writeokr"
      :exist.sync="writeokrExist"
      v-if="writeokrExist"
      :userName="userInfo.userName"
      :writeInfo="writeInfo"
      @success="searchOkr(searchForm.status)"
    ></tl-writeokr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      writeokrExist: false,
      writeInfo: {},
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  created() {
    if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgParentName) {
      this.departmentName = this.userInfo.orgParentName;
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
    const routeIndex = this.$route.name == 'myOkr' ? 0 : 1;
    const liWidth = document.querySelectorAll('.tab-list li');
    const selfLeft = document.querySelectorAll('.tab-list li')[routeIndex].offsetLeft;
    const borderWidth = document.querySelector('.border-slip');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[routeIndex].offsetWidth}px`;
    this.currentIndex = routeIndex;
    console.log('rote', this.currentIndex, routeIndex, this.$route.name);
  },
  methods: {
    goRoutesss(tab, event) {
      console.log(tab);
      console.log(event);
      this.go(this.activeName);
    },
    goWriteOkr() {
      this.writeInfo = {
        canWrite: 'new',
      };
      this.writeokrExist = true;
      this.$nextTick(() => {
        this.$refs.writeokr.showOkrDialog();
      });
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
    '$route.name': {
      handler(newVal) {
        const routeIndex = newVal == 'myOkr' ? 0 : 1;
        const liWidth = document.querySelectorAll('.tab-list li');
        const selfLeft = document.querySelectorAll('.tab-list li')[routeIndex].offsetLeft;
        const borderWidth = document.querySelector('.border-slip');
        borderWidth.style.left = `${selfLeft}px`;
        borderWidth.style.width = `${liWidth[routeIndex].offsetWidth}px`;
      },
      immediate: true,
    },
  },
};
</script>