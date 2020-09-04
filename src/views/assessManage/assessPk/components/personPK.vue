<template>
  <div class="home">
    <div class="header">
      <div class="person">
        <em class="image">陆涛</em>
        <div>
          <div>2020年下半年OKR</div>
          <div>
            <em>负责人:陆涛</em>
            <em style="margin-left:10px">OKR进度： 12%</em>
            <em style="margin-left:10px">上级考核： 张聪</em>
          </div>
        </div>
      </div>
      <div>
        <em>自评总分:78</em>
        <em style="margin-left:10px">上级评分--</em>
      </div>
    </div>
    <div class="main">
      <div>
        <em>考核信息</em>
        <div>
          <div class="leftinfo">
            <div>
              <div class="omart">目标O：</div>
              <em>
                1. 形成个别生态能力的解决方案，为下半年营收做准备
                完成上半年营收入100万元
              </em>
              <div class="modelflex">
                <em>权重 30% 进度</em>
                <el-progress :percentage="50" style="width:200px;"></el-progress>
                <em>20% 承接自 KR：至少5款现有产品完成升级支持</em>
              </div>
            </div>
            <div>
              <div class="omart">关键行动KR:</div>
              <em>1. 形成个别生态能力的解决方案，为下半年营收做准备</em>
              <div class="modelflex">
                <em>权重 30% 进度</em>
                <el-progress :percentage="50" style="width:200px;"></el-progress>
                <em>信心状态 可控</em>
              </div>
              <em class="mt">2 持续探索外部机会，寻找优质的产品引入，为下半年营收做准备</em>
              <div class="modelflex">
                <em>权重 30% 进度</em>
                <el-progress :percentage="50" style="width:200px;"></el-progress>
                <em>信心状态 可控</em>
              </div>
            </div>
          </div>
          <div class="leaderscore">
            <em>自评</em>
            <el-input style="width:50px"></el-input>
          </div>
          <div class="person">
            <em style="width:90px;">自评说明</em>
            <el-input type="textarea" v-model="form.desc" placeholder="
请输入您要点评的内容，不超过500字符"></el-input>
          </div>
          <div>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="text">+ 添加附件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div>
        <em>考核信息</em>
        <div>
          <div class="leftinfo">
            <div>
              <div class="omart">目标O：</div>
              <em>
                1. 形成个别生态能力的解决方案，为下半年营收做准备
                完成上半年营收入100万元
              </em>
              <div class="modelflex">
                <em>权重 30% 进度</em>
                <el-progress :percentage="50" style="width:200px;"></el-progress>
                <em>20% 承接自 KR：至少5款现有产品完成升级支持</em>
              </div>
            </div>
            <div>
              <div class="omart">关键行动KR:</div>
              <em>1. 形成个别生态能力的解决方案，为下半年营收做准备</em>
              <div class="modelflex">
                <em>权重 30% 进度</em>
                <el-progress :percentage="50" style="width:200px;"></el-progress>
                <em>信心状态 可控</em>
              </div>
              <em class="mt">2 持续探索外部机会，寻找优质的产品引入，为下半年营收做准备</em>
              <div class="modelflex">
                <em>权重 30% 进度</em>
                <el-progress :percentage="50" style="width:200px;"></el-progress>
                <em>信心状态 可控</em>
              </div>
            </div>
          </div>
          <div class="leaderscore">
            <em>自评</em>
            <el-input style="width:50px"></el-input>
          </div>
          <div class="person">
            <em style="width:90px;">自评说明</em>
            <el-input type="textarea" v-model="form.desc" placeholder="
请输入您要点评的内容，不超过200字符"></el-input>
          </div>
          <div>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="text">+ 添加附件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <div>评估人点评</div>
    <div>总计评分： 110</div>
    <div>
      <el-input type="textarea" v-model="form.desc" placeholder="
请输入您要点评的内容，不超过200字符"></el-input>
      <el-button>确认</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'assessManagementIndex',
  data() {
    return {
      form: {},
    };
  },
  components: {
  },
};
</script>
<style  scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  border-bottom: 1px solid saddlebrown;
}
.main {
  width: 100%;
  background: white;
  margin: 30px 0;
}
.image {
  width: 50px;
  height: 50px;
  text-align: center;
  display: block;
  line-height: 50px;
  border-radius: 50%;
  background: darkcyan;
}
.scoreModel {
  display: flex;
  flex-direction: row;
}
.person {
  display: flex;
  flex-direction: row;
}
.modelflex {
  display: flex;
  flex-direction: row;
  margin-left: 70px;
}
.mt {
  margin-left: 70px;
}
.mapmarg {
  margin-left: 50px;
}
.omart {
  display: inline-block;
}
.leaderscore {
  width: 100%;
  border-top: 1px solid black;
}
.intime {
  background: slategray;
  width: 300px;
}
</style>