<template>
    <TextareaAutosize
        :disabled="!isEditMode"
        rows="1"
        class="element__text"
        v-model="elementData.text"
        placeholder="Notes Section Text"
    />
</template>

<script>
export default {
    name: 'NotesElement',
    props: {
        isEditMode: {
            type: Boolean,
            default: false
        },
        elementData: Object
    }
};
</script>
