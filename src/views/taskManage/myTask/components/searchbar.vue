<template>
  <div>
    <ul style="display: flex;">
      <li>
        <el-button>全部</el-button>
      </li>
      <li>
        <el-button>我收到的</el-button>
      </li>
      <li>
        <el-button>我创建的</el-button>
      </li>
      <li>
        <el-button>我的草稿</el-button>
      </li>
      <li style="display: flex;">
        <el-input placeholder="请输入任务标题"></el-input>
        <el-button @click="search">查询</el-button>
      </li>
    </ul>
    <div @click="showSearchBar">
      展开更多筛选
      <i :class="arrowClass"></i>
    </div>

    <!-- 更多筛选 -->
    <div v-show="arrowClass == 'el-icon-caret-bottom'">
      <!-- 筛选标签 -->
      <div style="display: flex;">
        <span>所有筛选</span>
        <div class="searchblock" v-for="(item, index) in searchList" :key="index">
          <span>{{item.name}}</span>
          <i class="el-icon-error" @click.stop="clearNode(index)"></i>
        </div>
      </div>
      <dl style="display: flex;">
        <dt>任务过程</dt>
        <dd
          class="searchblock"
          :class="{'selected': item.isSelected}"
          v-for="(item,index) in taskProcessList"
          :key="index"
        >
          <span @click="switchParent(item)">{{item.label}}</span>
        </dd>
      </dl>
      <dl style="display: flex;">
        <dt>任务状态</dt>
        <dd
          class="searchblock"
          :class="{'selected': item.isSelected}"
          v-for="(item,index) in childCateList"
          :key="index"
        >
          <span @click="selectStatus(item)">{{item.label}}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchbar',
  data() {
    return {
      arrowClass: 'el-icon-caret-top',
      searchList: [],
      taskProcessList: [
        {
          label: '全部',
          value: 'all',
          isSelected: true,
          childCateList: [
            { label: '全部', value: 'all', isSelected: true },
            { label: '待处理', value: 1, isSelected: false },
            { label: '进行中', value: 2, isSelected: false },
            { label: '已完成', value: 3, isSelected: false },
          ],
        },
        {
          label: '标准任务过程',
          value: 1,
          isSelected: false,
          childCateList: [
            { label: '全部', value: 'all', isSelected: true },
            { label: '待处理', value: 1, isSelected: false },
            { label: '进行中', value: 2, isSelected: false },
            { label: '已完成', value: 3, isSelected: false },
          ],
        },
        {
          label: '产品任务过程',
          value: 2,
          isSelected: false,
          childCateList: [
            { label: '全部', value: 'all', isSelected: true },
            { label: '待处理', value: 1, isSelected: false },
            { label: '进行中', value: 2, isSelected: false },
            { label: '已完成', value: 3, isSelected: false },
          ],
        },
        {
          label: '研发任务过程',
          value: 3,
          isSelected: false,
          childCateList: [
            { label: '全部', value: 'all', isSelected: true },
            { label: '待处理', value: 1, isSelected: false },
            { label: '进行中', value: 2, isSelected: false },
            { label: '已完成', value: 3, isSelected: false },
          ],
        },
        {
          label: '测试任务过程',
          value: 4,
          isSelected: false,
          childCateList: [
            { label: '全部', value: 'all', isSelected: true },
            { label: '待处理', value: 1, isSelected: false },
            { label: '进行中', value: 2, isSelected: false },
            { label: '已完成', value: 3, isSelected: false },
          ],
        },
        {
          label: '上线发布任务过程',
          value: 5,
          isSelected: false,
          childCateList: [
            { label: '全部', value: 'all', isSelected: true },
            { label: '待处理', value: 1, isSelected: false },
            { label: '进行中', value: 2, isSelected: false },
            { label: '已完成', value: 3, isSelected: false },
          ],
        },
      ],
      childCateList: [
        { label: '全部', value: 'all', isSelected: true },
        { label: '待处理', value: 1, isSelected: false },
        { label: '进行中', value: 2, isSelected: false },
        { label: '已完成', value: 3, isSelected: false },
      ],
      taskProcess: {}, // 选择的任务过程
      taskStatus: {}, // 选择的任务状态
    };
  },
  methods: {
    search() {

    },
    showSearchBar() {
      if (this.arrowClass == 'el-icon-caret-top') {
        this.arrowClass = 'el-icon-caret-bottom';
      } else {
        this.arrowClass = 'el-icon-caret-top';
      }
    },
    clearNode(index) {
      this.searchList.splice(index, 1);
    },
    switchParent(parentCate) {
      this.taskProcess = parentCate;
      this.resetIsSelected(this.taskProcessList);
      this.childCateList = parentCate.childCateList;
      parentCate.isSelected = true;
      for (const item of this.taskProcessList) {
        if (item.value == parentCate.value) {
          this.resetIsSelected(item.childCateList, 'init');
        }
      }
    },
    selectStatus(childCate) {
      this.resetIsSelected(this.childCateList);
      childCate.isSelected = true;
      this.searchList.push({ name: `${this.taskProcess.label}-${childCate.label}` });
    },
    resetIsSelected(list, init) {
      if (init == 'init') {
        for (let i = 0; i < list.length; i += 1) {
          if (i == 0) {
            list[i].isSelected = true;
          } else {
            list[i].isSelected = false;
          }
        }
      } else {
        for (const item of list) {
          item.isSelected = false;
        }
      }
    },
  },
  watch: {
    searchList: {
      handler() {
        console.log('搜索');
      },
      deep: true,
    },
  },
};
</script>