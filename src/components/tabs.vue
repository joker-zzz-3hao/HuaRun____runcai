<template>
  <div class="tl-diy-tabs">
    <div class="tab-menus">
      <ul class="tab-list">
        <li
          v-for="(item,idx) in tabMenuList"
          :key="item.id"
          @click="borderSlip(idx)"
          :class="{'is-focus': currentIndex === idx}"
        >{{item.menuName}}</li>
      </ul>
      <div class="border-slip"></div>
    </div>
    <slot name="tabs-cont"></slot>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data() {
    return {
      currentIndex: 0,
      tabMenuList: [
        {
          menuName: '详情',
        },
        {
          menuName: '操作历史',
        },
      ],
    };
  },
  props: {

  },
  mounted() {
    // 状态
    const liWidth = document.querySelectorAll('.diy-drawer .tab-list li');
    const selfLeft = document.querySelectorAll('.diy-drawer .tab-list li')[0].offsetLeft;
    const borderWidth = document.querySelector('.border-slip');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
    console.log(liWidth);
  },
  created() {

  },
  computed: {

  },
  methods: {
    borderSlip(index) {
      const borderWidth = document.querySelector('.border-slip');
      console.log(document.querySelectorAll('.diy-drawer .tab-list li')[0]);
      console.log(index);
      const selfLeft = document.querySelectorAll('.diy-drawer .tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.diy-drawer .tab-list li');
      borderWidth.style.left = `${selfLeft}px`;
      borderWidth.style.width = `${liWidth[index].offsetWidth}px`;
      this.currentIndex = index;
      this.$emit('update:current', index);
    },
  },
  watch: {

  },
};
</script>