<script setup>

const props = defineProps({
  connections: {
    type: Array
  }
})



const emit = defineEmits(["connectionChange"])

</script>

<template>
    <div class="connection-menu">
        Connections 
        <li v-for="connection in connections" :key="connection">
            {{ connection }}
        </li>
    </div>

</template>

<style scoped>

#collection-menu {
    display: flex;
}
</style>