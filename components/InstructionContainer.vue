<template>
  <div>
    <p v-if="!this.notitle">{{this.title}}</p> 
    <template v-for="(element, index) in this.contents">
      <InstructionContainer v-if="element.type === 0" :key="index" :title="element.title" :contents="element.contents"></InstructionContainer>
      <p v-else-if="element.type === 1" :key="index">{{element.text}}</p>
      <p v-else-if="element.type === 2" :key="index">I am a Ordered List</p>
      <p v-else-if="element.type === 3" :key="index">I am an Unordered List</p>
      <p v-else :key="index">Something has gone horribly wrong!</p>
    </template>
  </div>
</template>

<script>
export default {
  name: "InstructionContainer",
  props: {"title":String, "contents":Array, "notitle": Boolean}
};
</script>

<style scoped>
.subsection__header {
  margin: 0;
  padding-left: 0.25em; /* Fix */
  line-height: 1.5em;
  font-size: 2em;

  position: relative;
  top: 0.4em;
}
.subsection__numbered__item {
  margin: 0;
  line-height: 1.5em;

  /* Positioning */
  padding-left: 0.5em;
  position: relative;
  top: 0.4em;
}
.subsection__numbered__item:last-child {
  padding-bottom: 1.5em;
}
.subsection__numbered__item span {
  position: absolute;
  left: -1em;
}
li {
  position: relative;
  left: 0em;
}
li::before {
  content: "•";
  color: blue;
  position: relative;
  right: 5em;
}
/* ol li:before {
  content: "•";
  margin-right: 7px;
} */
</style>