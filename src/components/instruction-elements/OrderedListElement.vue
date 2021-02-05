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
            :key="'ol' + step"
        >
            <!-- Iterator or Drag Handle -->
            <div class="element__list--iterator" v-if="!isEditMode">{{ index + 1 }}</div>
            <div v-else class="handle__list--spacer handle__list--drag">#</div>

            <!-- Delete Button -->
            <DeleteButton v-if="isEditMode" class="element__list--deletor" @delete-component="() => deleteListItem(index)" />

            <TextareaAutosize
                :disabled="!isEditMode"
                rows="1" 
                class="element__text"
                v-model="elementData.steps[index]"
                placeholder="List Item Text"
            />
        </div>

        <!-- Empty List Placeholder -->  
        <p class="element__text text--grey empty--phantom" key="phantom-text">This Numbered List is Empty</p>

        <v-btn 
            x-small
            color="primary"
            @click="addToList"
        >New</v-btn>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import DeleteButton from '../instruction-elements/DeleteButton';

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
        draggable,
        DeleteButton
    },
    methods: {
        addToList() {
            this.elementData.steps.push('');
        },
        deleteListItem(index) {
            this.elementData.steps.splice(index, 1);
        }
    }
};
</script>