<!-- 卡 -->
<template lang="html">
  <div :class="['card', size + '-card']">
    <div class="nocheck"></div>
    <div class="back" v-if="!open">
      <img src="../assets/back.png">
    </div>
    <div  v-show="open" :class="['card-num-left', size + '-num']" :style="{'color': cardColor}">{{value}}</div>
    <div  v-show="open"><img :src="cardType" class="card-type"></div>
    <div  v-show="open" :class="['card-num-right', size + '-num']" :style="{'color': cardColor}">{{type}}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    type: String,
    size: {
      type: String,
      default: 'big'
    },
    open: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    cardType () {
      return require(`@/assets/${this.type}.png`)
    },
    cardColor () {
      let color = {
        'hx': '#f00',
        'fk': '#f00',
        'ht': '#000',
        'mh': '#000'
      }
      return color[this.type]
    }
  }
}
</script>

<style lang="css">
.card {
  position: relative;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-color: #ccc;
  background: #f1f1f1;
  border-radius: 4px;
  font-family: monospace;
  text-align: center;
}
.big-card {
  width: 100px;
  height: 150px;
  font-weight: 600;
  font-size: 40px;
}
.small-card {
  width: 50px;
  height: 80px;
  font-weight: 200;
  font-size: 20px;
}
.card-num-left {
  text-align: left;
  padding-left: 2px;
  width: 50px;
  height: 50px;
}
.big-num {
  height: 50px;
  line-height: 50px;
}
.small-num {
  height: 24px;
  line-height: 24px;
}
.card-num-right {
  position: absolute;
  bottom: 0px;
  padding-left: 2px;
  transform:rotate(0deg);
}
.card-type {
  height: 50%;
  width: 50%;
}
.back {
  height: 90%;
  width: 85%;
  margin: 5%;
  border: 1px dashed #e88;
  background-color: #c1c1ff
}
.back img {
  width: 100%;
  height: 100%;
}
.nocheck {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 999;
}
</style>
