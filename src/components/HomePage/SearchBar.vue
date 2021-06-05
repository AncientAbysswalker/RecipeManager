<template>
  <div>
      <input type="text" name="title" placeholder="Search for a Recipe by Name" @input="$emit('input', $event.target.value)"> <!-- Perhaps in future by tags as well? -->
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
  methods: {
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
</style>


