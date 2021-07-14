<template>
  <div id="home">
    <SearchBar 
      :availableTags = "availableTags"
      :selectedTags = "selectedTags"
      :editCollections = "false"
      @freeFilter = "updateFreeFilter" 
      @addToSelectedTags = "addToSelectedTags" 
      @deleteSelectedTagAtIndex = "deleteSelectedTagAtIndex"
    />
    <DiscoverPane 
      :filterString="filterString"
      :filterTags="selectedTags"
      :editCollections = "false"
      @updateAvailableTags = "updateAvailableTags" 
      ref="recipePane"
    />
  </div>
</template>

<script>
// Modules
const services = require("@/helpers/services");
import axios from "axios";

import DiscoverPane from "../components/DiscoverPage/DiscoverPane";
import SearchBar from "../components/DiscoverPage/SearchBar";

export default {
  name: "DiscoverPage",
  components: {
    DiscoverPane,
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
