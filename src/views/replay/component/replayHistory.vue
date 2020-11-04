<template>
  <dl class="dl-card-panel replay-record">
    <dt><em>复盘记录</em></dt>
    <dd>
      <div class="tl-custom-timeline">
        <dl class="timeline-list">
          <dd v-for="(item, index) in activities" :key="index">
            <div class="list-info">
              <div class="list-title">{{ item.createTime }}</div>
              <div class="list-cont">
                <div class="operate-type">
                  <em>{{ item.userName }}</em>
                  <span>{{ item.content }}</span>
                </div>
              </div>
            </div>
          </dd>
        </dl>
      </div>
    </dd>
  </dl>
</template>
<script>
export default {
  props: ['activities'],
};
</script>