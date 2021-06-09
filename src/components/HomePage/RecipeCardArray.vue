<template>
  <div>
    <div class="cards cards--column">
      <div v-for="(item, index) in jobs" :key="index">
        <RecipeCard
          v-if="agnosticStringIncludes(item.name, filterString) && agnosticTagsIncludedInStringArray(item.tags, filterTags)"
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

.container__accordion {
  padding: 5px;
}
</style>
