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
        :class="[
          'el-upload-list__item',
          'is-' + file.status,
          focusing ? 'focusing' : '',
        ]"
        :key="file.uid"
        tabindex="0"
        @keydown.delete="!disabled && $emit('remove', file)"
        @focus="focusing = true"
        @blur="focusing = false"
        @click="focusing = false"
      >
        <slot :file="file">
          <img
            class="el-upload-list__item-thumbnail"
            v-if="
              file.status !== 'uploading' &&
              ['picture-card', 'picture'].indexOf(listType) > -1
            "
            :src="file.url"
            alt=""
          />
          <!-- <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>{{file.name}}
          <span>{{file.uploadDate}}</span>
        </a> -->
          <a
            class="el-upload-list__item-name c-upload-list__item-name"
            @click="handleClick(file)"
          >
            <label class="c-upload-item-name">
              <i class="el-icon-document"></i>{{ file.name }}</label
            >
            <span class="c-upload-item-date">{{ file.uploadDate }}</span>
          </a>
          <label class="el-upload-list__item-status-label">
            <i
              :class="{
                'el-icon-upload-success': true,
                'el-icon-circle-check': listType === 'text',
                'el-icon-check':
                  ['picture-card', 'picture'].indexOf(listType) > -1,
              }"
            ></i>
          </label>
          <span @click="openFile(file)">下载</span>

          <i
            class="el-icon-close"
            v-if="!disabled"
            @click="$emit('remove', file)"
          ></i>
          <i class="el-icon-close-tip" v-if="!disabled">{{
            t("el.upload.deleteTip")
          }}</i>
          <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
          <el-progress
            v-if="file.status === 'uploading'"
            :type="listType === 'picture-card' ? 'circle' : 'line'"
            :stroke-width="listType === 'picture-card' ? 6 : 2"
            :percentage="parsePercentage(file.percentage)"
          >
          </el-progress>
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
      <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
    </transition-group>
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
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10);
    },
    handleClick(file) {
      console.log(file);
      // eslint-disable-next-line no-unused-expressions
      this.handlePreview && this.handlePreview(file);
    },
    // 下载or预览
    openFile(res) {
      const fileObj = res.response.data;
      const images = {
        jpg: true,
        jpeg: true,
        png: true,
        bmp: true,
        gif: true,
      };
      if (images[fileObj.resourceType]) {
        this.$refs.imgDialog.show(fileObj.resourceUrl);
      } else {
        window.open(fileObj.resourceUrl);
      }
    },
  },
};
</script>
