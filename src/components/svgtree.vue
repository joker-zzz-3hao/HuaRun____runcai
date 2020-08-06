<!--
参考使用说明https://www.yuque.com/crcloud/team/vl2rkn
-->
<template>
  <div>
    <div class="draw-area" id="treeContent" ref="treeContent">
      <div v-for="(arr, index) in levels" :key="index">
        <!-- 通过left和top控制每个节点位置 -->
        <div
          v-for="(v,index) in arr"
          v-show="!v.parent || v.parent.open"
          class="vnode"
          v-bind:class="{pnode: v.children && v.children.length > 0}"
          :key="index"
          :style="'left:' + (v.left) + 'px; top:' + (v.top) + 'px'"
          @click="toggle(v)"
        >
          <div>
            <slot name="treecard" :node="v"></slot>
          </div>
        </div>
      </div>
      <svg :id="svgId" v-if="curveness">
        <!-- 直线 -->
        <line
          class="link"
          v-for="(link, index) in list"
          v-show="link.deep > 0 && link.parent.open"
          :x1="link.left + 90"
          :y1="link.top"
          :x2="link.parent.left + 105"
          :y2="link.parent.top + 150"
          :stroke="link.color ? link.color : '#aaa'"
          :stroke-width="link.strokeWidth ? link.strokeWidth : '1px'"
          :key="index"
        />
      </svg>

      <svg :id="svgId" v-if="!curveness">
        <path
          class="link"
          v-for="(link, index) in list"
          v-show="link.deep > 0 && link.parent.open"
          :d="link.path"
          :stroke="link.color ? link.color : '#aaa'"
          :stroke-width="link.strokeWidth ? link.strokeWidth : '1px'"
          :key="index"
        />
      </svg>
    </div>
  </div>
</template>

<script>

export default {
  name: 'VueSvgTree',
  components: {
  },
  data() {
    return {
      rules: {
        min: 200,
        max: 350,
      },
      delayRules: {
        min: 10,
        max: 300,
      },
      root: null, // 顶层根节点s
      list: null, // 列表
      levels: null, // 层次存储
    };
  },
  props: {
    treeData: {
      type: Array,
    },
    direction: {
      type: String,
      default: 'row', // col:横向 row:纵向
    },
    svgId: {
      type: String,
      default: 'svg',
    },
    curveness: {
      type: Boolean,
      default: false,
    },
    // 横向时节点块高度
    blockHeight: {
      type: Number,
      default: 200,
    },
    // 纵向时节点块宽度
    blockWidth: {
      type: Number,
      default: 300,
    },
    fatherId: {
      type: String,
      default: 'fatherId',
    },
    childId: {
      type: String,
      default: 'id',
    },
  },
  mounted() {
    if (this.treeData && this.treeData.length > 0) {
      this.initData(JSON.parse(JSON.stringify(this.treeData)));
    }
  },
  watch: {
    treeData(val) {
      if (val && val.length > 0) {
        this.initData(JSON.parse(JSON.stringify(val)));
      }
    },
  },
  methods: {
    compare(v1, v2) {
      if (v1.deep !== v2.deep) {
        return v1.deep - v2.deep;
      }

      if (v1.parent === v2.parent) {
        return v1[this.childId] - v2[this.childId];
      }

      return this.compare(v1.parent, v2.parent);
    },
    // 初始化数据： 计算deep等
    initData(data) {
      const keys = {}; // 生成一个以id为key的数组
      let root = null;
      const levels = []; // 层级数组

      if (!data && !(data.length > 0)) {
        return;
      }

      data.forEach((v) => {
        keys[v[this.childId]] = v;
        v.deep = 0;
        v.top = 0;
        v.height = 0;
        v.width = 0;
        v.path = '';
        v.left = 0;
        v.prev = null; // 前一个节点
      });
      data.forEach((v) => {
        if (v[this.fatherId] || v[this.fatherId] > 0) {
          const p = keys[v[this.fatherId]]; // p为v的上一级
          p.children = p.children || []; // 创建p的子节点数组
          p.children.push(v); // 把当前节点放到p的子节点数组里
          v.parent = p;
          v.deep = p.deep + 1; // 深度为p的深度+1
          // v.left = v.deep * 150 + 10;
          v.left = this.direction == 'col' ? v.deep * 300 + 10 : 0;
          v.top = this.direction == 'row' ? v.deep * 250 + 5 : 0; // 纵向 深度*250（块的高度）+ 5（间隔）
          v.open = v.deep < 1; // 除根节点默认open为false
          v.show = v.deep < 2; // 大于2层默认show为false
        } else {
          root = v;
          v.open = true;
          v.show = true;
        }
      });
      data.sort(this.compare); // 排序
      data.forEach((v) => {
        levels[v.deep] = levels[v.deep] || []; // 创建当前层级的数组
        levels[v.deep].push(v); // 把当前节点加到当前层级里
        v.prev = levels[v.deep][levels[v.deep].length - 2]; // 前一个节点
      });

      this.root = root; // 根节点
      this.list = data;
      this.levels = levels;
      if (this.direction == 'col') {
        // 横向
        this.calcHeight(root);
        this.calcTop();
        this.calSvg();
      } else {
        // default 纵向
        this.calWidth(root); // 计算宽度
        this.calcLeft();
        this.calSvgVer();
      }
    },
    // 计算所有节点占用的高度和宽度是否展示
    calcHeight(vnode) {
      const me = this;
      let height = 0;
      if (vnode.parent && !vnode.parent.open) {
        // 存在父节点并且父节点不展开
        vnode.height = 0;
        vnode.open = false;
      } else if (!vnode.open) {
        // 不展开，高度为默认高度(只有一个根节点时)
        vnode.height = this.blockHeight;
      }
      // 有子节点
      if (vnode.children && vnode.children.length > 0) {
        vnode.children.forEach((v) => {
          // 递归计算所有子节点的高度
          me.calcHeight(v);
          height += v.height;
        });
      }
      if (vnode.open) {
        // 已展开的节点，高度为子节点高度相加
        vnode.height = height || this.blockHeight;
      }
    },
    calWidth(vnode) {
      const me = this;
      let width = 0;
      if (vnode.parent && !vnode.parent.open) {
        // 存在父节点并且父节点不展开
        vnode.height = 0;
        vnode.width = 0;
        vnode.open = false;
      } else if (!vnode.open) {
        // 不展开，宽度为默认宽度
        vnode.width = this.blockWidth;
      }
      if (vnode.children && vnode.children.length > 0) {
        vnode.children.forEach((v) => {
          // 递归计算所有子节点的宽度
          me.calWidth(v);
          width += v.width;
        });
      }
      if (vnode.open) {
        vnode.width = width || this.blockWidth;
      }
    },
    // 计算svg的大小
    calSvg() {
      this.$nextTick(() => {
        // eslint-disable-next-line no-unused-vars
        const maxHeight = this.levels.flat(Infinity).filter((item) => item.show).sort((a, b) => b.top - a.top)[0].top;
        // 获取svg的dom
        const svg = document.getElementById(this.svgId);
        svg.setAttribute('height', this.root.height);
        svg.setAttribute('width', this.$refs.treeContent.scrollWidth);
        this.$emit('toggle', this.$refs.treeContent.scrollWidth, this.root.height);
      });
    },
    // 计算svg的大小 纵向
    calSvgVer() {
      this.$nextTick(() => {
        // eslint-disable-next-line no-unused-vars
        const maxHeight = this.levels.flat(Infinity).filter((item) => item.show).sort((a, b) => b.top - a.top)[0].top;
        // let svg = document.getElementById('svg')
        // 获取svg的dom
        const svg = document.getElementById(this.svgId);
        svg.setAttribute('height', this.$refs.treeContent.scrollHeight); // 设置高度 滚动
        svg.setAttribute('width', this.root.width); // 设置宽度 root根节点的宽度
        // 向父组件传值？但是父组件没有用到toggle
        this.$emit('toggle', { width: this.root.width, height: this.$refs.treeContent.scrollHeight });
      });
    },
    // 计算节点top的位置
    calcTop(vnode, prevHeight) {
      if (!vnode) {
        vnode = this.root; // 第一次进来为根节点
      }
      prevHeight = prevHeight || 0;
      // 使父节点top为所有子节点高度一半（位置居中
      vnode.top = prevHeight + vnode.height / 2;
      if (vnode.children && vnode.children.length > 0) {
        for (let i = 0; i < vnode.children.length; i += 1) {
          const { height } = vnode.children[i];
          this.calcTop(vnode.children[i], prevHeight);
          prevHeight += height;
        }
      }
      // 画线
      if (vnode.parent) {
        // 横向曲线偏移量。使曲线位于节点的中部
        const pianyi = this.blockWidth / 4;
        // 控制曲线的宽度，曲线终点的x
        const pLeft = vnode.parent.left + this.blockWidth - 50;
        // 控制点的y和终点的y
        const pTop = vnode.parent.top + pianyi;
        // 控制点的x，调整曲线的形状
        const mLeft = (vnode.left + pLeft) / 2;
        // eslint-disable-next-line no-unused-vars
        const mTop = (vnode.top + pTop) / 2;
        vnode.path = `M${vnode.left},${vnode.top + pianyi
        } C ${mLeft} ${vnode.top + pianyi},${mLeft} ${pTop
        },${pLeft} ${pTop}L ${vnode.parent.left},${pTop}`;
      }
    },
    // 节点左边位置
    calcLeft(vnode, prevWidth) {
      if (!vnode) {
        vnode = this.root; // 第一次进来为根节点
      }
      prevWidth = prevWidth || 0;
      vnode.left = prevWidth + vnode.width / 2; // 前面累计宽度 加 当前节点宽度一半
      if (vnode.children && vnode.children.length > 0) {
        for (let i = 0; i < vnode.children.length; i += 1) {
          const { width } = vnode.children[i]; // 解构赋值
          // 递归计算子节点宽度
          this.calcLeft(vnode.children[i], prevWidth);
          prevWidth += width; // 累计宽度
        }
      }
      // 如果有父节点
      if (vnode.parent) {
        const pLeft = vnode.parent.left + 115; // 父左
        const pTop = vnode.parent.top + 150;// 父上
        const vLeft = vnode.left + 115;// 节点左
        const vTop = vnode.top;// 节点上
        const mLeft = (pLeft + vLeft) / 2;
        // eslint-disable-next-line no-unused-vars
        const mTop = (pTop + vTop) / 2;
        // 节点在父 左边或右边 控制点的x1（控制曲线的形状）
        const x1 = vLeft > pLeft ? vLeft + 5 : vLeft - 5;
        if (vLeft == pLeft) {
          // 父左和节点左相等，画一条直线
          // eslint-disable-next-line no-useless-concat
          vnode.path = `M${vLeft},${vTop} ` + ` L ${pLeft},${pTop}`;
        } else {
          // 画贝塞尔曲线 M 起点 Q x1,y1控制点 x2,y2中间点 T x4,y4终点
          vnode.path = `M${vLeft},${vTop
          } Q ${x1},${vTop - 30} ${
            mLeft},${vTop - 30
          } T ${pLeft},${pTop}`;
        }
      }
    },
    // 收缩和展开
    toggle(vnode) {
      // 点开或关闭
      vnode.open = !vnode.open;
      // 如果有子节点
      if (vnode.children) {
        // show没用用上
        // eslint-disable-next-line array-callback-return
        vnode.children.map((child) => {
          child.show = !child.show;
        });
      }
      // 计算每个节点位置和画出svg
      if (this.direction == 'col') {
        this.calcHeight(this.root);
        this.calcTop();
        this.calSvg();
      } else {
        this.calWidth(this.root);
        this.calcLeft();
        this.calSvgVer();
      }
    },
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  font-size: 14px;
}
.draw-area {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  margin: 40px auto;
}
svg {
  z-index: 0;
}
.vnode {
  position: absolute;
  z-index: 100;
  top: 10px;
  left: 10px;
  height: 160px;
  margin: 0;
  margin-top: -10px;
  font-size: 13px;
  line-height: 20px;
  border-radius: 3px;
  background: #ffffff;
  box-shadow: 1px 2px 10px 3px rgba(0, 0, 0, 0.08);
  transition: top 0.3s;
  /* cursor: pointer; */
  width: auto;
  /* width: 230px;
    overflow:hidden; */
}

/* 如果有子节点。画一条红线 */
.pnode::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  display: inline-block;
  width: 216px;
  height: 1px;
  background: #e1244e;
}
.link {
  fill-opacity: 0;
}
.tip {
  z-index: 999;
  display: block;
  padding: 5px;
  border: 1px solid #eee;
  line-height: 20px;
  border-radius: 5px;
  background: transparent;
}
.vnode:hover {
  z-index: 999;
}
.vnode:hover .tip {
  display: block;
}
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
