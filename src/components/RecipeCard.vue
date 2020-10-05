<template>
  <div class="card">
    <div class="card__head">
      <div class="card__title" v-if="this.item.name">
        <a href="#">{{ this.item.name }}</a>
      </div>
    </div>
    <div class="card__body">
      <router-link :to="'/recipe/' + this.item._id">
        <img
          v-bind:src="
            (this.item.images.length > 0
              ? `${this.services.url_cdn}/${this.item.images[0]}`
              : require(`@/static/card_default.png`)) ||
            require(`@/static/card_loading.png`)
          "
          @error="imgPlaceholder"
        />
      </router-link>
    </div>
    <div class="card__foot"></div>
  </div>
</template>

<script>
import axios from "axios";
const services = require("@/helpers/services");

export default {
  name: "RecipeCard",
  props: ["todo", "item", "record", "reqPic"],
  data: () => ({ photo: null, services: services }),
  methods: {
    markComplete() {
      this.todo.completed = !this.todo.completed;
    },
    imgPlaceholder(e) {
      e.target.src = require(`@/static/card_error.png`);
    },
  },
  created() {
    this.photo = this.reqPic;
    //   axios
    //     .get(this.reqPic)
    //     .then((res) => (this.photo = res.data))
    //     .catch((err) => console.log(err));
  },
};
</script>

<style scoped>
img {
  object-fit: cover;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

@supports (--css: variables) {
  :root {
    --space: 12px;
    --space-s: calc(var(--space) / 2);
    --space-xs: calc(var(--space-s) / 2);
    --space-l: calc(var(--space) * 2);
    --space-xl: calc(var(--space-l) * 2);
    --space-: -12px;
    --space-s-: calc(var(--space-) / 2);
    --space-xs-: calc(var(--space-s-) / 2);
    --space-l-: calc(var(--space-) * 2);
    --space-xl-: calc(var(--space-l-) * 2);
    --card-gaps: 0;
    --card-shadow-grow: 0;
    --card-shadow-opac: 0;
  }
  .db {
    --candi: #0c4b85;
    --hirer: #0e7e8b;
    --cta: #ff9000;
  }
  .js {
    --candi: #1c3f94;
    --hirer: #1b953e;
    --cta: #fff200;
  }
  p {
    margin: var(--space) var(--space) var(--space-s);
  }
}
*,
::before,
::after {
  box-sizing: inherit;
}
html {
  box-sizing: border-box;
}
body {
  background-color: #f8f8fa;
  margin: 0;
}
html,
button,
input,
select,
textarea {
  font-family: "Muli", Helvetica, Arial, sans-serif;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  margin-left: var(--space-s-);
  margin-right: var(--space-s-);
  padding: var(--card-gaps);
  align-items: start;
  transition: all 0.3s;
}
@supports (display: grid) {
  .cards {
    display: grid;
  }
}
.cards > * {
  flex: 1 0 300px;
  margin-left: var(--space-s);
  margin-right: var(--space-s);
}
@supports (display: grid) {
  .cards {
    grid-gap: var(--card-gaps);
    margin: 0;
  }
  .cards > * {
    margin: 0;
  }
}
.cards--column > * {
  max-width: 500px;
}
@supports (display: grid) {
  .cards--column {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
.cards--packed {
  --card-gaps: 0;
}
.cards--packed .card {
  --card-shadow-grow: 0;
  --card-shadow-opac: 0;
}
.cards--packed .card:not(:last-child) {
  border-bottom: 1px solid #ccc;
}
.card {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;

  /* border-bottom: 0 solid transparent; */
  border: 2px red solid;
  /* filter: drop-shadow(
    0 0 var(--card-shadow-grow) rgba(0, 0, 0, var(--card-shadow-opac))
  ); */
  font-size: 12px;
  line-height: 20px;
  padding: var(--space) calc(var(--space) * 4 / 3);
  transition: all 0.3s;
}
@supports (display: grid) {
  .card {
    display: grid;
  }
}
.card:hover,
.card:hover * {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E@keyframes marching-ants {to {stroke-dashoffset: -15px;}}%3C\/style%3E%3Crect width='100%' height='100%' style='stroke:rgba(0,0,0,.3); stroke-width: 1px; fill: none;stroke-dasharray: 10px 5px; animation: marching-ants 1s infinite'/%3E%3C/svg%3E");
}
.card a:not(:hover) {
  text-decoration: none;
}
.card:hover {
  background-color: #eef8fc;
}
@supports (display: grid) {
  .card {
    grid-gap: var(--space-s);
    grid-template-areas: "ghead ghead" "gbody gbody" "gfoot glogo" "gmore gmore";
    grid-template-columns: 1fr 120px;
  }
}
.card--data1 {
  grid-template-areas: "ghead ghead" "gbody gbody" "gfoot glogo" "gmore gmore";
}
.card--data2 {
  grid-template-areas: "ghead ghead" "gbody gbody" "gfoot glogo" "gmore gmore";
}
.card--data3 {
  grid-template-areas: "ghead ghead" "gbody gbody" "gfoot glogo" "gmore gmore";
}
.card--data4 {
  grid-template-areas: "ghead ghead" "gbody gbody" "gfoot glogo" "gmore gmore";
}
.card--data5 {
  grid-template-areas: "ghead ghead" "gbody gbody" "gfoot glogo" "gmore gmore";
}
.card--data6 {
  grid-template-areas: "ghead ghead" "gbody gbody" "gfoot glogo" "gmore gmore";
}
.card__head,
.card__body,
.card__foot {
  display: flex;
  flex-grow: 1;
  flex-basis: 100%;
}
@supports (display: grid) {
  .card__head,
  .card__body,
  .card__foot {
    display: grid;
  }
}
@supports (display: grid) {
  .card__head,
  .card__body,
  .card__foot {
    grid-gap: var(--space-xs);
  }
}
.card__head {
  display: flex;
  position: relative;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
@supports (display: grid) {
  .card__head {
    display: grid;
  }
}
@supports (display: grid) {
  .card__head {
    grid-template-columns: 1fr 40px;
    grid-template-areas: "gtitle gbookmark" "ggroup gbookmark";
    grid-area: ghead;
  }
}
.card__body {
  grid-area: gbody;
  flex-wrap: wrap;
}
.card__foot {
  grid-area: gfoot;
  line-height: 16px;
  align-items: end;
}
.card__more {
  grid-area: gmore;
}
.card__title {
  flex-grow: 9999;
  flex-basis: 100%;
  grid-area: gtitle;
}
.card__title a {
  color: #298eb9;
}
@media (min-width: 768px) {
  .card__title a {
    font-size: 16px;
  }
}
.card__group {
  grid-area: ggroup;
}
.card__group a {
  color: #333;
}
.card__feat {
  color: #999;
  padding-left: 1.4em;
  margin: 0;
}
.card__feat span {
  color: #333;
}
.card__loc,
.card__price {
  display: flex;
  align-self: start;
}
.card__loc a,
.card__price a,
.card__loc span,
.card__price span {
  color: #333;
  flex: 1;
}
.card__loc .ico,
.card__price .ico {
  color: #ccc;
  flex-shrink: 0;
  padding-left: 0;
  width: 16px;
  height: 16px;
}
.card__loc .ico:first-child,
.card__price .ico:first-child {
  margin-right: 4px;
}
.bookmarked {
  color: #333;
}
.bookmarked:before {
  color: #333;
}
.card__bookmark {
  flex-basis: 40px;
  grid-area: gbookmark;
}
.card__bookmark a {
  color: #ccc;
  width: 40px;
  height: 40px;
  position: relative;
  display: block;
  border: 1px dashed #ccc;
}
.card__bookmark a.bookmarked {
  color: #999;
}
@supports (display: grid) {
  .card__bookmark {
    position: static;
    z-index: 0;
    top: 0;
    right: 0;
  }
  .card__bookmark a {
    transform: translate(12px, -8px);
    border-color: transparent;
  }
}
.card__bookmark .ico {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
}
.card__logo {
  flex-basis: 120px;
  align-self: end;
  justify-items: end;
  grid-area: glogo;
  width: 100%;
  height: auto;
  vertical-align: bottom;
  /* filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3)); */
}
.card__loc {
  grid-column: 1;
  grid-row: 1;
}
.ico {
  position: relative;
}
@media (max-width: 339.95px) {
  .card:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
}
@media (min-width: 340px) {
  :root {
    --card-shadow-grow: 1rem;
    --card-shadow-opac: 0.1;
    --card-gaps: 16px;
  }
  .card {
    margin-bottom: 16px;
  }
  @supports (display: grid) {
    .card {
      margin-bottom: 0;
    }
  }
}
/* utility class */
.ants,
.ants-on-hover:hover {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E@keyframes marching-ants {to {stroke-dashoffset: -15px;}}%3C\/style%3E%3Crect width='100%' height='100%' style='stroke:rgba(0,0,0,.3); stroke-width: 1px; fill: none;stroke-dasharray: 10px 5px; animation: marching-ants 1s infinite'/%3E%3C/svg%3E");
}
.colored .grid {
  background-color: #fcc;
}
.colored .grid .grid {
  background-color: #fc9;
}
.colored .grid .grid .grid {
  background-color: #ff9;
}
.colored .grid .grid .grid .grid {
  background-color: #ffc;
}
@supports (display: grid) {
  .colored .grid {
    background-color: #cff;
  }
  .colored .grid .grid {
    background-color: #cfc;
  }
  .colored .grid .grid .grid {
    background-color: #cf9;
  }
  .colored .grid .grid .grid .grid {
    background-color: #cc9;
  }
}
/*!
 * https://webdesign.tutsplus.com/tutorials/how-to-create-a-sticky-floating-video-on-page-scroll--cms-28342
 * Probably can use it as bookmarked job tray
 */
#featured {
  transition: width 0.2s ease-in-out, height 0.2s ease-in-out,
    transform 0.38s ease-in-out;
}
#featured.is-stikcy {
  position: fixed;
  top: 15px;
  right: auto;
  max-width: 280px;
  max-height: 158px;
  width: 280px;
  height: 158px;
}
@media (min-width: 1120px) {
  #featured.is-stikcy {
    transform: translateX(-80%);
  }
}
@media (min-width: 1300px) {
  #featured.is-stikcy {
    transform: translateX(-115%);
  }
}
</style>
