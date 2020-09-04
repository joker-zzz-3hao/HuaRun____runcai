<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="详情" name="detail">
        <!-- 公共信息 -->
        <div>
          <ul>
            <li>
              <span>目标类型</span>
              <span>{{CONST.OKR_TYPE_MAP[okrmain.okrBelongType]}}</span>
            </li>
            <li>
              <span>负责人</span>
              <span>{{okrmain.userName}}</span>
            </li>
            <li>
              <span>更新时间</span>
              <span>{{okrmain.updateTime || okrmain.createTime}}</span>
            </li>
            <li>
              <span>进度</span>
              <span>
                <el-progress :stroke-width="10" :percentage="parseInt(okrmain.okrProgress, 10)"></el-progress>
              </span>
            </li>
          </ul>
        </div>
        <!-- okr折叠面板 -->
        <tl-okr-collapse :tableList="tableList" :showParentOkr="false">
          <template slot="head-bar" slot-scope="props">
            <button
              v-if="props.okritem.versionCount > 1"
              @click="openHistory(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
            >历史版本</button>
          </template>
          <template slot="body-bar" slot-scope="props">
            <button
              v-if="props.okritem.versionCount > 1"
              @click="openHistory(props.okritem.okrDetailId,props.okritem.okrDetailObjectKr)"
            >历史版本</button>
          </template>
        </tl-okr-collapse>
      </el-tab-pane>
      <el-tab-pane label="操作历史" name="history" v-if="this.okrId">
        <!-- 操作历史 -->
        <div>
          <span>操作历史</span>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in cycleList"
              :key="index"
              :timestamp="activity.createTime"
              placement="top"
            >
              <div v-if="activity.operateType=='update'">
                <span>{{userName}}</span>
                <span>{{activity.operateTypeCn}}</span>
                <div v-for="uitem in activity.okrDetailId" :key="uitem.id">
                  <span>{{CONST.OKR_KIND_MAP[uitem.type || 0]}}</span>
                  <span
                    v-if="uitem.updateContents.okrDetailObjectKr"
                  >{{uitem.updateContents.okrDetailObjectKr}}</span>
                  <span
                    v-if="uitem.updateContents.afterProgress"
                  >进度为{{uitem.updateContents.afterProgress}}%，</span>
                  <span
                    v-if="uitem.updateContents.afterConfidence"
                  >风险状态修改为{{CONST.CONFIDENCE_MAP[uitem.updateContents.afterConfidence]}}。</span>
                </div>

                <span v-if="activity.remark">说明：</span>
                <span v-if="activity.remark">{{activity.remark}}。</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 点赞要一直浮着 -->
    <div v-if="showSupport">
      <ul style="display:flex">
        <el-button v-if="showLike" @click="like()">点赞</el-button>
        <li class="user-info" v-for="(item,index) in voteUser" :key="item.userId+index">
          <div class="user-name">{{cutName(item.userName)}}</div>
        </li>
      </ul>
    </div>
    <el-drawer
      title="历史版本"
      :modal="false"
      :wrapperClosable="false"
      :append-to-body="true"
      class="tl-drawer"
      :visible.sync="innerDrawer"
    >
      <tl-okr-history
        v-if="innerDrawer"
        ref="tl-okr-history"
        :server="server"
        :okrDetailId="okrDetailId"
        :okrmain="okrmain"
      ></tl-okr-history>
    </el-drawer>
  </div>
</template>

<script>
import okrCollapse from '@/components/okrCollapse';
import okrHistory from './okrHistory';

export default {
  name: 'okrDetail',
  data() {
    return {
      tableList: [], // okr列表
      voteUser: [], // 点赞人列表
      okrmain: {}, // 公共信息
      canWrite: true, // true写okr false okr详情
      dialogTitle: 'OKR详情', // 弹框标题
      cycleList: [], // 操作历史
      showLike: true, // okr地图查看详情可点赞
      supportType: 0, // 点赞1 取消赞0
      innerDrawer: false,
      activeName: 'detail',
      okrDetailId: '',
      userName: '张三',
    };
  },
  components: {
    'tl-okr-history': okrHistory,
    'tl-okr-collapse': okrCollapse,
  },
  props: {
    dialogExist: {
      type: Boolean,
      default: true,
    },
    server: {
      type: Object,
      required: true,
    },
    okrId: {
      type: String,
      defualt: '',
    },
    CONST: {
      type: Object,
      default() {
        return {};
      },
    },
    okrItem: {
      type: Object,
      default() {
        return {};
      },
    },
    showSupport: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 生成数字序列（用于打开okrCollapse
    // activeList() {
    //   if (this.tableList && this.tableList.length > 0) {
    //     return Array.from(new Array(this.tableList.length).keys());
    //   }
    //   return [];
    // },
  },
  created() {
  },
  methods: {
    // 查okr详情
    getokrDetail() {
      if (this.okrId) {
        this.server.getokrDetail({ okrId: this.okrId }).then((res) => {
          if (res.code == 200) {
            this.tableList = res.data.okrDetails || [];
            this.okrmain = res.data.okrMain || {};
          }
        });
      }
      if (this.okrItem) {
        this.formData = JSON.parse(JSON.stringify(this.okrItem));
        this.tableList = this.formData.tableList || [];
        this.okrmain = this.formData.okrMain || {};
        console.log('this.tableList', this.formData);
      }
    },
    // 点赞
    like() {
      this.supportType = this.supportType === 1 ? 0 : 1;
      this.server.okrSupport({
        okrId: this.okrId,
        supportType: this.supportType,
      }).then((res) => {
        if (res.code == 200) {
          console.log(res.code);
          this.getSupportList();
        }
      });
    },
    // 查点赞列表
    getSupportList() {
      this.server.getSupportList({ okrId: this.okrId }).then((res) => {
        console.log(res.code);
        if (res.code == 200) {
          this.voteUser = res.data.supportUserList;
        }
      });
    },
    // TODO:查全部pageSize要传大点
    getOperationHistory() {
      this.server.okrOperationHistory({
        currentPage: 1,
        okrMainId: this.okrId,
        pageSize: 10,
      }).then((res) => {
        console.log(res.code);
        if (res.code == 200) {
          this.userName = res.data.userName || '';
          console.log(res.data.userName);
          this.cycleList = res.data.contentVoList || [];

          this.cycleList.forEach((item) => {
            if (item.okrDetailId && item.okrDetailId.length > 0) {
              item.okrDetailId.forEach((uitem) => {
                const contents = JSON.parse(uitem.updateJsonStr);
                uitem.updateContents = contents;
              });
            }
          });
        }
      });
    },
    //
    showOkrDialog() {
      this.getokrDetail();
      this.getSupportList();
      this.getOperationHistory();
    },
    // 打开历史版本
    openHistory(id, name) {
      console.log(name);
      this.okrDetailId = id;
      this.innerDrawer = true;
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
    splitContent(content) {
      if (content) {
        return content.split(';');
      }
      return '';
    },
  },
  watch: {

  },
};
</script>

<style>
.collapse span,
.collapsetitle span {
  margin-left: 10px;
}

.collapsetitle {
  margin-left: 250px;
}
.progresswidth {
  width: 150px;
  display: inline-block;
}
.detail {
  display: flex;
}
</style>