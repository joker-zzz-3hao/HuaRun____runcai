<template>
  <div
    class="replay-okr"
    :class="{
      'replay-edit': $route.name == 'replayEdit',
      'replay-communication replay-detail':
        $route.name == 'replayLink' || $route.name == 'replayApproval',
      'replay-detail': $route.name == 'replayDetail',
      'replay-edit replay-detail': $route.name == 'replayScoreDetail',
      'replay-rank': $route.name == 'assessRank',
    }"
  >
    <div
      class="operating-area"
      v-show="
        ['replayList', 'replayScore', 'assessRank', 'replayAssess'].includes(
          $route.name
        )
      "
    >
      <div class="operating-area-inside">
        <div class="tl-custom-tabs">
          <div class="tab-menus">
            <ul class="tab-list">
              <li
                v-for="(item, idx) in tabsList"
                :key="item.menuTitle"
                :class="{ 'is-focus': currentIndex === idx }"
                @click="borderSlip(item, idx)"
              >
                {{ item.menuTitle }}
              </li>
            </ul>
            <div class="border-slip"></div>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'replay',
  data() {
    return {
      currentIndex: 0,
      tabsList: [
        {
          menuTitle: 'OKR复盘',
          toName: 'replayList',
        },
      ],
    };
  },
  components: {
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  created() {
    if (this.roleCode.includes('ORG_ADMIN')) {
      this.tabsList.push({
        menuTitle: '绩效排名',
        toName: 'assessRank',
      });
    }
    if (this.roleCode.includes('TENANT_ADMIN')) {
      this.tabsList.push({
        menuTitle: 'OKR复核得分',
        toName: 'replayScore',
      },
      {
        menuTitle: '绩效复核',
        toName: 'replayAssess',
      });
    }
  },
  mounted() {
    this.tabsList.forEach((item, index) => {
      if (item.toName == this.$route.name) {
        this.currentIndex = index;
      }
    });
    const borderWidth = document.querySelector('.operating-area .border-slip');
    const selfLeft = document.querySelectorAll('.operating-area .tab-list li')[this.currentIndex].offsetLeft;
    const liWidth = document.querySelectorAll('.operating-area .tab-list li');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[this.currentIndex].offsetWidth}px`;
  },
  destroyed() {
    sessionStorage.removeItem('historyPer');
  },
  methods: {
    borderSlip(item, index) {
      const borderWidth = document.querySelector('.border-slip');
      const selfLeft = document.querySelectorAll('.tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      this.currentIndex = index;
      this.go(item.toName);
    },
  },
};
</script>