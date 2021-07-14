<template>
  <div>
    <div>
      <!-- Main Array -->
      <RecipeCardArray
        :recipeHeaders="recipeHeaders"
        :filterString="filterString"
        :filterTags="filterTags"
        :activeIds="[]"
        :disableRoute="false"
        :showSelectBoxes="false"
      />
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
  name: "DiscoverPane",
  components: {
    RecipeCard,
    RecipeCardArray
  },
  props: {
    filterString: {
      type: String,
      default: ''
    },
    filterTags: {
      type: Array,
      default: []
    },
    editCollections: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    services: services,
    recipeHeaders: [],
    recipeCollections: {},
    modifyCollections: {
      base: "",
      update: {}
    },
    enableCollectionDeletion: false,
    showModal: false,
    modalTitle: "I am a modal",
    dialogInput: "",
    dialogInputEditReference: "",
  }),
  methods: {
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
    }
  },
  mounted() {
    // Import api data to populate recipe cards
    axios
      .get(
        `${this.services.url_api}?fields=name&fields=time_active&fields=images&fields=tags`
      )
      .then((res) => {
        this.recipeHeaders = res.data;
        this.$emit('updateAvailableTags', flattenTagsFromAllRecipes(this.recipeHeaders));
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
