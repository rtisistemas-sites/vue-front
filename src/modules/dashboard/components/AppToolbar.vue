<template>
  <v-app-bar
    app
    fixed
    color="primary"
  >
    <v-app-bar-nav-icon @click.stop="$emit('hide', !show)"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title || 'Dashboard' }}</v-toolbar-title>

    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn
        icon
        @click="showLofoutDialog = true"
      >
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar-items>

    <v-dialog
      v-model="showLofoutDialog"
      max-width="150px"
    >
      <v-card>
        <v-card-title>
          <h4 class="subheading">Deseja realmente sair?</h4>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            small
            @click="showLofoutDialog = false"
          >Não</v-btn>
          <v-btn
            small
            @click="logout"
          >Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
import apollo, { onLogout } from '@/plugins/apollo'

export default {
  name: 'AppToolbar',
  props: {
    show: Boolean
  },
  model: {
    prop: 'show',
    event: 'hide'
  },
  data: () => ({
    showLofoutDialog: false
  }),
  computed: {
    ...mapState(['title'])
  },
  methods: {
    async logout (e) {
      this.$router.push('/login')
      await onLogout(apollo)
    }
  }
}
</script>
