<template>
  <transition name="out">
    <div class="login-page" v-if="onoff == 'on'">
      <div class="login-top-contents">
        <input
          id="id"
          type="text"
          class="id"
          v-model="logindata._id"
          spellcheck="false"
          autocomplete="off"
        />
        <input
          id="pwd"
          type="password"
          class="pwd"
          v-model="logindata.pwd"
          spellcheck="false"
          autocomplete="off"
        />
        <button class="login-input" @click="login()">Login</button>
        <button class="sign-input" @click="signtable()">Sign</button>
      </div>
      <transition name="sign">
        <div class="login-bottom-contents" v-if="signOnOff == 1">
          <div class="login-bottom-contents-top">
            <input
              type="text"
              class="testid"
              v-model="loginframe._id"
              placeholder="Id"
              spellcheck="false"
            />

            <input
              type="password"
              class="testpwd"
              v-model="loginframe.pwd"
              placeholder="Pwd"
              spellcheck="false"
            />

            <input
              type="password"
              class="testpwdr"
              v-model="pwdr"
              placeholder="Pwd Check"
              spellcheck="false"
            />
          </div>
          <div class="login-bottom-contents-middle-img">
            <div
              class="middleimg0"
              :style="{ backgroundImage: `url('${fakeprofileimage[0]}')` }"
            ></div>
            <div
              class="middleimg1"
              :style="{ backgroundImage: `url('${fakeprofileimage[1]}')` }"
            ></div>
          </div>
          <div class="login-bottom-contents-middle">
            <label for="profileimg1">+</label>
            <input
              @change="upload0"
              type="file"
              class="profileimg1"
              id="profileimg1"
            />
            <label for="profileimg2">+</label>
            <input
              @change="upload1"
              type="file"
              class="profileimg2"
              id="profileimg2"
            />
          </div>
          <div class="login-bottom-contents-bottom">
            <input
              type="text"
              class="profilename1"
              v-model="loginframe.name0"
              placeholder="Profile 1 Name"
              spellcheck="false"
            />

            <input
              type="text"
              class="profilename2"
              v-model="loginframe.name1"
              placeholder="Profile 2 Name"
              spellcheck="false"
            />
          </div>
          <p id="notice">&nbsp;{{ Noticesign }}</p>
          <button @click="sign()">Sign</button>
          <button @click="signtable">Close</button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import axios from 'axios';
import basicframe from './modal.json';
import loginframe from './login.json';
let today = new Date();
let m = today.getMonth() + 1;
let d = today.getDate();

export default {
  emits: ['userdata'],
  data() {
    return {
      logindata: { _id: '', pwd: '' },
      pwdr: '',
      basicframe: basicframe,
      loginframe: loginframe,
      onoff: 'on',
      signOnOff: 0,
      Noticesign: '',
      fakeprofileimage: ['', ''],
    };
  },
  methods: {
    sign() {
      var notice = document.getElementById('notice');
      if (
        this.loginframe.id != '' &&
        this.loginframe.pwd == this.pwdr &&
        this.loginframe.pwd != '' &&
        this.pwdr != '' &&
        this.loginframe.name0 != '' &&
        this.loginframe.name1 != '' &&
        this.loginframe.img0 != '' &&
        this.loginframe.img1 != ''
      ) {
        basicframe._id = loginframe._id;
        basicframe.profile[0].profilename = loginframe.name0;
        basicframe.profile[1].profilename = loginframe.name1;
        basicframe.profile[0].profileimage = loginframe.img0;
        basicframe.profile[1].profileimage = loginframe.img1;
        basicframe.profile[0].contents[0].month = m;
        basicframe.profile[0].contents[0].day = d;
        basicframe.profile[1].contents[0].month = m;
        basicframe.profile[1].contents[0].day = d;
        axios.post('/MakeUserData', this.loginframe).then(response => {
          console.log(response);
        });
        axios.post('/MakeUserFirstProfile', this.basicframe).then(response => {
          console.log(response);
        });
        this.signOnOff = 0;
      } else if (this.loginframe.pwd != this.pwdr) {
        this.Noticesign = 'Pwd Error';
        notice.classList.add('wrongdata');
        setTimeout(function () {
          notice.classList.remove('wrongdata');
        }, 500);
      } else if (
        this.loginframe.id == '' ||
        this.loginframe.pwd == '' ||
        this.pwdr == ''
      ) {
        this.Noticesign = 'Input Error';
        notice.classList.add('wrongdata');
        setTimeout(function () {
          notice.classList.remove('wrongdata');
        }, 500);
      } else if (this.loginframe.name0 == '' || this.loginframe.name1 == '') {
        this.Noticesign = 'Input ProfileName';
        notice.classList.add('wrongdata');
        setTimeout(function () {
          notice.classList.remove('wrongdata');
        }, 500);
      } else if (this.loginframe.img0 == '' || this.loginframe.img1 == '') {
        this.Noticesign = 'Input ProfileImage';
        notice.classList.add('wrongdata');
        setTimeout(function () {
          notice.classList.remove('wrongdata');
        }, 500);
      }
    },
    login() {
      var id = document.getElementById('id');
      var pwd = document.getElementById('pwd');
      axios.post('/Login', this.logindata).then(response => {
        if (response.data == '잘못됨') {
          id.classList.add('wrongdata');
          pwd.classList.add('wrongdata');
          setTimeout(function () {
            id.classList.remove('wrongdata');
            pwd.classList.remove('wrongdata');
          }, 500);
        } else {
          //조건문써야함
          const first = response.data[0].profile[0].contents.find(
            x => x.month == m && x.day == d
          );
          const sceond = response.data[0].profile[1].contents.find(
            x => x.month == m && x.day == d
          );
          if (first === undefined || sceond === undefined) {
            axios.post('/LoginBeforeUpdate', this.logindata).then(응답 => {
              this.$emit('getid', 응답);
              this.onoff = 'off';
            });
          } else {
            this.$emit('getid', response);
            this.onoff = 'off';
          }
        }
      });
    },
    signtable() {
      if (this.signOnOff == 0) {
        this.signOnOff = 1;
      } else {
        this.signOnOff = 0;
      }
    },
    upload0(e) {
      let 파일 = e.target.files[0];
      function readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
      }
      readFile(파일, function (e) {
        loginframe.img0 = e.target.result;
      });

      let url = URL.createObjectURL(파일);
      this.fakeprofileimage[0] = url;
    },
    upload1(e) {
      let 파일 = e.target.files[0];
      function readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
      }

      readFile(파일, function (e) {
        loginframe.img1 = e.target.result;
      });

      let url = URL.createObjectURL(파일);
      this.fakeprofileimage[1] = url;
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
body,
a,
p,
input,
button,
span {
  font-size: 14px;
  text-decoration: none;
  color: #36384f;
}
p {
  margin: 0;
}
input {
  display: block;
}
.login-page {
  position: absolute;
  width: 1024px;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}
.login-top-contents {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 40vh;
  left: 448px;
}
.login-top-contents > input {
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

.login-top-contents > input:focus {
  outline: none;
}
.login-top-contents > button {
  background: transparent;
  border: 0;
  margin: 12px 0;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
  font-size: 14px;
}

.login-top-contents > button:hover {
  margin: 12px 0;
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
}
.login-top-contents > button:focus {
  margin: 12px 0;
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
  outline: 0;
}
.login-top-contents > p {
  color: rgba(192, 40, 40, 0.628);
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin: 5px 0;
}
.login-bottom-contents {
  width: 900px;
  height: 600px;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: calc(50vh - 300px);
  vertical-align: middle;
  left: 62px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  background: rgba(88, 88, 88, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}
.login-bottom-contents > input {
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
.login-bottom-contents > p {
  color: rgba(192, 40, 40, 0.628);
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}

.login-bottom-contents-top {
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 82px 187px 0 187px;
}
.login-bottom-contents-top > input {
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
.login-bottom-contents-top > input:focus {
  outline: none;
}

.login-bottom-contents-middle-img {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 151px;
}
.middleimg0 {
  width: 200px;
  height: 200px;
  background-color: rgba(66, 63, 64, 0.5);
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  background-position: center center;
  background-size: cover;
}
.middleimg1 {
  width: 200px;
  height: 200px;
  background-color: rgba(66, 63, 64, 0.5);
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  background-position: center center;
  background-size: cover;
}

.login-bottom-contents-middle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 187px;
}

.login-bottom-contents-middle > input {
  display: none;
}

.login-bottom-contents-middle > label {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  border: 0;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 18px;
  transition: 0.3s ease;
  margin: 0 49px;
}

.login-bottom-contents-middle > label:hover {
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  transition: 0.3s ease;
}

.login-bottom-contents-bottom {
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 187px;
}
.login-bottom-contents-bottom > input {
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
.login-bottom-contents-bottom > input:focus {
  outline: none;
}

.login-bottom-contents > button {
  width: 100px;
  background: transparent;
  border: 0;
  margin: 10px 400px;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
}
.login-bottom-contents > button:hover {
  margin: 10px 400px;
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
}
.login-bottom-contents > button:focus {
  margin: 10px 400px;
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
  outline: 0;
}

.sign-enter-to,
.sign-leave-from {
  opacity: 1;
}

.sign-enter-active,
.sign-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.sign-enter-from,
.sign-leave-to {
  opacity: 0;
}

.out-enter-to,
.out-leave-from {
  opacity: 1;
}

.out-enter-active,
.out-leave-active {
  transition: 0.4s ease-in-out;
}
.out-enter-from,
.out-leave-to {
  opacity: 0;
  transform: translateY(-100vh);
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
