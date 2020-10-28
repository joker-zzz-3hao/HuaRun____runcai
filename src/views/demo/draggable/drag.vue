<template>
  <div>
    <h3>draggable</h3>
    <draggable
      v-model="list"
      :disabled="!enabled"
      class="list-group"
      ghost-class="ghost"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
      <div class="list-group-item" v-for="element in list" :key="element.name">{{ element.name }}</div>
    </draggable>

    <rawDisplayer :value="list" title="List" />
  </div>
</template>

<script>

import draggable from 'vuedraggable';
import rawDisplayer from './raw-displayer';

export default {
  components: {
    draggable,
    rawDisplayer,
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: 'John', id: 0 },
        { name: 'Joao', id: 1 },
        { name: 'Jean', id: 2 },
      ],
      dragging: false,
    };
  },
  methods: {
    checkMove(evl) {
      console.log(evl);
    },
  },
};
</script>

    <style>
</style>