<template>
  <Mesh cast-shadow :position="realPosition">
    <BoxGeometry ref="box" :size="SIZE"/>
    <LambertMaterial>
      <Texture :magFilter="NearestFilter" ref="cubeTexture" :src="`/textures/${type}.${FTYPES[type]}`"/>
    </LambertMaterial>
  </Mesh>
</template>

<script>
import {RepeatWrapping, NearestFilter} from 'three'
const SIZE = 1;
const FTYPES = {
  'cobblestone':'jpeg',
  'dirt':'jpeg',
  'glass':'png',
  'grass':'jpeg',
  'log':'jpeg',
  'stone':'jpeg',
  'wood':'png'
}
export default {
  name: "Cube",
  props: {
    'type': String,
    'position':{
      type:Object, default:{
        x:0, y:0, z:0
      }
    },
    opacity:{
      type: Number, default: 1
    }
  },
  data:()=>({
    SIZE, FTYPES, NearestFilter
  }),
  mounted(){
    const { texture:cubeTexture } = this.$refs.cubeTexture
    cubeTexture.wrapS = RepeatWrapping;
    cubeTexture.wrapT = RepeatWrapping;
    cubeTexture.repeat.set(1,1)
  },
  computed:{
    realPosition(){
      return {
        x: this.position.x*SIZE,
        y: this.position.y*SIZE,
        z: this.position.z*SIZE+SIZE/2
      }
    }
  }
}
</script>

<style scoped>

</style>
