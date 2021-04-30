<template>
  <div>
  <router-view/>
  </div>
</template>

<script>
import World from "./views/World.vue";
export default {
  components: {World}
}
</script>

<style>
body {
  margin: 0;
}
canvas {
  display: block;
}
</style>
