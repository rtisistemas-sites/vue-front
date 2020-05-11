<template>
  <div>

    <TotalBalance class="mb-2" />

    <ToolbarByMonth
      class="mb-2"
      format="MM-YYYY"
      @month="changeMonth"
      :color="toolbarColor"
      :month="month || $route.query.month"
      :showSlot="true"
    >
      <RecordsFilter @filter="filter" />
    </ToolbarByMonth>

    <v-card>

      <v-card-text
        class="text-xs-center text-center"
        v-if="mappedRecordsLength === 0"
      >
        <v-icon
          size="100"
          color="grey"
        >assignment</v-icon>
        <p class="font-weight-light subheading grey--text">Nenhum lançamento no período</p>
      </v-card-text>

      <v-list
        v-else
        two-line
        subheader
      >
        <template v-for="(records_dados, date, index) in mappedRecord">
          <v-subheader :key="date">{{ date }}</v-subheader>
          <RecordsListItem
            v-for="record in records_dados"
            :key="record.id"
            :record="record"
          />
          <v-divider
            :key="`${date}-${index}`"
            v-if="showDivider(index, mappedRecord)"
          ></v-divider>
        </template>

      </v-list>

      <v-footer class="pa-2">
        <v-flex
          text-xs-right
          text-right
        >
          <h3 class="font-weight-light">
            <span>Saldo do mês:</span>
            <strong
              class="ml-5"
              :class="amountColor(totalAmount)"
            >{{ formatCurrency(totalAmount) }}</strong>
          </h3>
        </v-flex>
      </v-footer>

    </v-card>
  </div>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { groupBy } from '@/utils'
import formatCurrencyMixin from '@/mixins/format-currency'
import amountColorMixin from './../mixins/amount-color'
import RecordsListItem from './RecordsListItem'
import RecordsService from './../services/records-service'
import ToolbarByMonth from './ToolbarByMonth'
import TotalBalance from './TotalBalance'
import RecordsFilter from './RecordsFilter'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'RecordsList',
  components: {
    RecordsListItem,
    ToolbarByMonth,
    TotalBalance,
    RecordsFilter
  },
  mixins: [
    amountColorMixin,
    formatCurrencyMixin
  ],
  data: () => ({
    records: [],
    filtersSubject$: new Subject(),
    subscriptions: []
  }),
  computed: {
    ...mapState(['filters', 'month']),
    mappedRecord () {
      return groupBy(this.records, 'date', (record, dateKey) => {
        return moment(record[dateKey].substr(0, 10)).format('DD/MM/YYYY')
      })
    },
    mappedRecordsLength () {
      return Object.keys(this.mappedRecord).length
    },
    totalAmount () {
      return this.records.reduce((sum, record) => sum + record.amount, 0)
    },
    toolbarColor () {
      return this.totalAmount <= 0 ? 'error' : 'primary'
    }
  },
  created () {
    this.setRecords()
  },
  destroyed () {
    this.subscriptions.forEach(s => s.unsubscribe())
    console.log('Subscriptions: ', this.subscriptions)
  },
  methods: {
    ...mapActions(['setMonth']),
    setRecords () {
      console.log('Subscribing...')

      this.subscriptions.push(
        this.filtersSubject$
          .pipe(
            mergeMap(variables => RecordsService.records(variables))
          ).subscribe(records => (this.records = records))
      )
    },
    filter () {
      this.filtersSubject$.next({ month: this.month, ...this.filters })
    },
    showDivider (index, object) {
      return index < Object.keys(object).length - 1
    },
    changeMonth (month) {
      this.$router.push({
        path: this.$route.path,
        query: { month: month }
      })
      console.log('Month: ', month)
      this.setMonth({ month })
      this.filter()
    }
  }
}
</script>
