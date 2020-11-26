<template>
  <div>
    <transition-group
      tag="ul"
      :class="[
        'el-upload-list',
        'el-upload-list--' + listType,
        { 'is-disabled': disabled },
      ]"
      name="el-list"
    >
      <li
        v-for="file in files"
        :key="file.uid"
        tabindex="0"
        @focus="focusing = true"
        @blur="focusing = false"
        @click="focusing = false"
      >
        <slot :file="file">
          <div class="el-upload-list__item-name c-upload-list__item-name">
            <img
              class="el-upload-list__item-thumbnail"
              v-if="
                file.status !== 'uploading' &&
                ['picture-card', 'picture'].indexOf(listType) > -1
              "
              :src="file.url"
              alt=""
            />
            <span class="c-upload-item-name">
              <i class="el-icon-document"></i
              >{{ file.name || file.resourceName }}</span
            >
            <span class="c-upload-item-date">{{ file.uploadDate }}</span>
          </div>
          <div class="upload-option">
            <!-- <span class="el-upload-list__item-status-label">
              <i
                :class="{
                  'el-icon-upload-success': true,
                  'el-icon-circle-check': listType === 'text',
                  'el-icon-check':
                    ['picture-card', 'picture'].indexOf(listType) > -1,
                }"
              ></i>
            </span> -->
            <span
              v-if="images_map[file.resourceType]"
              @click="openExistFile(file)"
              >预览</span
            >
            <span
              v-else-if="images_map[cutType(file.resourceName)]"
              @click="openFile(file)"
              >预览</span
            >
            <span
              v-else-if="images_map[cutType(file.name)]"
              @click="openresFile(file)"
              >预览</span
            >
            <!-- 只有sourceKey存在才能下载 -->
            <span v-if="hasValue(sourceKey)" @click="downExistFile(file)"
              >下载</span
            >
            <!-- <span v-else @click="downFile(file)">下载</span> -->
            <span
              ><i
                class="el-icon-close"
                v-if="!disabled"
                @click="$emit('remove', file)"
              ></i
            ></span>
          </div>

          <el-progress
            v-if="file.status === 'uploading'"
            :type="listType === 'picture-card' ? 'circle' : 'line'"
            :stroke-width="listType === 'picture-card' ? 6 : 2"
            :percentage="parsePercentage(file.percentage)"
          >
          </el-progress>
          <!-- 图片类型 -->
          <span
            class="el-upload-list__item-actions"
            v-if="listType === 'picture-card'"
          >
            <span
              class="el-upload-list__item-preview"
              v-if="handlePreview && listType === 'picture-card'"
              @click="handlePreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="$emit('remove', file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </slot>
      </li>
    </transition-group>
    <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
  </div>
</template>
<script>
// import ElProgress from 'element-ui/packages/progress';
import imgDialog from '@/components/imgDialog';
import Locale from './locale';

export default {

  name: 'ElUploadList',

  mixins: [Locale],
  components: { 'img-dialog': imgDialog },
  data() {
    return {
      focusing: false,
      images_map: {
        jpg: true,
        jpeg: true,
        png: true,
        bmp: true,
        gif: true,
      },
    };
  },
  // components: { ElProgress },

  props: {
    files: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handlePreview: Function,
    listType: String,
    sourceKey: String,
    sourceType: String,
  },
  methods: {
    cutType(name) {
      console.log(name);
      if (name && name.indexOf('.') > -1) {
        return name.split('.')[1];
      } return '';
    },
    parsePercentage(val) {
      return parseInt(val, 10);
    },
    handleClick(file) {
      console.log(file);
      // eslint-disable-next-line no-unused-expressions
      this.handlePreview && this.handlePreview(file);
    },
    // 预览
    openFile(fileObj) {
      this.$refs.imgDialog.show(fileObj.resourceUrl);
    },
    openExistFile(fileObj) {
      const images = {
        jpg: true,
        jpeg: true,
        png: true,
        bmp: true,
        gif: true,
      };
      if (images[fileObj.resourceType]) {
        this.$refs.imgDialog.show(fileObj.resourceUrl);
      }
    },
    openresFile(file) {
      if (file.response && file.response.data) {
        const url = file.response.data.resourceUrl;
        console.log(url);
        this.$refs.imgDialog.show(url);
      }
    },
    // 下载
    downFile(fileObj) {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      const url = `${origin}/gateway/system-service/sys/attachment/outside/download?resourceId=${fileObj.resourceId}&sourceType=${this.sourceType}&sourceKey=${this.sourceKey}`;
      window.open(url);
    },
    // 下载
    downExistFile(fileObj) {
      let resourceId = '';
      if (fileObj.resourceId) {
        resourceId = fileObj.resourceId;
      } else if (fileObj.response.data) {
        resourceId = fileObj.response.data.resourceId;
      }
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      const url = `${origin}/gateway/system-service/sys/attachment/outside/download?resourceId=${resourceId}&sourceType=${this.sourceType}&sourceKey=${this.sourceKey}`;
      window.open(url);
    },
  },
};
</script>
