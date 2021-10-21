<template>
  <el-container direction="vertical">

    <el-table border :data="transactions.items">
      <el-table-column fixed prop="fromUser" :label="$t('profile.transactions.from')">
        </el-table-column>         

        <el-table-column prop="toUser" :label="$t('profile.transactions.to')">
        </el-table-column>         

        <el-table-column prop="amount" :label="$t('profile.transactions.amount')">
          <template slot-scope="scope">
            <span>{{scope.row.amount}} {{$t('advertise.soum')}}</span>
          </template>
        </el-table-column>                     

        <el-table-column prop="date" align="center" :label="$t('profile.transactions.date')">
          <template slot-scope="scope">
            <span> {{scope.date | toTime}} </span>
          </template>
        </el-table-column>    
    </el-table>

    <el-pagination v-if="transactions.total > size" 
      background layout="prev, pager, next" :page-size="size" 
      :total="transactions.total" @current-change="onCurrentPageChange">
    </el-pagination>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      transactions: {
        items: [],
        total: 0
      },     
      size: 15,
      offset: 0,

      loading: true
    }
  },

  mounted () {
    this.getTransactions(this.size, this.offset);
  },

  methods: {
    onCurrentPageChange (page) {
      this.offset = (page - 1) * this.size;
      this.getTransactions(this.size, this.offset);
    },

    getTransactions (size, offset) {
      this.loading = true;

      const metadata = {
        url: 'transaction',
        params: {
          size, 
          offset
        },
        token: this.$store.state.userInfo.token
      }

      this.$store.dispatch('getData', metadata)
        .then(response => {          
          this.transactions.total = response.count;          
          this.transactions.items = response.transactions;            
        })
        .catch(error => {

        })
        .finally(() => {
          this.loading = false;
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>