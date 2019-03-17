<template>
  <div class="top">
    <v-flex xs12 sm6 offset-sm3>
      <h2>SNS認証</h2>
      <v-card class="container">
        <v-flex>
          <v-flex style="margin: 24px;">
            <span>{{ loginStatusText }}</span>
          </v-flex>
          <v-flex style="margin: 24px;" xs12 sm6 offset-sm3>
            <v-flex>
              <v-btn 
                @click="onLogin(0)"
                round 
                large
                :loading="isLoading"
                :disabled="isLoading"
                class="social twitter white--text">
                Twitterでログイン
              </v-btn>
              <v-btn 
                @click="onLogin(1)"
                round 
                large
                :loading="isLoading"
                :disabled="isLoading"
                class="social facebook white--text">
                Facebookでログイン
              </v-btn>
            </v-flex>
            <v-flex style="margin-top: 12px;">
              <v-btn
                @click="onLogout"
                :loading="isLoading"
                :disabled="!isLoginStatus"
                color="red"
                class="white--text">
                ログアウトする
              </v-btn>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'

@Component({
  name: 'SocialLoginPage',
})
export default class SocialLoginPage extends Vue {
  /**
   * ローディングフラグ
   */
  isLoading: boolean = false
  isLoginStatus: boolean | null = null

  mounted() {
    this.getItems()
  }

  getItems() {
    console.log('getItems')
    /**
     * 認証状態を監視する。
     * 認証状態が変わると処理される
     */
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.isLoginStatus = true
        console.log('user', user.uid)
      } else {
        this.isLoginStatus = false
      }
    })
  }

  /**
   * ログイン
   */
  async onLogin(type: number) {
    this.isLoading = true
    switch (type) {
      case 0:
        await this.signInTwitter()
      case 1:
        await this.signInFacebook()
    }
    this.isLoading = false
  }

  async onLogout() {
    this.isLoading = true
    await this.signOut()
    this.isLoading = false
  }

  /**
   * Twitterでログインする
   */
  async signInTwitter() {
    try {
      const provider = new firebase.auth.TwitterAuthProvider()
      const result = await firebase.auth().signInWithPopup(provider)
      console.log(result)
      const user = firebase.auth().currentUser
      if (user !== null) {
        console.log('user', user.uid)
      }
      this.$router.push({ name: 'sign_in_finish_page' })
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * Facebookでログインする
   */
  async signInFacebook() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider()
      const result = await firebase.auth().signInWithPopup(provider)
      console.log(result)
      const user = firebase.auth().currentUser
      if (user !== null) {
        console.log('user', user.uid)
      }
      this.$router.push({ name: 'sign_in_finish_page' })
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  /**
   * ログアウトする
   */
  async signOut() {
    try {
      const result = await firebase.auth().signOut()
      console.log(result)
      this.isLoginStatus = false
    } catch (error) {
      console.error('firebase error', error)
    }
  }

  get loginStatusText() {
    return this.isLoginStatus === true ? 'ログイン中' : 'ログアウト中'
  }

}
</script>
<style lang="stylus">

.top
  margin 10px

.container
  text-align left 
  margin-top 20px

.subtitle
  padding-left 12px

.social
  text-transform none
  
/** main.tsのvuetifyのcolor設定が機能しないのでここで無理やり変更する. */
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat).twitter
  background-color #00aced

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat).facebook
  background-color #305097
</style>