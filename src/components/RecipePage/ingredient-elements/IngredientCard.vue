<template>
    <div class="instruction__card__container">
        <input class="element__hdr instruction__card__header" :disabled="!isEditMode" v-model="cardData.title" :placeholder="isEditMode ? 'Instruction Card Title' : ''" />
        <div class="ruled__paper">
            <IngredientContainer
                :elementData="cardData"
                :isEditMode="isEditMode"
            />
        </div>
    </div>
</template>

<script>
// Components Import
import IngredientContainer from './IngredientContainer';
export default {
    name: 'IngredientCard',
    props: {
        cardData: Object,
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    components: {
        IngredientContainer
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
    /*margin: 0; Causes issues*/
    /*padding: 0;*/
    /* margin-bottom: 0 !important; */
    line-height: 1.5em;
}

/* Top-level card and paper styling*/
.instruction__card__container {
    border: 1px solid #cfcfcf;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
    padding: 0;
    margin-bottom: 1.5em;
}
.ruled__paper {
    display: block;  /* THIS BUGS THE FUCK OUT IF INLINE with TEXTAREA SPECIFICALLY??? BUT INLINE REALLY HELPS WITH TH FUCKKKING EXTENDED RULES*/
    width: 100%;
    border-top: solid 1px #ffb3b3;
    /* Set a font size */
    font-size: 16px;
    /*height: 500px;*/
    margin: 0 !important;
    padding: 0 !important;
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

.element__hdr { /* Styling for text areas */
    display: block;
    width: 100%;
    border: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    outline: none;
}
.element__hdr:focus { /* When activaly editing */
    background-color: #cccccc55;
}
.element__hdr:disabled { /* Text black if disabled */
    color: black;
}
.element__hdr::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #cccccc;
    opacity: 1; /* Firefox */
}
.element__hdr:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #cccccc;
}
.element__hdr::-ms-input-placeholder { /* Microsoft Edge */
    color: #cccccc;
}
</style>
