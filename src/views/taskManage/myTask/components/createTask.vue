<template>
  <div>
    <el-form :model="formData">
      <div>
        <el-form-item prop="title">
          <el-input
            type="text"
            placeholder="请输入任务标题"
            v-model="formData.title"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <i class="el-icon-user-solid"></i>
          </template>
          <span>无经办人</span>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <i class="el-icon-date"></i>
          </template>
          <el-date-picker
            v-model="formData.timeVal"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <i class="el-icon-s-flag"></i>
            <span>优先级</span>
          </template>
          <el-select v-model="formData.priorityVal" placeholder="请选择优先级">
            <el-option
              v-for="item in CONST.PRIORITY_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属项目" prop="projectVal">
          <el-select v-model="formData.projectVal" placeholder="请选择归属项目">
            <el-option
              v-for="item in CONST.TASK_PROCESS_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属OKR" prop="okrVal">
          <el-select v-model="formData.okrVal" placeholder="请选择归属OKR">
            <el-option
              v-for="item in CONST.TASK_PROCESS_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属任务过程管理" prop="processVal">
          <el-select v-model="formData.processVal" placeholder="请选择任务过程">
            <el-option
              v-for="item in CONST.TASK_PROCESS_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时长统计">
          <span>当前已用时长 0天 0小时 0分</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>2020-08-11 18：00</span>
        </el-form-item>
        <el-form-item label="当前进度" prop="processNum">
          <el-slider v-model="formData.processNum" show-input></el-slider>
        </el-form-item>
        <el-form-item label="进度更新原因说明" prop="reason">
          <el-input type="textarea" :rows="2" placeholder="请输入进度更新原因" v-model="formData.reason"></el-input>
        </el-form-item>
      </div>
      <!-- 按钮 -->
      <div>
        <el-button>取消</el-button>
        <el-button>暂存</el-button>
        <el-button>确认指派</el-button>
        <el-button>确认接收</el-button>
      </div>
    </el-form>
    <!-- 右侧 -->
    <div>
      <el-tabs>
        <el-tab-pane label="操作历史" name="history">
          <!--  -->
          <ul>
            <li
              v-for="item in historyList"
              :key="item.id"
            >{{item.name}}添加任务{{item.title}}{{item.time}}</li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="进度更新说明" name="update">
          <ul>
            <li v-for="item in updateList" :key="item.id">
              <span>进度更新为：{{item.process}}%</span>
              <span>进度更新说明：{{item.reason}}</span>
              <span>操作人：{{item.name}}</span>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

import CONST from '../const';

export default {
  name: 'createTask',
  data() {
    return {
      CONST,
      formData: {
        title: '',
        timeVal: [new Date(2020, 8, 1, 10, 10), new Date(2020, 9, 11, 10, 10)],
        priorityVal: 1,
        projectVal: '',
        okrVal: '',
        processVal: '',
        processNum: 0,
      },
      historyList: [{
        name: '张三', title: '关于润才平台产品市场竞品调研', reason: '因11111任务属于错误输入的任务', time: '1小时前',
      }],
      updateList: [{
        name: '李四', reason: '因11111任务属于错误输入的任务', process: 20,
      }],
    };
  },
};
</script>

<style>
</style>