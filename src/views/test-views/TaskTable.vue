<script setup>
import {useTasksStore} from '@/store/tasks'
import {onMounted} from 'vue'

import {VDataTable} from 'vuetify/labs/VDataTable'

const tasksStore = useTasksStore()

onMounted(async () => {
  if (tasksStore.tableItems.length === 0) {
    await tasksStore.initTable()
  }
})
</script>

<template>
  <VCard title="Task Done List">
    <!--  添加条目，添加类别，搜索框的功能栏 -->
    <VCardText>
      <VRow>
        <!-- 搜索框 -->
        <VCol
          class="d-flex justify-start"
          cols="4"
          md="4"
        >
          <VTextField
            v-model="tasksStore.tableSearch"
            append-inner-icon="tabler-search"
            clearable
            label="Search"
            variant="underlined"
          />
        </VCol>

        <!-- 按钮区域 -->
        <VCol
          class="d-flex align-center justify-end"
          cols="8"
          md="8"
        >
          <div class="demo-space-x">
            <!-- 👉 Edit item Dialog  -->
            <VDialog
              v-model="tasksStore.editDialog"
              max-width="600px"
              @click:outside="() => {
                tasksStore.editDialog = false
                tasksStore.resetEditItem()
              }"
            >
              <!-- Dialog Activator -->
              <template #activator="{ props }">
                <VBtn
                  color="primary"
                  size="38"
                  v-bind="props"
                  variant="tonal"
                  @click="tasksStore.openEditDialog"
                >
                  <VIcon size="22">
                    mdi-plus
                  </VIcon>
                </VBtn>
              </template>
              <!-- Dialog close btn -->
              <DialogCloseBtn
                @click="() => {
                  tasksStore.editDialog = false
                  tasksStore.resetEditItem()
                }"
              />
              <VCard
                prepend-icon="tabler-edit"
                title="Editing"
              >
                <VCardItem>
                  <VRow>
                    <!-- category（类别） -->
                    <VCol
                      cols="12"
                      md="4"
                      sm="4"
                    >
                      <VAutocomplete
                        v-model="tasksStore.editedItem.category"
                        :items="tasksStore.allLists.category"
                        append-inner-icon="tabler-tags"
                        chips
                        closable-chips
                        multiple
                        variant="underlined"
                        @click:append-inner="event => tasksStore.setItemContent(event, 'category')"
                        @update:search="newValue => tasksStore.onAutocompleteSearch(newValue, 'category')"
                      />
                    </VCol>

                    <!-- task（任务） -->
                    <VCol
                      cols="12"
                      md="4"
                      sm="4"
                    >
                      <VAutocomplete
                        v-model="tasksStore.editedItem.task"
                        :items="tasksStore.allLists.task"
                        append-inner-icon="tabler-school"
                        chips
                        closable-chips
                        multiple
                        variant="underlined"
                        @click:append-inner="event => tasksStore.setItemContent(event, 'task')"
                        @update:search="newValue => tasksStore.onAutocompleteSearch(newValue, 'task')"
                      />
                    </VCol>
                    <!-- target（具体任务对象） -->
                    <VCol
                      cols="12"
                      md="4"
                      sm="4"
                    >
                      <VAutocomplete
                        v-model="tasksStore.editedItem.target"
                        :items="tasksStore.allLists.target"
                        append-inner-icon="tabler-note"
                        chips
                        closable-chips
                        multiple
                        variant="underlined"
                        @click:append-inner="event => tasksStore.setItemContent(event, 'target')"
                        @update:search="newValue => tasksStore.onAutocompleteSearch(newValue, 'target')"
                      />
                    </VCol>

                    <!-- date（日期） -->
                    <VCol
                      cols="12"
                      md="4"
                      sm="4"
                    >
                      <VTextField
                        v-model="tasksStore.editedItem.date"
                        append-inner-icon="tabler-calendar"
                        variant="underlined"
                      />
                    </VCol>
                    <!-- slot（时间段） -->
                    <VCol
                      cols="12"
                      md="4"
                      sm="4"
                    >
                      <VTextField
                        v-model="tasksStore.editedItem.slot"
                        append-inner-icon="tabler-24-hours"
                        variant="underlined"
                      />
                    </VCol>
                    <!-- location（地点） -->
                    <VCol
                      cols="12"
                      md="4"
                      sm="4"
                    >
                      <VAutocomplete
                        v-model="tasksStore.editedItem.location"
                        :items="tasksStore.allLists.location"
                        append-inner-icon="tabler-current-location"
                        chips
                        closable-chips
                        multiple
                        variant="underlined"
                        @click:append-inner="event => tasksStore.setItemContent(event, 'location')"
                        @update:search="newValue => tasksStore.onAutocompleteSearch(newValue, 'location')"
                      />
                    </VCol>

                    <!-- detail（详细） -->
                    <VCol cols="12">
                      <VTextarea
                        v-model="tasksStore.editedItem.detail"
                        auto-grow

                        clearable
                        variant="solo-filled"
                      />
                    </VCol>
                  </VRow>
                </VCardItem>
                <VCardText class="d-flex justify-end flex-wrap gap-3">
                  <!--          delete button ❌ -->
                  <VBtn
                    v-if="tasksStore.editedItem.uuid !== ''"
                    color="error"
                    variant="tonal"
                    @click="tasksStore.deleteTask"
                  >
                    <VIcon
                      icon="tabler-circle-minus"
                      start
                    />
                    Delete
                  </VBtn>
                  <!-- confirm button✅ -->
                  <VBtn
                    color="success"
                    variant="tonal"
                    @click="tasksStore.saveEditedItem"
                  >
                    Accept
                    <VIcon
                      end
                      icon="tabler-checkbox"
                    />
                  </VBtn>
                </VCardText>
              </VCard>
            </VDialog>
            <!-- 👉 Add categories Dialog -->
            <VDialog
              v-model="tasksStore.categoryDialog"
              max-width="800px"
            >
              <template #activator="{ props }">
                <VBtn
                  color="warning"
                  size="38"
                  v-bind="props"
                  variant="tonal"
                  @click="tasksStore.categoryDialog = true"
                >
                  <VIcon size="20">
                    mdi-tag
                  </VIcon>
                </VBtn>
              </template>
              <!-- Dialog close btn -->
              <DialogCloseBtn @click="tasksStore.categoryDialog = false"/>
              <VCard title="Manage Categories">
                <VCardText>
                  <VRow>
                    <!-- Loop through different category types -->
                    <VCol
                      v-for="(itemList, listName) in tasksStore.allLists"
                      :key="listName"
                      class="py-4"
                    >
                      <h4>{{ listName }}</h4> <!-- 显示数据的键名作为列的名称 -->
                      <div
                        v-for="(item, index) in itemList"
                        :key="item"
                        class="my-2"
                      >
                        <VChip
                          :color="tasksStore.getRandomChipColor()"
                          closable
                          @click:close="tasksStore.updateCategory(index, listName)"
                        >
                          {{ item }}
                        </VChip>
                      </div>
                      <!-- Text field for entering new items -->
                      <VTextField
                        v-model="tasksStore.newItemCategories[listName]"
                        append-inner-icon="mdi-plus"
                        class="mb-0"
                        variant="solo-filled"
                        @click:append-inner="tasksStore.updateCategory(-1, listName)"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VDialog>

            <VBtn
              :loading="tasksStore.workingTasks > 0"
              color="info"
              icon="tabler-cloud-upload"
              size="38"
              variant="tonal"
              @click="tasksStore.categoryDialog = true"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
    <VCardItem style="position: relative;">
      <!-- Data table -->
      <VDataTable
        :headers="tasksStore.headers"
        :items="tasksStore.tableItems"

        :items-per-page="tasksStore.options.itemsPerPage"
        :page="tasksStore.options.page"
        :search="tasksStore.tableSearch"
        :sort-by="tasksStore.options.sortBy"
        :sort-desc="tasksStore.options.sortDesc"
        hover="true"
        @update:options="tasksStore.options = $event"
        @click:row="(event, { item }) => tasksStore.openEditDialog(item.value)"
      >
        <!--      no-data-state -->
        <template #no-data>
          <VOverlay
            v-model="tasksStore.loading"
            class="align-center justify-center"
            contained
            persistent
          >
            <VProgressCircular indeterminate/>
          </VOverlay>
        </template>

        <!-- 自定义task列 -->
        <template #item.task="{ item }">
          <div
            :style="{ overflow: 'auto', maxWidth: '100%' }"
            class="d-flex flex-wrap"
          >
            <VChip
              v-for="(task, index) in item.raw.task"
              :key="index"
              :color="tasksStore.getRandomChipColor()"
              :style="{ margin: '0 4px 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }"
            >
              {{ task }}
            </VChip>
          </div>
        </template>
        <!-- 自定义category列 -->
        <template #item.category="{ item }">
          <div
            v-for="(category, index) in item.raw.category"
            :key="index"
            :style="{ overflow: 'auto', maxWidth: '100%' }"
            class="d-flex flex-wrap"
          >
            <VChip
              :color="tasksStore.getRandomChipColor()"
              :style="{ margin: '0 4px 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }"
            >
              {{ category }}
            </VChip>
          </div>
        </template>
        <!-- target -->
        <template #item.target="{ item }">
          <div
            v-for="(target, index) in item.raw.target"
            :key="index"
            :style="{ overflow: 'auto', maxWidth: '100%' }"
            class="d-flex flex-wrap"
          >
            <VChip
              :color="tasksStore.getRandomChipColor()"
              :style="{ margin: '0 4px 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }"
            >
              {{ target }}
            </VChip>
          </div>
        </template>
        <!-- 自定义location列 -->
        <template #item.location="{ item }">
          <div
            v-for="(location, index) in item.raw.location"
            :key="index"
            :style="{ overflow: 'auto', maxWidth: '100%' }"
            class="d-flex flex-wrap"
          >
            <VChip
              :color="tasksStore.getRandomChipColor()"
              :style="{ margin: '0 4px 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }"
            >
              {{ location }}
            </VChip>
          </div>
        </template>
        <!--    底部显示条数 -->
        <template #bottom>
          <VCardText class="pt-2">
            <VRow>
              <VCol
                cols="3"
                lg="2"
              >
                <VTextField
                  v-model="tasksStore.options.itemsPerPage"
                  hide-details
                  label="Rows per page:"
                  max="15"
                  min="-1"
                  type="number"
                  variant="underlined"
                />
              </VCol>
              <VCol
                class="d-flex justify-end"
                cols="9"
                lg="10"
              >
                <VPagination
                  v-model="tasksStore.options.page"
                  :length="Math.ceil(tasksStore.tableItems.length / tasksStore.options.itemsPerPage)"
                  total-visible="5"
                />
              </VCol>
            </VRow>
          </VCardText>
        </template>
      </VDataTable>
    </VCardItem>
  </VCard>

  <!-- Similar dialog boxes for Task and Location -->
</template>
