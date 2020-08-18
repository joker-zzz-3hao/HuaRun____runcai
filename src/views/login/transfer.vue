<template>
  <section class="login-layout">
    <div>登录跳转中......</div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'transfer',
  components: {
  },
  data() {
    return {
      classTagList: [],
      eventsList: [],
      talentList: [],
      systemList: [],
      crList: [],
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      crMenuList: (state) => state.crMenuList,
      talentMenuList: (state) => state.talentMenuList,
      systemMenuList: (state) => state.systemMenuList,
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      console.log(self.userInfo);
      // self.userInfo.forEach((item) => {
      //   switch (item.functionCode) {
      //     // 租户管理员
      //     case 'TENANT':
      //       item.children.forEach((tItem) => {
      //         self.classTagList = [];
      //         self.classTagList.push(tItem.functionCode);
      //         self.eventsList = [];
      //         self.eventsList = tItem.resourceUrl.split(',');
      //         self.talentList.push({
      //           mainMenuTitle: tItem.functionName,
      //           classTag: self.classTagList,
      //           toName: 'overview',
      //           events: self.eventsList,
      //           subMenuList: [],
      //         });
      //       });
      //       break;
      //     // 系统管理员
      //     case 'SYSTEM':
      //       self.systemList = [];
      //       item.children.forEach((tItem) => {
      //         self.classTagList = [];
      //         self.classTagList.push(tItem.functionCode);
      //         self.eventsList = [];
      //         self.eventsList = tItem.resourceUrl.split(',');
      //         self.systemList.push({
      //           mainMenuTitle: tItem.functionName,
      //           classTag: self.classTagList,
      //           toName: 'overview',
      //           events: self.eventsList,
      //           subMenuList: [],
      //         });
      //       });
      //       break;
      //     // 润才
      //     default:
      //       self.crList.push(item);
      //       break;
      //   }
      // });
      self.$router.push({
        name: 'overview',
      });
    },
  },
};
</script>