<template>
  <article class="card">
    <router-link :to="'/recipe/' + this.item._id">
      <div class="card-header" v-if="this.item.name">
        <span>{{ this.item.name }}</span>
      </div>
      <div class="card-body">
        <v-img
          :aspect-ratio="16 / 9"
          :lazy-src="require(`@/static/loading.gif`)"
          :width="'100%'"
          :src="
            this.broken_image
              ? require(`@/static/card_error.png`)
              : this.item.images.length > 0
              ? `${services.url_cdn}/${this.item.images[0]}`
              : require(`@/static/card_default.png`)
          "
          @error="setBrokenImage"
        />
      </div>
      <div class="card-footer"></div>
    </router-link>
  </article>
</template>

<script>
import axios from "axios";
const services = require("@/helpers/services");

export default {
  name: "RecipeCard",
  props: ["todo", "item", "record"],
  data: () => ({ services: services, broken_image: false }),
  methods: {
    setBrokenImage() {
      this.broken_image = true;
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  border: 2px #e0e0e0 solid;
}
@supports (display: grid) {
  .card {
    display: grid;
  }
}
.card a:hover {
  text-decoration: none;
}
.card a:not(:hover) {
  text-decoration: none;
}
.card:hover {
  background-color: #eef8fc;
}
.card-header,
.card-body,
.card-footer {
  display: flex;
  flex-grow: 1;
  flex-basis: 100%;
}
@supports (display: grid) {
  .card-header,
  .card-body,
  .card-footer {
    display: grid;
  }
}
.card-header {
  display: flex;
  position: relative;
  font-size: 1.6vw;
  font-weight: bold;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 2px #e0e0e0 solid;
}
.card-header span {
  font-size: 1.6vw;
  white-space: nowrap;
  overflow: hidden;
}
@supports (display: grid) {
  .card-header {
    display: grid;
  }
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
