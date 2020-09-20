<template>
  <div class="undertake-maps">
    <keep-alive>
      <tl-undertake-maps v-if="undertakeMapsStep == '1'"></tl-undertake-maps>
    </keep-alive>
    <tl-undertake-detail v-if="undertakeMapsStep == '2'"></tl-undertake-detail>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import undertakeMaps from './components/undertakeMaps';
import undertakeDetail from './components/undertakeDetail';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'undertakeMapsIndex',
  components: {
    'tl-undertake-maps': undertakeMaps,
    'tl-undertake-detail': undertakeDetail,
  },
  data() {
    return {
      CONST,
      server,
    };
  },
  computed: {
    ...mapState('common', {
      undertakeMapsStep: (state) => state.undertakeMapsStep,
    }),
  },
  mounted() {
    this.setUndertakeMapsStep('1');
  },
  methods: {
    ...mapMutations('common', ['setUndertakeMapsStep']),
  },
};
</script>
