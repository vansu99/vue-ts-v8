// TODO:testing

import { defineStore } from 'pinia'

export const useGlobalState = defineStore('globalState', {
  state: () => ({
    tasks: [],
  }),
  actions: {
    addBackgroundTask(taskId, message) {
      this.tasks.push({
        id: taskId,
        status: 'loading',
        message: message,
      })
    },
    updateTaskStatus(taskId, status, message) {
      const task = this.tasks.find(task => task.id === taskId)
      if (task) {
        task.status = status
        task.message = message
      }
    },
  },
})
