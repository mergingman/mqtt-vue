<script setup>
import {useConnectionStore} from "../stores/connections";
import {storeToRefs} from "pinia";

const connectionStore = useConnectionStore();
const {connections} = storeToRefs(connectionStore)
const {deleteConnection} = connectionStore
</script>

<template>
  <div class="container-row">
    <div>
      <label class="container-item">Connections</label>
      <RouterLink to="/" class="container-item">Add Connection</RouterLink>
    </div>
    <nav>
      <div id="links" v-for="connection in connections" :key="connection">
        <RouterLink :to="'/connections/' + connection.name" class="container-item">
          {{ connection.name }}
        </RouterLink>
        <button class="container-item" @click="deleteConnection(connection)">Remove</button>
        <br/>
      </div>
    </nav>
  </div>

</template>

<style scoped>

.container-row {
  display: flex;
  flex-direction: column;
}

.container-column {
  display: flex;
  flex-direction: row;
}

.container-item {
  padding: 5px
}

#links {
  display: inline-flex;
  flex-direction: row;
}

.stretch {
  flex-grow: 1;
}

</style>