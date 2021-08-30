<template>
  <v-card>
    <v-card-title>
     Select Account
    </v-card-title>
    <v-card-subtitle>
      My Brocoin wallet
    </v-card-subtitle>
    <v-list dense>
      <v-list-item v-for="(account, index) in accounts" :key="index" :to="`/${account}`">
        <v-list-item-title>{{account}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class Index extends Vue {
  accounts: string[] = [];

  async fetch() {
    this.accounts = await this.$web3.eth.getAccounts();
  }

}
</script>
