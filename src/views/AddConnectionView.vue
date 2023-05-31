<script setup>
import {useConnectionStore} from "../stores/connections";
import { storeToRefs } from "pinia";
import {computed, ref} from "vue";

const connectionStore = useConnectionStore();
const { addConnection } = connectionStore

const nameInput = ref("")
const hostInput = ref("")
const portInput = ref("")
const pathInput = ref("")
const clientIdInput = ref(`mqtt_client_${Math.random().toString(16).substring(2, 10)}`)

const validInput = computed(() => nameInput.value && hostInput.value && portInput.value)

function saveConnection() {
  addConnection({name: nameInput.value, host: hostInput.value, port: portInput.value, path: pathInput.value})
  nameInput.value = ""
  hostInput.value = ""
  portInput.value = ""
  pathInput.value = ""
  clientIdInput.value = ""
}
</script>

<template>
  <div>
    <div id="broker" class="container">
      <label id="broker-label" class="container-item broker-item">Broker</label>
      <label id="name-label" for="name" class="container-item broker-item">Name</label>
      <input id="name" class="container-item broker-item" v-model="nameInput"/>
      <label id="host-label" for="host" class="container-item broker-item">Host</label>
      <input id="host" class="container-item broker-item" v-model="hostInput"/>
      <label id="port-label" for="port" class="container-item broker-item">Port</label>
      <input id="port" class="container-item broker-item" type="number" max="65535" v-model="portInput" min="0"/>
      <label id="path-label" for="path" class="container-item broker-item">Path</label>
      <input id="path" class="container-item broker-item" v-model="pathInput"/>
      <label id="clientId-label" for="path" class="container-item broker-item">Mqtt Client ID</label>
      <input id="client-id" class="container-item broker-item" v-model="clientIdInput"/>
      <button id="connect-button" class="container-item broker-item" :disabled="!validInput" @click="saveConnection()">Save</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  border: 1px solid black;
  margin: 5px;
}

.container-item {
  margin: 5px;
}
</style>