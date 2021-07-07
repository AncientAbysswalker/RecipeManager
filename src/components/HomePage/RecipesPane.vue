<template>
  <div>
    <div>
      <!-- Modal Dialog -->
      <ModalDialog
        v-if="showModal"
        :titleText="modalTitle"
      >
        <input slot="body" placeholder="Enter a collection name" v-model="dialogInput" />  <!--:disabled="!is_edit_mode" v-model="fields.name" :placeholder="is_edit_mode ? 'Recipe Title' : ''" />-->

        <!-- Footer Buttons -->
        <button slot="footer" @click="verifyAndSaveCollection">Save</button>
        <button slot="footer" @click="showModal=false">Close</button>
        <button v-if="enableCollectionDeletion" slot="footer" @click="deleteCollection">Delete</button>
      </ModalDialog>

      <!-- Accordions -->
      <AccordionBox 
        class="container__accordion" 
        label="All Recipes"
        :manageActive="true"
        :manageActions="[
          {icon: 'mdi-shape-square-plus', emitter: 'add-collection'}
        ]"
        @add-collection="openAddCollectionDialog"
      >
        <RecipeCardArray
          :jobs="jobs"
          :filterString="filterString"
          :filterTags="filterTags"
          :activeIds="modifyCategories.update['null'] || []"
          @activate-card="(id) => processCardActivation('null', id)"
          :disableRoute="true"
        />
      </AccordionBox>
      <AccordionBox 
        v-for="(categoryTitle, index) in Object.keys(recipeCategories)" 
        :key="index"
        class="container__accordion" 
        :label="categoryTitle" 
        :manageActions="[
          {icon: 'mdi-pencil', emitter: 'edit-collection'},
          {icon: 'mdi-content-save', emitter: 'save-collection'},
          {icon: 'mdi-wrench', emitter: 'settings-collection'}
        ]"
        @settings-collection="() => openSettingsCollectionDialog(categoryTitle)"
        @edit-collection="() => editCollection(categoryTitle)"
        @save-collection="saveCollectionChanges"
        startExpanded
      >
        <RecipeCardArray
          :jobs="categoricalRecipes(recipeCategories[categoryTitle])"
          :filterString="filterString"
          :filterTags="filterTags"
          :activeIds="modifyCategories.update[categoryTitle] || []"
          @activate-card="(id) => processCardActivation(categoryTitle, id)"
          :disableRoute="true"
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
import ModalDialog from "../CommonComponents/ModalDialog.vue";

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
    AccordionBox,
    ModalDialog
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
    recipeCategories: {},
    modifyCategories: {
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
    processCardActivation(collectionName, recipeId) {
      if (!this.modifyCategories.update.hasOwnProperty(collectionName)) {
        this.$set(this.modifyCategories.update, collectionName, [recipeId]);
      } else {
        const recipeIdIndex = this.modifyCategories.update[collectionName].indexOf(recipeId);
        if (recipeIdIndex > -1) {
          this.modifyCategories.update[collectionName].splice(recipeIdIndex, 1);
        } else {
          this.modifyCategories.update[collectionName].push(recipeId);
        }
      }
    },
    editCollection(collectionName) {
      this.modifyCategories.base = collectionName;
    },
    saveCollectionChanges() {
      // Identify collections to add from and to remove from
      const editCollection = this.modifyCategories.base;
      const arrayOfCollectionsToAddFrom = Object.keys(this.modifyCategories.update);

      // Add recipeIds from other collections
      for (const collectionToAddFrom of arrayOfCollectionsToAddFrom) {
        if (collectionToAddFrom !== editCollection) {
          for (const recipeId of this.modifyCategories.update[collectionToAddFrom]) {
            if (!this.recipeCategories[editCollection].includes(recipeId)) {
              this.recipeCategories[editCollection].push(recipeId);
            }
          }

          // Reset checkboxes to empty
          this.modifyCategories.update[collectionToAddFrom] = [];
        }
      }

      // Remove and collections selected within edited collection
      for (const recipeId of this.modifyCategories.update[editCollection]) {
        const recipeIndex = this.recipeCategories[editCollection].indexOf(recipeId);
        if (recipeIndex > -1) {
          this.recipeCategories[editCollection].splice(recipeIndex, 1);
        }
      }

      // Reset base to original state
      this.modifyCategories.update[editCollection] = [];
      this.modifyCategories.base = "";
    },
    openAddCollectionDialog() {
      this.showModal = true;
      this.modalTitle = "Add New Collection";
      this.enableCollectionDeletion = false;
    },
    openSettingsCollectionDialog(categoryTitle) {
      this.showModal = true;
      this.modalTitle = "Rename or Delete Collection";
      this.dialogInput = categoryTitle;
      this.dialogInputEditReference = categoryTitle;
      this.enableCollectionDeletion = true;
    },
    verifyAndSaveCollection() {
      // First must be a valid key!
      if (this.dialogInput.trim() !== "" && this.dialogInput.toLowerCase() !== "null") {
        // Am I intesecting with another key?
        if (!this.agnosticStringIncludedInStringArray(Object.keys(this.recipeCategories), this.dialogInput) || this.dialogInput.toLowerCase() === this.dialogInputEditReference.toLowerCase()) {
          // If I am editing an existing key
          if (this.dialogInputEditReference !== "") {
            // Don't bother overwriting if EXACTLY the same
            if (this.dialogInput !== this.dialogInputEditReference) {
              // Copy to new key
              Object.defineProperty(
                this.recipeCategories,
                this.dialogInput,
                Object.getOwnPropertyDescriptor(this.recipeCategories, this.dialogInputEditReference)
              );
              
              // Remove old key
              delete this.recipeCategories[this.dialogInputEditReference];
            }
            
            this.showModal = false;

            this.dialogInput = "";
            this.dialogInputEditReference = "";
          } else {
            this.$set(this.recipeCategories, this.dialogInput, []);
            this.showModal = false;
            this.dialogInput = "";
          }
        }
      }
    },
    deleteCollection() {
      if (this.dialogInputEditReference.trim() !== "" && this.dialogInputEditReference.toLowerCase() !== "null") {
        delete this.recipeCategories[this.dialogInputEditReference];

        this.showModal = false;
        this.dialogInput = "";
        this.dialogInputEditReference = "";
      }
    },
    addCollection() {
      console.log(this.recipeCategories)
      if (!this.recipeCategories.hasOwnProperty("New Category!")) {
        this.$set(this.recipeCategories, "New Category!", ["60bc2199d45b8e03541ff799", "60c02d57d45b8e03541ff79b"]);
        this.showModal = true;
      } else {
        this.recipeCategories["New Category!"].push("60c2cc8ad45b8e03541ff79c");
      }
    },
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

        // axios
        //   .get(
        //     `${this.services.url_userdata}/collections`, 
        //     {withCredentials: true}
        //   )
        //   .then((res) => {
        //     this.recipeCategories = res.data.userCollections;
        //   })
        //   .catch((err) => console.log(err));
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
