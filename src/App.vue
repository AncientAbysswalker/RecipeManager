<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <Header />
      <div class="d-flex align-center">
        <v-img
          alt="Raviole Logo"
          class="shrink mr-2 ml-2"
          contain
          src="@/assets/raviole.png"
          transition="scale-transition"
          width="50"
        />

        <div class="text-h4">RaviOlé</div>
        <!-- <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
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
