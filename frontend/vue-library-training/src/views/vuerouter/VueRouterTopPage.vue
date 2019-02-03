<template>
  <div class="top">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class VueRouterTopPage extends Vue {}
</script>
<style lang="stylus">
.top
  margin 10px
</style>