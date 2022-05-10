<template>
  <div class="setting-outside" v-if="SettingsOnOff == 1">
    <div class="setting-wrap">
      <div class="setting-img">
        <div
          class="settingimg0"
          :style="{
            backgroundImage: `url('${profileimage[0].profileimage}')`,
          }"
        ></div>
        <div
          class="settingimg1"
          :style="{
            backgroundImage: `url('${profileimage[1].profileimage}')`,
          }"
        ></div>
        <div
          class="fakeimg0"
          :style="{
            backgroundImage: `url('${fakeimg.img0}')`,
          }"
        ></div>
        <div
          class="fakeimg1"
          :style="{
            backgroundImage: `url('${fakeimg.img1}')`,
          }"
        ></div>
      </div>
      <div class="setting-input">
        <label for="settingimginput0">+</label>
        <input
          @change="upload0"
          type="file"
          id="settingimginput0"
          class="settingimginput0"
        />
        <label for="settingimginput1">+</label>
        <input
          @change="upload1"
          type="file"
          id="settingimginput1"
          class="settingimginput1"
        />
      </div>
      <div class="setting-name">
        <input
          type="text"
          class="settingname0"
          v-model="send.name0"
          :placeholder="profile[0].profilename"
          spellcheck="false"
        />

        <input
          type="text"
          class="settingname1"
          v-model="send.name1"
          :placeholder="profile[1].profilename"
          spellcheck="false"
        />
      </div>
      <div class="setting-btn">
        <button @click="set">Modify</button>
        <button @click="$emit('clickSettings')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      fakeimg: { img0: '', img1: '' },
      send: { _id: '', name0: '', name1: '', img0: '', img1: '' },
    };
  },
  props: {
    SettingsOnOff: Number,
    profile: Array,
    profileimage: Array,
    userid: String,
  },
  methods: {
    set() {
      this.send._id = this.userid;
      axios.post('/SettingUpdate', this.send).then(response => {
        this.$emit('updateprofile', response);
      });
      this.$emit('clickSettings');
    },
    upload0(e) {
      let 파일 = e.target.files[0];
      function readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
      }
      readFile(파일, e => {
        this.send.img0 = e.target.result;
      });

      let url = URL.createObjectURL(파일);
      this.fakeimg.img0 = url;
    },
    upload1(e) {
      let 파일 = e.target.files[0];
      function readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
      }

      readFile(파일, e => {
        this.send.img1 = e.target.result;
      });

      let url = URL.createObjectURL(파일);
      this.fakeimg.img1 = url;
    },
  },
};
</script>

<style>
.setting-outside {
  position: absolute;
  width: 1024px;
  height: 90vh;
  top: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0);
}
.setting-wrap {
  position: absolute;
  width: 512px;
  height: 35vh;
  background-color: rgba(0, 0, 0, 0.1);
  left: 256px;
  top: 30vh;
  box-shadow: 0 0 14px 6px rgb(0 0 0 / 40%);
  border-radius: 30px;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.setting-img {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 20px;
}
.settingimg0 {
  width: 200px;
  height: 200px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  background-position: center center;
  background-size: cover;
}
.settingimg1 {
  width: 200px;
  height: 200px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  background-position: center center;
  background-size: cover;
}
.fakeimg0 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-position: center center;
  background-size: cover;
  left: 27px;
}
.fakeimg1 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-position: center center;
  background-size: cover;
  right: 29px;
}

.setting-input {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.setting-input > input {
  display: none;
}

.setting-input > label {
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

.setting-input > label:hover {
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  transition: 0.3s ease;
}

.setting-name {
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.setting-name > input {
  width: 124px;
  height: 3vh;
  border-radius: 30px;
  border: 0;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(66, 63, 64, 0.5);
  box-shadow: 1px 7px 10px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.setting-name > input:focus {
  outline: none;
}

.setting-btn {
  position: relative;
  width: inherit;
  height: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.setting-btn > button {
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.3s ease;
  font-size: 14px;
  height: 30px;
}
.setting-btn > button:hover {
  background-color: rgba(66, 63, 64, 0.5);
  border-radius: 30px;
  transition: 0.3s ease;
  border: 0;
}
</style>
