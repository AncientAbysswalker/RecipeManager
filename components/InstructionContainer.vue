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
            tag="ul"
            handle=".can-drag"
            :animation="150"
            :list="contents"
            :group="{ name: 'g1' }"
        >
            <template v-for="(element, index) in this.contents">
                <InstructionContainer
                    v-if="element.type === 0"
                    :key="index + '-' + element.type"
                    :title="element.title"
                    :contents="element.contents"
                    :class="isEditMode && 'can-drag'"
                ></InstructionContainer>
                <p
                    class="element__notes"
                    :class="isEditMode && 'can-drag'"
                    v-else-if="element.type === 1"
                    :key="index + '-' + element.type"
                >
                    {{ element.text }}
                </p>
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
                        <span>{{ index + 1 }}</span
                        >{{ step }}
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
    border: 1px black solid;
}

/* Padding to add space between elements in the container */
.instruction__container > *:not(:last-child) {
    padding-bottom: 1.5em;
}
.top__level {
    /* The top-level container needs to add some space at the end to look more natural */
    padding-bottom: 1.5em;
}

.element__general {
    padding-bottom: 1.5em;
}

/* Styling for Notes */
.element__notes {
    @extend .element__general;
    margin: 0;
    line-height: 1.5em;

    /* Space to vertical line on left and from right of 'card' */
    padding-left: 0.5em;
    padding-right: 0.5em;

    /* Space afterwards for *FDIHDR93 */
    /* padding-bottom: 1.5em;*/
}

/* Styling for  */
.element__unordered__list__item,
.element__ordered__list__item {
    margin: 0;
    line-height: 1.5em;

    /* Positioning */
    padding-left: 0.5em;
    position: relative;
    /* top: 0.4em; */
}
/* .element__ordered__list__item:last-child {
  padding-bottom: 1.5em;
} */
.element__unordered__list__item span,
.element__ordered__list__item span {
    padding: 0;
    margin: 0; /* Because .paper * line */
    position: absolute;
    left: -1em;
}
</style>
