<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <HelloWorld msg="msg" />

  <e-input v-model="value" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import EInput from '../packages/input/EInput.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    EInput
  },
  data() {
    return {
      value: ''
    }
  }
})
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
