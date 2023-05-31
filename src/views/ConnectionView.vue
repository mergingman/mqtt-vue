<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {useMQTT} from "mqtt-vue-hook";
import {useConnectionStore} from "../stores/connections";

const connectionStore = useConnectionStore()
const {setTopics, getConnection} = connectionStore

const props = defineProps(["name"])
const mqttHook = useMQTT()
let connection = getConnection(props.name)

const brokerUrl = computed(() => connection ? `ws://${connection.host}:${connection.port}/${connection.path}` : "")
const topics = ref(connection.topics ? connection.topics : [])
const topicToPublish = ref("")
const topicToSubscribeTo = ref("")
const messageToPublish = ref("")
const statusMessages = ref([])
const currentTopic = ref(null)
const messages = computed(() => currentTopic.value !== null && currentTopic.value.messages ? currentTopic.value.messages.join("\n") : null)
const statusMessagesFormatted = computed(() => statusMessages.value ? statusMessages.value.join("\n") : null)

watch(() => props.name, () => {
  connection = getConnection(props.name)
})

//Ändert das topic, von dem gerade die Nachrichten angezeigt werden
function setCurrentTopic(topicToSet) {
  const topicFromList = topics.value.find(topic => topic.name === topicToSet.name);
  if (topicFromList !== undefined) {
    currentTopic.value = topicFromList
  }
}

//Sobald ein neues topic hinzukommt und das currentTopic noch nicht gesetzt ist, weil noch keine topics da waren, wird das currentTopic gesetzt
//Topics werden im store gespeichert
watch(topics.value, () => {
  setTopics(connection.name, topics.value)
  if (currentTopic.value === null && topics.value[0].name) {
    setCurrentTopic(topics.value[0])
  }
}, { deep: true })

//Fügt dem topic eine Nachricht hinzu
function addMessageToTopic(topicName, message) {
  const topicFromList = topics.value.find(topic => topic.name === topicName)
  if (topicFromList !== undefined) {
    if (topicFromList.messages === undefined) {
      topicFromList.messages = []
    }
    topicFromList.messages.push(message)
  }
}

//Fügt ein neues topic hinzu, falls es noch nicht existiert
function addTopic(newTopic) {
  const existingTopic = topics.value.find(topic => topic.name === newTopic.name)
  if (existingTopic === undefined) {
    topics.value.push(newTopic)
    mqttHook.registerEvent(
        newTopic.name,
        (topic, message) => {
          statusMessages.value.push(`${new Date().toLocaleString()}: Received message from topic '${topic}'! Message: \n ${message}`)
          addMessageToTopic(topic, message)
        },
        'string_key',
    )
  }
}

//Subscribed ein topic und fügt es hinzu
function subscribeToTopic() {
  const topic = topicToSubscribeTo.value
  mqttHook.subscribe(
      [topic],
      1,
      undefined,
      () => {
        statusMessages.value.push(`${new Date().toLocaleString()}: Subscribed to topic '${topic}'!`)
        addTopic({name: topic})
      }
  )
  topicToSubscribeTo.value = ""
}

//Published eine Nachricht
function publishMessage() {
  const topic = topicToPublish.value
  const message = messageToPublish.value
  mqttHook.publish(
      topic,
      message,
      1,
      undefined,
      () => {
        statusMessages.value.push(`${new Date().toLocaleString()}: Published message '${message}' with topic '${topic}'!`)
      }
  )
  messageToPublish.value = ""
}

onUnmounted(() => {
  topics.value.forEach(topic => mqttHook.unRegisterEvent(topic.name, "string_key"))
  mqttHook.unRegisterEvent('on-connect', 'string_key')
  mqttHook.unRegisterEvent('on-disconnect', 'string_key')
  mqttHook.unRegisterEvent('on-connect-fail', 'string_key')
  mqttHook.unRegisterEvent('on-reconnect', 'string_key')
})

mqttHook.registerEvent(
    'on-reconnect', // mqtt status: on-connect, on-reconnect, on-disconnect, on-connect-fail
    () => {
      statusMessages.value.push(`${new Date().toLocaleString()}: Reconnected to '${brokerUrl.value}'!`)
    },
    'string_key',
)

mqttHook.registerEvent(
    'on-disconnect', // mqtt status: on-connect, on-reconnect, on-disconnect, on-connect-fail
    () => {
      statusMessages.value.push(`${new Date().toLocaleString()}: Disconnected from '${brokerUrl.value}'!`)
    },
    'string_key',
)

mqttHook.registerEvent(
    'on-connect-fail', // mqtt status: on-connect, on-reconnect, on-disconnect, on-connect-fail
    () => {
      statusMessages.value.push(`${new Date().toLocaleString()}: Connecting to '${brokerUrl.value}' failed!`)
    },
    'string_key',
)

mqttHook.registerEvent(
    'on-connect', // mqtt status: on-connect, on-reconnect, on-disconnect, on-connect-fail
    () => {
      statusMessages.value.push(`${new Date().toLocaleString()}: Connected to '${brokerUrl.value}'!`)
    },
    'string_key',
)

function mqttConnect() {
  if (connection && connection.name !== 'new') {
    mqttHook.connect(brokerUrl.value, {
      clean: false,
      keepalive: 60,
      clientId: connection.mqttClientId,
      connectTimeout: 4000,
    })
  }
}

mqttConnect();
</script>

<template>
  <div>
    <div id="actions">
      <div>

      </div>
      <div id="broker" class="container">
        <label id="broker-label" class="container-item broker-item">Broker</label>
        <label id="host-label" for="host" class="container-item broker-item">Host</label>
        <input id="host" class="container-item broker-item" v-model="connection.host"/>
        <label id="port-label" for="port" class="container-item broker-item">Port</label>
        <input id="port" class="container-item broker-item" type="number" max="65535" v-model="connection.port" min="0"/>
        <label id="path-label" for="path" class="container-item broker-item">Path</label>
        <input id="path" class="container-item broker-item" v-model="connection.path"/>
        <label id="clientId-label" for="path" class="container-item broker-item">Mqtt Client ID</label>
        <input id="client-id" class="container-item broker-item" v-model="connection.mqttClientId"/>
        <button id="connect-button" class="container-item broker-item" :disabled="mqttHook.isConnected()" @click="mqttConnect()">Connect</button>
        <button id="disconnect-button" class="container-item broker-item" :disabled="!mqttHook.isConnected()" @click="mqttHook.disconnect()">Disconnect
        </button>
      </div>
      <div id="publish" class="container">
        <label class="container-item">Publish</label>
        <label class="container-item">Topic</label>
        <input class="container-item" placeholder="enter topic" v-model="topicToPublish"/>
        <label class="container-item">Message</label>
        <textarea class="container-item stretch" placeholder="enter message" v-model="messageToPublish"/>
        <button class="container-item" :disabled="!topicToPublish || !messageToPublish" @click="publishMessage()">
          Publish
        </button>
      </div>
      <div id="subscribe" class="container">
        <label class="container-item">Subscribe</label>
        <label class="container-item">Topic</label>
        <input class="container-item" placeholder="enter topic" v-model="topicToSubscribeTo"/>
        <button class="container-item" :disabled="!topicToSubscribeTo" @click="subscribeToTopic()">Subscribe</button>
      </div>
    </div>
    <div id="status" class="container">
      <label class="container-item">Status</label>
      <textarea id="status-box" class="stretch" :value="statusMessagesFormatted" disabled></textarea>
    </div>
  </div>
  <div id="data" class="container">
    <div id="topics" class="container">
      <label class="container-item">Topics</label>
      <p v-for="topic in topics" :key="topic.name"
         :class="{'container-item': true, hover: true, 'selected-topic': currentTopic.name === topic.name}"
         @click="setCurrentTopic(topic)">
        {{ topic.name }}
      </p>
    </div>
    <div id="messages" class="container">
      <label class="container-item">Messages {{ currentTopic ? `in ${currentTopic.name}` : "" }}</label>
      <textarea :value="messages" disabled class="container-item"></textarea>
    </div>
  </div>
</template>

<style scoped>
/*#wrapper {*/
/*  display: grid;*/
/*  grid-template-rows: 1fr 1fr;*/
/*}*/

#actions {
  display: flex;
  height: 40vh;
}

#broker {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  grid-template-rows: auto auto auto auto;
  align-items: flex-start;
  justify-content: flex-start;
}

#connect-button {
  grid-column-start: 2;
  grid-column-end: 3;
}

#disconnect-button {
  grid-column-start: 4;
  grid-column-end: 5;
}

#topics {
  flex-grow: .4;
}

#broker-label {
  grid-column-start: 1;
  grid-column-end: 5;
}

#messages {
  flex-grow: 1;
}

#status {
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  height: 200px;
}

#data {
  display: flex;
  flex-direction: row;
}

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

.stretch {
  flex-grow: 1;
}

.selected-topic {
  background-color: #d4ffe8;
}

.hover:hover {
  background-color: #d4ffe8;
}
</style>