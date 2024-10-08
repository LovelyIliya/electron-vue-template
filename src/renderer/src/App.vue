<template>
  <p>hello word</p>
  <button @click="testUpdate">检测更新</button>
  <p v-if="noUp">无新版本</p>
  <button @click="notification">通知</button>
  <p id="output"></p>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const noUp = ref(false)
const testUpdate = () => window.electron.ipcRenderer.send('testUpdate')
window.electron.ipcRenderer.on('update-not-available', () => {
  noUp.value = true
})

const notification = () => {
  const NOTIFICATION_TITLE = '通知'
  const NOTIFICATION_BODY = '测试通知'
  const CLICK_MESSAGE = '点击通知!'
  new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick = () =>
    ((document.getElementById('output') as HTMLElement).innerText = CLICK_MESSAGE)
}
</script>
