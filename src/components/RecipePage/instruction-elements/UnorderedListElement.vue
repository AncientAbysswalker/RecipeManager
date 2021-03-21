<template>
    <draggable
        class="dragArea"
        dragClass="sortable-drag"
        handle=".handle__list--drag"
        :animation="150"
        :list="elementData.steps"
        :group="{ name: 'instruction-list' }"
    >
        <div
            class="anchor"
            v-for="(step, index) in elementData.steps"
            :key="'ul' + index"
        >
            <div class="element__list--iterator" v-if="!isEditMode">●</div>
            <div v-else class="handle__list--spacer"><div class="handle__list--circle handle__list--drag"></div></div>

            <TextareaAutosize
                :disabled="!isEditMode"
                rows="1" 
                class="element__text"
                v-model="elementData.steps[index]"
                placeholder="List Item Text"
            />
        </div>

        <!-- Empty List Placeholder -->  
        <p class="element__text text--grey empty--phantom" key="phantom-text">This Bullet List is Empty</p>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';

export default {
    name: 'OrderedListElement',
    props: {
        isEditMode: {
            type: Boolean,
            default: false
        },
        elementData: Object
    },
    components: {
        draggable
    }
};
</script>