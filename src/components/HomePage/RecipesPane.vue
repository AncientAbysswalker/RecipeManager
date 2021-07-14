<template>
  <div>
    <div>
      <!-- Modal Dialog -->
      <ModalDialog
        v-if="showModal"
        :titleText="modalTitle"
      >
        <input slot="body" placeholder="Enter a collection name" maxlength="64" v-model="dialogInput" />

        <!-- Footer Buttons -->
        <button slot="footer" @click="verifyAndSaveCollection">Save</button>
        <button slot="footer" @click="showModal=false">Close</button>
        <button v-if="enableCollectionDeletion" slot="footer" @click="deleteCollection">Delete</button>
      </ModalDialog>

      <!-- Accordions -->
      <AccordionBox 
        class="container__accordion" 
        label="All Saved Recipes"
        :manageActive="true"
      >
        <!-- Main Array -->
        <p v-if="recipeHeaders.length === 0 || false">No saved recipes! :(</p>
        <RecipeCardArray
          :recipeHeaders="recipeHeaders"
          :filterString="filterString"
          :filterTags="filterTags"
          :activeIds="modifyCollections.update['null'] || []"
          @activate-card="(id) => processCardActivation('null', id)"
          :disableRoute="editCollections"
          :showSelectBoxes="modifyCollections.base !== ''"
        />

        <!-- Icons -->
        <v-icon slot="icons" class="accordion__icon" v-if="editCollections" @click.stop.prevent="openAddCollectionDialog">mdi-shape-square-plus</v-icon>
      </AccordionBox>
      <AccordionBox 
        v-for="(collectionTitle, index) in Object.keys(recipeCollections)" 
        :key="index"
        class="container__accordion" 
        :label="collectionTitle" 
        startExpanded
      > 
        <!-- Main Array -->
        <RecipeCardArray
          :recipeHeaders="categoricalRecipes(recipeCollections[collectionTitle])"
          :filterString="filterString"
          :filterTags="filterTags"
          :activeIds="modifyCollections.update[collectionTitle] || []"
          @activate-card="(id) => processCardActivation(collectionTitle, id)"
          :disableRoute="editCollections"
          :showSelectBoxes="modifyCollections.base !== ''"
          :selectBoxChar="(modifyCollections.base === collectionTitle) ? '✘' : '✔'"
        />

        <!-- Icons -->
        <v-icon slot="icons" class="accordion__icon" v-if="editCollections && modifyCollections.base === ''" @click.stop.prevent="() => editCollection(collectionTitle)">mdi-pencil</v-icon>
        <v-icon slot="icons" class="accordion__icon" v-if="editCollections && modifyCollections.base === collectionTitle" @click.stop.prevent="saveCollectionChanges">mdi-content-save</v-icon>
        <v-icon slot="icons" class="accordion__icon" v-if="editCollections && modifyCollections.base === collectionTitle" @click.stop.prevent="dropCollectionChanges">mdi-close</v-icon>
        <v-icon slot="icons" class="accordion__icon" v-if="editCollections && modifyCollections.base === ''" @click.stop.prevent="() => openSettingsCollectionDialog(collectionTitle)">mdi-wrench</v-icon>
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
    processCardActivation(collectionName, recipeId) {
      // Only process if we are actually editing a collection
      if (this.modifyCollections.base !== '') {
        if (!this.modifyCollections.update.hasOwnProperty(collectionName)) {
          this.$set(this.modifyCollections.update, collectionName, [recipeId]);
        } else {
          const recipeIdIndex = this.modifyCollections.update[collectionName].indexOf(recipeId);
          if (recipeIdIndex > -1) {
            this.modifyCollections.update[collectionName].splice(recipeIdIndex, 1);
          } else {
            this.modifyCollections.update[collectionName].push(recipeId);
          }
        }
      }
    },
    editCollection(collectionName) {
      this.modifyCollections.base = collectionName;
    },
    saveCollectionChanges() {
      // Identify collections to add from and to remove from
      const editCollection = this.modifyCollections.base;
      const arrayOfCollectionsToAddFrom = Object.keys(this.modifyCollections.update);

      // Add recipeIds from other collections
      for (const collectionToAddFrom of arrayOfCollectionsToAddFrom) {
        if (collectionToAddFrom !== editCollection) {
          for (const recipeId of this.modifyCollections.update[collectionToAddFrom]) {
            if (!this.recipeCollections[editCollection].includes(recipeId)) {
              this.recipeCollections[editCollection].push(recipeId);
            }
          }

          // Reset checkboxes to empty
          this.modifyCollections.update[collectionToAddFrom] = [];
        }
      }

      // Remove and collections selected within edited collection (if it exists - otherwise we can only be adding!)
      if (this.modifyCollections.update.hasOwnProperty(editCollection)) {
        for (const recipeId of this.modifyCollections.update[editCollection]) {
          const recipeIndex = this.recipeCollections[editCollection].indexOf(recipeId);
          if (recipeIndex > -1) {
            this.recipeCollections[editCollection].splice(recipeIndex, 1);
          }
        }
      }

      // Reset base to original state
      this.modifyCollections.update[editCollection] = [];
      this.modifyCollections.base = "";
    },
    dropCollectionChanges() {
      // Reset checkboxes to empty
      const arrayOfCollectionsToAddFrom = Object.keys(this.modifyCollections.update);
      for (const collectionToAddFrom of arrayOfCollectionsToAddFrom) {
        this.modifyCollections.update[collectionToAddFrom] = [];
      }
      // Reset base to original state
      this.modifyCollections.base = "";
    },
    openAddCollectionDialog() {
      this.showModal = true;
      this.modalTitle = "Add New Collection";
      this.enableCollectionDeletion = false;
    },
    openSettingsCollectionDialog(collectionTitle) {
      this.showModal = true;
      this.modalTitle = "Rename or Delete Collection";
      this.dialogInput = collectionTitle;
      this.dialogInputEditReference = collectionTitle;
      this.enableCollectionDeletion = true;
    },
    verifyAndSaveCollection() {
      // First must be a valid key!
      if (this.dialogInput.trim() !== "" && this.dialogInput.toLowerCase() !== "null") {
        // Am I intesecting with another key?
        if (!this.agnosticStringIncludedInStringArray(Object.keys(this.recipeCollections), this.dialogInput) || this.dialogInput.toLowerCase() === this.dialogInputEditReference.toLowerCase()) {
          // If I am editing an existing key
          if (this.dialogInputEditReference !== "") {
            // Don't bother overwriting if EXACTLY the same
            if (this.dialogInput !== this.dialogInputEditReference) {
              // Copy to new key
              Object.defineProperty(
                this.recipeCollections,
                this.dialogInput,
                Object.getOwnPropertyDescriptor(this.recipeCollections, this.dialogInputEditReference)
              );
              
              // Remove old key
              delete this.recipeCollections[this.dialogInputEditReference];
            }
            
            this.showModal = false;

            this.dialogInput = "";
            this.dialogInputEditReference = "";
          } else {
            this.$set(this.recipeCollections, this.dialogInput, []);
            this.showModal = false;
            this.dialogInput = "";
          }
        }
      }
    },
    deleteCollection() {
      if (this.dialogInputEditReference.trim() !== "" && this.dialogInputEditReference.toLowerCase() !== "null") {
        delete this.recipeCollections[this.dialogInputEditReference];

        this.showModal = false;
        this.dialogInput = "";
        this.dialogInputEditReference = "";
      }
    },
    addCollection() {
      console.log(this.recipeCollections)
      if (!this.recipeCollections.hasOwnProperty("New Category!")) {
        this.$set(this.recipeCollections, "New Category!", ["60bc2199d45b8e03541ff799", "60c02d57d45b8e03541ff79b"]);
        this.showModal = true;
      } else {
        this.recipeCollections["New Category!"].push("60c2cc8ad45b8e03541ff79c");
      }
    },
    categoricalRecipes(categoricalRecipeIds) {
      return this.recipeHeaders.filter((item) => (categoricalRecipeIds.includes(item._id)));
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
    submitCollections() {
      // Submit changes to server and return a promise
      return axios
        .put(
          `${this.services.url_userdata}/collections`, 
          this.recipeCollections,
          {withCredentials: true}
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    // Import api data to populate recipe cards
    axios
      .get(`${this.services.url_api_user_saved}?fields=headers`, {withCredentials: true})
      .then((res) => {
        this.recipeHeaders = res.data;
        console.log(this.recipeHeaders)
        this.$emit('updateAvailableTags', flattenTagsFromAllRecipes(this.recipeHeaders));

        axios
          .get(
            `${this.services.url_userdata}/collections`, 
            {withCredentials: true}
          )
          .then((res) => {
            this.recipeCollections = res.data.userCollections;
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
