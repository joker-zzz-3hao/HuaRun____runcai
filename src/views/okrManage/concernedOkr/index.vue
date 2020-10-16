<template>
  <div class="concerned-okr">
    <div class="cont-area">
      <div class="followed-users">
        <dl>
          <dt>我的关注</dt>
          <dd>
            <el-input
              maxlength="64"
              @keyup.enter.native="searchFocus"
              v-model="keyWord"
              placeholder="请输入关注人姓名"
              class="tl-input-search"
              clearable
            >
              <i class="el-icon-search" slot="prefix" @click="searchFocus"></i>
            </el-input>
          </dd>
          <dd
            v-for="item in focusList"
            :key="item.id"
            :class="{ 'is-selected': item.userId == selectUserId }"
          >
            <div class="user-info" @click="selectUser(item)">
              <div v-if="item.headUrl">
                <el-avatar :src="item.headUrl"></el-avatar>
              </div>
              <div v-else-if="item.userName" class="user-name">
                <em>{{ item.userName.substring(item.userName.length - 2) }}</em>
              </div>
              <div>{{ item.userName }}</div>
              <div>{{ `(${item.orgName})` }}</div>
            </div>
            <div v-if="hasPower('okr-focus-add')">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="cancelFocus(item)"
                    >取消关注</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </dd>
        </dl>
      </div>
      <div class="followed-okrs">
        <div
          v-for="item in tableList"
          :key="item.okrMain.okrId"
          class="tl-card-panel"
        >
          <div class="card-panel-head">
            <div class="okr-title">{{ item.okrMain.periodName }}</div>
            <dl class="okr-follow">
              <dd @click="cancelFocus(item)">取消关注</dd>
            </dl>
            <dl class="okr-progress">
              <dt>
                <em>OKR进度</em>
              </dt>
              <dd>
                <el-progress
                  type="circle"
                  :percentage="item.okrMain.okrProgress"
                  :width="60"
                  :stroke-width="5"
                  color="#4ccd79"
                  class="tl-progress-circle"
                ></el-progress>
              </dd>
            </dl>
          </div>
          <div class="card-panel-body">
            <tl-okr-table :tableList="item.tableList"></tl-okr-table>
          </div>
        </div>
      </div>
    </div>
    <!-- <div>
      <div>
        <div>我的关注</div>
        <el-input
          maxlength="64"
          @keyup.enter.native="searchFocus"
          v-model="keyWord"
          placeholder="请输入关注人姓名"
          class="tl-input-search"
        >
          <i class="el-icon-search" slot="prefix" @click="searchFocus"></i>
        </el-input>
      </div>
      <div
        v-for="item in focusList"
        :key="item.id"
        :class="item.userId == selectUserId ? 'red' : 'green'"
      >
        <div style="display: flex" class="user-info" @click="selectUser(item)">
          <div v-if="item.headUrl">
            <el-avatar :src="item.headUrl"></el-avatar>
          </div>
          <div v-else-if="item.userName" class="user-name">
            <em>{{ item.userName.substring(item.userName.length - 2) }}</em>
          </div>
          <div>{{ item.userName }}</div>
          <div>{{ `(${item.orgName})` }}</div>
        </div>
        <div v-if="hasPower('okr-focus-add')">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="cancelFocus(item)"
                >取消关注</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div v-for="item in tableList" :key="item.okrMain.okrId">
      <div class="card-panel-head">
        <div class="okr-title">{{ item.okrMain.periodName }}</div>
        <dl class="okr-state">
          <dt>
            <i class></i>
            <em>状态</em>
          </dt>
          <dd>
            <i class="el-icon-sunny"></i>
            <em>{{ CONST.STATUS_LIST_MAP[item.okrMain.status] }}</em>
          </dd>
        </dl>
        <dl class="okr-responsible">
          <dt>
            <em>OKR类型</em>
          </dt>
          <dd>{{ CONST.OKR_TYPE_MAP[item.okrMain.okrBelongType || 2] }}</dd>
        </dl>
        <dl class="okr-responsible">
          <dt>
            <em>负责人</em>
          </dt>
          <dd>{{ item.okrMain.userName }}</dd>
        </dl>
        <dl class="okr-responsible">
          <dd v-if="item.supported" @click="addFocus(item)">关注</dd>
          <dd v-else @click="cancelFocus(item)">取消关注</dd>
        </dl>
        <dl class="okr-progress">
          <dt>
            <em>OKR进度</em>
          </dt>
          <dd>
            <el-progress
              type="circle"
              :percentage="item.okrMain.okrProgress"
              :width="60"
              :stroke-width="5"
              color="#4ccd79"
              class="tl-progress-circle"
            ></el-progress>
          </dd>
        </dl>
      </div>
      <div class="card-panel-body">
        <tl-okr-table :tableList="item.tableList">
          <template slot="head-undertake" slot-scope="props">
            <div
              v-if="props.okritem.continueCount > 0"
              @click="
                goUndertakeMaps(
                  props.okritem.okrDetailId,
                  props.okritem.okrDetailObjectKr
                )
              "
            >
              <i
                :class="{
                  'has-undertake': props.okritem.continueCount > 0,
                }"
                class="el-icon-link"
              ></i>
            </div>
            <div v-else-if="showUndertake">暂无</div>
          </template>
          <template slot="body-bar" slot-scope="props">
            <div
              v-if="props.okritem.continueCount > 0"
              @click="
                goUndertakeMaps(
                  props.okritem.okrDetailId,
                  props.okritem.okrDetailObjectKr
                )
              "
            >
              <i
                :class="{
                  'has-undertake': props.okritem.continueCount > 0,
                }"
                class="el-icon-link"
              ></i>
            </div>
            <div v-else-if="showUndertake">暂无</div>
          </template>
          <template slot="weight-bar" slot-scope="props">
            <div
              v-if="item.okrMain.status == '1'"
              @click="openUpdate(props.okritem)"
            >
              <el-button plain class="tl-btn btn-lineheight"
                >更新进展</el-button
              >
            </div>
          </template>
        </tl-okr-table>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import okrTable from './components/okrTable';
import CONST from './const';
import Server from './server';

const server = new Server();

export default {
  name: 'concernedOkr',
  components: {
    'tl-okr-table': okrTable,
  },
  data() {
    return {
      server,
      keyWord: '',
      CONST,
      focusList: [],
      exist: false,
      param: [],
      selectUserId: '',
      tableList: [],
      totalData: [],
    };
  },
  computed: {
    ...mapState('common', {
      roleCode: (state) => state.roleCode,
    }),
    expands() {
      if (this.tableList.length > 0) {
        return [this.tableList[0].okrDetailId];
      }
      return [];
    },
    showUndertake() {
      if (this.roleCode.includes('ORG_ADMIN')) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.hasPower('okr-foucs-list')) {
        this.queryFocusList();
      }
    },
    queryFocusList() {
      this.server.focusList().then((res) => {
        if (res.code == '200') {
          this.focusList = res.data;
          if (this.focusList.length > 0) {
            this.totalData = res.data;
            this.selectUserId = this.focusList[0].userId;
            this.queryOKR(this.focusList[0]);
          }
        }
      });
    },
    searchFocus() {
      this.focusList = this.totalData.filter((item) => item.userName.indexOf(this.keyWord) > -1) || [];
    },
    addFocus(data) {
      this.param = [];
      this.param.push({
        focusType: 0,
        targetId: data.okrMain.okrId,
        supported: 1,
      });
      this.server.addFocus(
        this.param,
      ).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.init();
        }
      });
    },
    queryOKR(data) {
      if (this.hasPower('okr-focus-user-detail')) {
        this.tableList = [];
        this.server.queryFocusUserOkr({
          userId: data.userId,
        }).then((response) => {
          if (response.code == '200') {
            response.data.forEach((item) => {
              this.tableList.push({
                okrMain: item.okrMain,
                tableList: item.okrDetails,
              });
            });
          }
        });
      }
    },
    cancelFocus(data) {
      this.param = [];
      this.param.push({
        focusType: 0,
        targetId: data.okrMain.okrId,
        supported: 0,
      });
      this.server.addFocus(
        this.param,
      ).then((res) => {
        if (res.code == '200') {
          console.log(res);
          this.init();
        }
      });
    },
    success() {
      this.exist = false;
      this.init();
    },
    closed() {
      this.exist = false;
    },
    selectUser(data) {
      this.selectUserId = data.userId;
      this.queryOKR(data);
    },
  },
};
</script>