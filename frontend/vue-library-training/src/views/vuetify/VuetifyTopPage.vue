<template>
  <div>
    <v-app>
      <!-- ナビゲーションバー https://vuetifyjs.com/en/components/navigation-drawers#navigation-drawer -->
      <v-navigation-drawer
        fixed
        clipped
        app
        dark
        v-model="isDrawer"
        class="blue lighten-3">
        <v-container
          fluid
          style="min-height: 0;"
          grid-list-lg>
          <v-list>
            <v-layout wrap column>
              <v-flex>
                <template
                  v-for='(menu, index) in menuList'>
                  <v-list-tile :key="index" @click="onClickNavigationItem(menu)">
                    <v-list-tile-action>
                      <v-icon>{{ menu.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ menu.label }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-flex>
            </v-layout>
          </v-list>
        </v-container>
      </v-navigation-drawer>
      <!-- ここまで -->
      <!-- ツールバー https://vuetifyjs.com/en/components/toolbars#toolbar -->
      <v-toolbar
        dark
        color="blue"
        fixed
        clipped-left
        app>
        <v-toolbar-side-icon @click.stop="isDrawer = !isDrawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{ toolberTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- ここまで -->
      <!-- メインページ -->
      <v-container>
        <v-fade-transition mode="out-in">
          <router-view/>
        </v-fade-transition>
      </v-container>
      <!-- ここまで-->
      <!-- フッター https://vuetifyjs.com/en/components/footer#footer -->
      <v-footer
        color='gray'
        app>
        <span>&copy; {{ footerTitle }}</span>
      </v-footer>
      <!-- ここまで -->
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class VuetifyTopPage extends Vue {
  toolberTitle: string = 'Vuetifyトレーニング'

  footerTitle: string = 'Vuetifyトレーニング 2019'
  isDrawer: boolean = false
  menuList: any[] = [
    {
      to: 'vuetify_child_page_1',
      label: 'ページ1',
      icon: 'dashboard',
    },
    {
      to: 'vuetify_child_page_2',
      label: 'ページ2',
      icon: 'account_box',
    },
    {
      to: 'vuetify_child_page_3',
      label: 'ページ3',
      icon: 'gavel',
    },
  ]
  mounted() {
    console.log('VuetifyTopPage')
  }
  onClickNavigationItem(menu: any) {
    this.$router.push({name: menu.to})
  }
}
</script>
<style lang="stylus">
.top
  margin 10px

.container
  text-align left

</style>