<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <HelloWorld msg="msg" />

  <e-input v-model="value" />

  <EButton>按钮</EButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import EInput from '../packages/input/Input.vue';
import EButton from '../packages/button/Button.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    EInput,
    EButton,
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
</style>
