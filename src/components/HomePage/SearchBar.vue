<template>
  <div>
    <div class="searchbar">
        <input 
          type="text" 
          class="searchbar__filter--freetext searchbar__element--hollow" 
          :placeholder="freeTextPlaceholder" 
          @focus="freeTextPlaceholder = ''"
          @blur="freeTextPlaceholder = 'Search for a Recipe by Name'"
          @input="$emit('freeFilter', $event.target.value)"
        />
        <select ref="select" class="searchbar__filter--tags searchbar__element--hollow" @change="addToSelectedTags">
          <option class="red" value="" disabled selected hidden>Filter By Tag</option>
          <option v-for="tag in availableTags" :value="tag" :key="tag">
              {{ tag }}
          </option>
        </select>
        <router-link to="/recipe/new" class="searchbar__button--add searchbar__element">Add New Recipe</router-link>
    </div>
    <div class="searchbar__tags__container">
      <div tabindex="0" class="searchbar__tag" v-for="(tag, index) in selectedTags" :key="index + tag" @click="showTagClose" @blur="hideTagClose">{{tag}}<DeleteTagButton class="hide searchbar__tag--deletor" @delete-component="() => $emit('deleteSelectedTagAtIndex', index)"></DeleteTagButton></div>
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
  .searchbar__element {
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
  .searchbar__element--hollow {
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
  .searchbar__element--hollow::placeholder {
    color: #B29A30;
  }
  .searchbar__element--hollow:focus {
    outline: none;
    color: #B29A30;
    background-color: #FFFCED;
  }
  .searchbar__filter--freetext {
    width: 500px;
  }
  .searchbar__filter--tags {
    width: 250px;
  }
  .searchbar__button--add {
    float: right;
  }

  .searchbar__tags__container {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 0 0 5px;
  }
  .searchbar__tags__container:empty {
    display: none;
  }
  .searchbar__tag {
    font-weight: bold;
    position: relative;
    background-color: #aaaaaa;
    padding: 2px 12px;
    margin: 0 5px 5px 0;
    border-radius: 100px;
    outline: none;
    cursor: pointer;
  }
  .searchbar__tag--deletor {
    position: absolute;
    right: -0.4em;
    top: -0.4em;
    z-index: 1;
  }
  .hide {
    display: none;
  }
</style>


