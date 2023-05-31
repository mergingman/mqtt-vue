import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connections', () => {
  const activeConnection = ref(null)
  const connections = ref(initConnections())

  async function postConnection(connection) {
    await fetch("http://localhost:8080/connections", {
      method: 'POST',
      body: connection
    })
    connections.value =
  }

  async function getConnections() {
    const response = await fetch("http://localhost:8080/connections")
    const json = response.json()
    return json['_embedded']
  }

  return { activeConnection, connections, postConnection }
})
