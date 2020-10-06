<template>
  <div>
    <h1>{{ this.section.title }}</h1>
    <p v-if="section.hasOwnProperty('steps')">reddit</p>
    <div
      v-else
      v-for="subsection in this.section.subsections"
      :key="subsection.title"
    >
      <InstructionSection :section="subsection" />
    </div>
  </div>
</template>

 

<script>
export default {
  name: "InstructionSection",
  props: ["section"],
};
</script>