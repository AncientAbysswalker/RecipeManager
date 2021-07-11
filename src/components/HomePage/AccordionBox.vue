<template>
  <div>
    <div class="accordion__header" @click="toggleAccordion">
      <span class="accordion__label">{{this.label}}</span>
      <span class="accordion__line"></span>
      <slot name="icons"></slot>
      <span class="accordion__carret" ref="accordionCarret">▼</span>
    </div>
    <div class="accordion__container" ref="accordionContainer">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: "AccordionBox",
  props: {
    startExpanded: {
      type: Boolean
    },
    label: {
      type: String,
      default: 'wersg'
    },
    manageActions: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data: () => ({
  }),
  methods: {
    toggleAccordion() {
      const accordionContainer = this.$refs.accordionContainer;
      if (accordionContainer.style.maxHeight !== "0px") {
        accordionContainer.style.maxHeight = "0px";
      } else {
        accordionContainer.style.maxHeight = accordionContainer.scrollHeight + "px";
      } 

      this.toggleCarret();
    },
    toggleCarret(evt) {
      const accordionCarret = this.$refs.accordionCarret;
      accordionCarret.classList.toggle("accordion__carret--rotate");
    }
  },
  mounted() {
    if (!this.startExpanded) {
        const accordionContainer = this.$refs.accordionContainer;
        const accordionCarret = this.$refs.accordionCarret;
        accordionContainer.style.maxHeight = "0px";
        accordionCarret.classList.add("accordion__carret--rotate");
    }
  }
};
</script>

<style scoped>
.accordion__container {
  background-color: red;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
}
.accordion__header {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.accordion__header span {
  margin: 5px; 
}
.accordion__label {
  white-space: nowrap;
  color: grey;
  font-size: 24px;
}
.accordion__line {
  display:block;
  width: 100%;
  border-top: 2px solid grey;
}
.accordion__icon {
  line-height: 0.8em;
  margin-left: 10px;
  margin-right: 10px;
}
.accordion__icon:after { /* Remove default ripple */
  opacity: 0 !important;
}
.accordion__carret {
  color: grey;
  line-height: 0.8em;
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  transition: transform 150ms ease;
}
.accordion__carret--rotate {
  transform: rotate( -180deg );        
}
</style>
