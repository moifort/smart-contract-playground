<template>
  <v-card>
    <v-card-title>
      BROCOIN - Account : {{ accountId }}
    </v-card-title>
    <v-card-subtitle>
      Current balance: {{ balance }} BCN
    </v-card-subtitle>
    <v-card-text>
      <v-list dense>
        <v-list-item-title>Debit</v-list-item-title>
        <v-list-item v-for="(debit, index) in debits" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ debit.amount }} BCN</v-list-item-title>
            <v-list-item-subtitle> {{ debit.from }} => {{ debit.to }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item-title>Credit</v-list-item-title>
        <v-list-item v-for="(credit, index) in credits" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ credit.amount }} BCN</v-list-item-title>
            <v-list-item-subtitle> {{ credit.from }} => {{ credit.to }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-title>
      Transfert to a Bro
    </v-card-title>
    <v-card-text>
      <v-select
        v-model="selectedAccount"
        :items="accounts"
        label="Bro account ID"
      />
      <v-text-field
        v-model="amount"
        label="BNC"
        required
      />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="transfer">Transfer to my bro</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { Contract, ContractOptions } from "web3-eth-contract";


@Component
export default class AccountId extends Vue {
  accountId = this.$route.params.accountId;
  accounts: string[] = [];
  balance = 0;
  debits: { from: string, to: string, amount: number }[] = [];
  credits: { from: string, to: string, amount: number }[] = [];
  selectedAccount = "";
  contract: Contract | null = null;
  amount = 0;
  isTransfering = false;

  abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "sendCoin",
      "outputs": [
        {
          "internalType": "bool",
          "name": "sufficient",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "getBalanceInEth",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  async fetch() {
    this.accounts = (await this.$web3.eth.getAccounts()).filter(account => account !== this.accountId);
    this.selectedAccount = this.accounts[0];
    this.contract = new this.$web3.eth.Contract(
      // @ts-ignore
      this.abi,
      "0xAd6445926f280e1B726f046f792437062ba8F02F"
    );
    this.balance = await this.contract.methods.getBalance(this.accountId).call();
    this.contract.events.Transfer({ filter: { _to: this.accountId } }, async (_error: any, result: any) => {
      this.credits.push({
        from: result.returnValues._from.slice(0, 10),
        to: result.returnValues._to.slice(0, 10),
        amount: result.returnValues._value
      });
      this.balance = await this.contract!.methods.getBalance(this.accountId).call();
    });
    this.contract.events.Transfer({ filter: { _from: this.accountId } }, async (_error: any, result: any) => {
      this.debits.push({
        from: result.returnValues._from.slice(0, 10),
        to: result.returnValues._to.slice(0, 10),
        amount: result.returnValues._value
      });
      this.balance = await this.contract!.methods.getBalance(this.accountId).call();
    });
  }

  async transfer() {
    this.isTransfering = true;
    try {
      await this.contract!.methods.sendCoin(this.selectedAccount, this.amount).send({ from: this.accountId });
    } finally {
      this.isTransfering = false;
    }
  }
}
</script>
