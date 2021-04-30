<template>
  <div>
    <h2>{{debug}}</h2>
  <Renderer shadow ref="renderer" antialias resize="window" >
    <PerspectiveCamera ref="camera"  :position="{ z: 100, x:0, y:0 }" />
    <Scene :background="'#9adcf1'" ref="scene">
      <PointLight :shadow-map-size="{ width: 512, height: 512 }" cast-shadow :position="{ y: -50, z: 4, x:0 }"/>
      <PointLight :shadow-map-size="{ width: 512, height: 512 }" cast-shadow :position="{ y: 50, z: 50, x:50 }"/>
      <Ground/>
      <Cube
          v-for="z in 10"
          type="dirt" :position="{x:0, y:0, z:z-1}"/>
    </Scene>
  </Renderer>
  </div>
</template>

<script>
const PLAYER_HEIGHT = 4;
const PLAYER_RADIUS = 1;
const PLAYER_SPEED = 0.2;
import Ground from "../components/Ground.vue";
import Cube from "../components/Cube.vue";
import {Raycaster, Vector3} from 'three';
export default {
  name: "World",
  components: {Ground, Cube},
  data:()=>({
    speedBoost: 1,
    keys:{},
    debug:{},
    raycaster: new Raycaster(),
    camera: null,
    renderer:null,
    scene:null
  }),
  mounted() {
    const {renderer} = this.$refs.renderer;
    this.renderer = renderer;
    const {camera} = this.$refs.camera
    const scene = this.$refs.scene;
    this.scene = scene;

    this.camera = camera;
    camera.rotation.order = 'XYZ';
    camera.rotation.set(Math.PI/2, Math.PI, 0);
    camera.position.set(0,  25, PLAYER_HEIGHT);
    //console.log(camera.rotation)
    document.addEventListener('click', e => {
      document.body.requestPointerLock();
    });
    document.addEventListener('mousemove', e => {
      if (document.pointerLockElement) {
        camera.rotation.y -= e.movementX / 700;

          this.debug.y = (camera.rotation.y % (Math.PI*2))*180/Math.PI + 90
        this.debug.x = (camera.rotation.x % (Math.PI*2))*180/Math.PI - 90
        //this.debug.camx = camera.rotation.x
        if (this.debug.y < 180 && this.debug.y > 0) {
          this.debug.rot = 'back';
          camera.rotation.x -= e.movementY / 700; // this part is good
          if (this.debug.x < 0) camera.rotation.x = Math.PI / 2;
          else if (camera.rotation.x > Math.PI ) camera.rotation.x = Math.PI;
        }
        else {
          this.debug.rot = 'front'
          camera.rotation.x += e.movementY / 700; // this part is good
          if (camera.rotation.x > Math.PI / 2) camera.rotation.x = Math.PI / 2; //good
          else if (camera.rotation.x < -Math.PI / 2) camera.rotation.x = -Math.PI / 2; //good

        }
      }
    });
    const keys = this.keys;
    document.addEventListener('keydown', e => {
      switch (e.keyCode) {
        case 65: case 37: keys.left = true; break;
        case 87: case 38: keys.up = true; break;
        case 68: case 39: keys.right = true; break;
        case 83: case 40: keys.down = true; break;
        case 16: keys.shift = true; break;
      }
    });
    document.addEventListener('keyup', e => {
      switch (e.keyCode) {
        case 65: case 37: keys.left = false; break;
        case 87: case 38: keys.up = false; break;
        case 68: case 39: keys.right = false; break;
        case 83: case 40: keys.down = false; break;
        case 16: keys.shift = false; break;
      }
    });
    this.animate();
  },
  methods: {
    animate() {

      requestAnimationFrame(this.animate);

      // 6. MOVEMENT
      const dx = Math.sin(this.camera.rotation.z);
      const dz = Math.cos(this.camera.rotation.z);
      this.speedBoost += ((this.keys.shift ? 20 : 1) - this.speedBoost) / 50;
      let xv = 0, zv = 0;
      if (this.keys.up) {
        xv -= dx * PLAYER_SPEED * this.speedBoost;
        zv -= dz * PLAYER_SPEED * this.speedBoost;
      }
      if (this.keys.down) {
        xv += dx * PLAYER_SPEED * this.speedBoost;
        zv += dz * PLAYER_SPEED * this.speedBoost;
      }
      if (this.keys.left) {
        xv -= dz * PLAYER_SPEED * this.speedBoost;
        zv += dx * PLAYER_SPEED * this.speedBoost;
      }
      if (this.keys.right) {
        xv += dz * PLAYER_SPEED * this.speedBoost;
        zv -= dx * PLAYER_SPEED * this.speedBoost;
      }
      this.camera.position.x -= this.collideAxis(xv, true);
      this.camera.position.y += this.collideAxis(zv, true);

      this.renderer.render(this.scene.scene, this.camera);
    },
    abstractedPlayerCollision(xCorner, zCorner, direction) {
      const start = this.camera.position.clone().add(new Vector3(xCorner * PLAYER_RADIUS,
          0, zCorner * PLAYER_RADIUS));
      this.raycaster.set(start, direction.normalize());
      const [intersection] = this.raycaster.intersectObjects(this.collideables||[]);
      return intersection || null;
    },
    collideAxis(velocity, isX) {
      if (velocity !== 0) {
        const sign = Math.sign(velocity);
        const leftIntersection = this.abstractedPlayerCollision(isX ? 0 : -1,
            isX ? -1 : 0, new Vector3(isX ? velocity : 0, 0, isX ? 0 : velocity));
        const rightIntersection = this.abstractedPlayerCollision(isX ? 0 : 1,
            isX ? 1 : 0, new Vector3(isX ? velocity : 0, 0, isX ? 0 : velocity));
        const intersection = leftIntersection && rightIntersection
            ? (leftIntersection.distance < rightIntersection.distance
                ? leftIntersection : rightIntersection) : leftIntersection
            || rightIntersection;
        if (intersection && intersection.distance <= Math.abs(velocity) + PLAYER_RADIUS) {
          const axisName = isX ? 'x' : 'z';
          return intersection.point[axisName] - camera.position[axisName] - sign * PLAYER_RADIUS;
        }
      }
      return velocity;
    }
  }
}
</script>

<style scoped>

</style>
