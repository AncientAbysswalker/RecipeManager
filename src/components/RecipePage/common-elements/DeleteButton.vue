<template>
    <div class="delete__button--circle" tabindex="0" ref="button" @click="activateButton" @blur="deactivateButton">
        <div class="anchor">
            <div class="delete__button--bar1" ref="bar1"></div>
            <div class="delete__button--bar2" ref="bar2"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeleteButton',
    created() {
        this.ActivatedState = {
            INACTIVE: 0,
            ACTIVATING: 1,
            ACTIVE: 2,
            DEACTIVATING: 3
        };
    },
    data() {
        return {
            // Initialized to zero to begin
            currentActivatedState: 0
        }
    },
    methods: {
        // Handle button activations/clicks
        activateButton() {
            let buttonElement = this.$refs.button;

            switch (this.currentActivatedState) {
                // Transition from resting state to active state
                case this.ActivatedState.INACTIVE:
                    buttonElement.classList.remove("notransition") // Reinstate transitions if necessary
                    this.currentActivatedState = this.ActivatedState.ACTIVATING;
                    buttonElement.classList.add("delete__button--activated");
                    setTimeout(() => {
                        if (this.currentActivatedState === this.ActivatedState.ACTIVATING) { // Can only transition into active state if we are activating
                            this.currentActivatedState = this.ActivatedState.ACTIVE 
                        }}, 500);
                    break;
                // If in active state, emit deletion event
                case this.ActivatedState.ACTIVE:
                    buttonElement.classList.add("notransition"); // Kill transition due to vue uid problems for duplicate data
                    this.$emit('delete-component');
                    this.deactivateButton();
                    break;
            }
        },
        // Handle button deactivation
        deactivateButton() {
            let buttonElement = this.$refs.button;
            
            this.currentActivatedState = this.ActivatedState.DEACTIVATING;
            buttonElement.classList.remove("delete__button--activated");
            setTimeout(() => this.currentActivatedState = this.ActivatedState.INACTIVE, 500);
        }
    }
};
</script>

<style lang="scss" scoped>
    .anchor { /* Make the anchor of a floating element */
        position: relative;
    }

    .delete__button--circle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 1.5rem;
        background-color: red;
        border: 2px #cccccc solid;
        outline: none;
    }
    .delete__button--bar1,
    .delete__button--bar2 {
        position: absolute; top: -1.5px; left: -0.5rem;
        width: 1rem;
        height: 3px;
        border-radius: 1.5em;
        background-color: #cccccc;

        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
        // -webkit-transform-origin: 50% 50%;
        // -moz-transform-origin: 50% 50%;
        // -ms-transform-origin: 50% 50%;
        // -o-transform-origin: 50% 50%;
        // transform-origin: 50% 50%;

        -webkit-transition: 500ms ease all;
        -moz-transition: 500ms ease all;
        -o-transition: 500ms ease all;
        transition: 500ms ease all;
    }
    .delete__button--activated .delete__button--bar1 {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
    }
    .delete__button--activated .delete__button--bar2 {
        -webkit-transform: rotate(135deg);
        -moz-transform: rotate(135deg);
        -ms-transform: rotate(135deg);
        -o-transform: rotate(135deg);
        transform: rotate(135deg);
    }

    .notransition * {
        -o-transition: none !important;
        -ms-transition: none !important;
        -moz-transition: none !important;
        -webkit-transition: none !important;
        transition: none !important;
    }
</style>