<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <HelloWorld msg="msg" />

  <e-input v-model="value" />

  <!-- <EButton>按钮</EButton> -->
  <EScrollView class="scroll-view" scrollY refresher-enabled>
    <div style="height: 1000px; background: red;"></div>
  </EScrollView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import EInput from '../packages/input/input.vue';
import EScrollView from '../packages/scrollView/scrollView.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    EInput,
    EScrollView,
    // EButton,
  },
  data() {
    return {
      value: '',
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.scroll-view {
  height: 100px;
}
</style>
