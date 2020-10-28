<template>
  <div
    class="menu-cont"
    :class="{
      'no-sub-menu': noSubMenu,
      'is-sub-menu': isSubMenu,
      'is-shrink': isShrinkMenus,
    }"
  >
    <div class="menu-cont-inside" :class="{ 'is-zindex': zIndex }">
      <div class="main-menu" :class="{ 'is-main-menu': isMainMenu }">
        <ul>
          <li
            v-for="(item, idx) in menuList"
            :key="item.id"
            :class="[
              item.classTag,
              { 'is-active': item.toName === $route.meta.parentRoute },
              { 'is-hover': menuIndex === idx },
            ]"
            @click="fnHandle(item.events, 0, item.toName)"
          >
            <i></i>
            <em>{{ item.mainMenuTitle }}</em>
          </li>
        </ul>
        <div class="sub-menu" :class="{ 'change-index': changeZindex }">
          <template v-for="item in menuList">
            <dl
              :key="item.id"
              v-if="item.subMenuList"
              :class="{ 'is-focus': item.toName === $route.meta.parentRoute }"
            >
              <dt>{{ item.mainMenuTitle }}</dt>
              <router-link
                tag="dd"
                :key="options.id"
                v-for="options in item.subMenuList"
                :class="[
                  options.subClassTag,
                  {
                    'is-active':
                      selectMenu === options.subToName ||
                      options.subToName === $route.meta.belongsTo,
                  },
                ]"
                :to="{ name: options.subToName }"
              >
                <!-- <i></i> -->
                <span>
                  <em>{{ options.subMenuTitle }}</em>
                </span>
                <el-cascader-panel
                  v-model="processId"
                  :options="taskoptions"
                  v-if="
                    (options.subClassTag == 'taskProcess' ||
                      options.subClassTag == 'taskprocess') &&
                    showtask
                  "
                  @change="selectProcessItem"
                  :props="{
                    value: 'processId',
                    label: 'processName',
                  }"
                ></el-cascader-panel>
              </router-link>
            </dl>
          </template>
          <div
            class="menu-control-button"
            @click="shrinkMenus"
            @mouseover.stop="rmChangeIndex"
          >
            <i></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import Server from '../server';

const server = new Server();
export default {
  name: 'mainMenu',
  data() {
    return {
      server,
      isShrinkMenus: false,
      zIndex: false,
      selectMenu: '',
      menuIndex: '',
      changeZindex: false,
      isMainMenu: false,
      processId: '',
      taskoptions: [{
        processId: '1',
        processName: '团队使用',
        children: [],
      }, {
        processId: '2',
        processName: '小范围使用',
        children: [],
      }, {
        processId: '3',
        processName: '个人使用',
        children: [],
      }],
      showtask: process.env.VUE_APP_PORTAL
                        != 'https://talent.crcloud.com',
    };
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {

  },
  computed: {
    ...mapState('common', {
      listenerWidth: (state) => state.listenerWidth,
    }),
    noSubMenu() {
      return this.$route.meta.noSubMenu;
    },
    isSubMenu() {
      return this.$route.meta.isSubMenu;
    },
  },
  mounted() {},
  methods: {
    ...mapMutations('common', ['setListenerWidth', 'setProcessId']),
    queryTaskProcessList(processType) {
      // 搜索任务过程
      this.server.queryTaskProcessList({
        currentPage: 1,
        pageSize: 1000,
        processType: processType || '',
        enable: 1,
      }).then((res) => {
        if (res.code == 200) {
          if (processType == '1') {
            this.teamList = res.data.content;
            this.taskoptions[0].children = res.data.content;

            if (this.teamList.length > 0) {
              this.processId = ['1', this.teamList[0].processId];
              this.selectProcessItem(this.processId);
            }
          } else if (processType == '2') {
            this.littleRangeList = res.data.content;
            this.taskoptions[1].children = res.data.content;
          } else if (processType == '3') {
            this.personList = res.data.content;
            this.taskoptions[2].children = res.data.content;
          }
        }
      });
    },
    selectProcessItem(value) {
      let processList = [];
      if (value[0] == '1') {
        processList = this.teamList;
      } else if (value[0] == '2') {
        processList = this.littleRangeList;
      } else {
        processList = this.personList;
      }
      const processVal = processList.filter((pitem) => value[1] == pitem.processId)[0] || {};
      console.log('selectProcessItem', processVal);
      this.setProcessId(processVal);
    },
    fnHandle(str, index, parameter) {
      if (str.length > 0 && index < str.length) {
        if (typeof (parameter) === 'string') {
          // eslint-disable-next-line no-eval
          eval(`this.${str[index]}('${parameter}')`);
        } else if (typeof (parameter) === 'number') {
          // eslint-disable-next-line no-eval
          eval(`this.${str[index]}(${parameter})`);
        } else {
          // eslint-disable-next-line no-eval
          eval(`this.${str[index]}(${parameter})`);
        }
      }
    },
    shrinkMenus() {
      this.setListenerWidth(this.listenerWidth + 1);
      this.isShrinkMenus = !this.isShrinkMenus;
      // this.changeZindex = !this.changeZindex;
      this.isMainMenu = true;
    },
    rmSubMenu(routeName) {
      this.go(routeName);
      this.isShrinkMenus = false;
    },
    isExtend(routeName) {
      this.go(routeName);
      if (this.isShrinkMenus) {
        this.isShrinkMenus = false;
      }
    },
    moveMenu(itemIndex) {
      this.menuIndex = itemIndex;
      this.zIndex = true;
    },
    leaveMenu() {
      this.menuIndex = '';
      this.zIndex = false;
    },
    changeIndex() {
      if (!this.changeZindex) {
        this.changeZindex = true;
        if (this.isMainMenu) {
          this.isMainMenu = false;
        }
      }
    },
    rmChangeIndex() {
      if (this.changeZindex) {
        this.changeZindex = false;
        console.log(2222);
      }
    },
  },
  watch: {
    '$route.name': {
      handler(newVal) {
        this.selectMenu = newVal;
        if (newVal == 'taskProcess') {
          this.queryTaskProcessList('1');
          this.queryTaskProcessList('2');
          this.queryTaskProcessList('3');
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>