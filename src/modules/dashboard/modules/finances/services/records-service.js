import apollo from '@/plugins/apollo'
import RecordsQuery from './../graphql/Records.gql'
import moment from 'moment'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import TotalBalanceQuery from './../graphql/TotalBalance.gql'
import RecordCreateMutation from './../graphql/RecordCreate.gql'
import md5 from 'md5'

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateMutation,
    variables,
    update: (proxy, { data: { createRecord } }) => {
      const month = moment(createRecord.date.substr(0, 10)).format('MM-YYYY')
      const variables = { month }
      try {
        const recordData = proxy.records({
          query: RecordsQuery,
          variables
        })
        recordData.records = [...recordData.records, createRecord]
        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordData
        })
      } catch (e) {
        console.log('Query records ainda não foi lida', e)
      }

      try {
        const currentDate = moment().endOf('day')
        const recordDate = moment(createRecord.date.substr(0, 10))
        const variables = { date: currentDate.format('YYY-MM-DD') }

        if (recordDate.isBefore(currentDate)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = +(totalBalanceData.totalBalance + createRecord.amount).toFixed(2)
          proxy.writeQuery({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceData
          })
        }
      } catch (e) {
        console.log('Query "totalBalance" has not benn read yet!', e)
      }
    }
  })
  return response.data.createRecord
}

const recordsWatchedQueries = {}

const records = variables => {
  const hasKey = md5(
    Object
      .keys(variables)
      .map(k => variables[k]).join('_')
  )

  console.log('HashKey: ', hasKey)

  let queryRef = recordsWatchedQueries[hasKey]
  if (!queryRef) {
    queryRef = apollo.watchQuery({
      query: RecordsQuery,
      variables
    })
    recordsWatchedQueries[hasKey] = queryRef
  }

  return from(queryRef)
    .pipe(
      map(res => res.data.records)
    )
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  })
  return response.data.totalBalance
}

export default {
  records,
  totalBalance,
  createRecord
}
