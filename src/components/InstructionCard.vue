<template>
  <div class="instruction__card__container">
    <!--<div class="paper">
      <p>fuck you</p>
      <p>fuck you</p>
      <p>fuck you</p>
    </div>-->
    <p class="instruction__card__header">{{ this.title }}</p>
    <div class="paper">
      <InstructionContainer :contents="this.contents" notitle />
    </div>
  </div>
</template>

<script>
// Components
import InstructionContainer from "../components/InstructionContainer";

export default {
  name: "InstructionCard",
  props: ["title", "contents"],
  components: {
    InstructionContainer
  }
};
</script>

<style scoped>
* {
  border: 0px blue solid;
}
.instruction__card__container {
  border: 1px solid #cfcfcf;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
}
.instruction__card__container:not(:last-child) {
  margin-bottom: 20px;
}
/* Header Line */
.instruction__card__header {
  margin-bottom: 0;
  font-size: 32px;
  font-weight: bold;
  padding: 0.25em 0.5em 0.25em 0.5em;
  line-height: 32px;
  height: 1.5em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  /* position: relative;
  top: 0.2em; */
}
/* Instructions Table */
.instruction__card__table {
  width: 100%;
  border-collapse: collapse;
  position: relative;
  top: 0.4em;
}
.instruction__card__table tr {
  border-bottom: solid 0px #e6e6ff;
}
.instruction__card__table tr > td {
  padding-right: 4px;
  bottom: 0;
}
.instruction__card__table tr > td > p {
  vertical-align: 20em;
}
.instruction__card__table tr > td:first-child {
  /* First Column */
  border-right: solid 0px #b3b3ff;
  width: 48px;
  text-align: right;
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
  padding: 0;
  margin: 0; /* Because .paper * line */
  position: absolute;
  left: -1em;
}
.paper {
  border-top: solid 1px #ffb3b3;
  /* Set a font size */
  font-size: 16px;
  /*height: 500px;*/
  margin: 0;
  padding: 0;
  background-repeat: repeat;

  /* Begin The Redundancies */
  background-image: -webkit-linear-gradient(
      0deg,
      transparent 4em,
      rgba(255, 0, 0, 0.2) 0,
      transparent 4.1em
    ),
    -webkit-linear-gradient(90deg, rgba(0, 0, 255, 0.3) 1px, transparent 0);
  /*background-image: 
    -moz-linear-gradient(0deg, transparent 5em, rgba(255,0,0,.2) 0, transparent 5.1em),
    -moz-linear-gradient(rgba(0,0,255,.3) 1px, transparent 0);
  background-image: 
    -o-linear-gradient(0deg, transparent 5em, rgba(255,0,0,.2) 0, transparent 5.1em), 
    -o-linear-gradient(rgba(0,0,255,.3) 1px, transparent 0);
  background-image: 
    -ms-linear-gradient(0deg, transparent 5em, rgba(255,0,0,.2) 0, transparent 5.1em), 
    -ms-linear-gradient(rgba(0,0,255,.3) 1px, transparent 0);*/
  -webkit-background-size: 100% 1.5em;
  /*-moz-background-size: 100% 2em;*/

  /* In a perfect world... */
  /*background-image: 
    linear-gradient(0deg, transparent 5em, rgba(255,0,0,.2) 0, transparent 5.1em), 
    linear-gradient(rgba(0,0,255,.3) 1px, transparent 0);
  background-size: 100% 2em;*/
}
/* .paper * {
  margin: 0;
  padding: 0;
  height: 1.5em;
} */
.paper * {
  margin-left: 4em;
}
</style>