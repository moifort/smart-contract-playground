import Web3 from 'web3'

declare module 'vue/types/vue' {
  interface Vue {
    $web3: Web3
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $web3: Web3
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $web3: Web3
  }
  interface Context {
    $web3: Web3
  }
}

declare module 'vuex/types/index' {
  // @ts-ignore
  interface Store {
    $web3: Web3
  }
}
