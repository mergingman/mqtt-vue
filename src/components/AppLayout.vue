<script setup>
import { reactive } from 'vue';
import ConnectionBar from './ConnectionBar.vue';
import { RouterView } from 'vue-router'
const connections = reactive(["test", "test1", "test2"])
</script>


<template>
    <div id="wrapper">
        <div id="head-bar">    
            {{ "MQTT-Explorer" }}
        </div>
        <div id="side-bar">
            <ConnectionBar :connections="connections">
            </ConnectionBar>
        </div>
        <div id="content">
            <RouterView></RouterView>
        </div>
    </div>

</template>

<style scoped>
#head-bar {
    background-color: #A3C1AD;
    grid-area: header;
    padding: 10px;
}

#wrapper {
    display: grid;
    grid-template-areas:    'header header'
                            'sidebar content';
    grid-template-columns: 15vw 85vw;
    grid-template-rows: auto 1fr;
    width: 100vw;
    height: 100vh;
}

#side-bar {
    display: flex;
    grid-area: sidebar;
}

#content {
    grid-area: content;
    display: grid;
    grid-template-areas:    'broker publish subscribe'
                            'data status';
}


</style>