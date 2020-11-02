<template>
  <div class="subsection__card__container">
    <!--<div class="paper">
      <p>fuck you</p>
      <p>fuck you</p>
      <p>fuck you</p>
    </div>-->
    <p class="subsection__header">{{ this.section.title }}</p>
    <p class="subsection__numbered__item" v-for="(step, index) in this.section.steps" :key="step">
      <span>{{ index + 1 }}</span>
      {{ step }}
    </p>
  </div>
</template>

<script>
export default {
  name: "InstructionSubSection",
  props: ["section"]
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