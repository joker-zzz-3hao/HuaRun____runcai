<template>
  <div class="my-okr">
    <router-view class="cont-area"></router-view>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="tl-custom-tabs">
          <div class="tab-menus">
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
    } else if (this.roleCode.includes('ORG_ADMIN') && this.userInfo.orgId == 'CR0011000054') {
      this.departmentName = '润联科技';
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
    this.currentIndex = this.$route.name == 'myOkr' ? 0 : 1;
    const borderWidth = document.querySelector('.operating-area .border-slip');
    const selfLeft = document.querySelectorAll('.operating-area .tab-list li')[this.currentIndex].offsetLeft;
    const liWidth = document.querySelectorAll('.operating-area .tab-list li');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[this.currentIndex].offsetWidth}px`;
  },
  methods: {
    goWriteOkr() {
      // 调用接口校验是否可创建
      this.server.checkPrivilege({ operateType: 'add' }).then((res) => {
        if (res.code == 200 && res.data) {
          if (res.data.validFlag) {
            this.writeInfo = {
              canWrite: 'new',
            };
            this.writeokrExist = true;
            this.$nextTick(() => {
              this.$refs.writeokr.showOkrDialog();
            });
          } else {
            this.$message.error(res.data.remark);
          }
        }
      });
    },
    borderSlip(item, index, name) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      console.log('index', document.querySelectorAll('.border-slip'));
      console.log(index, name);
      this.currentIndex = index;
      this.go(name);
    },
  },
  watch: {
  },
};
</script>