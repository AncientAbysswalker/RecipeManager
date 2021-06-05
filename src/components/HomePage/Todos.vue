<template>
  <div class="cards cards--column">
    <div v-for="(item, index) in jobs" :key="index">
      <RecipeCard
        v-if="agnosticStringIncludes(item.name, filterString)"
        class="card"
        :item="item"
      />
    </div>
  </div>
  <!-- <div class="cards cards--column">
    <div class="card" v-bind:key="todo.id" v-for="todo in todos">
      <RecipeCard v-bind:todo="todo" v-on:del-todo="$emit('del-todo', todo.id)" />
    </div>
  </div>-->
</template>

<script>
import RecipeCard from "./RecipeCard.vue";
const services = require("@/helpers/services");
import axios from "axios";

export default {
  name: "Todos",
  components: {
    RecipeCard,
  },
  props: {
    filterString: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    services: services,
    jobs: [],
  }),
  methods: {
    agnosticStringIncludes(base, check) {
      return base.toLowerCase().includes(check.toLowerCase());
    }
  },
  mounted() {
    // Import api data to populate recipe cards
    axios
      .get(
        `${this.services.url_api}?fields=name&fields=time_active&fields=images`
      )
      .then((res) => {
        this.jobs = res.data;
        console.log(this.jobs);
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
}
@supports (display: grid) {
  .cards {
    display: grid;
  }
}
.cards > * {
  flex: 1 0 300px;
  margin-left: var(--space-s);
  margin-right: var(--space-s);
}
@supports (display: grid) {
  .cards {
    grid-gap: 1rem;
    margin: 0;
  }
  .cards > * {
    margin: 0;
  }
}
.cards--column > * {
  max-width: 500px;
}
@supports (display: grid) {
  .cards--column {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
</style>
