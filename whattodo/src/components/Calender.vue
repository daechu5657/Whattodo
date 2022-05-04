<template>
  <div class="calender-wrap">
    <span class="month-area">{{ selectmonth }}월</span>
    <div class="daygrid-top">
      <p>일</p>
      <p>월</p>
      <p>화</p>
      <p>수</p>
      <p>목</p>
      <p>금</p>
      <p>토</p>
    </div>
    <div class="daygird-flex">
      <a @click="previous" v-if="previousbtn == 1">이전달</a>
      <div class="daygird-main">
        <span v-for="(a, i) in date" :key="i" @click="clickday(a)">{{
          a
        }}</span>
      </div>
      <a @click="next" v-if="nextbtn == 1">다음달</a>
    </div>
  </div>
</template>

<script>
let today = new Date();
let m = today.getMonth() + 1;
// import axios from 'axios';
export default {
  emits: ['Cmonthday'],
  data() {
    return {
      dateofmonth: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      date: [],
      selectmonth: m,
      selectday: 0,
      selectData: [{ month: m }, { day: '' }],
      //달은 어차피 selectmonth
      //day는 v-model
      previousbtn: 1,
      nextbtn: 1,
      //초기값 달 인데 이건 이번달로
    };
  },
  methods: {
    previous() {
      if (this.selectmonth == 1) {
        this.selectmonth = 12;
        this.selectData[0].month = this.selectmonth;
      } else {
        this.selectmonth--;
        this.selectData[0].month = this.selectmonth;
      }
    },
    next() {
      if (this.selectmonth == 12) {
        this.selectmonth = 1;
        this.selectData[0].month = this.selectmonth;
      } else {
        this.selectmonth++;
        this.selectData[0].month = this.selectmonth;
      }
    },
    clickday(a) {
      this.selectday = a;
      // axios.post('/CalenderUpdate', this.logindata).then(응답 => {
      //   this.$emit('getid', 응답);
      //   this.onoff = 'off';
      // });
    },
  },
  watch: {
    selectmonth() {
      // if (this.selectmonth == 1) {
      //   this.previousbtn = 0;
      // } else if (this.selectmonth == 12) {
      //   this.nextbtn = 0;
      // } else {
      //   this.previousbtn = 1;
      //   this.nextbtn = 1;
      // }
      this.date = [];
      let date = new Date();
      let currnetyear = date.getFullYear();
      let fisrt = new Date(currnetyear, this.selectmonth - 1, 1);
      let last = new Date(currnetyear, this.selectmonth, 0);
      let firstday = fisrt.getDay();
      let lastdate = last.getDate();
      //0~6 월~일

      this.dateofmonth[this.selectmonth - 1] = lastdate;

      var step;
      for (
        step = 1;
        step < this.dateofmonth[this.selectmonth - 1] + 1;
        step++
      ) {
        this.date.push(step);
      }
      var blank;
      if (firstday > 0) {
        for (blank = 0; blank < firstday; blank++) {
          this.date.unshift('');
        }
      }
    },
    selectday() {
      this.selectData[1].day = this.selectday;
      this.$emit('SelectCalenderDay', this.selectData);
    },
  },
  created() {
    let date = new Date();
    let currnetyear = date.getFullYear();

    let fisrt = new Date(currnetyear, this.selectmonth - 1, 1);
    let last = new Date(currnetyear, this.selectmonth, 0);
    let firstday = fisrt.getDay();
    let lastdate = last.getDate();
    //0~6 월~일

    this.dateofmonth[this.selectmonth - 1] = lastdate;

    var step;
    for (step = 1; step < this.dateofmonth[this.selectmonth - 1] + 1; step++) {
      this.date.push(step);
    }
    var blank;
    if (firstday > 0) {
      for (blank = 0; blank < firstday; blank++) {
        this.date.unshift('');
      }
    }
  },
};
</script>

<style>
div {
  box-sizing: border-box;
}
.calender-wrap {
  width: 1024px;
  height: 90vh;
  position: absolute;
  top: 0;
  z-index: 1000;
  background-color: gray;
}
.month-area {
  width: 1024px;
  height: 8vh;
  background-color: beige;
}
.daygrid-top {
  width: inherit;
  height: 2vh;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: beige;
  position: relative;
  padding: 0 100px;
}
.daygird-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.daygird-main {
  width: 824px;
  height: 80vh;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
}
</style>
