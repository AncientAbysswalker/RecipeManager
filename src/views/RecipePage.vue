<template>
    <div class="recipe__page__container">
        <div class="recipe__page__column">
            <div id="section-header">
                <h1 class="text-fancy">{{ this.fields.name }}</h1>

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
                    >Log List State</v-btn>
                </div>

                <!-- Side Edit Container -->
                <div class="edit__mode__tools">
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <draggable
                                class="dragArea"
                                dragClass="new__element__drag--notes"
                                ghostClass="ghost"
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
                                ghostClass="ghost"
                                :animation="150"
                                :list="[{steps: [''], type: 2}]"
                                :group="{ name: 'instruction-element', pull: 'clone', put: false }"
                            >
                                <img class="new__drag--paragraph" src="@/assets/ordered_list.png" v-bind="attrs" v-on="on">
                            </draggable>
                        </template>
                        <span>Numbered List</span>
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
                    <!-- <slide>
          <img
            :src="
              `${this.services.url_cdn}/${this.fields.images[0]}` ||
                require(`@/static/card_loading.png`)
            "
            @error="imgPlaceholder"
          />
        </slide>
        <slide>
          <img
            :src="
              `${this.services.url_cdn}/${this.fields.images[1]}` ||
                require(`@/static/card_loading.png`)
            "
            @error="imgPlaceholder"
          />
          </slide>-->
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

            <!-- <img
        v-bind:src="
          (this.fields.images !== undefined && this.fields.images.length > 0
            ? `${this.services.url_cdn}/${this.fields.images[0]}`
            : require(`@/static/card_default.png`)) ||
            require(`@/static/card_loading.png`)
        "
        @error="imgPlaceholder"
      />-->
            <div id="section__production">
                <table>
                    <tbody>
                        <tr>
                            <td>Active Time</td>
                            <td>{{ this.fields.time_active }} minutes</td>
                        </tr>
                        <tr>
                            <td>Total Time</td>
                            <td>{{ this.fields.time_total }} minutes</td>
                        </tr>
                        <tr>
                            <td>Yield</td>
                            <td>MANY FOODS minutes</td>
                        </tr>
                    </tbody>
                </table>
                <!-- <p>{{ this.fields.time_passive }} minutes</p>
        <p>{{ this.fields.time_active }} minutes</p>-->
            </div>

            <!-- Ingredients -->
            <div id="section-ingredients">
                <h2>Ingredients</h2>
                <div
                    v-for="(ingredient_section, index) in this.fields
                        .ingredients"
                    :key="index"
                    class="instruction__card__container"
                >
                    <p class="instruction__card__header">Optional Header?</p>
                    <div class="paper">
                        <p
                            class="subsection__numbered__item"
                            v-for="(ingredient,
                            index) in ingredient_section.ingredients"
                            v-bind:key="index"
                        >
                            <span>{{ ingredient.quantity }}</span>
                            <span>{{ ingredient.unit }}</span>
                            {{ ingredient.name }}
                        </p>
                        <!-- <table>
            <tbody>
              <tr v-for="(ingredient, index) in this.fields.ingredients" v-bind:key="index">
                <td>{{ ingredient.quantity }}</td>
                <td>{{ ingredient.unit }}</td>
                <td>{{ ingredient.name }}</td>
              </tr>
            </tbody>
            </table>-->
                    </div>
                </div>

                <!-- <div>
          <p
            v-for="(ingredient, index) in this.fields.ingredients"
            v-bind:key="index"
          >
            {{ ingredient.quantity }} - {{ ingredient.unit }} -
            {{ ingredient.name }}
          </p>
        </div>-->
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
                        v-for="container in this.fields.instructions"
                        :key="container.title"
                        :title.sync="container.title"
                        :contents="container.contents"
                        :isEditMode="is_edit_mode"
                        @update-title="updateTitle($event, container)"
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
import InstructionCard from '../components/InstructionCard';
//import { Carousel, Slide } from "vue-carousel";

export default {
    name: 'RecipeCard',
    props: ['todo', 'item', 'record', 'reqPic'],
    components: {
        InstructionCard,
        draggable
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
        updateTitle(newTitle, instructionCard) {
            instructionCard.title = newTitle;
        },
        printListState() {
            console.log(this.fields.instructions);
        }
    },
    mounted() {
        console.log(5);
        axios
            .get(`${this.services.url_api}/${this.$route.params.id}`)
            .then(res => {
                this.fields = res.data;
                console.log(this.fields);
            })
            .catch(err => console.log(err));
        console.log(52);
    }
};
</script>

<style scoped>
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
h1 {
    font-size: 50px;
}
h2 {
    font-size: 24px;
}

/* To help position the edit mode button(s) */
#section-header {
    position: relative;
}

/* Header and Carousel */

.text-fancy {
    font-family: 'QuickKiss', Helvetica, Arial;
    font-weight: 100;
}
.caru {
    border: red solid 1px;
}
img {
    width: 500px;
}
/* ol li {
  margin-left: 50px;
  list-style: upper-roman;
  color: red;
} */

/* Production Section */
#section__production {
    background-color: lightgrey;
    padding: 10px;
}
/* Styling based on https://codesandbox.io/s/zealous-snowflake-ri6cp?file=/style.css:182-530 */
#section__production table {
    border-collapse: collapse;
}
/* First Column */
#section__production tr td:first-child {
    border-right: grey solid 2px;
    color: grey;
    text-align: right;
}
/* Second Column */
#section__production tr td:nth-child(2) {
    font-weight: bold;
}

#section__production td {
    min-width: 120px;
    padding: 5px;
}

#section-ingredients table {
    border: 2px solid #42b983;
    border-collapse: collapse;
    margin: 10px;
}
#section-ingredients tr {
    border: red solid 1px;
}
#section-ingredients tr td:first-child {
    text-align: right;
}
#section-ingredients tr td:nth-child(2) {
    border-right: black solid 1px;
}

#section-ingredients td {
    min-width: 120px;
    padding: 10px 20px;
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

.subsection__numbered__item {
    margin: 0;
    line-height: 1.5em;

    /* Positioning */
    padding-left: 0.5em;
    position: relative;
    top: 0.4em;
}
.instruction__card__header {
    margin-bottom: 0;
    font-size: 32px;
    font-weight: bold;
    padding: 0.25em 0.5em 0.25em 0.5em;
    line-height: 1em;
    height: 1.5em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    /* position: relative;
  top: 0.2em; */
}

/* Space between Instruction Cards */
#section-instructions > div:not(:last-child) {
    margin-bottom: 20px;
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

    padding: 0px;
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
.ghost {
    font-size: 16px;
    margin: 0;
    padding: 0;
    height: 24px;
    line-height: 24px;
    margin-bottom: 24px;
}
</style>
