<template>
  <div id="login" class="login__page__container">
    <!-- Login Sub-View -->
    <form v-if="!this.isSignup" method="post" @submit.prevent="handleLogin" class="login__page__box">
      <input ref="login-input-username" class="login__page__input" type="text" placeholder="Enter Username" name="username" v-model="user.username" required>
      <span ref="login-warn-username" class="login__page__warn-text hidden">Username or password is incorrect</span>
      <div class="anchor login__page__input__margin">
        <input class="login__page__input" :type="viewPassword ? 'text' : 'password'" placeholder="Enter Password" name="password" v-model="user.password" required>
        <v-icon v-if="!viewPassword" @click="viewPassword=true" class="login__page__input__icon">mdi-eye-off</v-icon>
        <v-icon v-else @click="viewPassword=!viewPassword" class="login__page__input__icon">mdi-eye</v-icon>
      </div>
      <button class="login__page__button" type="submit">Login</button>

      <!-- Swap Sub-view -->
      <div class="login__page__change-view login__page__change-view--1">
        <span>Don't have an account yet?</span>
        <span @click="isSignup=!isSignup">Sign Up!</span>
      </div>
    </form>

    <!-- Signup Sub-View -->
    <form v-else method="post" @submit.prevent="handleSignup" class="login__page__box">
      <input ref="signup-input-username" class="login__page__input" type="text" placeholder="Enter Username" name="username" v-model="user.username" required>
      <span ref="signup-warn-username" class="login__page__warn-text hidden">Username is already in use</span>
      <input ref="signup-input-email" class="login__page__input" type="text" placeholder="Enter Email" name="email" v-model="user.email" @blur="checkValidEmail" required>
      <span ref="signup-warn-email" class="login__page__warn-text hidden">Email is invalid</span>
      <div class="anchor">
        <input ref="signup-input-pass" class="login__page__input" :type="viewPassword ? 'text' : 'password'" placeholder="Enter Password" name="password" v-model="user.password" @blur="checkValidPassword" required>
        <v-icon v-if="!viewPassword" @click="viewPassword=true" class="login__page__input__icon">mdi-eye-off</v-icon>
        <v-icon v-else @click="viewPassword=!viewPassword" class="login__page__input__icon">mdi-eye</v-icon>
      </div>
      <span ref="signup-warn-pass" class="login__page__warn-text hidden">Password must be at least 8 characters long</span>
      <input ref="signup-input-pass2" class="login__page__input" :type="viewPassword ? 'text' : 'password'" placeholder="Re-enter Password" name="password2" v-model="user.password2" @blur="checkEqualPasswords" required>
      <span ref="signup-warn-pass2" class="login__page__warn-text hidden">Passwords do not match</span>
      <button class="login__page__button" type="submit">Sign Up</button>
      
      <!-- Swap Sub-view -->
      <div class="login__page__change-view">
        <span>Already have an account?</span>
        <span @click="isSignup=!isSignup">Login Here!</span>
      </div>
    </form>   
  </div>
</template>

<script>
import RecipesPane from "../components/HomePage/RecipesPane";
import SearchBar from "../components/HomePage/SearchBar";
import axios from "axios";

const services = require("@/helpers/services");

export default {
  name: "HomePage",
  components: {
    RecipesPane,
    SearchBar
  },
  services: services,
  data: () => ({
    isSignup: false,
    viewPassword: false,
    user: {
      username: '',
      password: '',
      password2: '',
      email: ''
    }
  }),
  methods: {
    handleLogin() {
      axios
        .post(`${this.$options.services.url_uac}/login`, this.user, {withCredentials: true, credentials: 'include'})
        .then(res => {
          console.log(res)
          this.$root.sessionInfo = res.data;
          this.$router.push('/');
        })
        .catch(err => {
          console.log(err)
          this.setWarning("login-warn-username", "login-input-username");
        });
    },
    handleSignup() {
      axios
        .post(`${this.$options.services.url_uac}/signup`, this.user, {withCredentials: true, credentials: 'include'})
        .then(res => {
          console.log(res)
          if (res.data.loggedIn) {
            this.$root.sessionInfo = res.data;
            this.$router.push('/');
          }
        })
        .catch(err => {
          console.log(err)
          const conflict = err.response.data.conflict;
          const message = err.response.data.message;
          this.setWarning("signup-warn-" + conflict, "signup-input-" + conflict, message);
        });
    },
    checkValidEmail() {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      // Make email all lower case
      this.user.email = this.user.email.toLocaleLowerCase().trim();

      if (re.test(this.user.email) || this.user.email.length === 0) {
        this.clearWarning("signup-warn-email", "signup-input-email");
      } else {
        this.setWarning("signup-warn-email", "signup-input-email", "Email is invalid");
      }
    },
    checkValidPassword() {
      // Password must be 8 char or longer per NIST standards
      if (this.user.password.length < 8 && this.user.password.length > 0) {
        this.setWarning("signup-warn-pass", "signup-input-pass");
      } else {
        this.clearWarning("signup-warn-pass", "signup-input-pass");
      }
      
      // Recheck password equality
      this.checkEqualPasswords();
    },
    checkEqualPasswords() {
      if (this.user.password.length > 0 && this.user.password2.length > 0) {
        if (this.user.password !== this.user.password2) {
          this.setWarning("signup-warn-pass2", "signup-input-pass2");
        } else {
          this.clearWarning("signup-warn-pass2", "signup-input-pass2");
        }
      }
    },
    setWarning(refWarn, refInput, text) {
      this.$refs[refWarn].classList.remove("hidden");
      this.$refs[refInput].classList.add("login__page__input--invalid");
      if (text) {
        this.$refs[refWarn].innerText = text;
      }
    },
    clearWarning(refWarn, refInput) {
      this.$refs[refWarn].classList.add("hidden");
      this.$refs[refInput].classList.remove("login__page__input--invalid");
    },
  }
};
</script>

<style scoped lang="scss">
/* Global and container */
.login__page__container {
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login__page__box {
  display: flex;
  flex-direction: column;
  border: #B29A30 solid 1px;
  border-radius: 5px;
  width: 50%;
  height: 390px;
  padding: 30px;
}
.login__page__input {
  width: 100%;
  padding: 5px;
  border: 1px solid #B29A30;
  border-radius: 5px;
}
.login__page__input__margin {
  margin-bottom: 30px;
}
.login__page__input::placeholder {
  color: #B29A30; 
}
.login__page__input--invalid {
  border: red solid 2px;
  margin: -1px;
}

.login__page__input__icon {
  position: absolute;
  height: 100%;
  right: 5px;
  cursor: pointer;
}
.login__page__input__icon:after { // Remove default ripple
  opacity: 0 !important;
}

.login__page__change-view {
  width: 100%;
}
.login__page__change-view *:first-child {
  margin-right: 10px;
}
.login__page__change-view *:nth-child(2) {
  text-decoration: underline;
  cursor: pointer;
}
.login__page__change-view--1 {
  margin-top: 130px;
}
.login__page__button {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 5px;
  background-color: #FFF1B3;
  color: #B29A30;
  border: none;
}
.login__page__warn-text {
  color: red;
  line-height: 20px;
  margin-bottom: 10px;
}
.hidden {
  visibility: hidden;
}
.anchor {
  position: relative;
}
</style>
