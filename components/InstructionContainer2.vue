<template>
    <div
        :class="
            'instruction__container anchor' + (this.top_level ? ' top__level' : '')
        "
    > <!-- v-on:dragover="dragOver" --> 
        <div v-if="isEditMode && !this.top_level" class="handle__container can-drag"></div>
        <p 
            class="element__title editable__title"
            v-if="!this.top_level"
            :contenteditable="isEditMode ? 'true': 'false'"
        >{{ this.title }}</p>

        <draggable
            class="dragArea"
            dragClass="sortable-drag"
            :class="contents.length==0 && 'gry'"
            ghostClass="ghost"
            handle=".can-drag"
            :animation="150"
            :list="contents"
            :group="{ name: 'instruction-element', put: (to, from, other, other2, other3)=>fltr(to, from, other, other2, other3) }"
        >
            <template v-for="(element, index) in contents">
                <div class="anchor" v-if="element.type === 1" :key="index + '-' + element.type">
                    <div v-if="isEditMode" class="handle__component can-drag"></div>
                    <TextareaAutosize
                        :disabled="!isEditMode"
                        rows="1"
                        class="element__notes element__edit--notes rerpl"
                        v-model="element.text"
                        placeholder="Notes Section Text"
                    />
                </div>
                <div class="anchor list-container" v-else-if="element.type === 2" :key="index + '-' + element.type">
                    <div v-if="isEditMode" class="handle__component can-drag"></div>
                    
                    <draggable
                        class="dragArea"
                        dragClass="sortable-drag"
                        ghostClass="ghost"
                        handle=".can-drag"
                        :animation="150"
                        :list="element.steps"
                        :group="{ name: 'instruction-list' }"
                    >
                        <div
                            class="element__ordered__list__item anchor"
                            v-for="(step, index) in element.steps"
                            :key="'ol' + index"
                        >
                            <span v-if="!isEditMode">{{ index + 1 }}</span>
                            <div v-else class="center"><div class="ball can-drag"></div></div>
                            <TextareaAutosize
                                :disabled="!isEditMode"
                                rows="1" 
                                class="element__edit--lists rerpl"
                                v-model="element.steps[index]"
                                placeholder="Notes Section Text"
                            />
                        </div>
                    </draggable>

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
            <!-- Empty List Placeholder -->  
            <p id="phantom" class="element__notes text--grey" key="phantom-text">This Container is Empty</p>
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
        eatEnter(e) {
            if (e.keyCode === 13) {
                //e.preventDefault()
            } else if (e.keyCode === 50) {
                alert('@ was pressed');
            }      
            this.log += e.key;
        },
        onNotesEdit(evt, notesState) {
            let updatedContent = evt.target.textContent.replace('\xa0', ' '); // Remove &nbsp and newlines
            console.log(updatedContent);
            //evt.target.textContent = updatedContent; // Ensure updated contents
            notesState.text = updatedContent;
        },
        onOrderedListEdit(evt, index, listState) {
            let updatedContent = evt.target.textContent.replace('\xa0', ' '); // Remove &nbsp and newlines
            //evt.target.textContent = updatedContent; // Ensure updated contents
            listState.steps[index] = updatedContent; // Store updated state
        },
        updateTitle(newTitle, list) {
            console.log('ddd');
            console.log(list);
            //instructionCard.title = newTitle;
        },
        dragOver(evt) {
            console.log(evt.target.id);
            console.log(evt.target.id === "phantom");
            if (evt.target.id === "phantom") {
                evt.target.classList.add('hide');
            }
            //console.log(evt.target.id);//let phantom = console.log(evt.target.classList.add('hide'))
            //instructionCard.title = newTitle;
        },
        showPhantom(evt) {
            console.log(evt);//let phantom = 
            //instructionCard.title = newTitle;
        },
        stopProp(evt) {
            console.log(3);
            evt.stopPropagation();
        },
        fltr(to, from, draggedElement, other2, other3) {
            // console.log(33);
            // console.log(from);
            // console.log(35);
            console.log(from);
            console.log(draggedElement);
            console.log(draggedElement.classList.contains('instruction__container'));
            // console.log(37);
            // console.log(other2);
            // console.log(39);
            // console.log(other3);
            return !draggedElement.classList.contains('instruction__container') && from.options.group.name==='instruction-element';
        }
    },
    watch: {
        counter: function(){
            this.$emit('update:counter',this.counter)
        }
    },
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
    padding: 0;
    line-height: 1.5rem;
    /*margin-bottom: 1.5rem;*/

    /* Space to vertical line on left and from right of 'card' */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
/*.top__level:last-child {  Fixing one extra 1px line on card showing 
    margin-bottom: calc(1.5em - 1.5px);
}*/
.element__edit:focus { /* When activaly editing */
    outline: none;
    background-color: #cccccc55;
}
.element__edit:empty::before { /* Edit mode empty item text */
    content: 'Instruction Text';
    color: #cccccc;
}

.rerpl {
  border: none;
  display: inline;
  font-family: inherit;
  font-size: inherit;
  padding: none;
  width: auto;
}

.rerpl:disabled {
    color: black;
}

.editable__general:focus { /* When activaly editing */
    outline: none;
    background-color: #cccccc55;
}
.editable__general:empty::before { /* Edit mode empty item text */
    content: 'Override this text within inherited styles';
    color: #cccccc;
}

/* Styling for Sub-Title */
.element__title {
    @extend .element__general;
    font-weight: bold;
    line-height: 1.5rem;
    font-size: 1.5rem;
    margin-bottom: 0px;
}
.editable__title { /* Edit Mode Style */
    @extend .editable__general;
}
.editable__title:empty::before { /* Edit mode empty item text */
    content: 'Section Header Text';
}



/* Styling for Notes */
.element__notes {
    @extend .element__general;
    width: 100%;
    border-style: none;
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
    border: 1px solid red;
}

.element__unordered__list__item,
.element__ordered__list__item {
    margin: 0;
    padding: 0;

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
.element__unordered__list__item span:last-child,
.element__ordered__list__item span:last-child {
    display: inline-block;
    width:100%;
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
.redborder {
    border: red 1px solid;
}
.anchor {
    position: relative;
}
.handle__component {
    position: absolute;
    left: -25px;
    background: #cccccc88;
    height: 100%;
    width: 20px;
    border-radius: 5px;
}
.handle__container {
    position: absolute;
    left: -50px;
    background: red;
    height: 100%;
    width: 20px;
    border-radius: 5px;
}
.center {
    position: absolute;
    left: -25px;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.ball {
    background: #ffffff;
    height: 10px;
    width: 10px;
    //margin: 4px;
    border-radius: 100px;
}
.instruction__container {
    min-height: 24px;
}
.list-container {
    margin-bottom: 1.5em;
}
.hide {
    display:none;
}
.gry {
    background: #cccccc44;
}
.text--grey {
    color: #cccccc;
}

// Handles the 'empty container' text that shows when dragging
.dragArea #phantom:not(:only-child) {
    display: none;
}
.img {
    margin: 0;
    padding: 0;
}
.zxz {
    z-index: 12
}
</style>
