import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const userNotFound = ref(true)

    async function setUser() {
        user.value = getUser()
    }

    async function getUser() {
        const usernameResponse = await fetch("http://localhost:8080/api/username")
        if(!response.ok) {
            return
        }
        const username = usernameResponse.json()
        const response = await fetch(`http://localhost:8080/api/user/${username}`)
        if(response.ok) {
           userNotFound.value = false
        }
        const json = response.json()
        return json
    }

    return { user, userNotFound, setUser }
})
