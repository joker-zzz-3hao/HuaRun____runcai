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
    </ul>
    <el-form-item>
      <el-input placeholder="请输入任务标题"></el-input>
      <el-button @click="search">查询</el-button>
    </el-form-item>
    <el-button>展开更多筛选</el-button>
    <!-- 更多筛选 -->
    <div>
      <!-- 筛选标签 -->
      <div style="display: flex;">
        <span>所有筛选</span>
        <div class="searchblock" v-for="(item, index) in searchList" :key="index">
          <span>{{item.name}}</span>
          <i class="el-icon-error" @click.stop="clearNode(item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchbar',
  data() {
    return {
      searchList: [
        { name: '标准任务过程-待处理' },
        { name: '标准任务过程-处理中' },
        { name: '标准任务过程-已完成' },
      ],
    };
  },
  methods: {
    search() {

    },
    clearNode(item) {
      console.log(item);
    },
  },
};
</script>

<style>
.searchblock {
  border: 1px solid #d5dde3;
  background-color: #fff;
  margin: 5px;
}
</style>