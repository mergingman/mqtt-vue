import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useConnectionStore = defineStore('connections', () => {
    const connections = ref(getFromLocalStorage())

    function getFromLocalStorage() {
        let storageConnections = JSON.parse(localStorage.getItem("connections"))
        if(!storageConnections || !Array.isArray(storageConnections)) {
            return []
        } else {
            return storageConnections
        }
    }

    function setHiveExampleInLocalStorage() {
        let storageConnections = JSON.parse(localStorage.getItem("connections"))
        if (!storageConnections || !Array.isArray(storageConnections)) {
            storageConnections = []
        }
        const existingHiveExample = storageConnections.find(con => con.name === "hive-example")
        if (!existingHiveExample) {
            storageConnections.push({
                name: "hive-example",
                host: "broker.hivemq.com",
                port: 8000,
                path: "mqtt",
                mqttClientId: `mqtt_client_${Math.random().toString(16).substring(2, 10)}`
            })
            localStorage.setItem("connections", JSON.stringify(storageConnections))
        }
    }

    function addConnection(connection) {
        connections.value.push(connection)
        localStorage.setItem("connections", JSON.stringify(connections.value))
    }

    function setTopics(connectionName, topics) {
        const existingConnection = connections.value.find(con => con.name === connectionName)
        if (existingConnection) {
            if (!existingConnection.topics) {
                existingConnection.topics = []
            }
            existingConnection.topics = topics
        }
        localStorage.setItem("connections", JSON.stringify(connections.value))
    }

    function getConnection(connectionName) {
        if (connectionName === "new") {
            return {name: "new"}
        }
        return connections.value.find(con => con.name === connectionName)
    }

    setHiveExampleInLocalStorage();

    return {connections, addConnection, setTopics, getConnection}
})
