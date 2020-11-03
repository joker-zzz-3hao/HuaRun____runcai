<template>
  <div class="kr-replay">

           <elcollapse class="tl-collapse okr-change-list" v-model="activeNames">
      <elcollapseitem
        ref="o-kr-replay"
        v-for="(item, index) in okrMain.okrReviewPojoList"
        :key="index"
        :name="index"
      >

             <template slot="title">
          <dl class="is-o">
            <dt class="tag-kind">
              <span class="kind-parent">目标</span>
              <em>{{ item.o.okrDetailObjectKr }}</em>
            </dt>
            <dd>
              <div>
                <i class="el-icon-medal"></i>
                <span>权重</span>
                <em>{{ item.o.okrWeight }}%</em>
              </div>
              <div>
                <i class="el-icon-odometer"></i>
                <span>进度</span>
                <tl-process
                  :data="parseInt(item.o.okrDetailProgress, 10)"
                ></tl-process>
              </div>
              <!-- <div>
                <i class="el-icon-attract"></i>
                <span>关联父目标</span>
                <em
                  v-if="
                    oData.undertakeOkrDto &&
                    oData.undertakeOkrDto.undertakeOkrContent
                  "
                  ><em>{{ oData.undertakeOkrDto.undertakeOkrContent }}</em
                  ><em>{{ oData.cultureName }}</em></em
                >
                <em
                  v-else-if="
                    oData.undertakeOkrVo &&
                    oData.undertakeOkrVo.undertakeOkrContent
                  "
                  ><em>{{ oData.undertakeOkrVo.undertakeOkrContent }}</em
                  ><em>{{ oData.cultureName }}</em></em
                >
                <em v-else-if="oData.cultureName">{{ oData.cultureName }}</em>
                <em v-else>暂无</em>
              </div> -->
            </dd>
          </dl>
        </template>
          <div v-for="(list, i) in item.krs" :key="i + 'k'">
            <div>
              <em>KR{{ i + 1 }} </em><em>{{ list.okrDetailObjectKr }}</em>
              <div class="right" style="width: 200px">
                <em style="float: left; width: 100px"
                  >权重
                  <el-progress
                    :width="50"
                    :percentage="parseInt(list.okrWeight) || 0"
                    :show-text="true"
                  ></el-progress>
                </em>
                <em style="float: left; width: 100px"
                  >进度
                  <el-progress
                    :width="50"
                    :percentage="parseInt(list.okrDetailProgress) || 0"
                    :show-text="true"
                  ></el-progress>
                </em>
              </div>
            </div>

            <div>
              考核指标
              {{ list.checkQuota }}
            </div>
            <el-form ref="form">
              <div>衡量办法 {{ list.judgeMethod }}</div>
              <div>
                <div>价值与收获</div>
                <el-form-item>
                  <el-input
                    maxlength="2000"
                    v-model="list.advantage"
                    type="textarea"
                    placeholder="事情完成情况说明，这件事的价值与意义，亮点如何？"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <div>问题与不足</div>

                <el-form-item>
                  <el-input
                    v-model="list.disadvantage"
                    type="textarea"
                    maxlength="1000"
                    placeholder="事情做的有那些不足，自己表现有哪些不足？"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <div>改进措施</div>
                <div>
                  <template v-if="list.measure.length > 1">
                    <div v-for="(li, d) in list.measure || []" :key="d">
                      <el-input
                        type="textarea"
                        placeholder="事情做的有那些不足，自己表现有哪些不足？"
                        v-model="list.measure[d]"
                      ></el-input>

                      <el-button
                        v-if="list.measure.length == d + 1"
                        type="text"
                        @click="addDefic(index, i)"
                        >添加</el-button
                      >
                      <el-button
                        v-else
                        type="text"
                        @click="deletedProduce(index, i, d)"
                        >删除</el-button
                      >
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <el-input
                        type="textarea"
                        placeholder="事情做的有那些不足，自己表现有哪些不足？"
                        v-model="list.measure[0]"
                      ></el-input>
                    </div>
                    <el-button type="text" @click="addDefic(index, i)"
                      >添加</el-button
                    >
                  </template>
                </div>
              </div>
            </el-form>
          </div>
           </elcollapseitem>
    </elcollapse>

      <el-button type="primary" @click="submit" :loading="submitLoad"
        >提交复盘</el-button
      >
      <el-button type="primary" @click="save" :loading="saveLoad"
        >保存</el-button
      >

      <el-button type="primary" @click="handleDeleteOne">关闭</el-button>
    </div>
  </div>
</template>

<script>
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  data() {
    return {
      reviewType: 1,
      form: {},
      submitLoad: false,
      saveLoad: false,
      activeNames: [1],
      server,
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      list: [],
      oldList: [],
      listBtn: [
        '超级优秀',
        '优秀',
        '继续努力',
        '要加油哦',
      ],
    };
  },
  created() {
    this.getOldList();
  },
  methods: {

    deletedProduce(index, i, d) {
      this.okrMain.okrReviewPojoList[index].krs[i].measure.splice(d, 1);
    },
    addDefic(index, i) {
      // if (!value) {
      //   this.$message.error('请填写改进措施');
      //   return false;
      // }
      if (this.okrMain.okrReviewPojoList[index].krs[i].measure.length == 0) {
        this.okrMain.okrReviewPojoList[index].krs[i].measure = [''];
      }
      this.okrMain.okrReviewPojoList[index].krs[i].measure.push('');
    },
    checkDatakrs(clear) {
      const krsData = this.okrMain.okrReviewPojoList.map((item) => item.krs);
      const krs = [];

      krsData.forEach((item) => {
        // eslint-disable-next-line prefer-spread
        krs.push.apply(krs, item);
      });
      const krsList = krs;
      if (clear) {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: '',
          communicationLabel: '',
          advantage: '',
          disadvantage: '',
          measure: [],
        }));
      } else {
        this.list = krsList.map((item) => ({
          detailId: item.detailId,
          okrDetailId: item.okrDetailId,
          communication: item.communication,
          advantage: item.advantage,
          disadvantage: item.disadvantage,
          measure: item.measure || [],
          communicationLabel: item.communicationLabel,
        }));
      }
    },

    save() {
      this.saveLoad = true;
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      this.server.okrReviewSave(params).then((res) => {
        this.saveLoad = false;
        if (res.code == 200) {
          this.$emit('getView');
          this.getOldList();
          this.$message.success('保存成功');
        } else {
          this.$$message.error(res.msg);
        }
      });
    },
    handleDeleteOne() {
      this.checkDatakrs(false);
      const CheckNull = this.list.every((item) => !item.advantage && !item.disadvantage && item.measure.length == 0);
      if (CheckNull) {
        this.$router.push('/replayList');
        return false;
      }

      if (JSON.stringify(this.oldList) == JSON.stringify(this.list)) {
        this.$router.push('/replayList');
      } else {
        this.$confirm('关闭后您填写内容将被清除，请确认是否关闭?', {
          confirmButtonText: '确定保存',
          cancelButtonText: '关闭',
        })
          .then(() => {
            this.save();
            this.$router.push('/replayList');
          })
          .catch(() => {
            this.$router.push('/replayList');
          });
      }
    },
    clearClose() {
      this.checkDatakrs(true);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };

      this.server.okrReviewSave(params).then((res) => {
        if (res.code == 200) {
          this.$router.push('/replayList');
        } else {
          this.$$message.error(res.msg);
        }
      });
    },
    submit() {
      this.submitLoad = true;
      this.checkDatakrs(false);
      const params = {
        okrMainVo: {
          reviewType: this.reviewType,
          okrBelongType: this.okrMain.okrMainVo.okrBelongType,
          okrId: this.okrMain.okrMainVo.okrId,
        },
        list: this.list,
      };
      const CheckNull = this.list.some((item) => !item.advantage || !item.disadvantage || item.measure.length == 0);
      if (CheckNull) {
        this.submitLoad = false;
        this.$message.error('未完成复盘，尚有未填写内容，请检查');
        return false;
      }
      this.server.okrReviewSubmit(params).then((res) => {
        this.submitLoad = false;
        if (res.code == 200) {
          this.$message.success('提交成功');
          this.$router.push('/replayList');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getOldList() {
      const KrList = JSON.parse(JSON.stringify(this.okrMain.okrReviewPojoList));
      const krsData = KrList.map((item) => item.krs);
      const krs = [];

      krsData.forEach((item) => {
        // eslint-disable-next-line prefer-spread
        krs.push.apply(krs, item);
      });
      const krsList = krs;

      this.oldList = krsList.map((item) => ({
        detailId: item.detailId,
        okrDetailId: item.okrDetailId,
        communication: item.communication,
        advantage: item.advantage,
        disadvantage: item.disadvantage,
        measure: item.measure || [],
        communicationLabel: item.communicationLabel,
      }));
    },
    getOkrReviewDetail() {
      this.server.getOkrReviewDetail({
        okrMainId: this.$route.query.okrId,
      }).then((res) => {
        this.okrMain = res.data;
        this.checkDatakrs(false);
      });
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

.rightweight {
  width: 200px;
  display: flex;
  flex-direction: row;
}

.title-row {
  display: flex;
  width: 100%;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
}

.flex {
  display: flex;
  width: 50%;
  flex-direction: row;
}
</style>
