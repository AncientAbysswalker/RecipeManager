<template>
    <div
        :class="
            'instruction__container' + (this.top_level ? ' top__level' : '')
        "
    >
        <p class="element__title" v-if="!this.top_level">
            {{ this.title }}
        </p>

        <draggable
            class="dragArea"
            dragClass="sortable-drag"
            ghostClass="ghost"
            handle=".can-drag"
            :animation="150"
            :list="contents"
            :group="{ name: 'instruction-element' }"
        >
            <template v-for="(element, index) in this.contents">
                <InstructionContainer
                    v-if="element.type === 0"
                    :key="index + '-' + element.type"
                    :title="element.title"
                    :contents="element.contents"
                    :class="isEditMode && 'can-drag'"
                    :isEditMode="isEditMode"
                ></InstructionContainer>
                <p
                    class="element__notes element__edit--notes"
                    :class="isEditMode && 'can-drag'"
                    v-else-if="element.type === 1"
                    :key="index + '-' + element.type"
                    :contenteditable="isEditMode ? 'true': 'false'"
                    @blur="onNotesEdit($event, element)"
                >{{element.text}}</p>
                <div
                    class="element__ordered__list"
                    :class="isEditMode && 'can-drag'"
                    v-else-if="element.type === 2"
                    :key="index + '-' + element.type"
                >
                    <p
                        class="element__ordered__list__item"
                        v-for="(step, index) in element.steps"
                        :key="'ol' + index"
                    >
                        <span>{{ index + 1 }}</span>
                        <span 
                            class="element__edit--lists"
                            :contenteditable="isEditMode ? 'true': 'false'"
                            @blur="onOrderedListEdit($event, index, element)"
                        >
                            {{step}}
                        </span>
                    </p>
                </div>
                <div
                    class="element__unordered__list"
                    :class="isEditMode && 'can-drag'"
                    v-else-if="element.type === 3"
                    :key="index + '-' + element.type"
                >
                    <p
                        class="element__unordered__list__item"
                        v-for="(step, index) in element.steps"
                        :key="'ul' + index"
                    >
                        <span>●</span>{{ step }}
                    </p>
                </div>
                <!-- <p v-else-if="element.type === 2" :key="index">I am a Ordered List</p> -->
                <!-- <p v-else-if="element.type === 3" :key="index">I am an Unordered List</p> -->
                <p
                    v-else
                    :key="index + '-' + element.type"
                    :class="isEditMode && 'can-drag'"
                >
                    Something has gone horribly wrong! Type
                    {{ element.type }} is invalid!
                </p>
            </template>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
    name: 'InstructionContainer',
    props: {
        title: String,
        contents: Array,
        top_level: Boolean,
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    components: {
        draggable
    },
    methods: {
        log(msg){
            console.log(msg); 
        },
        onNotesEdit(evt, notesState){
            let updatedContent = evt.target.innerText;
            console.log(typeof updatedContent);
            //notesState.text = updatedContent;
            console.log(notesState.text)
        },
        onOrderedListEdit(evt, index, listState){
            let updatedContent = evt.target.innerText;
            listState.steps[index] = updatedContent;
        },
        updateTitle(newTitle, list) {
            console.log('ddd');
            console.log(list);
            //instructionCard.title = newTitle;
        }
    }
};
</script>

<style lang="scss" scoped>
/*.instruction__container {
    border: red 1px solid;
    margin: -1px;
}*/

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

.dragArea {
    margin: 0;
    padding: 0;
}

.sortable-drag {
    color: red;
    /*border: 1px black solid;*/
}

/* General Styling for Elements */
.element__general { /* Base */
    margin: 0;
    line-height: 1.5em;
    margin-bottom: 1.5em;

    /* Space to vertical line on left and from right of 'card' */
    padding-left: 0.5em;
    padding-right: 0.5em;
}
.element__general:last-child { /* Fixing one extra 1px line on card showing */
    margin-bottom: calc(1.5em - 1.5px);
}
.element__edit:focus { /* When activaly editing */
    outline: none;
    background-color: #cccccc55;
}
.element__edit:empty::before { /* Edit mode empty item text */
    content: 'Instruction Text';
    color: #cccccc;
}

/* Styling for Notes */
.element__notes {
    @extend .element__general;
}
.element__edit--notes {
    @extend .element__edit;
}
.element__edit--notes:empty::before {
    content: 'Notes Section Text';
}

/* Styling for Lists */
.element__unordered__list,
.element__ordered__list {
    @extend .element__general;
}

.element__unordered__list__item,
.element__ordered__list__item {
    margin: 0;

    /* Positioning */
    //padding-left: 0.5em;
    position: relative;
    /* top: 0.4em; */
}
/* .element__ordered__list__item:last-child {
  padding-bottom: 1.5em;
} */
.element__unordered__list__item span:first-child,
.element__ordered__list__item span:first-child {
    padding: 0;
    margin: 0; /* Because .paper * line */
    position: absolute;
    left: -1.5em;
}
.element__edit--lists {
    @extend .element__edit;
    line-height: 1.5em;
}
.element__edit--lists:empty::before {
    content: 'List Section Text';
}

.new__drag, .new__element__drag--notes * {
    height: 5px;
}
.new__element__drag--notes img {
    height: 5px;
    width: auto;
}
.new__element__drag--drug img {
    height: 5px;
    width: auto;
}

.instruction__container img {
    height: 5px;
}
.sortable-drag img {
    height: 5px;
}
.ghost img {
    height: 5px;
}
.new__element__drag--notes {
    height: 5px;
}
.new__element__drag--drug {
    height: 5px;
}
</style>
