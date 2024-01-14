<template>
  // TODO: testing
  <v-snackbar
    v-model="showSnackbar"
    :color="snackbarColor"
    :timeout="3000"
    location="“top”"
  >
    <template v-if="currentTask.status === 'loading'">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
      {{ currentTask.message }}
    </template>
    <template v-else>
      <v-icon left>{{ snackbarIcon }}</v-icon>
      {{ currentTask.message }}
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
// eslint-disable-next-line import/extensions
import { useGlobalState } from '@/store/global_state.ts'

const globalState = useGlobalState()

const currentTask = ref({})

const showSnackbar = computed(() => globalState.tasks.length > 0)

watch(globalState.tasks, newTasks => {
  if (newTasks.length > 0) {
    currentTask.value = newTasks[newTasks.length - 1]
  }
}, { deep: true })

const snackbarIcon = computed(() => {
  if (currentTask.value.status === 'success') {
    return 'mdi-check-circle'
  } else if (currentTask.value.status === 'error') {
    return 'mdi-alert-circle'
  }
  return ''
})

const snackbarColor = computed(() => {
  if (currentTask.value.status === 'success') {
    return 'green'
  } else if (currentTask.value.status === 'error') {
    return 'red'
  }
  return 'primary'
})
</script>

<style scoped>
</style>
