<template>
    <div class="recipe__page__container">
        <div class="recipe__page__column">
            <div id="section-header">
                <input class="recipe-title text-fancy element__editable" :disabled="!is_edit_mode" v-model="fields.name" :placeholder="is_edit_mode ? 'Recipe Title' : ''" />
                <!-- <h1 class="text-fancy">{{ this.fields.name }}</h1> -->

                <!-- Top Edit Container -->
                <div class="edit-mode">
                    <input
                        type="checkbox"
                        id="isEditMode"
                        name="isEditMode"
                        v-model="is_edit_mode"
                    />
                    <v-btn 
                        x-small
                        color="primary"
                        @click="printListState"
                    >Log List States</v-btn>
                    <v-btn 
                        x-small
                        color="primary"
                        @click="saveListState"
                    >Save List States</v-btn>
                </div>

                <!-- Side Edit/Toolkit Container -->
                <div class="edit__mode__tools">
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <draggable
                                class="dragArea"
                                dragClass="new__element__drag--notes"
                                ghostClass="ghosty"
                                :animation="150"
                                :list="[{text: '', type: 1}]"
                                :group="{ name: 'instruction-element', pull: 'clone', put: false }"
                            >
                                <img class="new__drag--paragraph" src="@/assets/paragraph.png" v-bind="attrs" v-on="on">
                            </draggable>
                        </template>
                        <span>Paragraph</span>
                    </v-tooltip>
                    <hr>
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <draggable
                                class="dragArea"
                                dragClass="new__element__drag--notes"
                                ghostClass="ghosty"
                                :animation="150"
                                :list="[{steps: [''], type: 2}]"
                                :group="{ name: 'instruction-element', pull: 'clone', put: false }"
                            >
                                <img class="new__drag--paragraph" src="@/assets/ordered_list.png" v-bind="attrs" v-on="on">
                            </draggable>
                        </template>
                        <span>Numbered List</span>
                    </v-tooltip>
                    <hr>
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <draggable
                                class="dragArea"
                                dragClass="new__element__drag--notes"
                                ghostClass="ghosty"
                                :animation="150"
                                :list="[{steps: [''], type: 3}]"
                                :group="{ name: 'instruction-element', pull: 'clone', put: false }"
                            >
                                <img class="new__drag--paragraph" src="@/assets/unordered_list.png" v-bind="attrs" v-on="on">
                            </draggable>
                        </template>
                        <span>Bullet List</span>
                    </v-tooltip>
                    <hr>
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <draggable
                                class="dragArea"
                                dragClass="new__element__drag--notes"
                                ghostClass="ghosty"
                                :animation="150"
                                :list="[{contents: [], title: '', type: 0}]"
                                :group="{ name: 'instruction-element', pull: 'clone', put: false }"
                            >
                                <img class="new__drag--paragraph instruction__container" src="@/assets/subsection.png" v-bind="attrs" v-on="on">
                            </draggable>
                        </template>
                        <span>Sub-Section</span>
                    </v-tooltip>
                    <hr>
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <draggable
                                class="dragArea"
                                dragClass="new__element__drag--notes"
                                ghostClass="ghosty"
                                :animation="150"
                                :list="[{contents: [], title: '', type: 0}]"
                                :group="{ name: 'instruction-card', pull: 'clone', put: false }"
                            >
                                <img class="new__drag--paragraph instruction__container" src="@/assets/card.png" v-bind="attrs" v-on="on">
                            </draggable>
                        </template>
                        <span>Instruction Card</span>
                    </v-tooltip>
                </div>

                <v-carousel class="caru" :show-arrows="false">
                    <v-carousel-item
                        v-if="
                            this.fields.images &&
                                this.fields.images.length === 0
                        "
                        :src="
                            require(`@/static/card_default.png`) ||
                                require(`@/static/card_loading.png`)
                        "
                        @error="imgPlaceholder"
                    ></v-carousel-item>
                    <v-carousel-item
                        v-else
                        v-for="(image, index) in this.fields.images"
                        :key="index"
                        :src="
                            `${services.url_cdn}/${image}` ||
                                require(`@/static/card_loading.png`)
                        "
                        @error="imgPlaceholder"
                    ></v-carousel-item>
                </v-carousel>
            </div>

            <!-- Production - not split into a separate component because it is simple -->
            <div id="section-production">
                <div class="production__table__grid">
                    <div class="production__table__col--1">
                        <div>Active Time</div>
                        <div>Total Time</div>
                        <div>Yield</div>
                        <div>Tags</div>
                    </div>
                    <div class="production__table__col--2">
                        <div class="production__table__row--suffix-input">
                            <span>{{ fields.time_active ? fields.time_active + ' minutes' : '' }}</span>
                            <input class="element__editable--dark" :disabled="!is_edit_mode" v-model="fields.time_active" :placeholder="is_edit_mode ? 'In Minutes' : ''" @keypress="enforceNumber" @focus="focusProdParent" @blur="blurProdParent" @paste="noPaste"/>
                        </div>
                        <div class="production__table__row--suffix-input" @keypress="enforceNumber">
                            <span>{{ fields.time_total ? fields.time_total + ' minutes' : '' }}</span>
                            <input class="element__editable--dark" :disabled="!is_edit_mode" v-model="fields.time_total" :placeholder="is_edit_mode ? 'In Minutes' : ''" @keypress="enforceNumber" @focus="focusProdParent" @blur="blurProdParent" @paste="noPaste"/>
                        </div>
                        <div class="production__table__row">
                            <input class="element__editable--dark" :disabled="!is_edit_mode" v-model="fields.yield" :placeholder="is_edit_mode ? 'eg. \'Two Servings\'' : ''" @focus="focusProdParent" @blur="blurProdParent" />
                        </div>
                        <div class="production__table__row" v-show="is_edit_mode">
                            <input ref="tagInput" class="element__editable--dark" :disabled="!is_edit_mode" :placeholder="is_edit_mode ? 'Enter a New Tag' : ''" @focus="focusProdParent" @blur="blurProdParent" @keyup.enter="addTag"/>
                        </div>
                        <div class="tags__container">
                            <div tabindex="0" class="tag" v-for="(tag, index) in this.fields.tags" :key="index + tag" @click="showClose" @blur="hideClose">{{tag}}<DeleteTagButton v-if="is_edit_mode" class="hide tag--deletor" @delete-component="() => deleteTag(index)"></DeleteTagButton></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ingredients -->
            <div id="section-ingredients">
                <h2>Ingredients</h2>
                <draggable
                    :animation="150"
                    :list="this.fields.ingredients"
                    :group="{ name: 'ingredient-card' }"
                    handle=".nerp"
                >
                    <IngredientCard
                        v-for="(card, index) in this.fields.ingredients"
                        :key="index"
                        :cardData="card"
                        :isEditMode="is_edit_mode"
                    />
                </draggable>
            </div>

            <!-- Instructions -->
            <div id="section-instructions">
                <h2>Instructions</h2>
                <draggable
                    :animation="150"
                    :list="this.fields.instructions"
                    :group="{ name: 'instruction-card' }"
                >
                    <InstructionCard
                        v-for="(card, index) in this.fields.instructions"
                        :key="index"
                        :cardData="card"
                        :isEditMode="is_edit_mode"
                    />
                </draggable>
            </div>

            <!-- <div
        v-for="(section, index) in this.fields.instructions"
        :key="`section${index}`"
      >
        <h5>{{ section.title }}</h5>
        <ol>
          <li v-for="(step, index) in section.steps" :key="`step${index}`">
            {{ step }}
          </li>
        </ol>
      </div>-->
            <br />
            <br />
            <br />
            <p>This is the id: {{ $route.params.id }}</p>
        </div>
    </div>
</template>

<script>
// Modules
import axios from 'axios';
import draggable from 'vuedraggable';
const services = require('@/helpers/services');

// Components
import InstructionCard from '../components/RecipePage/instruction-elements/InstructionCard';
import IngredientCard from '../components/RecipePage/ingredient-elements/IngredientCard';
import DeleteTagButton from '../components/RecipePage/common-elements/DeleteTagButton';
//import { Carousel, Slide } from "vue-carousel";

export default {
    name: 'RecipeCard',
    props: ['todo', 'item', 'record', 'reqPic'],
    components: {
        InstructionCard,
        IngredientCard,
        draggable,
        DeleteTagButton
    },
    data: () => ({
        fields: [],
        services: services,
        is_edit_mode: true
    }),
    methods: {
        markComplete() {
            this.todo.completed = !this.todo.completed;
        },
        imgPlaceholder(e) {
            e.target.src = require(`@/static/card_error.png`);
        },
        printListState() {
            let rawInstructionJSON = this.fields.instructions;
            let rawIngredientsJSON = this.fields.ingredients;

            console.log("Title");
            console.log(this.fields.name);
            console.log("Instructions");
            console.log(this.fields.instructions);
            console.log("Ingredients");
            this.cleanIngredientInputs();
            console.log(this.fields.ingredients);
        },
        saveListState() {
            let recipeName = this.fields.name;
            let imageList = [
                    "fc8cf377-6056-476f-9597-6fef05f3c9b5.jpg",
                    "cf29d86b-d7b5-4684-9aa6-1ff5826a86bd.jpg"
                ];
            let activeTime = 20;
            let totalTime = 60;
            let yieldAmount = this.fields.yield;
            let tags = this.fields.tags;

            let rawIngredientsJSON = this.fields.ingredients;
            let rawInstructionJSON = this.fields.instructions;

            // Clean JSON

            let updatedRecipe = {
                "name": recipeName, 
                "images": imageList,
                "time_active": activeTime,
                "time_total": totalTime,
                "yield": yieldAmount,
                "tags": tags,
                "ingredients": rawIngredientsJSON,
                "instructions": rawInstructionJSON
            }
            console.log(this.fields.instructions);

            // Now run request
            axios
                .put(`${this.services.url_api}/${this.$route.params.id}`, updatedRecipe)
                .then(res => {
                    console.log(res);
                })
                .catch(err => console.log(err));
        },
        enforceNumber(evt) {
            let keyCode = evt.keyCode;

            // only allow number and one dot
            if (
                (keyCode < 48 || keyCode > 57) &&
                (keyCode !== 46)
            ) {
                evt.preventDefault();
            }
        },
        noPaste(evt) {
            evt.preventDefault();
        },
        focusProdParent(evt) {
            evt.target.parentElement.classList.add("production__table__row--highlight")
        },
        blurProdParent(evt) {
            evt.target.parentElement.classList.remove("production__table__row--highlight")
        },
        addTag(evt) {
            let tagInputField = this.$refs.tagInput;
            let tagInputText = tagInputField.value.trim();
            if (!(this.fields.tags.map((tag) => { return tag.toLowerCase() }).includes(tagInputText.toLowerCase()))) {
                this.fields.tags.push(tagInputText);
            }
            tagInputField.value = null;
        },
        showClose(evt) {
            let closeButtonElement = evt.target.firstElementChild;
            if (closeButtonElement) {
                closeButtonElement.classList.remove("hide")
            }
        },
        hideClose(evt) {
             let closeButtonElement = evt.target.firstElementChild;
            if (closeButtonElement) {
                closeButtonElement.classList.add("hide")
            }
        },
        deleteTag(index) {
            this.fields.tags.splice(index, 1);
        },
        cleanIngredientInputs() {
            let rawIngredientsJSON = this.fields.ingredients;
            for (let ingredientSection of rawIngredientsJSON) {
                ingredientSection.title = ingredientSection.title.trim();
                for (let i = 0; i < ingredientSection.ingredients.length; i++) {
                    let currentIngredient = ingredientSection.ingredients[i];
                    let nameText = currentIngredient.name.trim();
                    let quantityText = ('' + currentIngredient.quantity).trim(); // Make sure to cast just in case
                    let unitText = currentIngredient.unit.trim();

                    // If any of the fields are not filled out then remove the ingredient from the array
                    if (nameText.length === 0 || unitText.length === 0 || quantityText.length === 0) {
                        ingredientSection.ingredients.splice(i, 1);
                    } else {
                        currentIngredient.name = nameText;
                        currentIngredient.quantity = quantityText;
                        currentIngredient.unit = unitText;
                    }
                }
            }
        }
    },
    mounted() {
        axios
            .get(`${this.services.url_api}/${this.$route.params.id}`)
            .then(res => {
                this.fields = res.data;
                console.log(this.fields);
            })
            .catch(err => console.log(err));
    }
};
</script>

<style scoped lang="scss">
/* Global and container */
.recipe__page__container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.recipe__page__column {
    border: purple solid 1px;
    width: 100%;
    max-width: 1000px;
    padding: 20px;
}
.recipe__page__column > div {
    width: 100%;
    border: orange solid 0px;
    margin-bottom: 15px;
}

/* To help position the edit mode button(s) */
#section-header {
    position: relative;
}

/* Header and Carousel */
.recipe-title {
    font-size: 50px;
    font-weight: bold;
    width: 100%;
}
.text-fancy {
    font-family: 'AllPink', Helvetica, Arial;
    font-weight: 100;
}
.caru {
    border: red solid 1px;
}
img {
    width: 500px;
}

/* Edit Mode Area */
.edit-mode {
    position: absolute;
    right: 0px;
    top: 0px;
}
.edit-mode > * {
    margin-right:25px;
}
.edit__mode__tools {
    position: fixed;
    right: 0px;
    top: 150px;
    background: #FFF1B3;
    border-radius: 10px 0 0 10px;
}
.edit__mode__tools img {
    margin: 10px;
    padding: 0;
    height: 30px;
    width: auto;
}
.edit__mode__tools hr {
    margin: 0;

    padding: 0;
    margin-left: 10px;
    margin-right: 10px;
    display: block; 
    height: 0px;
    color: #D6BE57;
    background-color: #D6BE57;
    border: 1px solid #D6BE57;
    border-radius: 5px;
}
.edit__mode__tools hr:first-child {
    margin-top: 10px;
}
.edit__mode__tools hr:last-child {
    margin-bottom: 10px;
}
.new__drag--paragraph {
    height: 1.5em;
    width: auto;
    margin: 0;
    padding: 0;
    margin-bottom: 1.5em;
}
.ghostElement { /* External influence on the style of the Instruction Elements during cloning from this toolkit */
    display: block;
    height: 1.3em;
    padding: .1em .5em .1em .5em;
    
    margin-bottom: 1.5em;
}
.dragArea { /* Don't know?? */
    height: 50px;
}

.element__editable { /* Styling for text areas */
    margin: 0;
    padding: 0;
    border: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    outline: none;

    /* Space to vertical line on left and from right of 'card' */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.element__editable:focus { /* When activaly editing */
    background-color: #cccccc55;
}
.element__editable:disabled { /* Text black if disabled */
    color: black;
}
.element__editable::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #cccccc;
    opacity: 1; /* Firefox */
}
.element__editable:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #cccccc;
}
.element__editable::-ms-input-placeholder { /* Microsoft Edge */
    color: #cccccc;
}

/* Production Section */
#section-production {
    background-color: lightgrey;
    padding: 10px;
}
.production__table__grid {
    display: flex;
}
.production__table__col {
    min-width: 120px;
}
.production__table__col--1 {
    @extend .production__table__col;
    flex: 1;
    border-right: grey solid 2px;
    color: grey;
    text-align: right;
}
.production__table__col--2 {
    @extend .production__table__col;
    flex: 7;
}
.production__table__col > * {
    padding: 5px;
    margin: 0;
}
.production__table__row--highlight {
    background-color: #dedede;
}
.production__table__row * {
    padding: 0;
    width: 100%;
    font-weight: bold;
}
.production__table__row--suffix-input { /* For unit (suffix) handling */
    @extend .production__table__row;
    display: flex;
}
.production__table__row--suffix-input > input {
    margin-left: -100%;
    color: transparent;
}
.tags__container {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 0 0 5px;
}
.tags__container:empty {
  display: none;
}
.element__editable--dark { /* Styling for text areas */
    @extend .element__editable;    
    caret-color: black;
}
.element__editable--dark:focus { /* When activaly editing */
    background-color: transparent;
}
.element__editable--dark::placeholder { /* Styling for text areas */
    color: grey;
}
.tag {
    font-weight: bold;
    position: relative;
    background-color: #aaaaaa;
    padding: 2px 5px;
    margin: 0 5px 5px 0;
    border-radius: 5px;
    outline: none;
}
.hide {
    display: none;
}
.tag--deletor {
    position: absolute;
    right: -0.4em;
    top: -0.4em;
    z-index: 1;
}
</style>
