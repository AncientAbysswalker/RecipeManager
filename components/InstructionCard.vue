<template>
    <div class="instruction__card__container">
        <p class="instruction__card__header">{{ this.title }}</p>
        <div class="ruled__paper">
            <InstructionContainer
                :contents="this.contents"
                top_level
                :isEditMode="isEditMode"
            />
        </div>
    </div>
</template>

<script>
// Components Import
import InstructionContainer from '../components/InstructionContainer';

export default {
    name: 'InstructionCard',
    props: ['title', 'contents', 'isEditMode'],
    components: {
        InstructionContainer
    }
};
</script>

<style scoped>
/* Variables */
:root {
    --main-bg-color: brown;
}

/* Enforce 0 margin styling, as there is an auto-margin -_- */
/deep/ * {
    border: 0px blue solid;
    margin-bottom: 0 !important;
    line-height: 1.5em;
}

/* Top-level card and paper styling */
.instruction__card__container {
    border: 1px solid #cfcfcf;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
}
.ruled__paper {
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
.ruled__paper > * {
    margin-left: 4em;
}
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
</style>
