<template>
    <button :style="getStyle()" :class="classes">
        <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createNamespace } from '../_utils/create/index.ts';

const { prefixedName: name } = createNamespace('button');

export default defineComponent({
  name,
  props: {
    icon: String,
    color: String,

  },
  setup(props) {
    const getStyle = () => ({
      color: props.color,
    });

    return {
      getStyle,
    };
  },
});
</script>

<style scoped lang="scss">
@import './index.scss'
</style>
