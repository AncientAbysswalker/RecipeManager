<template>
  <v-app>
    <v-app-bar app color="#FFF1B3">
      
      <router-link to="/">
        <div class="d-flex align-center">
          <v-img
            alt="Raviole Logo"
            class="shrink mr-2 ml-2"
            contain
            src="@/assets/raviole.png"
            transition="scale-transition"
            width="50"
          />

          <div class="wt-tx text-h4">RaviOlé</div>
        <!-- <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
        </div>
      </router-link>

      <v-spacer></v-spacer>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/layout/Header";
export default {
  name: "App",
  components: {
    Header,
  },
  data: () => ({
    //
  }),
};
</script>

<style scoped>
#nav * {
  color: #B29A30 !important;
  text-decoration-color: #B29A30 !important;
  text-shadow: none;
  box-shadow: none;
}

.wt-tx {
  color: #B29A30;
  border-bottom: none !important;
  text-decoration: none !important;
  background-image: none !important;
}
.text-h4:visited {
  color: #B29A30;
  
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
