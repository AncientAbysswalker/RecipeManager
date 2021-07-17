<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <span>{{ titleText }}</span>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalDialog',
  props: {
    titleText: {
      type: String,
      default: ''
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 10px;
}

.modal-header {
  margin-top: 0;
  width: 100%;
  border-bottom: 2px solid #B29A30;
  color: #B29A30;
  font-weight: bold;
}

.modal-footer {
  display: flex;

  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.modal-body {
  margin: 20px 0;
}

button {
  background-color: #FFF1B3;
  color: #B29A30;
  border: none;
  border-radius: 100px;

  padding: 5px 15px 5px 15px;
  margin: 5px 15px 5px 15px;

  text-align: center;
  text-decoration: none;
  
  font-size: 16px;
  font-weight: bold;
}

input {
  width: 100%;

  color: #B29A30 !important;
  border: #B29A30 2px solid;
  border-radius: 5px;

  padding: 5px 15px 5px 15px !important;
  
  font-size: 16px;
}
input::placeholder {
  color: #B29A30;
}
input:focus {
  outline: none;
  color: #B29A30;
}

</style>