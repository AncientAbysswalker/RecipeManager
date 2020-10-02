<template>
  <div class="card">
    <div class="card__head">
      <div class="card__title" v-if="this.item.name">
        <a href="#">{{ this.item.name }}</a>
      </div>

      <div class="card__group" v-if="this.item.group">
        <a href="#">{{ this.item.group }}</a>
      </div>
      <div class="card__bookmark">
        <a
          href="#"
          :class="{ bookmarked: this.item.isBookmarked }"
          @click="toggleBookmark(item, index)"
        >
          <svg
            class="ico"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M21 24l-9-9-9 9V2.2C3 1 4 0 5.2 0h13.6C20 0 21 1 21 2.2V24z"
            />
          </svg>
        </a>
      </div>
    </div>
    <div class="card__body">
      <ul class="card__featw">
        <li v-for="value in this.item.features" v-bind:key="value">
          <span>{{ value }}</span>
        </li>
      </ul>

      <router-link :to="'/recipe/' + this.item._id">
        <img
          v-bind:src="
            `http://www.raviole.cerberus-heuristics.com/images/${this.item.images[0]}` ||
              'https://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png'
          "
          @error="imgPlaceholder"
        />
      </router-link>
      <!-- +
                this.item.image[0] -->

      <!-- <img
        src="https://www.justonecookbook.com/wp-content/uploads/2020/01/Sushi-Rolls-Maki-Sushi-%E2%80%93-Hosomaki-1117-I.jpg"
        alt="Example image"
      />-->
    </div>
    <div class="card__foot">
      <div class="card__loc" v-if="this.item.loc">
        <i class="ico">
          <svg
            class="ico"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            focusable="false"
          >
            <path
              fill="#ccc"
              d="M12 0C7.3 0 3.4 3.8 3.4 8.4 3.4 14.7 12 24 12 24s8.6-9.3 8.6-15.6C20.6 3.8 16.7 0 12 0zm0 11.4c-1.7 0-3-1.3-3-3 0-1.6 1.3-3 3-3s3 1.4 3 3c0 1.7-1.3 3-3 3z"
            />
          </svg>
        </i>
        <a href="#">{{ this.item.loc }}</a>
      </div>
      <div class="card__price" v-if="this.item.price">
        <svg
          class="ico"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          focusable="false"
        >
          <path
            fill="#ccc"
            d="M11.6 17.7v1.8H13v-1.8c.3 0 .6-.1.9-.2.5-.1 1-.3 1.4-.6.4-.3.8-.7 1-1.1.3-.5.4-1 .4-1.6 0-.3 0-.6-.1-.9-.1-.3-.2-.6-.4-.8-.2-.3-.4-.5-.7-.7-.3-.2-.6-.4-1-.5-.2-.1-.5-.1-.7-.2-.8-.2-1.7-.4-2.5-.7-.4-.1-.7-.3-1-.5-.3-.2-.4-.5-.4-.9 0-.3.1-.5.2-.7.1-.2.3-.3.5-.5.2-.1.4-.2.7-.2.2 0 .5-.1.7-.1.7 0 1.3.1 1.7.5.4.3.7 1.5.7 1.5h2c0-.6-.1-1.1-.3-1.6-.2-.4-.5-.8-.9-1.1-.4-.3-.9-.5-1.4-.7-.3-.1-.6-.1-.8-.2V4.5h-1.4v1.4c-.3 0-.7.1-1 .2-.5.1-.9.3-1.3.6s-.7.6-.9 1c-.4.4-.5.9-.5 1.5 0 .3 0 .6.1.9.1.3.2.6.4.8.2.3.4.5.8.7.3.2.7.4 1.2.5.8.2 1.4.4 2 .5.5.1 1 .3 1.4.4.2.1.4.2.6.4.2.2.3.5.3 1 0 .2 0 .4-.1.6-.1.2-.2.4-.4.5-.2.2-.5.3-.7.4-.3.1-.7.1-1.1.1-.4 0-.8 0-1.1-.1-.3-.1-.6-.2-.9-.4-.3-.2-.5-.5-.6-.8-.2-.3-.2-.7-.2-1.1h-2c0 .7.1 1.3.4 1.8.3.5.6.9 1 1.3.4.3.9.6 1.5.7.3.2.7.3 1.1.3zM12 24C5.4 24 0 18.6 0 12S5.4 0 12 0s12 5.4 12 12-5.4 12-12 12z"
          />
        </svg>
        <span>{{ this.item.price }}</span>
      </div>
    </div>
    <img class="card__logo" v-if="this.item.logo" :src="this.item.logo" alt />
    <div
      class="card__more"
      v-if="this.item.timestamp"
      :title="this.item.timestamp"
    >
      {{ this.item.timestamp || moment }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RecipeCard",
  props: ["todo", "item", "record", "reqPic"],
  data: () => ({ photo: null }),
  methods: {
    markComplete() {
      this.todo.completed = !this.todo.completed;
    },
    imgPlaceholder(e) {
      e.target.src =
        "http://www.raviole.cerberus-heuristics.com/images/profile_pic-1600920645911.jpg";
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
  height: calc(width * 1.75) * 0.1w + "px";
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
