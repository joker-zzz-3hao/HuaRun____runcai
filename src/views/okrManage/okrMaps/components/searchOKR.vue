<template>
  <div>
    <div
      v-for="item in searchData"
      :key="item.resource_id"
      style="display: flex;flex-direction: column;"
    >
      <div style="display:flex;">
        <div>{{CONST.OKR_TYPE_MAP[item.okr_detail_type]}}</div>
        <div>{{item.okr_detail_content}}</div>
      </div>
      <div style="display:flex;justify-content: space-between;">
        <div style="display: flex;">
          <div>当前进度</div>
          <div>
            <el-progress style="width:200px;" :percentage="item.okrDetailProgress" :color="color"></el-progress>
          </div>
        </div>
        <div style="display: flex;">
          <div>
            <span>来自</span>
            <span>{{item.org_name}}</span>
          </div>
          <div>
            <span>负责人</span>
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <span>{{item.user_name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchOKR',
  components: {},
  props: {},
  data() {
    return {
      color: 'blue',
    };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>