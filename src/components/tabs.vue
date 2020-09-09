<template>
  <div class="tl-diy-tabs">
    <ul class="tab-list">
      <li
        v-for="(item,idx) in tabMenuList"
        :key="item.id"
        @click="borderSlip(item,idx)"
        :class="{'is-focus': currentIndex === idx}"
      >{{item.menuName}}</li>
    </ul>
    <div slot="tabs-cont"></div>
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
  },
  created() {

  },
  computed: {

  },
  methods: {

  },
  watch: {

  },
};
</script>