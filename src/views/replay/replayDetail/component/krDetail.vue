<template>
  <div class="kr-replay">
    <elcollapse
      class="tl-collapse okr-change-list"
      v-model="activeNames"
      @change="expand"
    >
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
            </dd>
          </dl>
        </template>
        <dl class="is-kr" v-for="(list, i) in item.krs" :key="i">
          <dt class="tag-kind">
            <span class="kind-child">KR</span>
            <em>{{ list.okrDetailObjectKr }}</em>
          </dt>
          <dd>
            <div>
              <i class="el-icon-medal"></i>
              <span>权重</span>
              <em>{{ list.okrWeight }}%</em>
            </div>
            <div>
              <i class="el-icon-odometer"></i>
              <span>进度</span>
              <tl-process
                :ref="'process' + index + i"
                :data="parseInt(list.okrDetailProgress, 10)"
              ></tl-process>
            </div>
          </dd>
          <dd>
            <div>
              <span>考核指标</span>
              <em>{{ list.checkQuota || "未填写" }}</em>
            </div>
          </dd>
          <dd>
            <div>
              <span>衡量方法</span>
              <em>{{ list.judgeMethod || "未填写" }}</em>
            </div>
          </dd>
          <dd>
            <dl>
              <dt>评分</dt>
              <dd>{{ list.score }}</dd>
            </dl>
            <dl v-if="list.scoreRemark">
              <dt>评分说明</dt>
              <dd>{{ list.scoreRemark }}</dd>
            </dl>
            <dl v-if="list.attachmentDtoList">
              <dt>佐证材料</dt>
              <dd v-for="file in list.attachmentDtoList" :key="file.resourceId">
                <em>{{ file.resourceName }}</em>
                <span>
                  <span
                    v-if="CONST.IMAGES_MAP[cutType(file.resourceName)]"
                    @click="openFile(file)"
                    >预览</span
                  >
                  <span @click="downFile(file)">下载</span>
                </span>
              </dd>
            </dl>
            <template v-if="list.openAdvantage">
              <dl>
                <dt>价值与收获</dt>
                <dd>{{ list.advantage || "未填写" }}</dd>
              </dl>
              <dl>
                <dt>问题与不足</dt>
                <dd>{{ list.disadvantage || "未填写" }}</dd>
              </dl>
              <dl>
                <dt>改进措施</dt>
                <dd v-for="(li, d) in list.measure || []" :key="d">{{ li }}</dd>
                <dd v-if="list.measure.length == 0">未填写</dd>
              </dl>
            </template>
            <div @click="openMore(list)">
              <i :class="list.openAdvantage === true ? 'close' : 'open'"></i>
              <span v-if="list.openAdvantage">收起</span>
              <span v-else>展开</span>
            </div>
          </dd>
        </dl>
      </elcollapseitem>
    </elcollapse>
    <div>
      <span>OKR自评得分</span>
      <em>{{ okrMain.okrMainVo.selfAssessmentScore || 0 }}</em>
    </div>
    <div>
      <span>OKR复核得分</span>
      <em>{{ okrMain.okrMainVo.selfAssessmentScore || 0 }}</em>
    </div>
    <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import CONST from '@/lib/const';
import imgDialog from '@/components/imgDialog';
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  data() {
    return {
      CONST,
      reviewType: 1,
      form: {},
      activeNames: [0],
      server,
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      list: [],
      listBtn: [
        {
          txt: '超级优秀',
          clsName: 'super-good',
        },
        {
          txt: '优秀',
          clsName: 'good',
        },
        {
          txt: '继续努力',
          clsName: 'work-hard',
        },
        {
          txt: '要加油哦',
          clsName: 'refuel',
        },
      ],
    };
  },
  components: {
    elcollapse,
    elcollapseitem,
    'tl-process': process,
    'img-dialog': imgDialog,
  },
  methods: {
    selectColor(txt) {
      if (txt) {
        const data = this.listBtn.filter((item) => item.txt == txt);
        return data[0];
      }
      return '';
    },
    // 折叠展开
    openMore(list) {
      list.openAdvantage = !list.openAdvantage;
      this.$forceUpdate();
    },
    // 重新触发进度条计算
    expand(activeList) {
      activeList.forEach((item) => {
        this.okrMain.okrReviewPojoList[item].krs.forEach((kritem, krIndex) => {
          this.$nextTick(() => {
            this.$refs[`process${item}${krIndex}`][0].changeWidth();
          });
        });
      });
    },
    // -------------文件-------------
    // 截取文件类型
    cutType(name) {
      console.log(name);
      if (name && name.indexOf('.') > -1) {
        return name.split('.')[1];
      } return '';
    },
    // 预览
    openFile(fileObj) {
      this.$refs.imgDialog.show(fileObj.resourceUrl);
    },
    // 下载
    downFile(fileObj) {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      const url = `${origin}/gateway/system-service/sys/attachment/outside/download?resourceId=${fileObj.resourceId}&sourceType=OKR_REVIEW&sourceKey=${this.$route.query.okrId}`;
      window.open(url);
    },
  },
};
</script>