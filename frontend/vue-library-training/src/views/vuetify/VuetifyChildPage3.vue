<template>
  <div class="container">
    <v-flex class="container__body">
       <v-card height="600px" flat>
        <template>
          <div class="headline text-xs-center pa-5">
            {{ title + `${selectedTab+1}` }}
            <v-flex style="margin: 16px;" v-if="selectedTab===0">
              <!--  bottomNavigationTab1のフォームを表示 -->
              <v-text-field
                v-model="bottomNaviData0.name"
                label="名前"
                outline
                placeholder="名前"/>
              <v-text-field
                v-model="bottomNaviData0.age"
                label="年齢"
                outline
                type="number"
                placeholder="年齢"/>
              <v-btn
                color="blue"
                class="white--text"
                @click="onClickTab0Btn">
                表示
              </v-btn>
            </v-flex>
            <v-flex style="margin: 16px;" v-else-if="selectedTab===1">
              <!-- bottomNavigationTab2のフォームを表示 -->
              <!-- https://vuetifyjs.com/en/components/tabs -->
              <!--MenuTabの上部 -->
              <v-tabs
                slot="extension"
                v-model="bottomNaviData1.model"
                centered
                color="cyan"
                slider-color="yellow">
                <v-tab v-for="index in 3" :key="index" :href="`#tab-${index}`" class="white--text">
                  メニュー {{ index }}
                </v-tab>
              </v-tabs>
              <!--MenuTabの内容 -->
              <v-tabs-items v-model="bottomNaviData1.model">
                <v-tab-item v-for="index in 3" :key="index" :value="`tab-${index}`">
                  <!--indexに応じて内容を変える -->
                  <v-card flat>
                    <v-card-text v-text="bottomNaviData1.text + index"/>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-flex>
            <v-flex style="margin: 16px;" v-else>
              <!-- bottomNavigationTab3のフォームを表示 -->
            </v-flex>
          </div>
        </template>
        <!-- https://vuetifyjs.com/en/components/bottom-navigation -->
        <v-bottom-nav
          :value="true"
          absolute
          color="transparent">
          <v-btn
            color="teal"
            flat
            value="recent"
            @click="onClickTab(0)">
            <span>タブ1</span>
            <v-icon>history</v-icon>
          </v-btn>
          <v-btn
            color="teal"
            flat
            value="favorites"
            @click="onClickTab(1)">
            <span>タブ2</span>
            <v-icon>favorite</v-icon>
          </v-btn>
          <v-btn
            color="teal"
            flat
            value="nearby"
            @click="onClickTab(2)">
            <span>タブ3</span>
            <v-icon>place</v-icon>
          </v-btn>
        </v-bottom-nav>
        <!-- https://vuetifyjs.com/en/components/snackbars -->
        <v-snackbar
          v-model="isSnackbar"
          color="blue"
          multi-line
          :timeout="timeout">
          <div v-html="snackbarText"/>
          <v-btn dark flat
            @click="isSnackbar = false">
            閉じる
          </v-btn>
        </v-snackbar>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class VuetifyChildPage3 extends Vue {
  // https://vuetifyjs.com/en/components/bottom-navigation
  // https://vuetifyjs.com/en/components/snackbars
  // https://vuetifyjs.com/en/components/tabs
  title: string = 'v-bottom-navi-tab'
  /**
   * bottom-navigation
   */
  selectedTab: number = 0
  bottomNaviData0: any = {
    name: 'ゲスト',
    age: 20,
  }
  bottomNaviData1: any = {
    model: 'tab-2',
    text: 'menu-tab',
  }
  /**
   * snakbar
   */
  isSnackbar: boolean = false
  snackbarText: string = ''
  timeout: number = 5000

  /**
   * methods
   */
  onClickTab(tab: number) {
    this.selectedTab = tab
  }
  onClickTab0Btn() {
    console.log('tabBtan')
    this.snackbarText = `名前:${this.bottomNaviData0.name}<br>年齢:${this.bottomNaviData0.age}`
    this.isSnackbar = true
  }
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