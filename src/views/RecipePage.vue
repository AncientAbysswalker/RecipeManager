<template>
  <div class="rerp">
    <h1>{{ this.fields.name }}</h1>
    <carousel class="caru" :per-page="1">
      <slide v-if="this.fields.images.length === 0">
        <img
          :src="
            require(`@/static/card_default.png`) ||
              require(`@/static/card_loading.png`)
          "
          @error="imgPlaceholder"
        />
      </slide>
      <!-- <slide>
        <img
          :src="
            `${this.services.url_cdn}/${this.fields.images[0]}` ||
              require(`@/static/card_loading.png`)
          "
          @error="imgPlaceholder"
        />
      </slide>
      <slide>
        <img
          :src="
            `${this.services.url_cdn}/${this.fields.images[1]}` ||
              require(`@/static/card_loading.png`)
          "
          @error="imgPlaceholder"
        />
      </slide> -->
      <slide v-else v-for="(image, index) in this.fields.images" :key="index">
        <img
          :src="
            `${services.url_cdn}/${image}` ||
              require(`@/static/card_loading.png`)
          "
          @error="imgPlaceholder"
        />
      </slide>
    </carousel>
    <!-- <img
      v-bind:src="
        (this.fields.images !== undefined && this.fields.images.length > 0
          ? `${this.services.url_cdn}/${this.fields.images[0]}`
          : require(`@/static/card_default.png`)) ||
          require(`@/static/card_loading.png`)
      "
      @error="imgPlaceholder"
    /> -->
    <h3>TIME AND YIELDS?</h3>
    <p>{{ this.fields.time_passive }} minutes</p>
    <p>{{ this.fields.time_active }} minutes</p>
    <h3>Ingredients</h3>
    <div>
      <p
        v-for="(ingredient, index) in this.fields.ingredients"
        v-bind:key="index"
      >
        {{ ingredient.quantity }} - {{ ingredient.unit }} -
        {{ ingredient.name }}
      </p>
    </div>
    <h3>Instructions</h3>
    <InstructionSection
      v-for="section in this.fields.instructions"
      :key="section.title"
      :section="section"
    />
    <!-- <div
      v-for="(section, index) in this.fields.instructions"
      :key="`section${index}`"
    >
      <h5>{{ section.title }}</h5>
      <ol>
        <li v-for="(step, index) in section.steps" :key="`step${index}`">
          {{ step }}
        </li>
      </ol>
    </div> -->
    <p>This is the id: {{ $route.params.id }}</p>
  </div>
</template>

<script>
// Modules
import axios from "axios";
const services = require("@/helpers/services");

// Components
import InstructionSection from "../components/InstructionSection";
import { Carousel, Slide } from "vue-carousel";

export default {
  name: "RecipeCard",
  props: ["todo", "item", "record", "reqPic"],
  components: {
    InstructionSection,
    Carousel,
    Slide,
  },
  data: () => ({ fields: [], services: services }),
  methods: {
    markComplete() {
      this.todo.completed = !this.todo.completed;
    },
    imgPlaceholder(e) {
      e.target.src = require(`@/static/card_error.png`);
    },
  },
  mounted() {
    console.log(5);
    axios
      .get(`${this.services.url_api}/${this.$route.params.id}`)
      .then((res) => {
        this.fields = res.data;
        console.log(this.fields);
      })
      .catch((err) => console.log(err));
    console.log(52);
  },
};
</script>

<style scoped>
.caru {
  width: 500px;
}
img {
  width: 500px;
}
/* ol li {
  margin-left: 50px;
  list-style: upper-roman;
  color: red;
} */
</style>
