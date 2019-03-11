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
                <td width="80%" class="table__value">{{ authType }}</td>
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
                <td width="80%" class="table__value">{{ emailVerified }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">電話番号</td>
                <td width="80%" class="table__value">{{ phoneNumber }}</td>
              </tr>
              <tr>
                <td width="20%" class="table__key">写真URL</td>
                <td width="80%" class="table__value">{{ photoURL }}</td>
              </tr>
            </table>
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

  authType: string = ''
  uid: string = ''
  displayName: string = ''
  email: string = ''
  emailVerified: boolean = false
  phoneNumber: string = ''
  photoURL: string = ''

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
      if (user !== null) {
        console.log('user', user)
        if (user.isAnonymous) {
          this.authType = '匿名認証'
        } else {
          this.authType = ''
        }
        this.uid = user.uid
        this.displayName = user.displayName ? user.displayName : 'なし'
        this.email = user.email ? user.email : 'なし'
        this.emailVerified = user.emailVerified
        this.phoneNumber = user.phoneNumber ? user.phoneNumber : 'なし'
        this.photoURL = user.photoURL ? user.photoURL : 'なし'
      }
    })
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