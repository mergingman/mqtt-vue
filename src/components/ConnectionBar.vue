<script setup>
import {useConnectionStore} from "../stores/connections";
import {storeToRefs} from "pinia";

const connectionStore = useConnectionStore();
const {connections} = storeToRefs(connectionStore)
</script>

<template>
  <div class="container-row">
    <div>
      <label class="container-item">Connections</label>
      <RouterLink to="/" class="container-item">Add Connection</RouterLink>
    </div>
    <nav>
      <RouterLink v-for="connection in connections" :key="connection" :to="'/connections/' + connection.name">
        {{ connection.name }}
        <br/>
      </RouterLink>
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

.stretch {
  flex-grow: 1;
}

</style>