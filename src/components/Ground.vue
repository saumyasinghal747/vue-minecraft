<template>
  <Mesh receive-shadow>
    <PlaneGeometry ref="groundPlane" :width="500" :height="500"/>

    <BasicMaterial :side="DoubleSide">
      <Texture :magFilter="NearestFilter" ref="grassTexture" src="/textures/grass.jpeg"/>
    </BasicMaterial>
  </Mesh>

</template>

<script>
import {DoubleSide, RepeatWrapping, NearestFilter} from 'three'

export default {
  name: "Ground",
  data: () => ({
    DoubleSide, NearestFilter
  }),
  mounted() {
    const grass = this.$refs.grassTexture.texture;
    grass.wrapS = RepeatWrapping;
    grass.wrapT = RepeatWrapping;
    grass.repeat.set(250, 250);
    const ground = this.$refs.groundPlane.mesh;
    ground.mesh.position.set(0, 0, 0)

  }
}
</script>

<style scoped>

</style>
