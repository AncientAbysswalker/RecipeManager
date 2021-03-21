<template>
    <div
        class="minus"
        :class="
            'instruction__container anchor'
        "
    >        
        <!-- Sub-Section Title only if Master Title not already used -->
        <!-- <input v-if="!this.top_level && (elementData.title!=='' || isEditMode)" class="element__title" :disabled="!isEditMode" v-model="elementData.title" placeholder="Sub-Section Title" /> -->

        <draggable
            class="dragArea"
            dragClass="sortable-drag"
            filter=".no-drag"
            ghostClass="ghostElement"
            handle=".handle__element--drag"
            :animation="150"
            :list="elementData.contents"
            :group="{ name: 'instruction-element', put: (toSortable, fromSortable, draggedElement) => topLevelContainerFilter(toSortable, fromSortable, draggedElement) }"
        >
            <template v-for="(ingredient, index) in elementData.ingredients">
                <div class="element__draggable__container" :key="index + '-' + ingredient.name">
                    <div v-if="isEditMode" class="handle__component handle__element--drag"></div>

                    <IngredientElement :ingredientData="ingredient" :isEditMode="isEditMode" />
                </div>
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
import IngredientElement from './IngredientElement';

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
        IngredientElement
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
