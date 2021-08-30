<template>
  <v-card>
    <v-card-title>
      {{ balance }}
    </v-card-title>
    <v-list>
      <v-list-item v-for="(event, index) in events" :key="index">
        <v-list-item-title> {{event.amount}} BroCoin: {{ event.from }} => {{ event.to }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-btn @click="transfer">Transfer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class Index extends Vue {
  account: string[] = [];
  balance = 0;
  events : {from: string, to: string, amount: number}[]= [];

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
    this.account = await this.$web3.eth.getAccounts();
    this.contract = new this.$web3.eth.Contract(
      // @ts-ignore
      this.abi,
      "0xAd6445926f280e1B726f046f792437062ba8F02F"
    );
    this.balance = await this.contract.methods.getBalance("0x79FAe6155a8602816a6203C477E734642366B568").call();
    this.contract.events.Transfer({},async (error, result) => {
      this.events.push({
        from: result.returnValues._from,
        to: result.returnValues._to,
        amount: result.returnValues._value,
      });
      this.balance = await this.contract.methods.getBalance("0x79FAe6155a8602816a6203C477E734642366B568").call();
    });
  }

  async transfer() {
    await this.contract.methods.sendCoin(this.account[1], 20).send({ from: "0x79FAe6155a8602816a6203C477E734642366B568" });
  }
}
</script>
