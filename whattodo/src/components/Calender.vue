<template>
  <div class="calender-outside">
    <div class="calender-wrap">
      <div class="daygrid-month">
        <span>{{ topmonth }}</span>
      </div>
      <div class="daygrid-top">
        <p>Su</p>
        <p>Mo</p>
        <p>Tu</p>
        <p>We</p>
        <p>Th</p>
        <p>Fr</p>
        <p>Sa</p>
      </div>
      <div class="daygrid-flex">
        <a @click="previous" v-if="previousbtn == 1">&lt;</a>
        <div class="daygrid-main">
          <span v-for="(a, i) in date" :key="i" @click="clickday(a)">{{
            a
          }}</span>
        </div>
        <a @click="next" v-if="nextbtn == 1">&gt;</a>
      </div>
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
      topmonth: '',
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
    },
  },
  watch: {
    selectmonth() {
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
      if (this.selectmonth == 1) {
        this.topmonth = 'January';
      } else if (this.selectmonth == 2) {
        this.topmonth = 'February';
      } else if (this.selectmonth == 3) {
        this.topmonth = 'March';
      } else if (this.selectmonth == 4) {
        this.topmonth = 'April';
      } else if (this.selectmonth == 5) {
        this.topmonth = 'May';
      } else if (this.selectmonth == 6) {
        this.topmonth = 'June ';
      } else if (this.selectmonth == 7) {
        this.topmonth = 'July';
      } else if (this.selectmonth == 8) {
        this.topmonth = 'August';
      } else if (this.selectmonth == 9) {
        this.topmonth = 'September';
      } else if (this.selectmonth == 10) {
        this.topmonth = 'October';
      } else if (this.selectmonth == 11) {
        this.topmonth = 'November';
      } else if (this.selectmonth == 12) {
        this.topmonth = 'December';
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
    if (this.selectmonth == 1) {
      this.topmonth = 'January';
    } else if (this.selectmonth == 2) {
      this.topmonth = 'February';
    } else if (this.selectmonth == 3) {
      this.topmonth = 'March';
    } else if (this.selectmonth == 4) {
      this.topmonth = 'April';
    } else if (this.selectmonth == 5) {
      this.topmonth = 'May';
    } else if (this.selectmonth == 6) {
      this.topmonth = 'June ';
    } else if (this.selectmonth == 7) {
      this.topmonth = 'July';
    } else if (this.selectmonth == 8) {
      this.topmonth = 'August';
    } else if (this.selectmonth == 9) {
      this.topmonth = 'September';
    } else if (this.selectmonth == 10) {
      this.topmonth = 'October';
    } else if (this.selectmonth == 11) {
      this.topmonth = 'November';
    } else if (this.selectmonth == 12) {
      this.topmonth = 'December';
    }
  },
};
</script>

<style>
div {
  box-sizing: border-box;
}
.calender-outside {
  position: absolute;
  width: 1024px;
  height: 90vh;
  z-index: 100;
  top: 0;
}
.calender-wrap {
  width: 700px;
  height: 50vh;
  position: absolute;
  top: 20vh;
  left: 167px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 14px 6px rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  backdrop-filter: blur(8px);
}
.daygrid-month {
  width: inherit;
  height: 5vh;
  text-align: center;
  padding-top: 13px;
  padding-bottom: 8px;
}
.daygrid-month > span {
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}
.daygrid-top {
  width: 490px;
  height: 5vh;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: transparent;
  position: relative;
  left: 105px;
  text-align: center;
  align-items: center;
}
.daygrid-top > p {
  width: 70px;
  color: rgba(255, 255, 255, 0.8);
}
.daygrid-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 40vh;
}
.daygrid-flex > a {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  height: 50px;
  padding: 0px 0px 7px 0px;
}
.daygrid-flex > a:hover {
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
}
.daygrid-main {
  width: 490px;
  height: 40vh;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
}
.daygrid-main > span {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 70px;
  color: rgba(255, 255, 255, 0.8);
}
.daygrid-main > span:hover {
  transition: 0.3s ease;
  box-shadow: 0px 0px 14px 6px rgba(0, 0, 0, 0.4);
}
</style>
