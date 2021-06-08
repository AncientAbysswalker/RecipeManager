<template>
  <div id="home">
    <SearchBar 
      :availableTags = "availableTags"
      :selectedTags = "selectedTags"
      @freeFilter = "updateFreeFilter" 
      @addToSelectedTags = "addToSelectedTags" 
      @deleteSelectedTagAtIndex = "deleteSelectedTagAtIndex"
    />
    <Todos 
      :filterString="filterString"
      :filterTags="selectedTags"
      @updateAvailableTags = "updateAvailableTags" 
    />
  </div>
</template>

<script>
import Todos from "../components/HomePage/Todos";
import SearchBar from "../components/HomePage/SearchBar";
import axios from "axios";

export default {
  name: "HomePage",
  components: {
    Todos,
    SearchBar
  },
  data: () => ({
    filterString: '',
    availableTags: [],
    selectedTags: []
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
  }
};
</script>

<style>
/* 
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}*/
</style>
