import {
  mapState,
  mapMutations,
} from 'vuex';

export default {
  data() {
    return {
      classTagList: [],
      eventsList: [],
      talentList: [],
      systemList: [],
      crList: [],
      subMenuList: [],
      subMenuClassList: [],
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
    ...mapMutations('common', ['setCrMenu', 'setSystemMenu', 'setTalentMenu', 'setUserInfo']),
    init() {
      const self = this;
      console.log(self.userInfo);
      this.setUserInfo(self.userInfo);
      self.crList = [];
      self.systemList = [];
      self.talentList = [];
      self.userInfo.privilegeList.forEach((item) => {
        switch (item.functionCode) {
          // 租户管理员
          // case 'tenant_index':
          //   self.classTagList = [];
          //   self.classTagList.push(item.classTag);
          //   self.eventsList = ['moveMenu', 'leaveMenu'];
          //   self.subMenuList = [];
          //   if (item.children && item.children.length > 0) {
          //     self.eventsList.unshift('isExtend');
          //     item.children.forEach((cItem) => {
          //       self.subMenuClassList = [];
          //       self.subMenuClassList.push(cItem.classTag);
          //       self.subMenuList.push({
          //         subMenuTitle: cItem.functionName,
          //         subClassTag: self.subMenuClassList,
          //         subToName: cItem.resourceUrl,
          //       });
          //     });
          //   } else {
          //     self.eventsList.unshift('rmSubMenu');
          //   }
          //   self.talentList.push({
          //     mainMenuTitle: item.functionName,
          //     classTag: self.classTagList,
          //     toName: item.resourceUrl,
          //     events: self.eventsList,
          //     subMenuList: self.subMenuList,
          //   });
          //   break;
          // 系统管理员
          case 'sys_system':
            self.classTagList = [];
            self.classTagList.push(item.classTag);
            self.eventsList = ['moveMenu', 'leaveMenu'];
            self.subMenuList = [];
            if (item.children && item.children.length > 0) {
              self.eventsList.unshift('isExtend');
              item.children.forEach((cItem) => {
                self.subMenuClassList = [];
                self.subMenuClassList.push(cItem.classTag);
                self.subMenuList.push({
                  subMenuTitle: cItem.functionName,
                  subClassTag: self.subMenuClassList,
                  subToName: cItem.resourceUrl,
                });
              });
            } else {
              self.eventsList.unshift('rmSubMenu');
            }
            self.systemList.push({
              mainMenuTitle: item.functionName,
              classTag: self.classTagList,
              toName: item.resourceUrl,
              events: self.eventsList,
              subMenuList: self.subMenuList,
            });
            // });
            break;
          // 润才
          default:
            self.classTagList = [];
            self.classTagList.push(item.classTag);
            self.eventsList = ['moveMenu', 'leaveMenu'];
            self.subMenuList = [];
            if (item.children && item.children.length > 0) {
              self.eventsList.unshift('isExtend');
              item.children.forEach((cItem) => {
                self.subMenuClassList = [];
                self.subMenuClassList.push(cItem.classTag);
                self.subMenuList.push({
                  subMenuTitle: cItem.functionName,
                  subClassTag: self.subMenuClassList,
                  subToName: cItem.resourceUrl,
                });
              });
            } else {
              self.eventsList.unshift('rmSubMenu');
            }
            self.crList.push({
              mainMenuTitle: item.functionName,
              classTag: self.classTagList,
              toName: item.resourceUrl,
              events: self.eventsList,
              subMenuList: self.subMenuList,
            });
            break;
        }
      });
      console.log(self.systemList);
      self.setCrMenu(self.crList);
      self.setSystemMenu(self.systemList);
      self.setTalentMenu(self.talentList);
    },
  },
};
