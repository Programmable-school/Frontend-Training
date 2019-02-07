<template>
  <div class="container">
    <v-flex class="container__body">
      <h2>{{ title }}</h2>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class VuetifyChildPage3 extends Vue {
  // https://vuetifyjs.com/en/components/bottom-navigation
  // https://vuetifyjs.com/en/components/tabs
  // https://vuetifyjs.com/en/components/snackbars
  // https://vuetifyjs.com/en/components/ratings
  // https://vuetifyjs.com/en/components/badges
  title: string = 'VuetifyのBottomNavigationのサンプルです。'
}
</script>
<style lang="stylus">
.container
  text-align left 
  margin 0 auto
  width 100%
  &__body
    margin-top 24px

</style>