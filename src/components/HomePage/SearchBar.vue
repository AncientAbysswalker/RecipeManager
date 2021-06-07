<template>
  <div class="searchbar">
      <input type="text" name="title" placeholder="Search for a Recipe by Name" @input="$emit('freeFilter', $event.target.value)"> <!-- Perhaps in future by tags as well? -->
      <select ref="select" class="element__text ingredient__list--unit" @change="addTagFilter">
        <option class="red" value="" disabled selected hidden>Filter By Tag</option>
        <option class="red" value="fuckyou">Filter By Tag</option>
        <option v-for="tag in availableTags" :value="tag" :key="tag">
            {{ tag }}
        </option>
      </select>
      <router-link to="/recipe/new" class="button">Add New Recipe</router-link>
  </div>
</template>

<script>
// import uuid from 'uuid';
export default {
  name: "SearchBar",
  data() {
    return {
      title: ''
    }
  },
  props: {
    availableTags: {
      type: Array,
      default: []
    }
  },
  methods: {
    addTagFilter(evt) {
      let selectedTag = evt.target.value;
      evt.target.value='';

      this.$emit('tagFilterSelected', selectedTag);
    },
    addTodo() {
      const newTodo = {
        title: this.title,
        completed: false
      }
      // Send up to parent
      this.$emit('add-todo', newTodo);

      this.title = '';
    }
  }
}
</script>

<style scoped>
  div {
    display: flex;
  }

  input[type="text"] {
    flex: 10;
    padding: 5px;
  }

  input[type="submit"] {
    flex: 2;
  }

  .searchbar {
    padding-top: 5px;
    border-bottom: solid 1px red;
    /*background: #FFF7D3;*/
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
</style>


