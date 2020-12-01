<template>
  <div class="replay-okr">
    <div class="operating-area">
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
          menuTitle: 'OKR复核',
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
      this.tabsList = [
        {
          menuTitle: 'OKR复核',
          toName: 'replayList',
        },
        {
          menuTitle: '绩效排名',
          toName: 'replayScore',
        },
      ];
    } else if (this.roleCode.includes('TENANT_ADMIN')) {
      this.tabsList = [
        {
          menuTitle: 'OKR复核',
          toName: 'replayList',
        },
        {
          menuTitle: 'OKR复核得分',
          toName: 'replayScore',
        },
        {
          menuTitle: '绩效复核',
          toName: 'replayScore',
        },
      ];
    } else {
      this.tabsList = [
        {
          menuTitle: 'OKR复核',
          toName: 'replayList',
        },
      ];
    }
  },
  mounted() {
    this.currentIndex = 0;
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
      console.log('qieh', item);
      this.go(item.toName);
    },
  },
};
</script>