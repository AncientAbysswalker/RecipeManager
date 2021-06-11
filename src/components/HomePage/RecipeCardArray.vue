<template>
  <div>
    <div class="cards cards--column">
      <div v-for="(item, index) in filteredItems" :key="index">
        <RecipeCard
          class="card"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script>

// Components
import RecipeCard from "./RecipeCard.vue";

// Global Functions
function agnosticStringIncludes(base, check) {
  return base.toLowerCase().includes(check.toLowerCase());      
}
function agnosticStringIncludedInStringArray(strArr, check) {
  for (const str of strArr) {
    if (this.agnosticStringIncludes(str, check)) {
      return true;
    }
  }
  return false;
}
function agnosticTagsIncludedInStringArray(itemTagArr, checkTagArr) {
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

// Export
export default {
  name: "RecipeCardArray",
  components: {
    RecipeCard
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
    jobs: {
      type: Array,
      default: []
    }
  },
  computed: {
    filteredItems() {
      return this.jobs.filter((item) => (agnosticStringIncludes(item.name, this.filterString) && agnosticTagsIncludedInStringArray(item.tags, this.filterTags)));
    }
  }
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
