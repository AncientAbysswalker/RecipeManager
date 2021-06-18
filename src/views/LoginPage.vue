<template>
  <div id="login">
    <form method="post" @submit.prevent="handleSubmit">
      <input type="text" placeholder="Enter Username" name="username" v-model="user.username" required>
      <input type="password" placeholder="Enter Password" name="password" v-model="user.password" required>
      <button type="submit">Login</button>
    </form>   
  </div>
</template>

<script>
import RecipesPane from "../components/HomePage/RecipesPane";
import SearchBar from "../components/HomePage/SearchBar";
import axios from "axios";

export default {
  name: "HomePage",
  components: {
    RecipesPane,
    SearchBar
  },
  data: () => ({
    user: {
      username: '',
      password: ''
    }
  }),
  methods: {
    handleSubmit() {
      console.log(9)
      axios
        .post(`http://www.raviole.cerberus-heuristics.com/uac/login`, this.user, {withCredentials: true, credentials: 'include'})
        .then(res => {
          console.log(res)
          this.$root.sessionInfo = res.data;
          this.$router.push('/');
        })
        .catch(err => console.log(err));
    },
  }
};
</script>

<style>
/* 
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}*/
</style>
