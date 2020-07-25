<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree :nodes="customize" node-key="label" default-expand-all>
      <template v-slot:header-root="prop">
        <div class="row items-center">
          <div>{{ prop.node.label }}</div>
        </div>
      </template>

      <template v-slot:header-generic="prop">
        <div class="row items-center card">
          <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
        </div>
      </template>

      <template v-slot:body-story="prop">
        <div>{{ prop.node.story }}</div>
      </template>

      <template v-slot:body-toggles="prop">
        <p class="text-caption">这是toggles模板{{ prop.node.caption }}</p>
      </template>
    </q-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customize: [
        {
          label: 'Satisfied customers', // 节点标签
          header: 'generic',
          children: [
            {
              label: 'Good food',
              icon: 'restaurant_menu', // 节点图标
              header: 'generic',
              children: [
                {
                  label: 'Quality ingredients',
                  header: 'generic', // 节点头部作用域的插槽名称
                  // body: 'story',
                  story: 'Lorem ipsum dolor sit amet.',
                },
                {
                  label: 'Good recipe',
                  header: 'generic', // 节点头部作用域的插槽名称
                  // body: 'story', // 节点主体作用域的插槽名称
                  story: 'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.',
                },
              ],
            },
            {
              label: 'Good service',
              header: 'generic',
              // body: 'toggles',
              caption: 'Why are we as consumers so captivated by stories of great customer service? Perhaps it is because...',
              enabled: false,
              children: [
                {
                  label: 'Prompt attention',
                  header: 'generic', // 节点头部作用域的插槽名称

                },
                {
                  label: 'Professional waiter',
                  header: 'generic', // 节点头部作用域的插槽名称
                },
              ],
            },
            // {
            //   label: 'Pleasant surroundings',
            //   children: [
            //     { label: 'Happy atmosphere' },
            //     { label: 'Good table presentation', header: 'generic' },
            //     { label: 'Pleasing decor' },
            //   ],
            // },
          ],
        },
      ],
    };
  },
};
</script>
<style>
.card {
  border: 1px solid rgb(0, 0, 0);
  height: 150px;
  width: 200px;
}

.q-tree__children {
  padding-left: 300px;
}

.q-tree__node-header:before {
  content: "";
  position: absolute;
  top: -75px;
  bottom: 52%;
  width: 35px;
  left: -35px;
  border-right: 1px solid currentColor;
  border-top: 1px solid currentColor;
  border-left: 0px solid currentColor;
  border-bottom: 0px solid currentColor;
}

.q-tree__node--parent > .q-tree__node-header:before {
  width: 82px;
  left: -69px;
}
</style>