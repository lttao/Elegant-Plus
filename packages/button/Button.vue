<template>
  <button @click="handleClick"></button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Size, Type } from './src/interface'
import { createNamespace } from '../_utils';

const { prefixedName: name } = createNamespace('button');
const buttonProps = {
  color: String,
  text: Boolean,
  block: Boolean,
  loading: Boolean,
  disabled: Boolean,
  circle: Boolean,
  size: String as PropType<Size>,
  ghost: Boolean,
  round: Boolean,
  focusable: {
    type: Boolean,
    default: true,
  },
  keyboard: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String as PropType<Type>,
    default: 'default',
  },
  dashed: Boolean,
  bordered: {
    type: Boolean,
    default: true,
  },
};

export default defineComponent({
  name,
  props: buttonProps,
  setup(props, { emit }) {
    const handleClick = (e: MouseEvent): void => {
      e.preventDefault()
      if (props.disabled) return
      emit('click', e)
    }

    return {
      handleClick
    }
  },
});
</script>

<style scoped lang="scss">
@import './src/index.scss'
</style>
