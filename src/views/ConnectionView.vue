<script setup>
import * as mqtt from "mqtt";
const client = mqtt.connect({ port: 1883, host: '192.168.1.100', keepalive: 10000})

client.subscribe('presence')
client.publish('presence', 'bin hier')
client.on('message', function (topic, message) {
  console.log("MESSAGE: " + message)
})
client.end()
</script>

<template>
  <div>
    <div id="actions">

      <div id="broker" class="container">
        <label class="container-item">Broker</label>
        <input class="container-item" value="172.16.1.3"/>
        <button class="container-item">Connect</button>
      </div>
      <div id="publish" class="container">
        <label class="container-item">Publish</label>
        <label class="container-item">Topic</label>
        <input class="container-item" placeholder="enter topic"/>
        <label class="container-item">Message</label>
        <textarea class="container-item" placeholder="enter message"/>
        <button class="container-item">Publish</button>
      </div>
      <div id="subscribe" class="container">
        <label class="container-item">Subscribe</label>
        <input class="container-item" placeholder="enter topic"/>
        <button class="container-item">Subscribe</button>
      </div>
    </div>
    <div id="data">
      <div id="messages" class="container">
        <textarea class="container-item"></textarea>
      </div>
      <div id="status" class="container">

      </div>
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
  height: 35vh;
}

#broker {
  display: flex;
  flex-direction: column;
  text-align: center;
}

#publish {
}

#subscribe {
}

#messages {
}

#status {
  background-color: aliceblue;
}

#data {
  display: flex;
  flex-direction: column;
}

.container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border: 1px solid black;
  margin: 5px;
}

.container-item {
  margin: 5px;
}
</style>