<template>
  <div>
    <el-dialog
      title="评分"
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
            <el-button @click="selectWorth(item)" type="primary" round>{{item.label}}</el-button>
          </div>
        </div>
        <div v-if="worthName && scoreId != '50'">
          <span>描述：</span>
          <span>{{worthName}}</span>
        </div>
        <div v-if="scoreId=='50'">
          <span>描述：如支撑项不符合价值观背景，亲把它归类到其它标签中</span>
          <div>
            <div>添加：</div>
            <div>
              <el-tag
                :key="index"
                v-for="(lItem,index) in otherLabelList"
                :disable-transitions="false"
                @click="selectOtherLabel(lItem)"
              >{{lItem.label}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
            </div>
          </div>
        </div>
        <div>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="description"></el-input>
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
    show(data) {
      this.data = data;
      this.showScore = true;
    },
    closed() {
      this.showScore = false;
    },
    selectWorth(data) {
      this.worthName = data.label;
      this.scoreId = data.value;
    },
    selectOtherLabel(data) {
      console.log(111);
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
        this.otherLabelList.push({
          label: inputValue,
        });
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    submitScore() {
      this.server.score({
        id: this.data.id,
        score: this.scoreId,
        scoreDesc: this.description,
        scoreLabel: this.otherLabel,
      }).then((res) => {
        if (res.code == '200') {
          this.$emit('success');
          this.showScore = false;
        }
      });
    },
  },
  watch: {},
};
</script>