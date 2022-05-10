<template>
  <div class="daywrap">
    <header class="day-top">
      <span>{{ topmonth }} {{ day }}</span>
    </header>
    <section class="day-contents">
      <div class="no-contents">
        <span>&nbsp;{{ nothingstring }}</span>
      </div>
      <div class="yes-contents-top">
        <div v-for="(a, alarmindex) in alarmN" :key="alarmindex">
          <div class="yes-contents-top-outside">
            <div
              @click="ballclick(alarmindex)"
              class="yes-contents-top-outside-alarm-frame"
              v-bind:id="'frame' + alarmindex"
            >
              <div
                class="yes-contents-top-outside-alarm-ball"
                v-bind:id="'ball' + alarmindex"
              ></div>
            </div>
            <div
              class="yes-contents-top-outside-titletime"
              @click="alarmclickk(alarmindex)"
            >
              <span
                class="yes-contents-top-outside-time"
                v-if="alarm[alarmindex].time !== ''"
                >{{ alarm[alarmindex].time }}</span
              >
              <span
                class="yes-contents-top-outside-title"
                v-if="alarm[alarmindex].title !== ''"
                >{{ alarm[alarmindex].title }}</span
              >
            </div>
            <div class="yes-contents-top-outside-delmodify">
              <button
                class="yes-contents-top-outside-modify"
                @click="modify(alarmindex)"
              >
                Modify
              </button>
              <button
                class="yes-contents-top-outside-del"
                @click="del(alarmindex)"
              >
                Delete
              </button>
            </div>
          </div>
          <transition name="inside">
            <div
              class="yes-contents-top-inside"
              v-if="alarmclick[alarmindex] == 1"
            >
              <div class="yes-contents-top-inside-alarm123">
                <span v-if="alarm[alarmindex].text[0] !== ''">Ⅰ</span>
                <span v-if="alarm[alarmindex].text[1] !== ''">Ⅱ</span>
                <span v-if="alarm[alarmindex].text[2] !== ''">Ⅲ</span>
              </div>
              <div class="yes-contents-top-inside-alarmcontents">
                <span v-if="alarm[alarmindex].text[0] !== ''">{{
                  alarm[alarmindex].text[0].text
                }}</span>
                <span v-if="alarm[alarmindex].text[1] !== ''">{{
                  alarm[alarmindex].text[1].text
                }}</span>
                <span v-if="alarm[alarmindex].text[2] !== ''">{{
                  alarm[alarmindex].text[2].text
                }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="plus-contents">
        <button @click="modal()" v-if="alarmN != 3">+</button>
      </div>
    </section>
    <transition name="modal">
      <Modal
        v-if="modalOnOff == 1"
        :profileN="profileN"
        :modalOnOff="modalOnOff"
        @modalOnOffchange="modalOnOffchange"
        :month="month"
        :day="day"
        :userid="userid"
        @updateprofilebymodal="updateprofilebymodal"
        :sendtomodal="sendtomodal"
        :alarmindex="alarmindex"
        :profile="profile"
        :modifyOn="modifyOn"
        @modifychange="modifychange"
        :boxindex="boxindex"
        @boxindexreset="boxindexreset"
      />
    </transition>
    <transition name="calender">
      <Calender
        @SelectCalenderDay="SelectCalenderDay"
        v-if="CalenderOnOff == 1"
      />
    </transition>
  </div>
</template>

<script>
import Modal from './Modal.vue';
import Calender from './Calender.vue';

import axios from 'axios';
let today = new Date();
let m = today.getMonth() + 1;
let d = today.getDate();
export default {
  components: {
    Modal: Modal,
    Calender: Calender,
  },
  props: {
    profileN: Number,
    profile: Array,
    TodayOn: Number,
    CalenderOnOff: Number,
    userid: String,
  },
  data() {
    return {
      modalOnOff: 0,
      topmonth: '',
      month: m,
      day: d,
      alarm: ['', '', ''],
      alarmN: 0,
      alarmindex: 0,
      nothing: 1,
      nothingstring: 'Nothing',
      modifyOn: 0,
      ball0: 0,
      ball1: 0,
      ball2: 0,
      alarmclick: [0, 0, 0],
      boxindex: 0,
      sendtomodal: {
        _id: '',
        profileN: '',
        month: '',
        day: '',
        alarmindex: 0,
        alarmorder: 0,
        ball: 0,
      },
    };
  },
  methods: {
    modal() {
      if (this.modalOnOff == 0) {
        this.modalOnOff = 1;
      } else {
        this.modalOnOff = 0;
      }
    },
    modalOnOffchange() {
      if (this.modalOnOff == 0) {
        this.modalOnOff = 1;
      } else {
        this.modalOnOff = 0;
      }
      this.alarmindex++;
      this.modifyOn = 0;
    },
    SelectCalenderDay(xyz) {
      this.month = xyz[0].month;
      this.day = xyz[1].day;
      this.$emit('CalenderOff');
    },
    updateprofilebymodal(응답) {
      this.$emit('updateprofilebymodal', 응답);
    },
    del(alarmindex) {
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      if (alarmindex == 2) {
        this.sendtomodal.alarmindex = a.alarmN[2].index;
        this.alarmindex = a.alarmN[2].index;
      } else if (alarmindex == 1) {
        this.sendtomodal.alarmindex = a.alarmN[1].index;
        this.alarmindex = a.alarmN[1].index;
      } else {
        this.sendtomodal.alarmindex = a.alarmN[0].index;
        this.alarmindex = a.alarmN[0].index;
      }
      this.sendtomodal._id = this.userid;
      this.sendtomodal.profileN = this.profileN;
      this.sendtomodal.month = this.month;
      this.sendtomodal.day = this.day;
      axios.post('/DelModal', this.sendtomodal).then(응답 => {
        this.$emit('updateprofilebymodal', 응답);
      });
    },
    modify(alarmindex) {
      this.sendtomodal.alarmorder = alarmindex;
      this.modifyOn = 1;
      this.modalOnOff = 1;
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      if (alarmindex == 2) {
        this.sendtomodal.alarmindex = a.alarmN[2].index;
        this.sendtomodal.ball = this.ball2;
        if (
          a.alarmN[2].text[2].text != undefined &&
          a.alarmN[2].text[1].text != undefined &&
          a.alarmN[2].text[0].text != undefined
        ) {
          this.boxindex = 3;
        } else if (
          a.alarmN[2].text[1].text != undefined &&
          a.alarmN[2].text[0].text != undefined
        ) {
          this.boxindex = 2;
        } else if (a.alarmN[2].text[0].text != undefined) {
          this.boxindex = 1;
        } else {
          this.boxindex = 0;
        }
      } else if (alarmindex == 1) {
        this.sendtomodal.alarmindex = a.alarmN[1].index;
        this.sendtomodal.ball = this.ball1;
        if (
          a.alarmN[1].text[2].text != undefined &&
          a.alarmN[1].text[1].text != undefined &&
          a.alarmN[1].text[0].text != undefined
        ) {
          this.boxindex = 3;
        } else if (
          a.alarmN[1].text[1].text != undefined &&
          a.alarmN[1].text[0].text != undefined
        ) {
          this.boxindex = 2;
        } else if (a.alarmN[1].text[0].text != undefined) {
          this.boxindex = 1;
        } else {
          this.boxindex = 0;
        }
      } else {
        this.sendtomodal.alarmindex = a.alarmN[0].index;
        this.sendtomodal.ball = this.ball0;
        if (
          a.alarmN[0].text[2].text != undefined &&
          a.alarmN[0].text[1].text != undefined &&
          a.alarmN[0].text[0].text != undefined
        ) {
          this.boxindex = 3;
        } else if (
          a.alarmN[0].text[1].text != undefined &&
          a.alarmN[0].text[0].text != undefined
        ) {
          this.boxindex = 2;
        } else if (a.alarmN[0].text[0].text != undefined) {
          this.boxindex = 1;
        } else {
          this.boxindex = 0;
        }
      }
    },
    modifychange() {
      this.modifyOn = 2;
    },
    ballclick(alarmindex) {
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      const ballupdatestandard = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        }
      };
      //
      var ball0 = document.getElementById('ball0');
      var frame0 = document.getElementById('frame0');
      var ball1 = document.getElementById('ball1');
      var frame1 = document.getElementById('frame1');
      var ball2 = document.getElementById('ball2');
      var frame2 = document.getElementById('frame2');
      if (alarmindex == 0) {
        this.sendtomodal.alarmorder = alarmindex;
        if (this.ball0 == 0 && ballupdatestandard(alarmindex) != 0) {
          ball0.classList.add('balling-start-ball');
          frame0.classList.add('balling-start-frame');
          this.ball0 = 1;
          this.sendtomodal._id = this.userid;
          this.sendtomodal.profileN = this.profileN;
          this.sendtomodal.month = this.month;
          this.sendtomodal.day = this.day;
          this.sendtomodal.ball = this.ball0;
          axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
            this.$emit('updateprofilebymodal', 응답);
          });
        } else if (this.ball0 == 0 && ballupdatestandard(alarmindex) == 0) {
          ball0.classList.add('balling-start-ball');
          frame0.classList.add('balling-start-frame');
          alert('시간이 지났네유');
          ball0.classList.add('balling-end-ball');
          frame0.classList.add('balling-end-frame');
          setTimeout(function () {
            ball0.classList.remove('balling-start-ball');
            frame0.classList.remove('balling-start-frame');
            ball0.classList.remove('balling-end-ball');
            frame0.classList.remove('balling-end-frame');
          }, 350);
        } else if (this.ball0 == 1) {
          ball0.classList.add('balling-end-ball');
          frame0.classList.add('balling-end-frame');
          this.ball0 = 0;
          this.sendtomodal._id = this.userid;
          this.sendtomodal.profileN = this.profileN;
          this.sendtomodal.month = this.month;
          this.sendtomodal.day = this.day;
          this.sendtomodal.ball = this.ball0;
          axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
            this.$emit('updateprofilebymodal', 응답);
          });
          setTimeout(function () {
            ball0.classList.remove('balling-start-ball');
            frame0.classList.remove('balling-start-frame');
            ball0.classList.remove('balling-end-ball');
            frame0.classList.remove('balling-end-frame');
          }, 350);
        }
      } else if (alarmindex == 1) {
        this.sendtomodal.alarmorder = alarmindex;
        if (this.ball1 == 0 && ballupdatestandard(alarmindex) != 0) {
          ball1.classList.add('balling-start-ball');
          frame1.classList.add('balling-start-frame');
          this.ball1 = 1;
          this.sendtomodal._id = this.userid;
          this.sendtomodal.profileN = this.profileN;
          this.sendtomodal.month = this.month;
          this.sendtomodal.day = this.day;
          this.sendtomodal.ball = this.ball1;
          axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
            this.$emit('updateprofilebymodal', 응답);
          });
        } else if (this.ball1 == 0 && ballupdatestandard(alarmindex) == 0) {
          ball1.classList.add('balling-start-ball');
          frame1.classList.add('balling-start-frame');
          alert('시간이 지났네유');
          ball1.classList.add('balling-end-ball');
          frame1.classList.add('balling-end-frame');
          setTimeout(function () {
            ball1.classList.remove('balling-start-ball');
            frame1.classList.remove('balling-start-frame');
            ball1.classList.remove('balling-end-ball');
            frame1.classList.remove('balling-end-frame');
          }, 350);
        } else if (this.ball1 == 1) {
          ball1.classList.add('balling-end-ball');
          frame1.classList.add('balling-end-frame');
          this.ball1 = 0;
          this.sendtomodal._id = this.userid;
          this.sendtomodal.profileN = this.profileN;
          this.sendtomodal.month = this.month;
          this.sendtomodal.day = this.day;
          this.sendtomodal.ball = this.ball1;
          axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
            this.$emit('updateprofilebymodal', 응답);
          });
          setTimeout(function () {
            ball1.classList.remove('balling-start-ball');
            frame1.classList.remove('balling-start-frame');
            ball1.classList.remove('balling-end-ball');
            frame1.classList.remove('balling-end-frame');
          }, 350);
        }
      } else if (alarmindex == 2) {
        this.sendtomodal.alarmorder = alarmindex;
        if (this.ball2 == 0 && ballupdatestandard(alarmindex) != 0) {
          ball2.classList.add('balling-start-ball');
          frame2.classList.add('balling-start-frame');
          this.ball2 = 1;
          this.sendtomodal._id = this.userid;
          this.sendtomodal.profileN = this.profileN;
          this.sendtomodal.month = this.month;
          this.sendtomodal.day = this.day;
          this.sendtomodal.ball = this.ball2;
          axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
            this.$emit('updateprofilebymodal', 응답);
          });
        } else if (this.ball2 == 0 && ballupdatestandard(alarmindex) == 0) {
          ball2.classList.add('balling-start-ball');
          frame2.classList.add('balling-start-frame');
          alert('시간이 지났네유');
          ball2.classList.add('balling-end-ball');
          frame2.classList.add('balling-end-frame');
          setTimeout(function () {
            ball2.classList.remove('balling-start-ball');
            frame2.classList.remove('balling-start-frame');
            ball2.classList.remove('balling-end-ball');
            frame2.classList.remove('balling-end-frame');
          }, 350);
        } else if (this.ball2 == 1) {
          ball2.classList.add('balling-end-ball');
          frame2.classList.add('balling-end-frame');
          this.ball2 = 0;
          this.sendtomodal._id = this.userid;
          this.sendtomodal.profileN = this.profileN;
          this.sendtomodal.month = this.month;
          this.sendtomodal.day = this.day;
          this.sendtomodal.ball = this.ball2;
          axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
            this.$emit('updateprofilebymodal', 응답);
          });
          setTimeout(function () {
            ball2.classList.remove('balling-start-ball');
            frame2.classList.remove('balling-start-frame');
            ball2.classList.remove('balling-end-ball');
            frame2.classList.remove('balling-end-frame');
          }, 350);
        }
      }
    },
    alarmclickk(alarmindex) {
      if (alarmindex == 0) {
        if (this.alarmclick[0] == 0) {
          this.alarmclick[0] = 1;
        } else {
          this.alarmclick[0] = 0;
        }
      } else if (alarmindex == 1) {
        if (this.alarmclick[1] == 0) {
          this.alarmclick[1] = 1;
        } else {
          this.alarmclick[1] = 0;
        }
      } else {
        if (this.alarmclick[2] == 0) {
          this.alarmclick[2] = 1;
        } else {
          this.alarmclick[2] = 0;
        }
      }
    },
    boxindexreset() {
      this.boxindex = 0;
    },
  },
  watch: {
    profile() {
      if (this.month == 1) {
        this.topmonth = 'January';
      } else if (this.month == 2) {
        this.topmonth = 'February';
      } else if (this.month == 3) {
        this.topmonth = 'March';
      } else if (this.month == 4) {
        this.topmonth = 'April';
      } else if (this.month == 5) {
        this.topmonth = 'May';
      } else if (this.month == 6) {
        this.topmonth = 'June ';
      } else if (this.month == 7) {
        this.topmonth = 'July';
      } else if (this.month == 8) {
        this.topmonth = 'August';
      } else if (this.month == 9) {
        this.topmonth = 'September';
      } else if (this.month == 10) {
        this.topmonth = 'October';
      } else if (this.month == 11) {
        this.topmonth = 'November';
      } else if (this.month == 12) {
        this.topmonth = 'December';
      }
      const ballupdatestandard = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        }
      };

      // var ball1 = document.getElementById('ball1');
      // var frame1 = document.getElementById('frame1');
      // var ball2 = document.getElementById('ball2');
      // var frame2 = document.getElementById('frame2');
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );

      if (a.alarmN.length == 0) {
        this.alarmindex = 0;
      } else if (a.alarmN.length == 1) {
        if (a.alarmN[0].index == 0) {
          this.alarmindex = 1;
        } else if (a.alarmN[0].index == 1) {
          this.alarmindex = 2;
        } else {
          this.alarmindex = 0;
        }
      } else if (a.alarmN.length == 2) {
        if (a.alarmN[0].index == 0 && a.alarmN[1].index == 1) {
          this.alarmindex = 2;
        } else if (a.alarmN[0].index == 0 && a.alarmN[1].index == 2) {
          this.alarmindex = 1;
        } else if (a.alarmN[0].index == 1 && a.alarmN[1].index == 0) {
          this.alarmindex = 2;
        } else if (a.alarmN[0].index == 1 && a.alarmN[1].index == 2) {
          this.alarmindex = 0;
        } else if (a.alarmN[0].index == 2 && a.alarmN[1].index == 0) {
          this.alarmindex = 1;
        } else {
          this.alarmindex = 0;
        }
      } else {
        this.alarmindex = 0;
      }

      if (this.month == m && this.day == d) {
        // 그리고 날짜에 맞는 배열을 선택해야하니

        // 그리고 a의 alarm부분을 this.alarm0 this.alarm1 this.alarm2 에 저장하는데
        // alarm이 항상 있는건 아니니 조건식으로
        if (a.alarmN.length == 3) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.alarm[2] = a.alarmN[2];
          this.alarmN = 3;
          this.nothing = 0;
        } else if (a.alarmN.length == 2) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.nothing = 0;
          this.alarmN = 2;
        } else if (a.alarmN.length == 1) {
          this.alarm[0] = a.alarmN[0];
          this.nothing = 0;
          this.alarmN = 1;
        } else {
          this.nothing = 1;
          this.alarmN = 0;
          // notthing=1이면 컨텐츠 부분에 '일정이 없습니다'라고 뜨게 v-if 로 할꺼임
        }
      } else {
        // 캘린더에서 보낸숫자를 emit에 날짜 데이터 있으니까 그걸 this.Cmonth
        // this.Cday로 저장후

        // 그리고 a의 alarm부분을 this.alarm0 this.alarm1 this.alarm2 에 저장하는데
        // alarm이 항상 있는건 아니니 조건식으로
        // 위와동일
        const a = this.profile[this.profileN].contents.find(
          x => x.month == this.month && x.day == this.day
        );
        if (a.alarmN.length == 3) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.alarm[2] = a.alarmN[2];
          this.nothing = 0;
          this.alarmN = 3;
        } else if (a.alarmN.length == 2) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.nothing = 0;
          this.alarmN = 2;
        } else if (a.alarmN.length == 1) {
          this.alarm[0] = a.alarmN[0];
          this.nothing = 0;
          this.alarmN = 1;
        } else {
          this.nothing = 1;
          this.alarmN = 0;
          // notthing=1이면 컨텐츠 부분에 '일정이 없습니다'라고 뜨게 v-if 로 할꺼임
        }
      }
      setTimeout(() => {
        var ball0 = document.getElementById('ball0');
        var frame0 = document.getElementById('frame0');
        if (a.alarmN.length >= 1) {
          if (a.alarmN[0].ball == 1 && ballupdatestandard(0) != 0) {
            this.ball0 = 1;
          } else if (a.alarmN[0].ball == 1 && ballupdatestandard(0) == 0) {
            alert('알림다시맞춰주세용');
            ball0.classList.remove('balling-start-ball');
            frame0.classList.remove('balling-start-frame');
            this.ball0 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball0;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball0 = 0;
          }
        }
      }, 1000);
      setTimeout(() => {
        var ball1 = document.getElementById('ball1');
        var frame1 = document.getElementById('frame1');
        if (a.alarmN.length >= 2) {
          if (a.alarmN[1].ball == 1 && ballupdatestandard(1) != 0) {
            this.ball1 = 1;
          } else if (a.alarmN[1].ball == 1 && ballupdatestandard(1) == 0) {
            alert('알림다시맞춰주세용');
            ball1.classList.remove('balling-start-ball');
            frame1.classList.remove('balling-start-frame');
            this.ball1 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball1;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball1 = 0;
          }
        }
      }, 1000);

      setTimeout(() => {
        var ball2 = document.getElementById('ball2');
        var frame2 = document.getElementById('frame2');
        if (a.alarmN.length >= 3) {
          if (a.alarmN[2].ball == 1 && ballupdatestandard(2) != 0) {
            this.ball2 = 1;
          } else if (a.alarmN[2].ball == 1 && ballupdatestandard(2) == 0) {
            alert('알림다시맞춰주세용');
            ball2.classList.remove('balling-start-ball');
            frame2.classList.remove('balling-start-frame');
            this.ball2 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball2;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball2 = 0;
          }
        }
      }, 1000);
    },
    profileN() {
      // 그리고 날짜에 맞는 배열을 선택해야하니
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      const ballupdatestandard = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        }
      };
      if (a.alarmN.length == 3) {
        this.alarm[0] = a.alarmN[0];
        this.alarm[1] = a.alarmN[1];
        this.alarm[2] = a.alarmN[2];
        this.nothing = 0;
        this.alarmN = 3;
      } else if (a.alarmN.length == 2) {
        this.alarm[0] = a.alarmN[0];
        this.alarm[1] = a.alarmN[1];
        this.nothing = 0;
        this.alarmN = 2;
      } else if (a.alarmN.length == 1) {
        this.alarm[0] = a.alarmN[0];
        this.nothing = 0;
        this.alarmN = 1;
      } else {
        this.nothing = 1;
        this.alarmN = 0;
      }
      if (this.profileN == 0) {
        if (a.alarmN.length == 3) {
          this.alarmindex = 0;
        } else if (a.alarmN.length == 2) {
          if (a.alarmN[0].index == 0 && a.alarmN[1].index == 1) {
            this.alarmindex = 2;
          } else if (a.alarmN[0].index == 0 && a.alarmN[1].index == 2) {
            this.alarmindex = 1;
          } else if (a.alarmN[0].index == 1 && a.alarmN[1].index == 0) {
            this.alarmindex = 2;
          } else if (a.alarmN[0].index == 1 && a.alarmN[1].index == 2) {
            this.alarmindex = 0;
          } else if (a.alarmN[0].index == 2 && a.alarmN[1].index == 0) {
            this.alarmindex = 1;
          } else {
            this.alarmindex = 0;
          }
        } else if (a.alarmN.length == 1) {
          if (a.alarmN[0].index == 0) {
            this.alarmindex = 1;
          } else if (a.alarmN[0].index == 1) {
            this.alarmindex = 0;
          } else {
            this.alarmindex = 0;
          }
        } else if (a.alarmN.length == 0) {
          this.alarmindex = 0;
        }
      } else if (this.profileN == 1) {
        if (a.alarmN.length == 3) {
          this.alarmindex = 0;
        } else if (a.alarmN.length == 2) {
          if (a.alarmN[0].index == 0 && a.alarmN[1].index == 1) {
            this.alarmindex = 2;
          } else if (a.alarmN[0].index == 0 && a.alarmN[1].index == 2) {
            this.alarmindex = 1;
          } else if (a.alarmN[0].index == 1 && a.alarmN[1].index == 0) {
            this.alarmindex = 2;
          } else if (a.alarmN[0].index == 1 && a.alarmN[1].index == 2) {
            this.alarmindex = 0;
          } else if (a.alarmN[0].index == 2 && a.alarmN[1].index == 0) {
            this.alarmindex = 1;
          } else {
            this.alarmindex = 0;
          }
        } else if (a.alarmN.length == 1) {
          if (a.alarmN[0].index == 0) {
            this.alarmindex = 1;
          } else if (a.alarmN[0].index == 1) {
            this.alarmindex = 0;
          } else {
            this.alarmindex = 0;
          }
        } else if (a.alarmN.length == 0) {
          this.alarmindex = 0;
        }
      }

      setTimeout(() => {
        if (a.alarmN.length >= 1) {
          if (a.alarmN[0].ball == 1 && ballupdatestandard(0) != 0) {
            this.ball0 = 1;
          } else if (a.alarmN[0].ball == 1 && ballupdatestandard(0) == 0) {
            this.ball0 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball0;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball0 = 0;
          }
        } else {
          this.ball0 = 0;
        }
      }, 1000);

      setTimeout(() => {
        if (a.alarmN.length >= 2) {
          if (a.alarmN[1].ball == 1 && ballupdatestandard(1) != 0) {
            this.ball1 = 1;
          } else if (a.alarmN[1].ball == 1 && ballupdatestandard(1) == 0) {
            this.ball1 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball1;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball1 = 0;
          }
        } else {
          this.ball1 = 0;
        }
      }, 1000);

      setTimeout(() => {
        if (a.alarmN.length >= 3) {
          if (a.alarmN[2].ball == 1 && ballupdatestandard(2) != 0) {
            this.ball2 = 1;
          } else if (a.alarmN[2].ball == 1 && ballupdatestandard(2) == 0) {
            this.ball2 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball2;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball2 = 0;
          }
        } else {
          this.ball2 = 0;
        }
      }, 1000);
    },
    TodayOn() {
      if (this.TodayOn == 1) {
        this.month = m;
        this.day = d;
      }
    },
    month() {
      const ballupdatestandard = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        }
      };
      if (this.month == 1) {
        this.topmonth = 'January';
      } else if (this.month == 2) {
        this.topmonth = 'February';
      } else if (this.month == 3) {
        this.topmonth = 'March';
      } else if (this.month == 4) {
        this.topmonth = 'April';
      } else if (this.month == 5) {
        this.topmonth = 'May';
      } else if (this.month == 6) {
        this.topmonth = 'June ';
      } else if (this.month == 7) {
        this.topmonth = 'July';
      } else if (this.month == 8) {
        this.topmonth = 'August';
      } else if (this.month == 9) {
        this.topmonth = 'September';
      } else if (this.month == 10) {
        this.topmonth = 'October';
      } else if (this.month == 11) {
        this.topmonth = 'November';
      } else if (this.month == 12) {
        this.topmonth = 'December';
      }
      const first = this.profile[0].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      const sceond = this.profile[1].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      let send = [{ _id: '' }, { month: '' }, { day: '' }];
      send[0]._id = this.userid;
      send[1].month = this.month;
      send[2].day = this.day;
      if (first === undefined || sceond === undefined) {
        axios.post('/BeforeUpdate', send).then(응답 => {
          this.$emit('updateprofile', 응답);
        });
      } else {
        const a = this.profile[this.profileN].contents.find(
          x => x.month == this.month && x.day == this.day
        );
        if (a.alarmN.length == 3) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.alarm[2] = a.alarmN[2];
          this.nothing = 0;
          this.alarmN = 3;
        } else if (a.alarmN.length == 2) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.nothing = 0;
          this.alarmN = 2;
        } else if (a.alarmN.length == 1) {
          this.alarm[0] = a.alarmN[0];
          this.nothing = 0;
          this.alarmN = 1;
        } else {
          this.nothing = 1;
          this.alarmN = 0;
          // notthing=1이면 컨텐츠 부분에 '일정이 없습니다'라고 뜨게 v-if 로 할꺼임
        }
      }
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      setTimeout(() => {
        if (a.alarmN.length >= 0) {
          if (a.alarmN[0].ball == 1 && ballupdatestandard(0) != 0) {
            this.ball0 = 1;
          } else if (a.alarmN[0].ball == 1 && ballupdatestandard(0) == 0) {
            this.ball0 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball0;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball0 = 0;
          }
        } else {
          this.ball0 = 0;
        }
      }, 1000);
      setTimeout(() => {
        if (a.alarmN.length >= 1) {
          if (a.alarmN[1].ball == 1 && ballupdatestandard(1) != 0) {
            this.ball1 = 1;
          } else if (a.alarmN[1].ball == 1 && ballupdatestandard(1) == 0) {
            this.ball1 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball1;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball1 = 0;
          }
        } else {
          this.ball1 = 0;
        }
      }, 1000);
      setTimeout(() => {
        if (a.alarmN.length >= 2) {
          if (a.alarmN[2].ball == 1 && ballupdatestandard(2) != 0) {
            this.ball2 = 1;
          } else if (a.alarmN[2].ball == 1 && ballupdatestandard(2) == 0) {
            this.ball2 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball2;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball2 = 0;
          }
        } else {
          this.ball2 = 0;
        }
      }, 1000);
    },
    day() {
      let send = [{ _id: '' }, { month: '' }, { day: '' }];
      send[0]._id = this.userid;
      send[1].month = this.month;
      send[2].day = this.day;
      const ballupdatestandard = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        }
      };

      const first = this.profile[0].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      const sceond = this.profile[1].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      if (first === undefined || sceond === undefined) {
        axios.post('/BeforeUpdate', send).then(응답 => {
          this.$emit('updateprofile', 응답);
        });
      } else {
        const a = this.profile[this.profileN].contents.find(
          x => x.month == this.month && x.day == this.day
        );
        if (a.alarmN.length == 3) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.alarm[2] = a.alarmN[2];
          this.nothing = 0;
          this.alarmN = 3;
        } else if (a.alarmN.length == 2) {
          this.alarm[0] = a.alarmN[0];
          this.alarm[1] = a.alarmN[1];
          this.nothing = 0;
          this.alarmN = 2;
        } else if (a.alarmN.length == 1) {
          this.alarm[0] = a.alarmN[0];
          this.nothing = 0;
          this.alarmN = 1;
        } else {
          this.nothing = 1;
          this.alarmN = 0;
          // notthing=1이면 컨텐츠 부분에 '일정이 없습니다'라고 뜨게 v-if 로 할꺼임
        }
      }
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      setTimeout(() => {
        if (a.alarmN.length >= 1) {
          if (a.alarmN[0].ball == 1 && ballupdatestandard(0) != 0) {
            this.ball0 = 1;
          } else if (a.alarmN[0].ball == 1 && ballupdatestandard(0) == 0) {
            this.ball0 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball0;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball0 = 0;
          }
        } else {
          this.ball0 = 0;
        }
      }, 1000);

      setTimeout(() => {
        if (a.alarmN.length >= 2) {
          if (a.alarmN[1].ball == 1 && ballupdatestandard(1) != 0) {
            this.ball1 = 1;
          } else if (a.alarmN[1].ball == 1 && ballupdatestandard(1) == 0) {
            this.ball1 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball1;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball1 = 0;
          }
        } else {
          this.ball1 = 0;
        }
      }, 1000);

      setTimeout(() => {
        if (a.alarmN.length >= 3) {
          if (a.alarmN[2].ball == 1 && ballupdatestandard(2) != 0) {
            this.ball2 = 1;
          } else if (a.alarmN[2].ball == 1 && ballupdatestandard(2) == 0) {
            this.ball2 = 0;
            this.sendtomodal._id = this.userid;
            this.sendtomodal.profileN = this.profileN;
            this.sendtomodal.month = this.month;
            this.sendtomodal.day = this.day;
            this.sendtomodal.ball = this.ball2;
            axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
              this.$emit('updateprofilebymodal', 응답);
            });
          } else {
            this.ball2 = 0;
          }
        } else {
          this.ball2 = 0;
        }
      }, 1000);
    },
    nothing() {
      if (this.nothing == 1) {
        this.nothingstring = 'Nothing';
      } else {
        this.nothingstring = '';
      }
    },
    ball0() {
      var ball0 = document.getElementById('ball0');
      var frame0 = document.getElementById('frame0');
      var ball1 = document.getElementById('ball1');
      var frame1 = document.getElementById('frame1');
      var ball2 = document.getElementById('ball2');
      var frame2 = document.getElementById('frame2');
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );

      const alarmfunc = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        } else {
          var interval = setInterval(() => {
            var now = new Date().getTime();
            if (now - oprDate.getTime() > 0) {
              if (alarmindex == 0) {
                alert(a.alarmN[alarmindex].title);
                ball0.classList.remove('balling-start-ball');
                frame0.classList.remove('balling-start-frame');
                this.ball0 = 0;
                this.sendtomodal._id = this.userid;
                this.sendtomodal.profileN = this.profileN;
                this.sendtomodal.month = this.month;
                this.sendtomodal.day = this.day;
                this.sendtomodal.ball = this.ball0;
                axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
                  this.$emit('updateprofilebymodal', 응답);
                });
              } else if (alarmindex == 1) {
                alert(a.alarmN[alarmindex].title);
                ball1.classList.remove('balling-start-ball');
                frame1.classList.remove('balling-start-frame');
                this.ball1 = 0;
              } else {
                alert(a.alarmN[alarmindex].title);
                ball2.classList.remove('balling-start-ball');
                frame2.classList.remove('balling-start-frame');
                this.ball2 = 0;
              }

              clearInterval(interval);
            }
            if (alarmindex == 0 && this.ball0 == 0) {
              clearInterval(interval);
            } else if (alarmindex == 1 && this.ball1 == 0) {
              clearInterval(interval);
            } else if (alarmindex == 2 && this.ball2 == 0) {
              clearInterval(interval);
            }
          }, 1000);
        }
      };

      if (this.ball0 == 1) {
        ball0.classList.add('balling-start-ball');
        frame0.classList.add('balling-start-frame');
        alarmfunc(0);
      } else {
        if (a.alarmN.length != 0) {
          ball0.classList.remove('balling-start-ball');
          frame0.classList.remove('balling-start-frame');
        }
      }
    },
    ball1() {
      var ball0 = document.getElementById('ball0');
      var frame0 = document.getElementById('frame0');
      var ball1 = document.getElementById('ball1');
      var frame1 = document.getElementById('frame1');
      var ball2 = document.getElementById('ball2');
      var frame2 = document.getElementById('frame2');
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      const alarmfunc = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        } else {
          var interval = setInterval(() => {
            var now = new Date().getTime();
            if (now - oprDate.getTime() > 0) {
              if (alarmindex == 0) {
                alert(a.alarmN[alarmindex].title);
                ball0.classList.remove('balling-start-ball');
                frame0.classList.remove('balling-start-frame');
                this.ball0 = 0;
                this.sendtomodal._id = this.userid;
                this.sendtomodal.profileN = this.profileN;
                this.sendtomodal.month = this.month;
                this.sendtomodal.day = this.day;
                this.sendtomodal.ball = this.ball0;
                axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
                  this.$emit('updateprofilebymodal', 응답);
                });
              } else if (alarmindex == 1) {
                alert(a.alarmN[alarmindex].title);
                ball1.classList.remove('balling-start-ball');
                frame1.classList.remove('balling-start-frame');
                this.ball1 = 0;
              } else {
                alert(a.alarmN[alarmindex].title);
                ball2.classList.remove('balling-start-ball');
                frame2.classList.remove('balling-start-frame');
                this.ball2 = 0;
              }

              clearInterval(interval);
            }
            if (alarmindex == 0 && this.ball0 == 0) {
              clearInterval(interval);
            } else if (alarmindex == 1 && this.ball1 == 0) {
              clearInterval(interval);
            } else if (alarmindex == 2 && this.ball2 == 0) {
              clearInterval(interval);
            }
          }, 1000);
        }
      };
      if (this.ball1 == 1) {
        ball1.classList.add('balling-start-ball');
        frame1.classList.add('balling-start-frame');
        alarmfunc(1);
      } else {
        if (a.alarmN.length != 0) {
          ball1.classList.remove('balling-start-ball');
          frame1.classList.remove('balling-start-frame');
        }
      }
    },
    ball2() {
      var ball0 = document.getElementById('ball0');
      var frame0 = document.getElementById('frame0');
      var ball1 = document.getElementById('ball1');
      var frame1 = document.getElementById('frame1');
      var ball2 = document.getElementById('ball2');
      var frame2 = document.getElementById('frame2');
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );
      const alarmfunc = alarmindex => {
        let settime = a.alarmN[alarmindex].time;
        let hour1 = settime.substr(0, 2);
        let minute1 = settime.substr(3, 2);
        let month1 = String(this.month);
        let day1 = String(this.day);
        if (month1.length == 1) {
          month1 = '0' + month1;
        }
        if (day1.length == 1) {
          day1 = '0' + day1;
        }
        let standard = String('2022' + month1 + day1 + hour1 + minute1 + '00');
        var year = Number(standard.substring(0, 4));
        var month = Number(standard.substring(4, 6));
        var day = Number(standard.substring(6, 8));
        var time = Number(standard.substring(8, 10));
        var minute = Number(standard.substring(10, 12));
        var second = Number(standard.substring(12, 14));
        var oprDate = new Date(year, month - 1, day, time, minute, second);
        var nowDate = new Date();
        var timer = oprDate.getTime() - nowDate.getTime();
        if (timer < 0) {
          return 0;
        } else {
          var interval = setInterval(() => {
            var now = new Date().getTime();
            if (now - oprDate.getTime() > 0) {
              if (alarmindex == 0) {
                alert(a.alarmN[alarmindex].title);
                ball0.classList.remove('balling-start-ball');
                frame0.classList.remove('balling-start-frame');
                this.ball0 = 0;
                this.sendtomodal._id = this.userid;
                this.sendtomodal.profileN = this.profileN;
                this.sendtomodal.month = this.month;
                this.sendtomodal.day = this.day;
                this.sendtomodal.ball = this.ball0;
                axios.post('/BallUpdate', this.sendtomodal).then(응답 => {
                  this.$emit('updateprofilebymodal', 응답);
                });
              } else if (alarmindex == 1) {
                alert(a.alarmN[alarmindex].title);
                ball1.classList.remove('balling-start-ball');
                frame1.classList.remove('balling-start-frame');
                this.ball1 = 0;
              } else {
                alert(a.alarmN[alarmindex].title);
                ball2.classList.remove('balling-start-ball');
                frame2.classList.remove('balling-start-frame');
                this.ball2 = 0;
              }

              clearInterval(interval);
            }
            if (alarmindex == 0 && this.ball0 == 0) {
              clearInterval(interval);
            } else if (alarmindex == 1 && this.ball1 == 0) {
              clearInterval(interval);
            } else if (alarmindex == 2 && this.ball2 == 0) {
              clearInterval(interval);
            }
          }, 1000);
        }
      };
      if (this.ball2 == 1) {
        ball2.classList.add('balling-start-ball');
        frame2.classList.add('balling-start-frame');
        alarmfunc(2);
      } else {
        if (a.alarmN.length != 0) {
          ball2.classList.remove('balling-start-ball');
          frame2.classList.remove('balling-start-frame');
        }
      }
    },
  },
};
</script>

<style>
div {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
}
.daywrap {
  position: relative;
  width: 1024px;
  height: 90vh;
}
.day-top {
  position: relative;
  width: 1000px;
  height: 9vh;
  top: 1vh;
  left: 12px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.day-top > span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 36px;
}
.day-contents {
  position: relative;
  display: inline-block;
  width: 1000px;
  height: 78vh;
  left: 12px;
  top: 2vh;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
}
.day-contents span {
  color: rgba(255, 255, 255, 0.8);
}
.no-contents {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  top: 39vh;
}
.yes-contents-top {
  position: relative;
  background: transparent;
  display: flex;
  flex-direction: column;
  width: 972px;
  left: 14px;
  height: 67vh;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.6);
  border-radius: 30px;
  overflow-x: hidden;
  overflow-y: auto;
}
.yes-contents-top::-webkit-scrollbar {
  display: none;
}

.yes-contents-top-outside {
  width: 944px;
  height: 50px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
  border-radius: 30px;
  margin: 14px 14px 0px 14px;
}

.yes-contents-top-outside-alarm-frame {
  position: relative;
  width: 50px;
  height: 25px;
  border-radius: 30px;
  background: transparent;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.8);
  top: 12.5px;
  left: 20px;
}
.yes-contents-top-outside-alarm-ball {
  position: relative;
  width: 25px;
  height: 25px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.8);
}

.yes-contents-top-outside-titletime {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 500px;
}
.yes-contents-top-outside-time {
  padding-right: 115px;
}

.yes-contents-top-outside-titletime > span {
  display: inline-block;
  height: 25px;
  font-size: 18px;
  overflow: hidden;
}

.yes-contents-top-outside-delmodify {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.yes-contents-top-outside-delmodify > button {
  width: 100px;
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
  border-radius: 20px;
}
.yes-contents-top-outside-modify:hover {
  background-color: rgba(154, 150, 32, 0.3);
  border-radius: 30px;
}
.yes-contents-top-outside-del:hover {
  background-color: rgba(192, 40, 40, 0.3);
  border-radius: 30px;
}

.yes-contents-top-inside {
  width: 904px;
  height: 200px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0px 14px 14px 34px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  border-radius: 0px 0px 30px 30px;
}
.yes-contents-top-inside-alarm123 {
  width: 204px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px 0 0px 140px;
}
.yes-contents-top-inside-alarm123 > span {
  margin: 20px 0;
  overflow: hidden;
}

.yes-contents-top-inside-alarmcontents {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 700px;
  margin-left: 90px;
}
.yes-contents-top-inside-alarmcontents > span {
  margin: 20px 0;
  overflow: hidden;
}
.plus-contents {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: right;
  top: 2vh;
  left: -3.5vh;
}
.plus-contents > button {
  width: 60px;
  background: transparent;
  border: 0;
  margin: 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
  font-size: 52px;
  background-color: rgba(66, 63, 64, 0);
  border-radius: 15px;
}
.plus-contents > button:hover {
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
}

.balling-start-ball {
  transition: 0.2s ease;
  transform: translateX(25px);
}
.balling-start-frame {
  transition: 0.2s ease;
  background-color: rgba(154, 150, 32, 0.8);
}
.balling-end-ball {
  transition: 0.2s ease;
  transform: translateX(0px);
}
.balling-end-frame {
  transition: 0.2s ease;
  background-color: rgba(154, 150, 32, 0);
}
.inside-enter-active {
  animation: insidein 0.2s 0s 1 ease alternate;
}
.inside-leave-active {
  animation: insideout 0.2s 0s 1 ease alternate;
}

.modal-enter-active {
  /* transition: opacity 0.3s ease-in-out; */
  animation: zoom-in 0.3s ease;
}
.modal-leave-active {
  animation: zoom-in 0.3s ease reverse;
}
.calender-enter-active {
  /* transition: opacity 0.3s ease-in-out; */
  animation: zoom-in 0.3s ease;
}
.calender-leave-active {
  animation: zoom-in 0.3s ease reverse;
}

@keyframes insidein {
  0% {
    height: 0px;
    margin-bottom: 0px;
    opacity: 0;
  }
  10% {
    height: 20px;
    margin-bottom: 1.4px;
    opacity: 0.1;
  }
  20% {
    height: 40px;
    margin-bottom: 2.8px;
    opacity: 0.2;
  }
  30% {
    height: 60px;
    margin-bottom: 4.2px;
    opacity: 0.3;
  }
  40% {
    height: 80px;
    margin-bottom: 5.6px;
    opacity: 0.4;
  }
  50% {
    height: 100px;
    margin-bottom: 7px;
    opacity: 0.5;
  }
  60% {
    height: 120px;
    margin-bottom: 8.4px;
    opacity: 0.6;
  }
  70% {
    height: 140px;
    margin-bottom: 9.8px;
    opacity: 0.7;
  }
  80% {
    height: 160px;
    margin-bottom: 11.2px;
    opacity: 0.8;
  }
  90% {
    height: 180px;
    margin-bottom: 12.6px;
    opacity: 0.9;
  }
  100% {
    height: 200px;
    margin-bottom: 14px;
    opacity: 1;
  }
}
@keyframes insideout {
  100% {
    height: 0px;
    margin-bottom: 0px;
    opacity: 0;
  }
  90% {
    height: 20px;

    margin-bottom: 1.4px;
    opacity: 0.1;
  }
  80% {
    height: 40px;

    margin-bottom: 2.8px;
    opacity: 0.2;
  }
  70% {
    height: 60px;

    margin-bottom: 4.2px;
    opacity: 0.3;
  }
  60% {
    height: 80px;

    margin-bottom: 5.6px;
    opacity: 0.4;
  }
  50% {
    height: 100px;

    margin-bottom: 7px;
    opacity: 0.5;
  }
  40% {
    height: 120px;

    margin-bottom: 8.4px;
    opacity: 0.6;
  }
  30% {
    height: 140px;

    margin-bottom: 9.8px;
    opacity: 0.7;
  }
  20% {
    height: 160px;

    margin-bottom: 11.2px;
    opacity: 0.8;
  }
  10% {
    height: 180px;

    margin-bottom: 12.6px;
    opacity: 0.9;
  }
  0% {
    height: 200px;

    margin-bottom: 14px;
    opacity: 1;
  }
}
@keyframes zoom-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
