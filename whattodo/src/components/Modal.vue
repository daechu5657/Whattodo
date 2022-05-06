<template>
  <div class="modal-outside">
    <div class="modalwrap">
      <div class="modal-top">
        <input
          type="text"
          class="title"
          placeholder="제목"
          v-model="senddata.title"
        />
        <input
          type="time"
          class="time"
          placeholder="시간"
          v-model="senddata.time"
        />
      </div>
      <div class="modal-content">
        <div v-for="(text, index) in senddata.text" :key="index">
          <input type="text" v-model="senddata.text[index].text" />
        </div>
        <button @click="push()">박스추가</button>
        <button @click="del()">박스삭제</button>
      </div>
      <div class="modal-bottom">
        <button v-if="modifyOn != 2" @click="save()">등록</button>
        <button v-if="modifyOn == 2" @click="modify()">수정</button>
        <button @click="$emit('modalOnOffchange')">닫기</button>
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
      if (this.indexm >= 3) {
        alert('박슈는 3개까지만..ㅎ');
      } else {
        this.senddata.text.push({ text: '' });
        this.indexm++;
      }
    },
    save() {
      this.senddata._id = this.userid;
      this.senddata.profileN = this.profileN;
      this.senddata.month = this.month;
      this.senddata.day = this.day;
      this.senddata.alarmindex = this.alarmindex;
      if (this.indexm == 0) {
        alert('박슈만들어유');
      } else if (this.indexm == 1 && this.senddata.text[0].text == '') {
        alert('내용입력해쥬');
      } else if (
        this.indexm == 2 &&
        (this.senddata.text[0].text == '' || this.senddata.text[1].text == '')
      ) {
        alert('내용입력해쥬');
      } else if (
        this.indexm == 3 &&
        (this.senddata.text[0].text == '' ||
          this.senddata.text[1].text == '' ||
          this.senddata.text[2].text == '')
      ) {
        alert('내용입력해쥬');
      } else if (this.senddata.title == '') {
        alert('제목입력해쥬');
      } else if (this.senddata.time == '') {
        alert('시간입력해쥬');
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
        alert('박슈만들어유');
      } else if (this.indexm == 1 && this.senddata.text[0].text == '') {
        alert('내용입력해쥬');
      } else if (
        this.indexm == 2 &&
        (this.senddata.text[0].text == '' || this.senddata.text[1].text == '')
      ) {
        alert('내용입력해쥬');
      } else if (
        this.indexm == 3 &&
        (this.senddata.text[0].text == '' ||
          this.senddata.text[1].text == '' ||
          this.senddata.text[2].text == '')
      ) {
        alert('내용입력해쥬');
      } else if (this.senddata.title == '') {
        alert('제목입력해쥬');
      } else if (this.senddata.time == '') {
        alert('시간입력해쥬');
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
        this.senddata.time = a.alarmN[this.sendtomodal.alarmindex].time;
        this.senddata.title = a.alarmN[this.sendtomodal.alarmindex].title;

        if (a.alarmN[this.sendtomodal.alarmindex].text[1] == '') {
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmindex].text[0]
          );
        } else if (a.alarmN[this.sendtomodal.alarmindex].text[2] == '') {
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmindex].text[0]
          );
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmindex].text[1]
          );
        } else {
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmindex].text[0]
          );
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmindex].text[1]
          );
          this.senddata.text.push(
            a.alarmN[this.sendtomodal.alarmindex].text[2]
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
  height: 90vh;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
}
.modalwrap {
  position: absolute;
  width: 512px;
  height: 70vh;
  background-color: rgba(147, 70, 70, 0.9);
  z-index: 100;
  left: 256px;
  top: 10vh;
}
.modal-top {
  position: relative;
  width: inherit;
  height: 10vh;
}
.modal-content {
  position: relative;
  width: inherit;
  height: 50vh;
}
.modal-bottom {
  position: relative;
  width: inherit;
  height: 10vh;
}
</style>
