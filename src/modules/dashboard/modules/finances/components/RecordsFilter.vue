<template>
  <div>
    <v-layout row>
      <v-flex
        xs6
        v-if="isFiltering"
      >
        <v-btn
          icon
          @click="filter('clear')"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-flex>
      <v-flex
        xs6
        :class="buttonFilterClass"
      >
        <v-btn
          icon
          @click="showFilterDialog=true"
        >
          <v-icon>filter_list</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="showFilterDialog"
      max-width="350px"
    >
      <v-card>
        <v-card-title>
          <h3 class="headline">Filtros</h3>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showFilterDialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="filter"
          >
            <v-icon>check</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list three-line>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Tipo de Lançamento</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    placeholder="Todos os Lançamentos"
                    chips
                    deletable-chips
                    :items="operations"
                    item-text="description"
                    item-value="value"
                    @change="localFilters.type = $event"
                    :value="filters && filters.type"
                  ></v-select>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Contas</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    placeholder="Todos os Contas"
                    chips
                    deletable-chips
                    multiple
                    :items="accounts"
                    item-text="description"
                    item-value="id"
                    @change="localFilters.accountsIds = $event"
                    :value="filters && filters.accountsIds"
                  ></v-select>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Categorias</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    placeholder="Todos as Categorias"
                    chips
                    deletable-chips
                    multiple
                    :items="categories"
                    item-text="description"
                    item-value="id"
                    @change="localFilters.categoriesIds = $event"
                    :value="filters && filters.categoriesIds"
                  ></v-select>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-list>
        </v-card-text>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import AccountsService from './../services/accounts-services'
import CategoriesService from './../services/categories-services'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'RecordsFilter',
  data: () => ({
    showFilterDialog: false,
    accounts: [],
    categories: [],
    operations: [
      { description: 'Receita', value: 'CREDIT' },
      { description: 'Despesas', value: 'DEBIT' }
    ],
    localFilters: {
      accountsIds: [],
      categoriesIds: [],
      type: undefined
    },
    subscriptions: []
  }),
  computed: {
    ...mapState(['filters', 'isFiltering']),
    buttonFilterClass () {
      return !this.isFiltering ? 'offset-xs6' : ''
    }
  },
  created () {
    this.setItems()
  },
  destroyed () {
    this.subscriptions.forEach(s => s.unsubscribe())
  },
  methods: {
    ...mapActions(['setFilters']),
    filter (type) {
      this.showFilterDialog = false
      this.setFilters({ filters: type !== 'clear' ? this.localFilters : undefined })
      this.$emit('filter')
    },
    setItems () {
      this.subscriptions.push(
        AccountsService.accounts()
          .subscribe(accounts => (this.accounts = accounts))
      )
      this.subscriptions.push(
        CategoriesService.categories()
          .subscribe(categories => (this.categories = categories))
      )
    }
  }
}
</script>
