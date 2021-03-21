<template>
    <div
        class="minus"
        :class="
            'instruction__container anchor' + (this.top_level ? ' top__level' : '')
        "
    >
        <div v-if="isEditMode && !this.top_level" class="handle__container handle__element--drag"></div>
        
        <!-- Sub-Section Title only if Master Title not already used -->
        <input v-if="!this.top_level && (elementData.title!=='' || isEditMode)" class="element__title" :disabled="!isEditMode" v-model="elementData.title" placeholder="Sub-Section Title" /> 

        <draggable
            class="dragArea"
            :class="this.top_level ? ' top__level' : ''"
            dragClass="sortable-drag"
            filter=".no-drag"
            ghostClass="ghostElement"
            handle=".handle__element--drag"
            :animation="150"
            :list="elementData.contents"
            :group="{ name: 'instruction-element', put: (toSortable, fromSortable, draggedElement) => topLevelContainerFilter(toSortable, fromSortable, draggedElement) }"
        >
            <template v-for="(element, index) in elementData.contents">
                <InstructionContainer
                    v-if="element.type === 0"
                    :key="index + '-' + element.type"
                    :elementData="element"
                    :class="isEditMode && 'handle__element--drag'"
                    :isEditMode="isEditMode"
                ></InstructionContainer>
                <div class="element__draggable__container" v-else-if="element.type === 1" :key="index + '-' + element.type">
                    <div v-if="isEditMode" class="handle__component handle__element--drag"></div>

                    <NotesElement :elementData="element" :isEditMode="isEditMode" />
                </div>
                <div class="element__draggable__container" v-else-if="element.type === 2" :key="index + '-' + element.type">
                    <div v-if="isEditMode" class="handle__component handle__element--drag"></div>

                    <OrderedListElement :elementData="element" :isEditMode="isEditMode" />
                </div>
                <div class="element__draggable__container" v-else-if="element.type === 3" :key="index + '-' + element.type">
                    <div v-if="isEditMode" class="handle__component handle__element--drag"></div>

                    <UnorderedListElement :elementData="element" :isEditMode="isEditMode" />
                </div>
                <p
                    v-else
                    :key="index + '-' + element.type"
                    :class="isEditMode && 'handle__element--drag'"
                >
                    Something has gone horribly wrong! Type
                    {{ element.type }} is invalid!
                </p>
            </template>

            <!-- Empty List Placeholder -->  
            <div class="element__draggable__container empty--phantom">
                <p class="element__text text--grey" key="phantom-text">This Container is Empty</p>
            </div>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import NotesElement from './NotesElement';
import OrderedListElement from './OrderedListElement';
import UnorderedListElement from './UnorderedListElement';

export default {
    name: 'InstructionContainer',
    props: {
        elementData: Object,
        top_level: Boolean,
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    components: {
        draggable,
        NotesElement,
        OrderedListElement,
        UnorderedListElement
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
        topLevelContainerFilter(toSortable, fromSortable, draggedElement) {
            let isElement = (fromSortable.options.group.name==='instruction-element');
            let notContainerOrTopLevel = (toSortable.el.classList.contains('top__level') || !draggedElement.classList.contains('instruction__container'));
            return isElement && notContainerOrTopLevel;
        }
    }
};
</script>

<style lang="scss">
    @import './InstructionElements.scss';
</style>
