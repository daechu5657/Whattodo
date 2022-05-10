<template>
  <div class="wrap">
    <div class="center">
      <div class="centerwrap">
        <Login @getid="getid" />
        <div class="main">
          <Day
            :profileN="profileN"
            :profile="profile"
            :TodayOn="TodayOn"
            @CalenderOff="CalenderOnOff = 0"
            :CalenderOnOff="CalenderOnOff"
            @clickCalender="clickCalender"
            :userid="userid"
            @updateprofile="updateprofile"
            @updateprofilebymodal="updateprofilebymodal"
          />
          <transition name="settings">
            <Settings
              :SettingsOnOff="SettingsOnOff"
              :profile="profile"
              :profileimage="profileimage"
              @clickSettings="clickSettings"
              :userid="userid"
              @updateprofile="updateprofile"
            />
          </transition>
        </div>
        <div class="footer">
          <div class="footer-contents">
            <span @click="clicktoday">Today</span>
            <span @click="clickCalender">Calendar</span>
            <span @click="clickSettings">Settings</span>
            <div class="profile" @click="profileNchange">
              <transition name="profilechange2">
                <div class="profile-2" :key="profileNumber1">
                  <div
                    class="profile-img1"
                    :style="{
                      backgroundImage: `url(${profileimage[profileNumber1].profileimage})`,
                    }"
                  ></div>
                  <div class="profile-name1"></div>
                </div>
              </transition>
              <transition name="profilechange1">
                <div class="profile-1" :key="profileNumber0">
                  <div
                    class="profile-img0"
                    :style="{
                      backgroundImage: `url(${profileimage[profileNumber0].profileimage})`,
                    }"
                  ></div>
                  <div class="profile-name0">
                    {{ profilename[profileNumber0].profilename }}
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Day from './components/Day.vue';
import Login from './components/Login.vue';
import Settings from './components/Setting.vue';
export default {
  name: 'App',
  components: {
    Day: Day,
    Login: Login,
    Settings: Settings,
  },
  data() {
    return {
      profile: [],
      userid: '',
      profileN: 0,
      profileOnOff: 'off',
      profilename: [{ profilename: '' }, { profilename: '' }],
      profileimage: [{ profileimage: '' }, { profileimage: '' }],
      TodayOn: 0,
      CalenderOnOff: 0,
      profileNumber0: 0,
      profileNumber1: 1,
      SettingsOnOff: 0,
    };
  },
  methods: {
    getid(a) {
      this.userid = a.data[0]._id;
      this.profile = a.data[0].profile;
    },
    updateprofile(a) {
      this.profile = a.data[0].profile;
    },
    updateprofilebymodal(a) {
      this.profile = a.data[0].profile;
    },
    profileNchange() {
      if (this.profileN == 0) {
        this.profileN = 1;
      } else {
        this.profileN = 0;
      }
    },
    clicktoday() {
      this.CalenderOnOff = 0;
      this.TodayOn = 1;
    },
    clickCalender() {
      if (this.CalenderOnOff == 0) {
        this.CalenderOnOff = 1;
        this.TodayOn = 0;
      } else {
        this.CalenderOnOff = 0;
        this.TodayOn = 1;
      }
    },
    clickSettings() {
      if (this.SettingsOnOff == 1) {
        this.SettingsOnOff = 0;
      } else {
        this.SettingsOnOff = 1;
      }
    },
  },
  watch: {
    profile(data) {
      this.profilename[0].profilename = data[0].profilename;
      this.profilename[1].profilename = data[1].profilename;
      this.profileimage[0].profileimage = data[0].profileimage;
      this.profileimage[1].profileimage = data[1].profileimage;
    },
    profileN(a) {
      if (a == 0) {
        this.profileNumber0 = 0;
        this.profileNumber1 = 1;
      } else {
        this.profileNumber0 = 1;
        this.profileNumber1 = 0;
      }
    },
    // //결국 변동은 모달에서 나타나니까 모달에서 생성에 emit달아서 axios get하도록
    // 하면 계속 업데이트 되서 쭉쭉 props할듯
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
.wrap {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #242424;
  overflow: hidden;
}
.center {
  position: relative;
  width: 1024px;
  height: 100%;
  margin: 0 auto;
}
.centerwrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(#253739, #555546);
  /* background-image: url('./assets/background.png');
  background-repeat: no-repeat;
  background-size: 1024px 100vh; */
}
.main {
  position: relative;
  width: 1024px;
  height: 90vh;
  background-color: rgba(0, 0, 0, 0.45);
}
.footer {
  position: relative;
  width: 1024px;
  height: 10vh;
  background-color: rgba(0, 0, 0, 0.45);
}

.footer-contents {
  position: relative;
  width: 1000px;
  height: 9vh;
  left: 12px;
  padding: 0 150px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.footer-contents > span {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2vh 0;
  color: rgba(255, 255, 255, 0.8);
  transition: 0.3s ease;
  font-size: 18px;
  font-weight: bold;
  background-color: rgba(66, 63, 64, 0);
  border-radius: 15px;
}
.footer-contents > span:hover {
  background-color: rgba(54, 54, 54, 0.6);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
}
.profile {
  position: relative;
  width: 60px;
  height: 100px;
}
.profile-1 {
  width: 60px;
  height: 100px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.profile-2 {
  width: 60px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  left: 7px;
}
.profile-img0 {
  position: relative;
  width: 60px;
  height: 60px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  margin-top: 10px;
  background-position: center center;
  background-size: cover;
}
.profile-img1 {
  position: relative;
  width: 60px;
  height: 60px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  margin-top: 10px;
  background-position: center center;
  background-size: cover;
}
.profile-name0 {
  position: relative;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
  margin-bottom: 4px;
}
.profile-name1 {
  position: relative;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
  margin-bottom: 4px;
}

.profilechange2-enter-from {
  opacity: 0;
}
.profilechange2-enter-active {
  transition: ease 0.4s;
}
.profilechange2-enter-to {
  opacity: 1;
}
.profilechange2-leave-from {
  opacity: 1;
}
.profilechange2-leave-active {
  transition: all 1s;
}
.profilechange2-leave-to {
  opacity: 0;
}

.profilechange1-enter-from {
  opacity: 0;
}
.profilechange1-enter-active {
  transition: ease 0.4s;
}
.profilechange1-enter-to {
  opacity: 1;
}

.profilechange1-leave-from {
  opacity: 1;
}
.profilechange1-leave-active {
  transition: all 1s;
}
.profilechange1-leave-to {
  opacity: 0;
}
.settings-enter-active {
  animation: zoom-in 0.3s ease;
}
.settings-leave-active {
  animation: zoom-in 0.3s ease reverse;
}
</style>
