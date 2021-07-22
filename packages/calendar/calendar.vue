<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createNamespace } from '../_utils';

const { prefixedName: name } = createNamespace('actionSheet');

export default defineComponent({
  name,
  setup() {},
});
</script>

<style lang="scss" scoped>
@import './src/index.scss';
</style>
