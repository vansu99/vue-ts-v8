<script lang="ts" setup>
import { useTheme } from 'vuetify'
import TaskTable from "@/views/test-views/TaskTable.vue"

</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Website analytics -->
    <VCol cols="12">

      <TaskTable/>

    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
