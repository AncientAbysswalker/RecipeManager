# RaviOlé
> Recipe Management Application
![Logo](https://raw.githubusercontent.com/AncientAbysswalker/RecipeManager/master/readme/logo.png)

## Application
The working web app can be accessed [here](http://app.raviole.cerberus-heuristics.com).

## Purpose
I do a fair amount of cooking in my free time, and part of that includes looking through various websites for recipes to make. Seeing so many different websites made me interested in what is involved in making such an application, and made me want to try implementing one to learn some new technologies.

## Implementation

Through the process of implementation several technologies were selected to address the frontend and backend needs of the application - primarily geared towards the storage/serving of data and displaying the data.

#### Backend

The backend data storage is handled by a non-relational database (MongoDB). A non-relational database was chosen to provide practice with the technology and because the structure of recipes is better handled by the object structure of MongoDB than a standard SQL solution.

In order to handle the data serving, an API is provided. The API is written in ExpressJS, and the documentation is provided [here](http://raviole.cerberus-heuristics.com/documentation/).

#### Frontend

The frontend is written in VueJS. Minimal libraries are used, in order to focus on learning the framework. I tried to make the interface for the ingredients and instructions look a bit like cue cards, as I thought this was a nice look.

![Cue Card](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/card_view.png)

## Features

#### Account and Login
Most features of this application, such as creating your own recipes, require a user login. The login status can be seen in the top right corner of any screen in the application.

![Login Location](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/login_location.png)

If one is not logged in, they can click on this area to either log in or create a new user login if they do not have one. If creating a new user, the username is checked to ensure that we are not trying to create a duplicate user on the database level, and it will be rejected as such if the username already exists.

![Login Page](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/login_page.png)

#### Discover Recipes

The main page of the application is the Discover page. In this page you can discover recipes made by other users and click on them to view the details. Currently this page just displays all recipes in the database, but the idea is that down the line this page would be updated and database pagination would be used to make sure that this page is not handling too much data.



#### Creating a Recipe
To create a new recipe you navigate to the Home page and click on the Add New Recipe button in the top right.

![Add Recipe Location](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/new_recipe_location.png)

This will open a new page that will allow you to enter all of the details of your recipe including images, ingredients list, instructions, and other details. With respect to the instructions, as recipe workflows can vary and I want the user to have flexibility over how they represent this, the end user has a drag-and-drop toolbox for setting up their instructions. The button to save is the floppy disk icon in the top right corner.

![Instruction Toolbox](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/instruction_toolbox.png)

#### Copying, Editing, and Favoriting a Recipe

When viewing a recipe, the options you have for interacting with that recipe are shown in the top right corner. If you are the owner of a recipe, you will be presented with the options to edit or delete your recipe.

![Options Owner](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/edit_delete.png)
 If you are not the owner of a recipe, you will be presented with the options to either save/favorite the recipe, or make a copy of the recipe - which opens the editor prepopulated with the recipe's information.

![Options Non-Owner](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/favorite_copy.png)

#### Managing Collections
Any recipes you create or save/favorite will be linked to your account, and can be viewed in the Home Page. This is all well and good, but when you have more and more recipes this can become cluttered. The application has an interface to allow you to customize collections, which can group together recipes in whatever manner the user chooses.

The current location of the applet is displayed on the main settings dialog, and the location can be updated directly.

![Collections](https://raw.githubusercontent.com/AncientAbysswalker/Elysian-Cannon/master/readme/collections.png)

## Project Status

I am no longer developing this application as I am happy with the things I have learned through this development process. There are definitely some things that I could change if I were to come back to this project, but for now that is off the table.
