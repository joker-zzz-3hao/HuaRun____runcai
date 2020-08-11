<template>
  <div class="block">
    <ul>
      <li v-for="(item,index) in cycleList" :key="index" style="position: relative;display:flex; ">
        <div style="height: 100%;width: 150px;">
          <span>{{item.date}}</span>
          <span style="padding-left:10px;">{{item.createTime}}</span>
        </div>
        <div class="cycle"></div>
        <div
          v-if="index < cycleList.length-1"
          style="position: absolute;left: 154px;height: 100%;border-left: 2px solid #e4e7ed;"
        ></div>
        <div style="margin-left: 20px;width:330px;display: flex;">
          <div style="width: 50px;">{{item.createBy}}</div>
          <div style="width: 80px;">{{item.operateType}}</div>
          <div style="width: 200px;">{{item.content}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'timeline',
  data() {
    return {
      reverse: true,
      activities: [],
      // cycleList: [{
      //   date: '2020-08-01',
      //   time: '16:14',
      //   name: '张三',
      //   statusName: '通过',
      //   content: '内内容内容内容内容内容内容内容内容容',
      // }],
    };
  },
  props: {
    // 数组对象包括date：日期，time：时间，name：姓名，status：状态，content：内容
    cycleList: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  created() {},
  methods: {},
};
</script>
<style scoped>
.cycle {
  background-color: #e4e7ed;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 149px;
  width: 12px;
  height: 12px;
  position: absolute;
}
</style>