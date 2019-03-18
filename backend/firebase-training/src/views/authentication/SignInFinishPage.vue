<template>
  <div class="top">
    <v-flex>
      <v-card class="container">
        <v-flex>
          <h2>サインイン完了</h2>
          <v-flex style="margin-top: 16px;">
            <table border="1" class="table__list">
              <tr>
                <td width="20%" class="table__key">認証タイプ</td>
                <td width="80%" class="table__value">{{ authStatusText }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">認証ID</td>
                <td width="80%" class="table__value">{{ uid }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">名前</td>
                <td width="80%" class="table__value">{{ displayName }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">メールアドレス</td>
                <td width="80%" class="table__value">{{ email  }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">本人確認</td>
                <td width="80%" class="table__value">
                  <span v-if="emailVerified!=null">{{ emailVerified }}</span>
                </td>
              </tr>
              <tr>
                <td width="20%" class="table__key">電話番号</td>
                <td width="80%" class="table__value">{{ phoneNumber }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">写真URL</td>
                <td width="80%" class="table__value">{{ photoURL }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">作成日</td>
                <td width="80%" class="table__value">
                  <span v-if="createdAt!=null">{{ createdAt | dateFormat }}</span>
                </td>
              </tr>
              <tr>
                <td width="20%" class="table__key">最終ログイン</td>
                <td width="80%" class="table__value">
                  <span v-if="lastLoginAt!=null">{{ lastLoginAt | dateFormat }}</span>
                </td>
              </tr>
            </table>
          </v-flex>
        </v-flex>
      </v-card>
      <v-card class="container">
        <h2>操作</h2>
        <v-flex style="margin-top: 16px;">
          <v-flex v-if="isShowSendEmailVerification">
            <v-btn
              color="blue"
              class="white--text"
              :loading="isLoading"
              :disabled="isLoading"
              @click="onEmailVerification">本人確認メール送信</v-btn>
          </v-flex>
          <v-flex style="margin: 20px 0px;">
            <h3>メッセージ</h3>
            <p style="margin: 10px;" v-html="resultMessage"/>
          </v-flex>
        </v-flex>
      </v-card>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import { format } from 'date-fns'

@Component({
  name: 'SignInFinishPage',
  filters: {
    dateFormat(date: Date) {
      return format(date, 'YYYY/MM/DD HH:mm:ss');
    },
  },
})
export default class SignInFinishPage extends Vue {

  authType: number | null = null  // 0: メール認証, 1: 匿名認証, null: ログアウト状態
  uid: string = ''
  displayName: string = ''
  email: string = ''
  emailVerified: boolean | null = null
  phoneNumber: string = ''
  photoURL: string = ''
  createdAt: Date | null = null
  lastLoginAt: Date | null = null

  user: firebase.User | null = null
  isLoading: boolean = false
  resultMessage: string = ''

  mounted() {
    this.getItems()
  }

  async getItems() {
    console.log('getItems')
    /**
     * 認証状態を監視する。
     * 認証状態が変わると処理される
     */
    firebase.auth().onAuthStateChanged((user) => {
      this.authType = null
      if (user !== null) {
        console.log('user', user.toJSON())
        this.user = user
        if (user.isAnonymous) {
          this.authType = 1
        } else {
          user.providerData.forEach((item) => {
            if (item !== null) {
              if (item.email !== null && item.providerId === 'password') {
                this.authType = 0
              }
              if (item.providerId === 'twitter.com') {
                this.authType = 2
              }
              if (item.providerId === 'facebook.com') {
                this.authType = 3
              }
            }
          })
        }
        this.uid = user.uid
        this.displayName = user.displayName ? user.displayName : 'なし'
        this.email = user.email ? user.email : 'なし'
        this.emailVerified = user.emailVerified
        this.phoneNumber = user.phoneNumber ? user.phoneNumber : 'なし'
        this.photoURL = user.photoURL ? user.photoURL : 'なし'

        if ('createdAt' in user.toJSON()) {
          const createdAt = Number((user.toJSON() as any).createdAt)
          this.createdAt = new Date(createdAt)
          console.log('createdAt', this.createdAt)
        }
        if ('lastLoginAt' in user.toJSON()) {
          const lastLoginAt = Number((user.toJSON() as any).lastLoginAt)
          this.lastLoginAt = new Date(lastLoginAt)
          console.log('lastLoginAt', this.lastLoginAt)
        }
      }
    })
  }

  async onEmailVerification() {
    this.isLoading = true
    try {
      this.resultMessage = ''
      if (this.user !== null) {
        await this.user.sendEmailVerification()
        this.resultMessage = '本人確認メールを送信しました。'
      }
    } catch (error) {
      this.resultMessage = error.message
    }
    this.isLoading = false
  }

  get isShowSendEmailVerification() {
    if (this.user !== null && this.user.email !== null && this.user.emailVerified !== true) {
      return true
    } else {
      return false
    }
  }

  get authStatusText() {
    if (this.authType !== null) {
      switch (this.authType) {
        case 0:
          return 'メール認証'
        case 1:
          return '匿名認証'
        case 2:
          return 'Twitter認証'
        case 3:
          return 'Facebook認証'
        default:
          return '不明'
      }
    } else {
      return '-'
    }
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

.table
  &__list
    margin 0 auto
  &__key
    font-size 16px
    text-align center
    padding 8px
    word-break break-all

  &__value
    font-size 16px
    text-align right
    padding 8px
    word-break break-all

</style>