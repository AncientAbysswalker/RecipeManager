<template>
  <v-app>
    <v-app-bar app color="#FFF1B3">
      
      <!-- Left Part of Header -->
      <router-link class="header__left" to="/">
        <!-- Logo -->
        <div class="d-flex align-center">
          <v-img
            alt="Raviole Logo"
            class="shrink mr-2 ml-2"
            contain
            src="@/assets/raviole.png"
            transition="scale-transition"
            width="50"
          />

          <!-- Text -->
          <div class="text-h4">RaviOlé</div>
        </div>
      </router-link>

      <v-spacer></v-spacer>

      <!-- Middle Part of Header -->
      <div id="nav">
        <router-link v-if="this.$root.sessionInfo !== null && this.$root.sessionInfo.loggedIn" to="/">Home</router-link> 
        <span class="header__nav--divider" v-if="this.$root.sessionInfo !== null && this.$root.sessionInfo.loggedIn">|</span>
        <router-link to="/discover">Discover</router-link>
        <span class="header__nav--divider">|</span>
        <router-link to="/about">About</router-link>
      </div>
      
      <v-spacer></v-spacer>

      <!-- Right Part of Header 
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>                        -->
      <div>
        <div v-if="this.$root.sessionInfo !== null && this.$root.sessionInfo.loggedIn" class="header__login-info anchor">
          <span class="header__logout-text" @click="logoutSession">Log Out</span>
          <span class="header__username">Logged in as {{this.$root.sessionInfo.username}}</span>
        </div>
        <div v-else-if="this.$root.sessionInfo !== null" class="header__login-info">
          <router-link to="/login">Log In</router-link>
        </div>
      </div>
    </v-app-bar>
    
    <!-- Main Application -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// Modules
import axios from "axios";

// Enums
const services = require("@/helpers/services");

//import Header from "./components/layout/Header";
export default {
  name: "App",
  //components: {
  //  Header,
  //},
  services: services,
  data: () => ({
    test: false
  }),
  watch: {
    '$route' (to, from) {
      this.checkSession();
    }
  },
  mounted() {
    this.checkSession();
  },
  methods: {
    logoutSession() {
      axios
        .post(
          `${this.$options.services.url_uac}/logout`, {}, {withCredentials: true, credentials: 'include'}
        )
        .then((res) => {
          this.$root.sessionInfo = {
            loggedIn: false
          };
        })
        .catch((err) => console.log('Failed to logout: ', err));
    },
    checkSession  () {
      axios
        .get(
          `${this.$options.services.url_uac}/session`, {withCredentials: true, credentials: 'include'}
        )
        .then((res) => {
          console.log('setting session state');
          if (this.$root.sessionInfo === null) {
            console.log('setting first time');
            this.$root.sessionInfo = res.data;
          } else {
            if (this.$root.sessionInfo.loggedIn !== res.data.loggedIn) {
              this.$root.sessionInfo = res.data;
              console.log('small change');
            } else {
              console.log('no change');
            }
          }
        })
        .catch((err) => console.log('Cannot connect to server to check session'));
    }
  }
};
</script>

<style scoped>
#nav * {
  color: #B29A30 !important;
  text-decoration-color: #B29A30 !important;
  text-shadow: none;
  box-shadow: none;
}

.header__left {
  color: #B29A30 !important;
  border-bottom: none !important;
  text-decoration: none !important;
  text-decoration-color: #B29A30 !important;
  background-image: none !important;
}

.header__login-info * {
  margin: 5px;
}

.header__logout-text {
  cursor: pointer;
  color: #1976D2;
  text-decoration: underline;
}

.anchor {
  position: relative;
}

.header__username {
  white-space: nowrap; /* Prevent newline */
  margin-top: 0px; /* Because floating */
  position: absolute;
  right: 100%; /* Just to Left of Right Side of Log In/Out */
  text-align: right;
}

.header__nav--divider {
  margin-left: 5px;
  margin-right: 5px;
}

/* Add Fancy Font */
@font-face {
  font-family: "ReginaScript";
  src: local("ReginaScript"), url(./fonts/ReginaScript.ttf) format("truetype");
}
@font-face {
  font-family: "QuickKiss";
  src: local("QuickKiss"), url(./fonts/QuickKiss.ttf) format("truetype");
}
@font-face {
  font-family: "Secrets";
  src: local("GirlsHaveManySecrets"), url(./fonts/GirlsHaveManySecrets.ttf) format("truetype");
}
@font-face {
  font-family: "AllPink";
  src: local("AllThingsPink"), url(./fonts/AllThingsPink.ttf) format("truetype");
}
</style>
