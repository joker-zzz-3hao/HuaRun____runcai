<template>
  <div id="talent">
    <router-view />
  </div>
</template>
<script>
import Server from '@/ajax/server';

const server = new Server();

export default {
  name: 'app',
  data() {
    return {
      server,
      crList: [],
      talentList: [],
      adminList: [],
      classTagList: [],
      eventsList: [],
    };
  },
  mounted() {
    this.server.queryByTenantIdAndUserId().then((res) => {
      console.log(res);
      res.data.forEach((item) => {
        switch (item.functionCode) {
          case 'TENANT':
            item.children.forEach((tItem) => {
              this.classTagList = [];
              this.classTagList.push(tItem.functionCode);
              this.eventsList = [];
              this.eventsList = tItem.resourceUrl.split(',');
              this.talentList.push({
                mainMenuTitle: tItem.functionName,
                classTag: this.classTagList,
                toName: 'overview',
                events: this.eventsList,
                subMenuList: [],
              });
            });
            break;
          case 'SYSTEM':
            this.adminList.push(item.children);
            break;
          default:
            this.crList.push(item);
            break;
        }
      });
    });
  },
};
</script>
