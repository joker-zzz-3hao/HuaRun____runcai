<template>
  <ul class="tab-cont-list">
    <div v-if="searchData.length == 0" class="no-data">
      <div class="bg-no-data-search"></div>
      <div class="no-data-txt">暂无数据</div>
    </div>

    <li v-for="item in searchData" :key="item.resource_id">
      <dl>
        <dt class="tag-kind" @click="goDetail(item.okrId)">
          <span class="kind-parent">{{
            CONST.OKR_KIND_MAP[item.okrDetailType]
          }}</span>
          <em v-html="item.okrDetailContent"></em>
        </dt>
        <dd>
          <div>
            <span>当前进度</span>
            <tl-process
              :data="parseInt(item.okrDetailProgress, 10)"
              :width="40"
              :marginLeft="6"
              :class="item.okrDetailType == 0 ? 'is-o' : 'is-kr'"
            ></tl-process>
          </div>
          <div>
            <span>来自</span>
            <em>{{ item.orgName }}</em>
          </div>
          <div class="user-info">
            <span>负责人</span>
            <img v-if="true" src="@/assets/images/user/user.jpg" alt />
            <em v-else class="user-name">{{ cutName(item.userName) }}</em>
            <em @click="gotoView(item)">{{ item.userName }}</em>
          </div>
        </dd>
      </dl>
    </li>
  </ul>
</template>

<script>
import process from '@/components/process';
import CONST from '../const';

export default {
  name: 'searchOKR',
  components: {
    'tl-process': process,
  },
  props: {
    searchData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      CONST,
      color: 'blue',
    };
  },
  mounted() {},
  computed: {},
  methods: {
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
    goDetail(okrid) {
      this.$emit('showDetail', okrid);
    },
    gotoView(row) {
      const data = { node: row };
      this.$emit('takeOvierview', data);
    },
  },
  watch: {
    'searchData.length': {
      handler(val) {
        console.log(val);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>