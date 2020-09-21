<template>
  <div class="tl-custom-tabs">
    <div class="tab-menus">
      <ul class="tab-list">
        <li
          v-for="(item,idx) in tabMenuList"
          :key="item.id"
          @click="borderSlip(item,idx)"
          :class="{'is-focus': currentIndex === idx}"
        >{{item.menuName}}</li>
      </ul>
      <div class="border-slip"></div>
    </div>
    <slot name="tab-cont"></slot>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data() {
    return {
      currentIndex: 0,

    };
  },
  props: {
    tabMenuList: {
      type: Array,
      defalut() {
        return [];
      },
    },
  },
  mounted() {
    // 状态
    const liWidth = document.querySelectorAll('.custom-drawer .tab-list li');
    const selfLeft = document.querySelectorAll('.custom-drawer .tab-list li')[0].offsetLeft;
    const borderWidth = document.querySelector('.custom-drawer .border-slip');
    borderWidth.style.left = `${selfLeft}px`;
    borderWidth.style.width = `${liWidth[0].offsetWidth}px`;
  },
  created() {

  },
  computed: {

  },
  methods: {
    borderSlip(item, index) {
      const borderWidth = document.querySelector('.custom-drawer .border-slip');
      const selfLeft = document.querySelectorAll('.custom-drawer .tab-list li')[index].offsetLeft;
      const liWidth = document.querySelectorAll('.custom-drawer .tab-list li');
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