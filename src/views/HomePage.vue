<template>
  <div id="home">
    <SearchBar 
      :availableTags = "availableTags"
      :selectedTags = "selectedTags"
      :editCollections = "editCollections"
      @freeFilter = "updateFreeFilter" 
      @addToSelectedTags = "addToSelectedTags" 
      @deleteSelectedTagAtIndex = "deleteSelectedTagAtIndex"
      @manageCollections = "manageCollections"
      @saveCollections = "saveCollections"
    />
    <RecipesPane 
      :filterString="filterString"
      :filterTags="selectedTags"
      :editCollections = "editCollections"
      @updateAvailableTags = "updateAvailableTags" 
      ref="recipePane"
    />
  </div>
</template>

<script>
// Modules
const services = require("@/helpers/services");
import axios from "axios";

import RecipesPane from "../components/HomePage/RecipesPane";
import SearchBar from "../components/HomePage/SearchBar";

export default {
  name: "HomePage",
  components: {
    RecipesPane,
    SearchBar
  },
  data: () => ({
    services: services,
    filterString: '',
    availableTags: [],
    selectedTags: [],
    editCollections: false
  }),
  methods: {
    updateFreeFilter(updatedFilterString) {
      this.filterString = updatedFilterString;
    },
    addToSelectedTags(selectedTag) {
      if (!this.selectedTags.map((tag) => { return tag.toLowerCase() }).includes(selectedTag.toLowerCase())) {
        this.selectedTags.push(selectedTag);
      }
    },
    deleteSelectedTagAtIndex(index) {
      this.selectedTags.splice(index, 1);
    },
    updateAvailableTags(availableTags) {
      this.availableTags = availableTags;
    },
    manageCollections() {
      this.editCollections = true
    },
    saveCollections() {
      // Submit changes to server
      this.$refs.recipePane.submitCollections()
        .then(()=> {
          this.editCollections = false;
        });
    },
  }
};
</script>

<style>
/* 
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}*/
</style>
