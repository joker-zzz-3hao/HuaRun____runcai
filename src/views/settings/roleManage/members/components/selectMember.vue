<!--
 * @Author: 许志鹏
 * @Date: 2020-08-05 10:45:05
 * @Description: file content
-->
<template>
  <div class="issue-message">
    <el-input placeholder="输入用户名称/LDAP账号" v-model="filterText"></el-input>
    <div class="rouleflex">
      <div class="roulewidth">
        <div class="selectTitle">
          <div @click="cleargetqueryMenu()">返回></div>
          <div v-for="(item,index) in selectList" :key="index" @click="selectDep(item)">
            {{item.label}}
            >
          </div>
        </div>
        <div>
          <ul>
            <li v-for="(item,index) in data" :key="index" @click="selectDep(item)">
              <span v-if="item.type=='user'">
                <el-checkbox @change="checkMember($event,item)">{{item.label}}</el-checkbox>
              </span>
              <span v-else>{{item.label}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="roulewidth roulemodel">
        <div class="rouleselect">
          <span>已选1人</span>
          <span>清空</span>
        </div>
        <div class="roulelist">
          <ul>
            <li v-for="(item,index) in roulelist" :key="index">
              <img src alt class="rouleimg" />
              <span>{{item.userName}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    // 返回重置
    cleargetqueryMenu() {
      this.selectList = [];
      this.getqueryMenu();
    },
    // 设置名称
    selectDep(data) {
      this.setTitle(data);
      if (data.type == 'user') {
        return;
      }
      if (data.children.length == 0) {
        this.getRember(data);
      } else {
        this.data = data.children;
      }
    },
    // 设置标题
    setTitle(data) {
      this.selectList[data.num] = data;
    },
    // 获取菜单功能树形结构
    getqueryMenu() {
      this.server.getOrg({})
        .then((res) => {
          this.data = this.getTreeList(res.data[0].sonTree, -1);
        });
    },
    // 递归修改符合element tree结构数据
    getTreeList(data, num) {
      num += 1;
      if (data) {
        return data.map((item) => ({
          id: item.orgId,
          label: item.orgName,
          num,
          children: this.getTreeList(item.sonTree, num),
          type: 'dep',
        }));
      }
    },
    checkMember(node, data) {
      if (node) {
        this.roulelist.push({
          userName: data.label,
          id: data.id,
          userId: data.userId,
          orgId: data.orgId,
          roleId: this.$route.query.roleId,
        });
      } else {
        this.roulelist.forEach((item, index) => {
          if (item.id == data.id) {
            this.roulelist.splice(index, 1);
          }
        });
      }
      this.member = this.roulelist;
      this.$emit('getMember', this.member);
    },
    getRember(data) {
      this.server.listOrgUser({
        orgId: data.id,
      }).then((res) => {
        this.data = res.data.content.map((item) => ({
          label: item.userName,
          id: item.userAccount,
          type: 'user',
          userId: item.userId,
          orgId: item.orgId,
        }));
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },

  data() {
    return {
      server,
      filterText: '',
      dialogTableVisible: false,
      roulelist: [],
      data: [],
      form: {},
      member: '',
      selectList: [],
    };
  },
  mounted() {
    this.dialogTableVisible = true;
    this.getqueryMenu();
  },
};
</script>
<style  scoped>
.rouleflex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}
.roulewidth {
  width: 50%;
}
.rouleselect {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.rouleselect span:nth-child(2) {
  cursor: pointer;
}

.roulemodel {
  padding: 0 25px;
  background: #fff;
}

.roulelist ul li {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.rouleimg {
  background-color: aquamarine;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 20px;
}

.issue-message {
  height: 300px;
  overflow-y: scroll;
}
.selectTitle {
  display: flex;
  flex-direction: row;
}
</style>