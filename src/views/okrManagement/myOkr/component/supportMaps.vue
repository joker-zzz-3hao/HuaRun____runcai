<template>
  <div>
    <vue-svg-tree
      :treeData="treeData"
      svgId="svg"
      ref="svgTree"
      :curveness="false"
      direction="col"
      fatherId="okrfid"
      childId="cid"
    >
      <div slot="treecard" slot-scope="props">
        <div class="text">
          <div class="node_title">
            <span class="OKR">OKR</span>
            <span class="label">OKR{{props.node.name}}</span>
          </div>
          <div class="node_des">
            <div>{{props.node.content}}</div>
            <div>{{props.node.open}}</div>
            <div>{{$route.params.objectName}}</div>
          </div>
          <div class="showTips" :class="props.node.children ? 'havechild' : ''">
            <a @click="open(props.node)" class="tips_icon icon_edit">
              <i v-if="props.node.open" class="el-icon-minus"></i>
              <i v-else class="el-icon-plus"></i>
            </a>
          </div>
        </div>
      </div>
    </vue-svg-tree>
  </div>
</template>

<script>
import svgtree from '@/components/svgtree';
import Server from '../server';

const server = new Server();

export default {
  name: 'supportMaps',
  components: {
    'vue-svg-tree': svgtree,
  },
  data() {
    return {
      server,
      treeData: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 查承接地图
      this.server.getmaps().then((res) => {
        if (res.code == 200) {
          console.log('承接地图', res.data);
          this.treeData = res.data;
        }
      });
    },
  },
};
</script>
<style>
.vnode .text {
  padding: 0 10px;
}
.vnode .text {
  position: relative;
  height: 100%;
  max-width: 230px;
  min-width: 216px;
}
.vnode .text .node_title {
  padding: 3px 11px 0px 11px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.vnode .text .node_title .OKR {
  display: inline-block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: #fff;
  line-height: 35px;
  text-align: center;
  font-size: 1.2rem;
  background-color: #58c2ef;
}
.vnode .text .node_title .OKR.pink {
  background-color: #e1244e;
}
.vnode .text .node_title .OKR.blue {
  background-color: #58c2ef;
}
.vnode .text .node_title .label {
  max-width: 130px;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  padding-left: 10px;
  font-size: 1rem;
  color: #1f1f1f;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vnode .text .node_title .label button {
  overflow: hidden;
  color: #1f1f1f !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 140px;
  display: inline-block;
  line-height: 35px;
  text-align: left;
}
.vnode .text .node_des {
  display: flex;
  flex-direction: column;
  margin-left: 56px;
  height: 60px;
  color: #777777;
  font-size: 12px;
  justify-content: flex-start;
}
.vnode .text .node_des div {
  width: 140px;
  text-align: left;
}
.vnode .text .node_des div:nth-child(2) {
  margin-top: 5px;
}
.vnode .text .node_progress {
  position: absolute;
  width: 200px;
  bottom: 0px;
  height: 40px;
  border-top: 1px solid #d8d8d8;
  line-height: 40px;
}
.vnode .text .node_progress .el-progress {
  display: inline;
}
.vnode .text .node_progress .el-progress .el-progress__text {
  font-size: 12px !important;
  color: #777777 !important;
}
.vnode .text .showTips {
  position: absolute;
  left: 225px;
  top: 0px;
  opacity: 0;
}
.vnode .text .showTips a {
  display: inline-block;
}
.vnode .text .showTips .tips_icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  text-decoration: none;
  padding: 3px;
  background: #ffffff;
  box-shadow: 1px 2px 10px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.5s ease 0s;
  color: #777777;
}
.vnode .text .showTips .tips_icon:hover {
  color: #58c2ef;
}
.vnode .text:hover .showTips.havechild {
  color: #58c2ef;
  opacity: 1;
}
</style>
