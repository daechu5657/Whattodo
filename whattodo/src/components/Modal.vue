<template>
  <div class="modal-outside">
    <div class="modalwrap">
      <div class="modal-top">
        <input
          type="text"
          class="title"
          placeholder="Title"
          v-model="senddata.title"
          spellcheck="false"
        />
        <input
          type="time"
          class="time"
          placeholder="Time"
          v-model="senddata.time"
        />
      </div>
      <div class="modal-content">
        <div
          class="modal-content-box"
          v-for="(text, index) in senddata.text"
          :key="index"
        >
          <input
            type="text"
            v-model="senddata.text[index].text"
            spellcheck="false"
          />
        </div>
        <div class="modal-content-btn">
          <button @click="push()">Plus</button>
          <button @click="del()">Del</button>
        </div>
      </div>
      <p id="alert">&nbsp;{{ alert }}</p>
      <div class="modal-bottom">
        <button v-if="modifyOn != 2" @click="save()">Write</button>
        <button v-if="modifyOn == 2" @click="modify()">Modify</button>
        <button @click="$emit('modalOnOffchange')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      index: 0,
      indexm: 0,
      alert: '',
      senddata: {
        _id: '',
        profileN: '',
        month: '',
        day: '',
        alarmindex: 0,
        title: '',
        time: '',
        text: [],
        alarmorder: 0,
        ball: 0,
      },
    };
  },
  props: {
    profile: Array,
    profileN: Number,
    modalOnOff: Number,
    month: Number,
    day: Number,
    userid: String,
    sendtomodal: Array,
    alarmindex: Number,
    modifyOn: Number,
    boxindex: Number,
  },
  methods: {
    push() {
      var alert = document.getElementById('alert');
      if (this.indexm >= 3) {
        this.alert = 'Up to 3 boxes';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else {
        this.senddata.text.push({ text: '' });
        this.indexm++;
      }
    },
    save() {
      var alert = document.getElementById('alert');
      this.senddata._id = this.userid;
      this.senddata.profileN = this.profileN;
      this.senddata.month = this.month;
      this.senddata.day = this.day;
      this.senddata.alarmindex = this.alarmindex;
      if (this.indexm == 0) {
        this.alert = 'Make a box';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (this.indexm == 1 && this.senddata.text[0].text == '') {
        this.alert = 'Enter the content';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (
        this.indexm == 2 &&
        (this.senddata.text[0].text == '' || this.senddata.text[1].text == '')
      ) {
        this.alert = 'Enter the content';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (
        this.indexm == 3 &&
        (this.senddata.text[0].text == '' ||
          this.senddata.text[1].text == '' ||
          this.senddata.text[2].text == '')
      ) {
        this.alert = 'Enter the content';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (this.senddata.title == '') {
        this.alert = 'Enter the title';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (this.senddata.time == '') {
        this.alert = 'Enter the time';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else {
        axios.post('/ModalUpdate', this.senddata).then(응답 => {
          this.$emit('updateprofilebymodal', 응답);
          this.$emit('modalOnOffchange');
        });
      }
    },
    del() {
      this.senddata.text.pop();
      this.indexm--;
    },
    modify() {
      var alert = document.getElementById('alert');
      this.senddata._id = this.userid;
      this.senddata.profileN = this.profileN;
      this.senddata.month = this.month;
      this.senddata.day = this.day;
      this.senddata.alarmorder = this.sendtomodal.alarmorder;
      this.senddata.ball = this.sendtomodal.ball;
      const a = this.profile[this.profileN].contents.find(
        x => x.month == this.month && x.day == this.day
      );

      if (this.sendtomodal.alarmorder == 2) {
        this.senddata.alarmindex = a.alarmN[2].index;
      } else if (this.sendtomodal.alarmorder == 1) {
        this.senddata.alarmindex = a.alarmN[1].index;
      } else {
        this.senddata.alarmindex = a.alarmN[0].index;
      }

      if (this.indexm == 0) {
        this.alert = 'Make a box';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (this.indexm == 1 && this.senddata.text[0].text == '') {
        this.alert = 'Enter the content';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (
        this.indexm == 2 &&
        (this.senddata.text[0].text == '' || this.senddata.text[1].text == '')
      ) {
        this.alert = 'Enter the content';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (
        this.indexm == 3 &&
        (this.senddata.text[0].text == '' ||
          this.senddata.text[1].text == '' ||
          this.senddata.text[2].text == '')
      ) {
        this.alert = 'Enter the content';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (this.senddata.title == '') {
        this.alert = 'Enter the title';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else if (this.senddata.time == '') {
        this.alert = 'Enter the time';
        alert.classList.add('wrongdata');
        setTimeout(function () {
          alert.classList.remove('wrongdata');
        }, 500);
      } else {
        axios.post('/ModifyModal', this.senddata).then(응답 => {
          this.$emit('updateprofilebymodal', 응답);
          this.$emit('modalOnOffchange');
        });
      }
    },
  },
  watch: {
    modifyOn() {
      if (this.modifyOn == 2) {
        const a = this.profile[this.profileN].contents.find(
          x => x.month == this.month && x.day == this.day
        );
        this.senddata.time = a.alarmN[this.sendtomodal.alarmorder].time;
        this.senddata.title = a.alarmN[this.sendtomodal.alarmorder].title;

        if (a.alarmN[this.sendtomodal.alarmorder].text[1] == '') {
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmorder].text[0]
          );
        } else if (a.alarmN[this.sendtomodal.alarmorder].text[2] == '') {
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmorder].text[0]
          );
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmorder].text[1]
          );
        } else {
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmorder].text[0]
          );
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmorder].text[1]
          );
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmorder].text[2]
          );
        }
      }
    },
  },
  mounted() {
    if (this.modifyOn == 1) {
      this.$emit('modifychange');
    }
    if (this.boxindex > 0) {
      this.indexm = this.boxindex;
    }
  },
  unmounted() {
    this.senddata.text = [];
    this.indexm = 0;
    this.$emit('boxindexreset');
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
.modal-outside {
  position: absolute;
  width: 1024px;
  height: 100vh;
  top: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0);
}
.modalwrap {
  position: absolute;
  width: 512px;
  height: 50vh;
  background-color: rgba(0, 0, 0, 0.1);
  left: 256px;
  top: 20vh;
  box-shadow: 0px 0px 14px 6px rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  backdrop-filter: blur(8px);
}
.modal-top {
  position: relative;
  width: inherit;
  height: 10vh;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.modal-top > .title {
  width: 200px;
}
.modal-top > input {
  width: 124px;
  height: 3vh;
  border-radius: 30px;
  border: 0;
  margin: 1vh 0px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(66, 63, 64, 0.5);
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.modal-top > input:focus {
  outline: none;
}
.modal-content {
  position: relative;
  width: inherit;
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.modal-content-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
}
.modal-content-box > input {
  width: 420px;
  height: 3vh;
  border-radius: 30px;
  border: 0;
  margin: 1vh 0px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(66, 63, 64, 0.5);
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.modal-content-box > input:focus {
  outline: none;
}
.modal-content-btn {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.modal-content-btn > button {
  background: transparent;
  border: 0;
  margin: 12px 0;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
  font-size: 14px;
}
.modal-content-btn > button:hover {
  margin: 12px 0;
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
}
.modal-bottom {
  position: relative;
  width: inherit;
  height: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.modal-bottom > button {
  background: transparent;
  border: 0;
  margin: 12px 0;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
  font-size: 14px;
  height: 30px;
}
.modal-bottom > button:hover {
  margin: 12px 0;
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
}
#alert {
  height: 5vh;
  color: rgba(192, 40, 40, 0.628);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}
.wrongdata {
  animation: wrongdata 0.4s 0s 1 ease alternate;
}

@keyframes wrongdata {
  0% {
  }
  10% {
    transform: translateX(5px);
  }
  20% {
    transform: translateX(-5px);
  }
  30% {
    transform: translateX(5px);
  }
  40% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-5px);
  }
  70% {
    transform: translateX(5px);
  }
  80% {
    transform: translateX(-5px);
  }
  90% {
    transform: translateX(5px);
  }
  100% {
  }
}
</style>
