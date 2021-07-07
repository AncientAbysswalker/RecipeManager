<template>
  <div>
    <div class="cards cards--column">
      <div v-for="(item, index) in filteredItems" :key="index" class="anchor">
        <RecipeCard
          class="card"
          :item="item"
          :disableRoute="disableRoute"
          @activate-card="passCardActivation"
        />
        <span class="cards--select-box">{{ activeIds.includes(item._id) ? '✓' : '' }}</span>
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
    },
    activeIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    activeCategory: {
      type: Boolean,
      default: false
    },
    disableRoute: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({ 
    activatedCards: []
  }),
  computed: {
    filteredItems() {
      return this.jobs.filter((item) => (agnosticStringIncludes(item.name, this.filterString) && agnosticTagsIncludedInStringArray(item.tags, this.filterTags)));
    }
  },
  methods: {
    passCardActivation(recipeId) {
      console.log(9)
      this.$emit('activate-card', recipeId)
    },
    processCardActivation(recipeId) {
      this.activatedCards.push(recipeId);
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

.anchor {
  position: relative;
}
.cards--select-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  font-size: 200%; 
  line-height: 100%;
  font-weight: bold;
  background-color: white;
  position: absolute; 
  bottom:0px; 
  right:0px;
  border: 2px #e0e0e0 solid;
}
.cards--select-box:before {
	content: "";
	float: left;
	padding-top: 100%; 	/* initial ratio of 1:1*/
}

</style>
