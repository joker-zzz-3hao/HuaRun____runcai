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
          <template v-for="(item, mindex) in menuList">
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
              </router-link>
              <dd
                class="level-three-menu"
                v-if="showtask && $route.name == 'taskProcess'"
              >
                <el-popover
                  placement="right"
                  trigger="click"
                  :visible-arrow="false"
                  v-model="item.teamvisible"
                >
                  <ul class="tl-popover-list">
                    <li
                      v-for="teamitem in taskoptions[0].children"
                      :key="teamitem.processId"
                      @click="selectProcessItem(mindex, teamitem)"
                      :class="{
                        'is-selected': selectId == teamitem.processId,
                      }"
                    >
                      {{ teamitem.processName }}
                    </li>
                    <li v-if="taskoptions[0].children.length == 0">
                      暂无过程，可以去「过程管理」创建哦
                    </li>
                  </ul>
                  <div
                    slot="reference"
                    :class="{ 'is-selected': selectType == 1 }"
                  >
                    <em>团队使用</em><i class="el-icon-arrow-right"></i>
                  </div>
                </el-popover>
                <el-popover
                  placement="right"
                  trigger="click"
                  :visible-arrow="false"
                  v-model="item.littleRangevisible"
                >
                  <ul class="tl-popover-list">
                    <li
                      v-for="lritem in taskoptions[1].children"
                      :key="lritem.processId"
                      @click="selectProcessItem(mindex, lritem)"
                      :class="{
                        'is-selected': selectId == lritem.processId,
                      }"
                    >
                      {{ lritem.processName }}
                    </li>
                    <li v-if="taskoptions[1].children.length == 0">
                      暂无过程，可以去「过程管理」创建哦
                    </li>
                  </ul>
                  <div
                    slot="reference"
                    :class="{ 'is-selected': selectType == 2 }"
                  >
                    <em>小范围使用</em><i class="el-icon-arrow-right"></i>
                  </div>
                </el-popover>
                <el-popover
                  placement="right"
                  trigger="click"
                  :visible-arrow="false"
                  v-model="item.personvisible"
                >
                  <ul class="tl-popover-list">
                    <li
                      v-for="personitem in taskoptions[2].children"
                      :key="personitem.processId"
                      @click="selectProcessItem(mindex, personitem)"
                      :class="{
                        'is-selected': selectId == personitem.processId,
                      }"
                    >
                      {{ personitem.processName }}
                    </li>
                    <li v-if="taskoptions[2].children.length == 0">
                      暂无过程，可以去「过程管理」创建哦
                    </li>
                  </ul>
                  <div
                    slot="reference"
                    :class="{ 'is-selected': selectType == 3 }"
                  >
                    <em>个人使用</em><i class="el-icon-arrow-right"></i>
                  </div>
                </el-popover>
              </dd>
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
      teamvisible: false,
      littleRangevisible: false,
      personvisible: false,
      selectId: '',
      selectType: 1,
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
              // this.processId = ['1', this.teamList[0].processId];
              this.selectProcessItem(0, this.teamList[0]);
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
    selectProcessItem(index, value) {
      console.log('selectProcessItem', value);
      this.menuList[index].teamvisible = false;
      this.menuList[index].littleRangevisible = false;
      this.menuList[index].personvisible = false;
      this.selectId = value.processId;
      this.selectType = value.processType;
      this.setProcessId(value);
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
        if (newVal == 'taskProcess' && this.showtask) {
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