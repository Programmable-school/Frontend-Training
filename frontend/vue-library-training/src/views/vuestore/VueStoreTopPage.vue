<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="container">
        <v-flex>
          <h2>{{ title }}</h2>
          <v-flex style="margin: 24px;">
            <h3>commitで実行（こちら推奨）</h3>
            <v-flex style="margin-top: 12px;">
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                color="green"
                class="white--text"
                @click="onClickLoading(true)">
                Loading Start
              </v-btn>
              <v-btn
                color="red"
                class="white--text"
                @click="onClickLoading(false)">
                Loading Stop
              </v-btn>
            </v-flex>
            <v-flex style="margin-top: 12px;">
              <v-btn
                color="blue"
                class="white--text"
                @click="onClickSuccess">
                Success
              </v-btn>
              <v-btn
                color="red"
                class="white--text"
                @click="onClickError">
                Error
              </v-btn>
              <v-btn
                color="gray"
                @click="onClickClear">
                Clear
              </v-btn>
              <div>
                <p style="color: blue;" v-for="(item, index) in successMessages" :key=index>
                  {{ item }}
                </p>
              </div>
              <div>
                <p style="color: red;" v-for="(item, index) in errorMessages" :key=index>
                  {{ item }}
                </p>
              </div>
            </v-flex>
          </v-flex>
          <v-flex style="margin: 24px;">
            <h3>actionsで実行</h3>
            <v-flex style="margin-top: 12px;">
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                color="green"
                class="white--text"
                @click="doLoading(true)">
                Loading Start
              </v-btn>
              <v-btn
                color="red"
                class="white--text"
                @click="doLoading(false)">
                Loading Stop
              </v-btn>
            </v-flex>
            <v-flex style="margin-top: 12px;">
              <v-btn
                color="blue"
                class="white--text"
                @click="doSuccessMessages(['リクエストが完了しました。','正常に動作します。'])">
                Success
              </v-btn>
              <v-btn
                color="red"
                class="white--text"
                @click="doErrorMessages(['リクエストが失敗しました。','もう一度実行してください。'])">
                Error
              </v-btn>
              <v-btn
                color="gray"
                @click="onClickClear">
                Clear
              </v-btn>
              <div>
                <p style="color: blue;" v-for="(item, index) in successMessages" :key=index>
                  {{ item }}
                </p>
              </div>
              <div>
                <p style="color: red;" v-for="(item, index) in errorMessages" :key=index>
                  {{ item }}
                </p>
              </div>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState, mapActions } from 'vuex'

@Component({
  name: 'VueStoreTopPage',
  /**
   * mapStateを用いてstoreが保持するデータを取得する。
   */
  computed: mapState(['title', 'isLoading', 'successMessages', 'errorMessages']),
  methods: {
    ...mapActions(['doTitle', 'doLoading', 'doSuccessMessages', 'doErrorMessages']),
  },
})
export default class VueStoreTopPage extends Vue {

  /**
   * script構文内ではgettersを用いてstoreが保持するデータを取得する。
   */
  mounted() {
    console.log('title', this.$store.getters.title)
  }

  /**
   * $store.commitでデータを設定する。
   */
  onClickLoading(value: boolean) {

    if (value === true) {
      this.$store.commit('startLoading')
    } else {
      this.$store.commit('stopLoading')
    }
    console.log('isLoading', this.$store.getters.isLoading)
  }

  onClickSuccess() {
    const messages: string[] = [
      'リクエストが完了しました。',
      '正常に動作します。',
    ]
    this.$store.commit('success', messages)
    console.log('success', this.$store.getters.successMessages)
  }

  onClickError() {
    const messages: string[] = [
      'リクエストが失敗しました。',
      'もう一度実行してください。',
    ]
    this.$store.commit('error', messages)
    console.log('error', this.$store.getters.errorMessages)
  }
  onClickClear() {
    this.$store.commit('success', '')
    this.$store.commit('error', '')
    console.log('success', this.$store.getters.successMessages)
    console.log('error', this.$store.getters.errorMessages)
  }
}
</script>
<style lang="stylus">
.top
  margin 10px

.container
  text-align left 
</style>