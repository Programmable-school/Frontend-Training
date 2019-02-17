<template>
  <div class="container">
    <v-flex class="container__body">
      <!-- Grid https://vuetifyjs.com/en/framework/grid -->
      <v-flex xs12 sm6 offset-sm3>
        <!-- v-card https://vuetifyjs.com/ja/components/cards -->
        <v-card>
          <v-img class="white--text"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <h1>{{ title }}</h1>
              </v-flex>
            </v-layout>
          </v-container>
          </v-img>
          <v-card-title>
            <v-layout column>
              <h2>v-cardのタイトル</h2>
              <div>コメント コメント コメント コメント コメント コメント コメント コメント</div>
            </v-layout>
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="blue" @click="onClick">ダイアログ表示</v-btn>
          </v-card-actions>
          <v-card-title>
            {{ dialogResult }}
          </v-card-title>
        </v-card>
      </v-flex>
    </v-flex>
    <!-- Dialog https://vuetifyjs.com/en/components/dialogs -->
    <v-dialog
      v-model="isDialog"
      width="500">
      <v-card>
        <v-card-title>
          ダイアログ
        </v-card-title>
        <v-card-text>
          はい・いいえの選択肢ダイアログを表示します。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="onDialogAction(0)">
            はい
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="onDialogAction(1)">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class VuetifyChildPage1 extends Vue {
  title: string = 'v-cardサンプル'
  isDialog: boolean = false
  dialogResult: string = ''

  onClick() {
    this.isDialog = true
  }

  onDialogAction(selectedId: number) {
    this.isDialog = false
    if (selectedId === 0) {
      this.dialogResult = '「はい」が選択されました。'
    } else {
      this.dialogResult = '「いいえ」が選択されました。'
    }
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