<template>
  <div id="app">
    <SearchBar 
      :availableTags = "this.availableTags"
      v-on:freeFilter = "updateFreeFilter" 
      @tagFilterSelected = "addToSelectedTags" 
    />
    <Todos 
      :filterString="filterString"
      :filterTags="selectedTags"
      v-bind:todos="todos"
      v-on:del-todo="deleteTodo"
      v-on:updateAvailableTags = "updateAvailableTags" 
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
    SearchBar,
  },
  data: () => ({
    todos: [],
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
    updateAvailableTags(availableTags) {
      this.availableTags = availableTags;
    },
    deleteTodo(id) {
      axios
        .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
        .then(
          // eslint-disable-next-line no-unused-vars
          (res) => (this.todos = this.todos.filter((todo) => todo.id !== id))
        )
        .catch((err) => console.log(err));
    },
    addTodo(newTodo) {
      const { title, completed } = newTodo;

      axios
        .post("https://jsonplaceholder.typicode.com/todos", {
          title,
          completed,
        })
        .then((res) => {
          this.todos = [...this.todos, res.data];
          console.log(res.data.id);
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    axios
      .get("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((res) => (this.todos = res.data))
      .catch((err) => console.log(err));
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}

.btn {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}

.btn:hover {
  background: #666;
}
</style>
