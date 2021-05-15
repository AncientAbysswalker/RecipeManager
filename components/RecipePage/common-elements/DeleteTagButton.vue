<template>
    <div class="delete__tag__button--circle" ref="tagButton" @click="activateButton">
        <div class="anchor">
            <div class="delete__tag__button--bar1" ref="bar1"></div>
            <div class="delete__tag__button--bar2" ref="bar2"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeleteTagButton',
    methods: {
        // Handle button activation
        activateButton() {
            let buttonElement = this.$refs.tagButton;

            if (!buttonElement.classList.contains("hide")) {
                this.$emit('delete-component');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    .anchor { /* Make the anchor of a floating element */
        position: relative;
    }

    .delete__tag__button--circle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1rem !important; // Not sure what is conflicting to make this required
        height: 1rem !important; // Not sure what is conflicting to make this required
        border-radius: 1rem;
        background-color: white;
        border: 2px #aaaaaa solid;
        outline: none;
    }
    .delete__tag__button--bar1,
    .delete__tag__button--bar2 {
        position: absolute; top: -1.5px; left: -0.25rem;
        width: 0.5rem;
        height: 3px;
        border-radius: 1.5em;
        background-color: black;
    }
    .delete__tag__button--bar1 {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
    }
    .delete__tag__button--bar2 {
        -webkit-transform: rotate(135deg);
        -moz-transform: rotate(135deg);
        -ms-transform: rotate(135deg);
        -o-transform: rotate(135deg);
        transform: rotate(135deg);
    }
</style>