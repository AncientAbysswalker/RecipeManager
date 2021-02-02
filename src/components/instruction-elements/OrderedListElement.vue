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
            :key="'ol' + index"
        >
            <div class="element__list--iterator" v-if="!isEditMode">{{ index + 1 }}</div>
            <div v-else class="handle__list--spacer handle__list--drag">#</div>

            <TextareaAutosize
                :disabled="!isEditMode"
                rows="1" 
                class="element__text"
                v-model="elementData.steps[index]"
                placeholder="List Item Text"
            />
        </div>

        <v-btn 
            x-small
            color="primary"
            @click="() => addToList(elementData.steps)"
        >New</v-btn>

        <!-- Empty List Placeholder -->  
        <p class="element__text text--grey empty--phantom" key="phantom-text">This Numbered List is Empty</p>
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
    },
    methods: {
        addToList(steps){
            console.log(steps)
            steps.push('');
        }
    }
};
</script>