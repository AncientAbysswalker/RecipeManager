<template>
  <div>
    <div class="searchbar">
        <input 
          type="text" 
          class="searchbar--freetext hollow-rounded" 
          :placeholder="freeTextPlaceholder" 
          @focus="freeTextPlaceholder = ''"
          @blur="freeTextPlaceholder = 'Search for a Recipe by Name'"
          @input="$emit('freeFilter', $event.target.value)"
        />
        <select ref="select" class="searchbar--tags hollow-rounded element__text ingredient__list--unit" @change="addToSelectedTags">
          <option class="red" value="" disabled selected hidden>Filter By Tag</option>
          <option v-for="tag in availableTags" :value="tag" :key="tag">
              {{ tag }}
          </option>
        </select>
        <router-link to="/recipe/new" class="searchbar--add button">Add New Recipe</router-link>
    </div>
    <div class="tags__container">
      <div tabindex="0" class="tag" v-for="(tag, index) in selectedTags" :key="index + tag" @click="showTagClose" @blur="hideTagClose">{{tag}}<DeleteTagButton class="hide tag--deletor" @delete-component="() => $emit('deleteSelectedTagAtIndex', index)"></DeleteTagButton></div>
    </div>  
  </div>
</template>

<script>
// Components
import DeleteTagButton from '../RecipePage/common-elements/DeleteTagButton';

// import uuid from 'uuid';
export default {
  name: "SearchBar",
  components: {
    DeleteTagButton
  },
  data() {
    return {
      title: '',
      freeTextPlaceholder: 'Search for a Recipe by Name'
    }
  },
  props: {
    availableTags: {
      type: Array,
      default: []
    },
    selectedTags: {
      type: Array,
      default: []
    }
  },
  methods: {
    addToSelectedTags(evt) {
      let selectedTag = evt.target.value;
      evt.target.value='';

      this.$emit('addToSelectedTags', selectedTag);
    },
    showTagClose(evt) {
      let closeButtonElement = evt.target.firstElementChild;
      if (closeButtonElement) {
          closeButtonElement.classList.remove("hide")
      }
    },
    hideTagClose(evt) {
      let closeButtonElement = evt.target.firstElementChild;
      if (closeButtonElement) {
          closeButtonElement.classList.add("hide")
      }
    },
  }
}
</script>

<style scoped>
  .searchbar {
    padding: 5px;
    border-bottom: solid 1px red;
  }
  .button {
    background-color: #FFF1B3;
    color: #B29A30;
    border: none;
    border-radius: 100px;

    padding: 5px 15px 5px 15px;
    margin: 5px;

    text-align: center;
    text-decoration: none;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .hollow-rounded {
    color: #B29A30 !important;
    border: #B29A30 2px solid;
    border-radius: 100px;

    padding: 5px 15px 5px 15px !important;
    margin: 5px;
    
    text-decoration: none;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .hollow-rounded::placeholder {
    color: #B29A30;
  }
  .hollow-rounded:focus {
    outline: none;
    color: #B29A30;
    background-color: #FFFCED;
  }
  .searchbar--freetext {
    width: 500px;
  }
  .searchbar--tags {
    width: 250px;
  }
  .searchbar--add {
    float: right;
  }


  .tags__container {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 0 0 5px;
  }
  .tags__container:empty {
    display: none;
  }
  .element__editable--dark { /* Styling for text areas */
      @extend .element__editable;    
      caret-color: black;
  }
  .element__editable--dark:focus { /* When actively editing */
      background-color: transparent;
  }
  .element__editable--dark::placeholder { /* Styling for text areas */
      color: grey;
  }
  .tag {
      font-weight: bold;
      position: relative;
      background-color: #aaaaaa;
      padding: 2px 5px;
      margin: 0 5px 5px 0;
      border-radius: 5px;
      outline: none;
  }
  .hide {
      display: none;
  }
  .tag--deletor {
      position: absolute;
      right: -0.4em;
      top: -0.4em;
      z-index: 1;
  }
</style>


