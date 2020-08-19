import { mapState, mapMutations } from 'vuex';

export default {
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
    ...mapMutations('common', ['setCrMenu', 'setSystemMenu', 'setTalentMenu']),
    init() {
      const self = this;
      console.log(self.userInfo);
      self.crList = [];
      self.systemList = [];
      self.talentList = [];
      self.userInfo.privilegeList.forEach((item) => {
        switch (item.functionCode) {
          // 租户管理员
          case 'TENANT':
            item.children.forEach((tItem) => {
              self.classTagList = [];
              self.classTagList.push(tItem.functionCode);
              self.eventsList = ['moveMenu', 'leaveMenu'];
              if (tItem.children && tItem.children.length > 0) {
                self.eventsList.unshift('isExtend');
              } else {
                self.eventsList.unshift('rmSubMenu');
              }
              self.talentList.push({
                mainMenuTitle: tItem.functionName,
                classTag: self.classTagList,
                toName: tItem.resourceUrl,
                events: self.eventsList,
                subMenuList: [],
              });
            });
            break;
          // 系统管理员
          case 'SYSTEM':
            item.children.forEach((tItem) => {
              self.classTagList = [];
              self.classTagList.push(tItem.functionCode);
              self.eventsList = ['moveMenu', 'leaveMenu'];
              if (tItem.children && tItem.children.length > 0) {
                self.eventsList.unshift('isExtend');
              } else {
                self.eventsList.unshift('rmSubMenu');
              }
              self.systemList.push({
                mainMenuTitle: tItem.functionName,
                classTag: self.classTagList,
                toName: tItem.resourceUrl,
                events: self.eventsList,
                subMenuList: [],
              });
            });
            break;
          // 润才
          default:
            self.classTagList = [];
            self.classTagList.push(item.functionCode);
            self.eventsList = ['moveMenu', 'leaveMenu'];
            if (item.children && item.children.length > 0) {
              self.eventsList.unshift('isExtend');
            } else {
              self.eventsList.unshift('rmSubMenu');
            }
            self.crList.push({
              mainMenuTitle: item.functionName,
              classTag: self.classTagList,
              toName: item.resourceUrl,
              events: self.eventsList,
              subMenuList: [],
            });
            break;
        }
      });
      self.crList.push({
        mainMenuTitle: '租户管理',
        classTag: ['tenant-menu'],
        toName: 'organizeManage',
        events: ['rmSubMenu', 'moveMenu', 'leaveMenu'],
        subMenuList: [],
      });
      self.setCrMenu(self.crList);
    },
  },
};
