<template>
  <div>
    <div>
      <AccordionBox class="container__accordion" label="All Recipes">
        <RecipeCardArray
          :jobs="jobs"
          :filterString="filterString"
          :filterTags="filterTags"
        />
      </AccordionBox>
      <AccordionBox v-for="(categoryTitle, index) in Object.keys(recipeCategories)" class="container__accordion" :label="categoryTitle" startExpanded>
        <RecipeCardArray
          :jobs="categoricalRecipes(recipeCategories[categoryTitle])"
          :filterString="filterString"
          :filterTags="filterTags"
        />
      </AccordionBox>
    </div>
  </div>
</template>

<script>
// Modules
const services = require("@/helpers/services");
import axios from "axios";

// Components
import RecipeCard from "./RecipeCard.vue";
import RecipeCardArray from "./RecipeCardArray.vue";
import AccordionBox from "./AccordionBox.vue";

// Global Functions
function flattenTagsFromAllRecipes(listOfRecipes) {
  let listOfTags = listOfRecipes.map(recipe => recipe.tags);
  let flattenedList = [];
  for (const tags of listOfTags) {
    for (const tag of tags) {
      if (!flattenedList.map((tag) => { return tag.toLowerCase() }).includes(tag.toLowerCase())) {
        flattenedList.push(tag);
      }
    }
  }

  return flattenedList;
}

// Export
export default {
  name: "RecipesPane",
  components: {
    RecipeCard,
    RecipeCardArray,
    AccordionBox
  },
  props: {
    filterString: {
      type: String,
      default: ''
    },
    filterTags: {
      type: Array,
      default: []
    }
  },
  data: () => ({
    services: services,
    jobs: [],
    recipeCategories: []
  }),
  methods: {
    categoricalRecipes(categoricalRecipeIds) {
      return this.jobs.filter((item) => (categoricalRecipeIds.includes(item._id)));
    },
    agnosticStringIncludes(base, check) {
      return base.toLowerCase().includes(check.toLowerCase());      
    },
    agnosticStringIncludedInStringArray(strArr, check) {
      for (const str of strArr) {
        if (this.agnosticStringIncludes(str, check)) {
          return true;
        }
      }
      return false;
    },
    agnosticTagsIncludedInStringArray(itemTagArr, checkTagArr) {
      if (checkTagArr.length===0) {
        return true
      }

      for (const itemTag of itemTagArr) {
        for (const checkTag of checkTagArr) {
          if (checkTag.toLowerCase() === itemTag.toLowerCase()) {
            return true;
          }
        }
      }
      return false;
    },
    tansitionThing(evt) {
      let panel = this.$refs.pork;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    }
  },
  mounted() {
    // Import api data to populate recipe cards
    axios
      .get(
        `${this.services.url_api}?fields=name&fields=time_active&fields=images&fields=tags`
      )
      .then((res) => {
        this.jobs = res.data;
        this.$emit('updateAvailableTags', flattenTagsFromAllRecipes(this.jobs));

        axios
          .get(
            `http://www.raviole.cerberus-heuristics.com/userdata/categories/test`
          )
          .then((res) => {
            this.recipeCategories = res.data.homePageCategories;
          })
          .catch((err) => console.log(err));
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

.container__accordion {
  padding: 5px;
}
</style>
