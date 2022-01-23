<template>
  <div class="hello" :style="{'height': fullHeight + 'px'}">
    <div class="main">
      <div class="main-top">
        <div class="main-top-left">
          <div class="card-recorder" v-show="startState">
            <span>{{aCards.length}}</span>
          </div>
            <!-- 已出牌区域 -->
           <div class="cards history">
            <card class="card small" size="small" v-for="(item, i) in historyA" :value="item.label" :key="i" :type="item.type"></card>
           </div>
           <div :class="['msg', message.left ? 'say' : 'none']">
            <span>{{message.left}}</span>
           </div>
           <div class="cards other cards-margin-left">
            <card class="card small" :open="open" size="small" :style="{'margin-top': item.checked ? '-20px' : '0px'}" v-for="(item, i) in aCards" :value="item.label" :key="i" :type="item.type" @click.native="changed(item)"></card>
            <div class="clear"></div>
          </div>
          <div class="card-member-img">
            <img src="../assets/man.png">
          </div>
        </div>
        <div class="main-top-right">
          <div class="card-recorder" v-show="startState">
            <span>{{bCards.length}}</span>
          </div>
          <!-- 已出牌区域 -->
          <div class="cards history">
            <card class="card small" size="small" v-for="(item, i) in historyB" :value="item.label" :key="i" :type="item.type"></card>
          </div>
          <div :class="['msg', message.right ? 'say' : 'none']">
           <span>{{message.right}}</span>
          </div>
          <div class="cards other cards-margin-right">
            <card class="card small" :open="open" size="small"  :style="{'margin-top': item.checked ? '-20px' : '0px'}" v-for="(item, i) in bCards" :value="item.label" :key="i" :type="item.type" @click.native="changed(item)"></card>
            <div class="clear"></div>
          </div>
          <div class="card-member-img">
            <img src="../assets/man.png">
          </div>
        </div>
      </div>
      <div class="main-bottom">
        <div class="card-member-img">
          <img src="../assets/man.png">
        </div>
          <!-- 已出牌区域 -->
          <div class="cards history">
            <card class="card small" size="small" v-for="(item, i) in historyCards" :value="item.label" :key="i" :type="item.type"></card>
          </div>
        <div class="buttons" v-show="startState && !special">
          <span class="button" @click="unpush">不出</span>
          <span class="button" v-if="token === 'me'" @click="push">出牌</span>
          <span class="button" v-else style="background-color: #999;">出牌</span>
        </div>
        <div class="cards cards-height">
          <card class="card big" @mousemove.native="mousemove(item)" @mouseup.native="mouseup(item)"  @mousedown.native="mousedown(item)" :style="{'margin-top': item.checked ? '-40px' : '0px'}" v-for="(item, i) in cards" :value="item.label" :key="i" :type="item.type" @click.native="changed(item)"></card>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <div class="special-effect">
      <!-- 特效 -->
      <div :class="['special-effect-main', special ? 'special-effect-main-big' : 'special-effect-main-small']">
        <img v-if="specialType === 0" src="../assets/zd.jpg" style="height: 100%; width: 100%;">
        <img v-if="specialType === 1" src="../assets/man.png" style="height: 100%; width: 100%;">
        <div v-if="specialType === 1" class="text">
          恭喜你，赢了！
        </div>
      </div>
    </div>
    <div class="right-menu">
      <div class="menu-start" @click="start">
        开始
      </div>
      <div class="menu-start" @click="open = !open" :style="{'background-color': open ? '#999' : '#FFFF00', 'color': open ? '#fff' : '#008800'}">
        {{open ? '暗牌' : '明牌'}}
      </div>
      <!-- <div class="menu-start" @click="showSpecial">
        特效
      </div> -->
    </div>
  </div>
</template>

<script>
import card from './card'
export default {
  name: 'HelloWorld',
  data () {
    return {
      first: false,
      moveChange: false,
      open: false,
      special: false, // 特效
      startState: false,
      specialType: 0,
      fullHeight: document.documentElement.clientHeight,
      token: 'me', // me, right, left
      cards: [],
      aCards: [],
      bCards: [],
      historyCards: [],
      historyA: [],
      historyB: [],
      current: [],
      message: {
        me: '',
        right: '',
        left: ''
      },
      cardNum: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      types: {
        '0': 'sha',
        '1': 'shan',
        '2': 'tao'
      },
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    card
  },
  created () {
    window.addEventListener('resize', this.handleResize)
  },
  watch: {
    token (token, historytoken) {
      if (token === 'right') {
        this.historyB = []
        this.autopush('left', this.bCards, this.historyB, token)
        this.message.left = ''
      }
      if (token === 'left') {
        this.historyA = []
        this.autopush('me', this.aCards, this.historyA, token)
        this.message.me = ''
      }
      if (token === 'me') {
        this.historyCards = []
      }
    }
  },
  computed: {
  },
  methods: {
    mousedown (event) {
      console.log('mousedown', event)
      this.moveChange = true
      this.first = !event.checked
    },
    mousemove (event) {
      if (this.moveChange) {
        console.log('mousemove', event)
        this.cards.find(c => c.label === event.label && c.type === event.type).checked = this.first
      }
    },
    mouseup (event) {
      console.log('mouseup', event)
      this.moveChange = false
    },
    showSpecial (specialType) {
      // 显示特效
      this.specialType = specialType
      this.special = true
      setTimeout(() => {
        this.special = false
      }, 2000)
    },
    autopush (next, obj, history, token) {
      console.log('开始', token)
      // 延迟1s
      setTimeout(() => {
        let len = this.current.length
        let flag = false
        let num = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
        // 分组
        let map = new Map()
        obj.forEach(o => {
          let x = num.findIndex(n => n === o.label)
          if (map.has(x)) {
            let array = map.get(x)
            array.push(o)
            map.set(x, array)
          } else {
            map.set(x, [o])
          }
        })
        console.log('map', map)
        if (len === 1) {
          // 单张
          let x = num.findIndex(n => n === this.current[0].label)
          console.log(x)
          let checkCard = false
          map.forEach((v, k, m) => {
            console.log(v, k, m)
            if (k > x && v.length === 1) {
              checkCard = obj.find(o => o.label === v[0].label)
              flag = true
            }
          })
          if (!checkCard) {
            for (let i = obj.length; i > 0; i--) {
              let item = obj[i - 1]
              if (num.findIndex(n => n === item.label) > x) {
                checkCard = item
                flag = true
                break
              }
            }
          }
          if (!checkCard) {
            // 炸弹
            map.forEach((v, k, m) => {
              console.log(v, k, m)
              if (v.length === 4) {
                checkCard = obj.find(o => o.label === v[0].label)
                flag = true
              }
            })
          }
          if (checkCard) {
            checkCard.checked = true
          }
        } else if (len === 2) {
          // 对子
          let x = num.findIndex(n => n === this.current[0].label)
          console.log(x)
          let checkCard = false
          map.forEach((v, k, m) => {
            console.log(v, k, m)
            if (k > x && v.length === 2) {
              checkCard = obj.find(o => o.label === v[0].label)
              flag = true
            }
          })
          if (!checkCard) {
            // 拆3
            map.forEach((v, k, m) => {
              console.log(v, k, m)
              if (k > x && v.length === 3) {
                checkCard = obj.find(o => o.label === v[0].label)
                flag = true
              }
            })
          }
          if (!checkCard) {
            // 炸弹
            map.forEach((v, k, m) => {
              console.log(v, k, m)
              if (v.length === 4) {
                checkCard = obj.find(o => o.label === v[0].label)
                flag = true
              }
            })
          }
          if (checkCard) {
            let ooo = obj.filter(o => o.label === checkCard.label)
            if (ooo.length === 3) {
              ooo[0].checked = true
              ooo[1].checked = true
            } else {
              ooo.map(m => {
                m.checked = true
              })
            }
          }
        } else if (len === 3) {
          // 三不带
          let x = num.findIndex(n => n === this.current[0].label)
          console.log(x)
          let checkCard = false
          map.forEach((v, k, m) => {
            console.log(v, k, m)
            if (k > x && v.length === 3) {
              checkCard = obj.find(o => o.label === v[0].label)
              flag = true
            }
          })
          if (!checkCard) {
            // 炸弹
            map.forEach((v, k, m) => {
              console.log(v, k, m)
              if (v.length === 4) {
                checkCard = obj.find(o => o.label === v[0].label)
                flag = true
              }
            })
          }
          if (checkCard) {
            obj.filter(o => o.label === checkCard.label).map(m => {
              m.checked = true
            })
          }
        } else if (len === 4) {
          // 三带单，炸弹
          // 判断是否有效
          let checkCard = false
          let s = new Set()
          this.current.forEach(c => s.add(c.label))
          s = [...s]
          console.log('ssssssssss', s, s.length, s[0])
          if (s.size === 1) {
            // 炸弹
            let x = num.findIndex(n => n === s[0])
            map.forEach((v, k, m) => {
              console.log(v, k, m)
              if (k > x && v.length === 4) {
                checkCard = obj.find(o => o.label === v[0].label)
                flag = true
              }
            })
          } else if (s.length === 2) {
            let sss = this.current.filter(c => c.label === s[0])
            if (sss.length === 1 || sss.length === 3) {
              let x
              if (sss.length === 1) {
                x = num.findIndex(n => n === s[1])
              } else {
                x = num.findIndex(n => n === s[0])
              }
              let other = false
              map.forEach((v, k, m) => {
                console.log(v, k, m)
                if (k > x && v.length === 3) {
                  checkCard = obj.find(o => o.label === v[0].label)
                  flag = true
                }
                if (v.length === 1) {
                  other = obj.find(o => o.label === v[0].label)
                }
              })

              if (checkCard) {
                other.checked = true
              }
            }
          }

          if (checkCard) {
            obj.filter(o => o.label === checkCard.label).map(m => {
              m.checked = true
            })
          }
        } else if (len === 5) {
          // 三带对， 顺子
        } else if (len === 6) {
          // 顺子 3连队，2连三不带， 4带2
        } else if (len === 7) {
          // 顺子
        } else if (len === 8) {
          // 顺子 2连三带2， 4连队， 4带2对
        } else if (len === 9) {
          // 顺子 3连3不带
        } else if (len === 10) {
          // 顺子 5连对， 2连3带2对
        } else if (len === 11) {
          // 顺子
        } else if (len === 12) {
          // 顺子，6连队，4连3不带，3连3带3
        }
        if (flag) {
          this.pushCard(obj, history)
          this.message[token] = '我管上'
        } else {
          this.message[token] = '要不起'
        }
        this.token = next
      }, 1000)
    },
    pushCard (obj, history) {
      history.push(...obj.filter(c => c.checked))
      if (history.length === 4 && history[0].label === history[1].label && history[0].label === history[2].label && history[0].label === history[3].label) {
        this.showSpecial(0)
      }
      history.forEach(h => {
        obj.splice(obj.findIndex(n => n.label === h.label && n.type === h.type), 1)
      })
      this.current = history
    },
    unpush () {
      this.token = 'right'
      this.message.right = ''
    },
    push () {
      if (this.cards.filter(c => c.checked).length < 1) {
        alert('请选择需要出的牌！')
        return
      }
      this.pushCard(this.cards, this.historyCards)
      if (this.cards.length === 0) {
        this.showSpecial(1)
      }
      this.token = 'right'
      this.message.right = ''
      this.message.left = ''
    },
    sort (cards) {
      return cards.sort((a, b) => {
        let num = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
        let x = num.findIndex(n => n === a.label)
        let y = num.findIndex(n => n === b.label)
        if (x < y) {
          return 1
        } else if (x > y) {
          return -1
        } else {
          return 0
        }
      })
    },
    start () {
      this.startState = true
      // 发牌
      let cards = []
      cards.push(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'])
      cards.push(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'])
      cards.push(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'])
      cards.push(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'])
      this.cards = []
      this.aCards = []
      this.bCards = []
      this.historyCards = []
      this.historyA = []
      this.historyB = []
      this.message = {
        me: '',
        right: '',
        left: ''
      }
      this.addCards(cards)
    },
    addCards (cards) {
      this.addCard(this.cards, cards)
      this.addCard(this.aCards, cards)
      this.addCard(this.bCards, cards)
      setTimeout(() => {
        if (!(cards[0].length === 0 && cards[1].length === 0 && cards[2].length === 0 && cards[3].length === 0)) {
          this.addCards(cards)
        }
      }, 50)
    },
    addCard (obj, cards) {
      let type = this.rnd(0, 3)
      let card = cards[type]
      if (card.length === 0) {
        if (!(cards[0].length === 0 && cards[1].length === 0 && cards[2].length === 0 && cards[3].length === 0)) {
          this.addCard(obj, cards)
        }
        return
      }
      let cardIndex = this.rnd(0, card.length - 1)
      // 加牌
      obj.push({
        label: card[cardIndex],
        type: this.types[type],
        checked: false
      })
      // 删除
      card.splice(cardIndex, 1)
      // 排序
      this.sort(obj)
    },
    rnd (n, m) {
      // 随机数
      return Math.floor(Math.random() * (m - n + 1) + n)
    },
    handleResize (event) {
      this.fullHeight = document.documentElement.clientHeight
    },
    changed (item) {
      item.checked = !item.checked
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  background-image: url('../assets/bj.jpg');
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.right-menu {
  top: 0;
  height: 100%;
  position: absolute;
  right: 0px;
  width: 80px;
  background-color:rgba(0,0,0,0.6);
}
.menu-start {
  margin: 5px;
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border-radius: 10px;
  background-color: #00FF00;
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
}
.menu-start:hover {
  background-color: #FFFF00;
  color: #008800;
}
.cards-height {
  height: 150px;
}
.cards {
  width: 100%;
  display: flex;
}
.cards .card {
  /* float:left; */
  /*-moz-user-select:none;*/
}
.cards .big:not(:first-child) {
  margin-left: -45px;
}
.cards .small:not(:first-child) {
  margin-left: -35px;
}
.cards .clear {
  clear:both;
}
.main {
  display: flex;
  flex-direction: column;
  vertical-align: middle;
  align-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
}
.main .main-top {
  height: 60%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.main .main-bottom {
  flex: auto;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 20px;
  width: 80%;
  margin-left: 200px;
}
.main-top-left {
  position: absolute;
  left: 0px;
  top: 30px;
  width: 300px;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}
.main-top-right {
  position: absolute;
  right: 0px;
  top: 30px;
  width: 300px;
  /* display: flex;
  margin-right: 100px;
  flex-direction: column;
  justify-content: center; */
}
.main .other {
  transform:rotate(90deg);
}

.main-bottom .buttons {
  position: fixed;
  width: 100%;
  bottom: 220px;
  left: 50%;
  margin-left: -110px;
  z-index: 99;
}
.buttons .button {
  display: block;
  float: left;
  width: 100px;
  height: 50px;
  line-height: 50px;
  background-color: green;
  border-radius: 10px;
  text-align: center;
  color: #f1f1f1;
  margin-right: 10px;
  cursor: pointer;
}
.buttons .button:hover {
  background-color: #FFFF00;
  color: #333;
}
.main-bottom .history {
  position: fixed;
  height: 80px;
  line-height: 50px;
  width: 80%;
  bottom: 200px;
}
.main-top-left .history {
  position: relative;
  left: 370px;
  top: 30px;
  height: 80px;
  line-height: 50px;
}
.main-top-right .history{
  position: relative;
  width: 100%;
  top: 30px;
  height: 80px;
  line-height: 50px;
  right: 380px;
  justify-content: flex-end;
}

.main-top-left .msg {
  position: relative;
  left: 270px;
  top: 150px;
  height: 50px;
  line-height: 50px;
}
.main-top-right .msg {
  position: relative;
  justify-content: flex-end;
  top: 150px;
  right: 280px;
  height: 50px;
  line-height: 50px;
}
.say{
  width: 150px;
  border-radius: 5px;
  background-color:rgba(0,0,0,0.3);
  position: relative;
  margin: 0 auto;
  color: #fff;
}
.main-top-left .say::before{
  content: ''; //三角内容为空
  width: 0px;
  height: 0px;
  border-top: 12px transparent solid;
  border-left: 13px transparent solid;
  border-right: 15px rgba(0,0,0,0.5) solid;
  border-bottom: 12px transparent solid;
  position: absolute;
  margin: 13px -28px;
}

.main-top-right .say::after{
  content: ''; //三角内容为空
  width: 0px;
  height: 0px;
  border-top: 12px transparent solid;
  border-left: 13px rgba(0,0,0,0.5) solid;
  border-right: 15px transparent solid;
  border-bottom: 12px transparent solid;
  position: absolute;
  margin: 13px 82px;
}

.say span {
  padding-left: 20px;
}

.main-top-left .card-recorder {
  position: relative;
  left: 370px;
  top: 10px;
  height: 50px;
  line-height: 50px;
}
.main-top-right .card-recorder {
  position: relative;
  right: 130px;
  top: 10px;
  height: 50px;
  line-height: 50px;
}
.card-recorder span {
  display: block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  color: #fea;
  border: 2px solid #fff;
  font-size: 30px;
  font-weight: 700;
  text-align: center;
}

.card-member-img {
  position: absolute;
  left: 50px;
  height: 180px;
  width: 180px;
}
.card-member-img img {
  width: 100%;
  height: 100%;
}
.cards-margin-right {
  position: absolute;
  right: 130px;
}
.cards-margin-left {
  position: absolute;
  left: 120px;
}
.special-effect {
  position: fixed;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  z-index:1000;
  justify-content: center;
}
.special-effect-main {
  position: fixed;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  z-index:1000;
  margin-top: -100px;
  -webkit-transition: all 1s ease-in-out .3s;
  transition: all 1s ease-in-out .3s;
  color: #f1f1f1;
}
.special-effect-main-small {
  width: 100px;
  height: 100px;
  font-size: 12px;
  visibility: hidden;
  opacity: 0
}
.special-effect-main-big {
  width: 600px;
  height: 600px;
  font-size: 30px;
  visibility: visible;
  opacity: 1
}
.special-effect-main .text {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  margin-top: -10%;
}
</style>
