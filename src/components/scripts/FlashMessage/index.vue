<template lang="pug">
  #message(:class="classType")
    p {{ message.text }}

</template>

<style lang="scss" scoped>
  #message {
    font-size: .9rem;
    font-weight: bold;
    width: 100%;
    text-align: center;
    padding: .75rem 0;
    color: #fff;
  }
  .error-message {
    background-color: #ad0000;
  }
  .success-message {
    background-color: #28ad60;
  }
</style>

<script src="./index.js"></script>
