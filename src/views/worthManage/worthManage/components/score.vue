<template>
  <div>
    <el-dialog
      title="评价"
      :visible.sync="showScore"
      :with-header="true"
      @close="closed"
      :modal="false"
      :append-to-body="false"
      :wrapperClosable="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="true"
      class="tl-drawer"
    >
      <div>
        <div style="display: flex;">
          <div v-for="item in labelList" :key="item.value">
            <el-button
              :class="worthName == item.label ? 'red' : 'green'"
              @click="selectWorth(item)"
              round
            >{{item.label}}</el-button>
          </div>
        </div>
        <div v-if="worthName && scoreId != '50'">
          <span>描述：</span>
          <span>{{worthName}}</span>
        </div>
        <div v-if="scoreId=='50'">
          <span>描述：如支撑项不符合价值观背景，请把它归类到其它标签中</span>
          <div>
            <div>添加：</div>
            <div>
              <div v-if="!inputVisible && otherLabelList.length > 0">
                <el-tag
                  :key="index"
                  v-for="(lItem,index) in otherLabelList"
                  :disable-transitions="false"
                  @click="selectOtherLabel(lItem)"
                >{{lItem.label}}</el-tag>
              </div>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model.trim="inputValue"
                ref="saveTagInput"
                maxlength="5"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button
                v-else-if="!inputVisible && otherLabelList.length==0"
                class="button-new-tag"
                size="small"
                @click="showInput"
              >新增标签</el-button>
            </div>
          </div>
        </div>
        <div>
          <el-input
            type="textarea"
            maxlength="200"
            placeholder="请输入您的描述，200个字符内"
            :rows="2"
            v-model.trim="description"
          ></el-input>
        </div>
        <div>
          <el-button @click="submitScore">发送</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CONST from '../../const';

export default {
  name: 'score',
  data() {
    return {
      CONST,
      showScore: false,
      inputVisible: false,
      worthName: '',
      scoreId: '',
      labelList: [],
      description: '',
      worthId: '',
      otherLabel: '',
      otherLabelList: [],
      inputValue: '',
      data: {},
    };
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  mounted() {
    this.labelList = this.CONST.SCORE_VALUE;
  },
  computed: {},
  methods: {
    show(data, type) {
      this.worthName = '';
      this.scoreId = '';
      this.description = '';
      this.otherLabelList = [];
      if (type == 'edit') {
        this.scoreId = data.score;
        this.description = data.scoreDesc;
        if (this.scoreId == '50') {
          this.otherLabelList.push({
            label: data.scoreLabel,
          });
        }
        this.labelList.forEach((item) => {
          if (item.value == data.score) {
            this.worthName = item.label;
          }
        });
      }
      this.data = data;
      this.showScore = true;
    },
    closed() {
      this.showScore = false;
    },
    selectWorth(data) {
      this.otherLabelList = [];
      this.worthName = data.label;
      this.scoreId = data.value;
    },
    selectOtherLabel(data) {
      console.log(111);
      this.inputVisible = true;
      this.inputValue = data.label;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
      this.otherLabel = data.label;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const { inputValue } = this;
      if (inputValue) {
        this.otherLabelList = [];
        this.otherLabelList.push({
          label: inputValue,
        });
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    submitScore() {
      if (this.description.length == 0) {
        this.$message.error('请输入评价');
        return;
      }
      this.server.score({
        id: this.data.id,
        score: this.scoreId,
        scoreDesc: this.description,
        scoreLabel: this.otherLabelList.length > 0 ? this.otherLabelList[0].label : '',
      }).then((res) => {
        if (res.code == '200') {
          this.$message.success('评价成功');
          this.$emit('success');
          this.showScore = false;
        }
      });
    },
  },
  watch: {},
};
</script>
<style scoped>
.red {
  background-color: red;
}
.green {
  background-color: green;
}
</style>