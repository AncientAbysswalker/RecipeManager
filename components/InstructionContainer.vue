<template>
  <div :class="'instruction__container' + (this.top_level ? ' top__level' : '')">
    <p class="element__title" v-if="!this.top_level">{{this.title}}</p> 
    <template v-for="(element, index) in this.contents">
      <InstructionContainer v-if="element.type === 0" :key="index" :title="element.title" :contents="element.contents"></InstructionContainer>
      <p class="element__notes" v-else-if="element.type === 1" :key="index">{{element.text}}</p>
      <div class="element__ordered__list" v-else-if="element.type === 2" :key="index">
        <p class="element__ordered__list__item" v-for="(step, index) in element.steps" :key="'ol' + index"><span>{{index+1}}</span>{{step}}</p>
      </div>
      <div class="element__unordered__list" v-else-if="element.type === 3" :key="index">
        <p class="element__unordered__list__item" v-for="(step, index) in element.steps" :key="'ul' + index"><span>●</span>{{step}}</p>
      </div>
      <!-- <p v-else-if="element.type === 2" :key="index">I am a Ordered List</p> -->
      <!-- <p v-else-if="element.type === 3" :key="index">I am an Unordered List</p> -->
      <p v-else :key="index">Something has gone horribly wrong!</p>
    </template>
  </div>
</template>

<script>
export default {
  name: "InstructionContainer",
  props: {"title":String, "contents":Array, "top_level": Boolean}
};
</script>

<style scoped>
.instruction__container {
  border: red 1px solid;
  margin: -1px;
}

.subsection__header {
  margin: 0;
  padding-left: 0.25em; /* Fix */
  line-height: 1.5em;
  font-size: 2em;

  position: relative;
  top: 0.4em;
}
/* ol li:before {
  content: "•";
  margin-right: 7px;
} */

/* Padding to add space between elements in the container */
.instruction__container > *:not(:last-child) {
  padding-bottom: 1.5em;
}
.top__level { /* The top-level container needs to add some space at the end to look more natural */
  padding-bottom: 1.5em;
}

/* Styling for  */
.element__unordered__list__item,
.element__ordered__list__item {
  margin: 0;
  line-height: 1.5em;

  /* Positioning */
  padding-left: 0.5em;
  position: relative;
  /* top: 0.4em; */
}
/* .element__ordered__list__item:last-child {
  padding-bottom: 1.5em;
} */
.element__unordered__list__item span,
.element__ordered__list__item span {
  padding: 0;
  margin: 0; /* Because .paper * line */
  position: absolute;
  left: -1em;
}
</style>