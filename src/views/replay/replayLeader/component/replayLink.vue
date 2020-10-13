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
        <el-radio label="以关键结果KR复盘"></el-radio>
        <el-radio label="以目标O复盘"></el-radio>
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
          <div>衡量办法 功能上线通知</div>
          <div>
            <div>价值与收获</div>
            <div>
              他成功地带领英特尔从一家存储器芯片制造商转型为全球微处理器领域的霸主。
              格鲁夫对德鲁克的MBO推崇备至，并将MBO引入英特尔。不过，格鲁夫对德鲁克的MBO做了一些修改，
              将其变成了今天我们绝大多数人所看到的框架。他成功地带领英特尔从一家存储器芯片制造商转型为全球微处理器领域的霸主。
              格鲁夫对德鲁克的MBO推崇备至，并将MBO引入英特尔。不过，格鲁夫对德鲁克的MBO做了一些修改，将其变成了今天我们绝大多数人所看到的框架。
            </div>
          </div>
          <div>
            <div>问题与不足</div>
            <div>
              他成功地带领英特尔从一家存储器芯片制造商转型为全球微处理器领域的霸主。格鲁夫对德鲁克的MBO推崇备至，并将MBO引入英特尔。不过，
              格鲁夫对德鲁克的MBO做了一些修改，将其变成了今天我们绝大多数人所看到。
            </div>
          </div>
          <div>
            <div>改进措施</div>
            <div>
              <div>
                <em>
                  1、员工目标的设定应该上下级高度参与，而不应由高层自上而下强制推行；
                </em>
              </div>
              <div>
                <em> 2、强调员工的参与和自我管理 </em>
              </div>
              <div>
                <em> 3、目标的设置不仅要关注短期，更应该关注长期。 </em>
              </div>
            </div>
          </div>
          <div>
            <div>复盘沟通</div>
            <el-input type="textarea" placeholder="不超过1000字符"></el-input>
            <div>
              <em>请选择：</em>
              <el-button type="primary">超级优秀</el-button>
              <el-button type="primary">优秀</el-button>
              <el-button type="primary">继续努力</el-button>
              <el-button type="primary">要加油哦</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-button type="primary">保存</el-button>
      <el-button type="primary">确认沟通</el-button>
      <el-button type="primary">关闭</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  data() {
    return {
      form: {},
      activeNames: ['1'],
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
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