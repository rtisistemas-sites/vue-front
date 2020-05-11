<template>
  <RecordsList />
</template>

<script>
import RecordsList from './../components/RecordsList'
import { mapActions } from 'vuex'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  },
  methods: {
    ...mapActions(['setTitle'])
  },
  created () {
    this.setTitle({ title: 'Lançamentos' })
  }
}
</script>
