<template>
  <div class="cards cards--column">
    <div v-for="(item, index) in jobs" :key="index">
      <RecipeCard
        v-if="agnosticStringIncludes(item.name, filterString) && agnosticTagsIncludedInStringArray(item.tags, filterTags)"
        class="card"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import RecipeCard from "./RecipeCard.vue";
const services = require("@/helpers/services");
import axios from "axios";

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

export default {
  name: "Todos",
  components: {
    RecipeCard,
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
        this.jobs = res.data;
        this.$emit('updateAvailableTags', flattenTagsFromAllRecipes(this.jobs));
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
