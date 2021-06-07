<template>
    <div class="anchor">
        <draggable
            class="dragArea"
            dragClass="sortable-drag"
            handle=".handle__list--drag"
            filter=".handle__list--no--drag"
            :animation="150"
            :list="elementData.ingredients"
            :group="{ name: 'instruction-list' }"
        >
            <div
                class="anchor minus"
                v-for="(ingredient, index) in elementData.ingredients"
                :key="'ol' + index"
            >
                <!-- Drag Handle -->
                <div v-if="isEditMode" class="handle__ingredient__list--flexbox handle__list--drag"><div class="handle__list--drag handle__ingredient__list--circle"></div></div>

                <!-- Delete Button -->
                <DeleteButton v-if="isEditMode" class="ingredient__list--deletor" @delete-component="() => deleteListItem(index)" />

                <!-- Quantity -->
                <input class="ingredient__list--quantity element__text" :disabled="!isEditMode" v-model="elementData.ingredients[index].quantity" :placeholder="isEditMode ? 'qty' : ''" />

                <!-- Unit 
                <input class="element__text ingredient__list--unit" :disabled="!isEditMode" v-model="elementData.ingredients[index].unit" :placeholder="isEditMode ? 'unit' : ''" />-->
                <select ref="select" class="element__text ingredient__list--unit" :class="elementData.ingredients[index].unit === '' ? 'lgr' : ''" :placeholder="isEditMode ? 'unit' : ''" :disabled="!isEditMode" v-model="elementData.ingredients[index].unit">
                    <option class="red" value="" disabled selected hidden>unit</option>
                    <option v-for="option in unitOptions" :value="option.unit" :key="option.unit">
                        {{ option.unit }}
                    </option>
                </select>

                <!-- Name -->
                <input class="element__text ingredient__list--name" :disabled="!isEditMode" v-model="elementData.ingredients[index].name" :placeholder="isEditMode ? 'name' : ''" />
            </div>

            <!-- Empty List Placeholder -->  
            <p class="element__text text--grey empty--phantom" key="phantom-text">This Numbered List is Empty</p>
        </draggable>

        <!-- Add Button -->
        <AddButton v-if="isEditMode" class="ingredient__list--adder .handle__list--no--drag" @add-component="addToList" />
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import AddButton from '../common-elements/AddButton';
import DeleteButton from '../common-elements/DeleteButton';

export default {
    name: 'OrderedListElement',
    props: {
        isEditMode: {
            type: Boolean,
            default: false
        },
        elementData: Object
    },
    data: () => ({
        unitOptions: [
            {fullName: 'Cup', unit: 'cup'},
            {fullName: 'Teaspoon', unit: 'tsp'},
            {fullName: 'Tablespoon', unit: 'tbsp'},
            {fullName: 'Millilitre', unit: 'ml'},
            {fullName: 'Ounce', unit: 'oz'},
            {fullName: 'Fluid Ounce', unit: 'floz'},
        ]
    }),
    components: {
        draggable,
        AddButton,
        DeleteButton
    },
    methods: {
        addToList() {
            this.elementData.ingredients.push({name: '', quantity: '', unit: ''});
        },
        deleteListItem(index) {
            this.elementData.ingredients.splice(index, 1);
        }
    }
};
</script>

<style lang="scss">
    @import './IngredientElements.scss';
</style>