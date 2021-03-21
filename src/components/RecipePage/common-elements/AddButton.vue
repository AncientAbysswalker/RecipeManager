<template>
    <div class="add__button--circle" tabindex="0" ref="button" @click="activateButton" @animationend="resetAnimation">
        <div class="anchor">
            <div class="add__button--bar1" ref="bar1"></div>
            <div class="add__button--bar2" ref="bar2"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddButton',
    created() {
        this.ActivatedState = {
            INACTIVE: 0,
            PULSING: 1
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
            let buttonElement = this.$refs.button.classList;

            switch (this.currentActivatedState) {
                // Only add if animation is inactive
                case this.ActivatedState.INACTIVE:
                    buttonElement.add("add__button--pulse");
                    this.$emit('add-component');

                    this.currentActivatedState = this.ActivatedState.PULSING;
                    break;
            }
        },
        resetAnimation() {
            let buttonElement = this.$refs.button;
            buttonElement.classList.remove("add__button--pulse");

            this.currentActivatedState = this.ActivatedState.INACTIVE;
        }
    }
};
</script>

<style lang="scss" scoped>
    .anchor { /* Make the anchor of a floating element */
        position: relative;
    }

    .add__button--circle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 1.5rem;
        background-color: #1976D2;
        border: 2px #cccccc solid;
        outline: none;
    }

    .add__button--bar1 {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    .add__button--bar2 {
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
    }

    .add__button--bar1,
    .add__button--bar2 {
        position: absolute; top: -1.5px; left: -0.5rem;
        width: 1rem;
        height: 3px;
        border-radius: 1.5em;
        background-color: #cccccc;
    }

    // Pulse Animation
    .add__button--pulse{
        animation: pulse 0.5s;
    }
    .add__button--pulse .add__button--bar1{
        animation: pulse--bar1 0.5s;
    }
    .add__button--pulse .add__button--bar2 {
        animation: pulse--bar2 0.5s;
    }
    @keyframes pulse--bar1 {
        0% {
            -webkit-transform: scale(1) rotate(0deg);
            -moz-transform: scale(1) rotate(0deg);
            -ms-transform: scale(1) rotate(0deg);
            -o-transform: scale(1) rotate(0deg);
            transform: scale(1) rotate(0deg);
        }

        50% {
            -webkit-transform: scale(0.8) rotate(0deg);
            -moz-transform: scale(0.8) rotate(0deg);
            -ms-transform: scale(0.8) rotate(0deg);
            -o-transform: scale(0.8) rotate(0deg);
            transform: scale(0.8) rotate(0deg);
        }

        100% {
            -webkit-transform: scale(1) rotate(0deg);
            -moz-transform: scale(1) rotate(0deg);
            -ms-transform: scale(1) rotate(0deg);
            -o-transform: scale(1) rotate(0deg);
            transform: scale(1) rotate(0deg);
        }
    }
    @keyframes pulse--bar2 {
        0% {
            -webkit-transform: scale(1) rotate(90deg);
            -moz-transform: scale(1) rotate(90deg);
            -ms-transform: scale(1) rotate(90deg);
            -o-transform: scale(1) rotate(90deg);
            transform: scale(1) rotate(90deg);
        }

        50% {
            -webkit-transform: scale(0.8) rotate(90deg);
            -moz-transform: scale(0.8) rotate(90deg);
            -ms-transform: scale(0.8) rotate(90deg);
            -o-transform: scale(0.8) rotate(90deg);
            transform: scale(0.8) rotate(90deg);
        }

        100% {
            -webkit-transform: scale(1) rotate(90deg);
            -moz-transform: scale(1) rotate(90deg);
            -ms-transform: scale(1) rotate(90deg);
            -o-transform: scale(1) rotate(90deg);
            transform: scale(1) rotate(90deg);
        }
    }
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
        }

        70% {
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
    }
</style>