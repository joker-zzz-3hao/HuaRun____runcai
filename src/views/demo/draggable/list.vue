<template>
  <div class="row">
    <div class="col-4">
      <h3>待进行</h3>
      <draggable
        class="list-group"
        :list="list1"
        group="people"
        :clone="cloneDog"
        @end="onMove"
        id="norun"
      >
        <div class="list-group-item" v-for="(element, index) in list1" :key="element.name">
          {{ element.name }} {{ index }}
          <p>{{element.okr}}</p>
          <p>{{element.status}}</p>
        </div>
      </draggable>
    </div>

    <div class="col-4">
      <h3>进行中</h3>
      <draggable
        class="list-group"
        :list="list2"
        group="people"
        id="running"
        :clone="cloneDog"
        @end="onMove"
      >
        <div class="list-group-item" v-for="(element, index) in list2" :key="element.name">
          {{ element.name }} {{ index }}
          <p>{{element.okr}}</p>
          <p>{{element.status}}</p>
        </div>
      </draggable>
    </div>

    <div class="col-4">
      <h3>已完成</h3>
      <draggable
        class="list-group"
        :list="list3"
        group="people"
        id="end"
        :clone="cloneDog"
        @end="onMove"
      >
        <div class="list-group-item" v-for="(element, index) in list3" :key="element.name">
          {{ element.name }} {{ index }}
          <p>{{element.okr}}</p>
          <p>{{element.status}}</p>
        </div>
      </draggable>
    </div>
    <!-- <rawDisplayer class="col-3" :value="list1" title="List 1" />
    <rawDisplayer class="col-3" :value="list2" title="List 2" />
    <rawDisplayer class="col-3" :value="list3" title="List 3" />-->
  </div>
</template>
<script>
import draggable from 'vuedraggable';

export default {
  name: 'two-lists',
  display: 'Two Lists',
  order: 1,
  components: {
    draggable,
  },
  data() {
    return {
      list1: [
        {
          name: 'John', okr: '迭代16前端开发', status: '未开始', id: 1,
        },
        {
          name: 'Joao', okr: '销售额18w', status: '未开始', id: 2,
        },
        {
          name: 'Jean', okr: '迭代16后端开发', status: '未开始', id: 3,
        },
        {
          name: 'Gerard', okr: '迭代16产品设计', status: '未开始', id: 4,
        },
      ],
      list2: [
        {
          name: 'Juan', okr: '营业额29w', status: '进行中', id: 5,
        },
        {
          name: 'Edgard', okr: 'UI设计', status: '进行中', id: 6,
        },
        {
          name: 'Johnson', okr: '迭代16测试', status: '进行中', id: 7,
        },
      ],
      list3: [
        {
          name: 'Juan', okr: '迭代15研发', status: '已完成', id: 8,
        },
        // {
        //   name: 'Edgard', okr: '', status: '已完成', id: 9,
        // },
        // {
        //   name: 'Johnson', okr: '', status: '已完成', id: 10,
        // },
      ],
      changeid: '',
      removeid: '',
      item: {},
    };
  },
  methods: {

    cloneDog(evt) {
      // console.log(this.removeid);
      this.item = evt;
      return evt;
    },
    // changeDog(evt) {
    //   this.changeid = evt.to.id;
    //   console.log(evt.to.id);
    // },
    onMove(evt) {
      this.removeid = evt.to.id;
      // console.log(evt.to.id);
      // console.log(evt.clone);
      if (evt.to.id == 'norun') {
        this.item.status = '未开始';
      } else if (evt.to.id == 'running') {
        this.item.status = '进行中';
      } else if (evt.to.id == 'end') {
        this.item.status = '已完成';
      }
    },
  },
};
</script>
<style  scoped>
.list-group-item {
  border: 1px solid rgb(0, 0, 0);
  width: 80%;
  height: 120px;
  margin: 10px;
}

.row {
  display: flex;
}
.col-4 {
  width: 25%;
}
</style>