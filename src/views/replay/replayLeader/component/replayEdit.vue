<template>
  <div>
    <div>复盘对象：2020年下半年OKR (2020/06/01-2020/12/31)</div>
    <div class="replay-user">
      <div class="list">姓名：陆涛</div>
      <div class="list">OKR进度： 76%</div>
      <div class="list">复盘时间： 2020年9月21日 12:23</div>
    </div>
    <div>
      <el-radio-group v-model="form.resource">
        <el-radio label="kr">以关键结果KR复盘</el-radio>
        <el-radio label="o">以目标O复盘</el-radio>
      </el-radio-group>
    </div>
    <div>
      <el-collapse accordion v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1">
          <template slot="title">
            <div style="width: 100%">
              <em>目标1</em><em>完成上半年营收入100万元</em>
              <div class="right">
                <em>权重 30%</em>
                <em>进度 100%</em>
              </div>
            </div>
          </template>
          <div>
            <div style="width: 100%">
              <em>KR1 </em
              ><em>形成个别生态能力的解决方案，为下半年营收做准备</em>
              <div class="right">
                <em>权重 30%</em>
                <em>进度 100%</em>
              </div>
            </div>
          </div>
          <div>
            考核指标
            完成物理机（连通性、资源使用情况等）、虚拟机（连通性）的监控机制。
          </div>
          <el-form ref="form" :model="form" :rules="rules">
            <div>衡量办法 功能上线通知</div>
            <div>
              <div>价值与收获</div>
              <el-form-item>
                <el-input
                  maxlength="2000"
                  type="textarea"
                  placeholder="事情完成情况说明，这件事的价值与意义，亮点如何？"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <div>问题与不足</div>

              <el-form-item>
                <el-input
                  type="textarea"
                  maxlength="1000"
                  placeholder="事情做的有那些不足，自己表现有哪些不足？"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <div>改进措施</div>
              <div>
                <div v-for="(item, index) in produceList" :key="index">
                  <em>
                    {{ item.desc }}
                  </em>
                  <el-button type="text" @click="deleteProduce(index)"
                    >删除</el-button
                  >
                </div>

                <el-form-item>
                  <el-input
                    type="textarea"
                    placeholder="事情做的有那些不足，自己表现有哪些不足？"
                    v-model="deficiency"
                  ></el-input>
                </el-form-item>
                <el-button type="text" @click="addproduceList">添加</el-button>
              </div>
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-button type="primary">保存</el-button>
      <el-button type="primary">提交复盘</el-button>
      <el-button type="primary">关闭</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  data() {
    return {
      form: {
        resource: 'kr',
      },
      activeNames: ['1'],
      produceList: [
        {
          desc: '产品设计与研发按时按需交付，需继续努力产品设计与研发按时按需交付，需继续努力产品设计与研发按时按需交付，需继续努力。',
        },
      ],
      deficiency: '',
      rules: {

      },
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    // 添加改进
    addproduceList() {
      if (!this.deficiency) {
        this.$message.error('改进措施不能为空');
        return false;
      }
      this.produceList.push({
        desc: this.deficiency,
      });
      this.deficiency = '';
    },
    // 删除改进措施
    deleteProduce(index) {
      this.produceList.splice(index, 1);
    },
  },
};
</script>
<style  scoped>
.replay-user {
  display: flex;
  flex-direction: row;
}
.replay-user .list {
  margin-right: 40px;
}
.right {
  float: right;
}
</style>