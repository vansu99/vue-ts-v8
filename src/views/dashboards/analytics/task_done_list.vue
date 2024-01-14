<script setup>
import { onMounted } from 'vue'

import { VDataTable } from 'vuetify/labs/VDataTable'

// vDataTable
// eslint-disable-next-line import/no-duplicates
import { getRandomChipColor } from './taskDoneManager'

import {
  dataTable,
  itemCategoryEditDialog,
  itemEditDialog,
  workingTasks,
// eslint-disable-next-line import/no-duplicates
} from './taskDoneManager'

onMounted(async () => {
  if (dataTable.tableItems.length === 0) {
    await dataTable.fetchData()
    await itemCategoryEditDialog.init_category()
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
            v-model="dataTable.search"
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
            <VBtn
              color="primary"
              size="38"
              variant="tonal"
              @click="itemEditDialog.addNewConfirm"
            >
              <VIcon size="22">
                mdi-plus
              </VIcon>
            </VBtn>

            <VBtn
              color="warning"
              size="38"
              variant="tonal"
              @click="itemCategoryEditDialog.categoryDialog = true"
            >
              <VIcon size="20">
                mdi-tag
              </VIcon>
            </VBtn>
            <VBtn
              :loading="workingTasks > 0"
              color="info"
              icon="tabler-cloud-upload"
              size="38"
              variant="tonal"
              @click="itemCategoryEditDialog.categoryDialog = true"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
    <VCardItem style="position: relative;">
      <!-- Data table -->
      <VDataTable
        :headers="dataTable.headers"
        :items="dataTable.tableItems"

        :items-per-page="dataTable.options.itemsPerPage"
        :page="dataTable.options.page"
        :search="dataTable.search"
        :sort-by="dataTable.options.sortBy"
        :sort-desc="dataTable.options.sortDesc"
        @update:options="dataTable.options = $event"
        @click:row="itemEditDialog.editConfirm"
      >
        <!--      no-data-state -->
        <template #no-data>
          <VOverlay
            v-model="dataTable.loading"
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
              :color="getRandomChipColor()"
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
              :color="getRandomChipColor()"
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
              :color="getRandomChipColor()"
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
              :color="getRandomChipColor()"
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
                  v-model="dataTable.options.itemsPerPage"
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
                  v-model="dataTable.options.page"
                  :length="Math.ceil(dataTable.tableItems.length / dataTable.options.itemsPerPage)"
                  total-visible="5"
                />
              </VCol>
            </VRow>
          </VCardText>
        </template>
      </VDataTable>
    </VCardItem>

    <!-- 👉 Edit item Dialog  -->
    <VDialog
      v-model="itemEditDialog.editDialog"
      max-width="600px"
      @click:outside="itemEditDialog.closeEdit"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="itemEditDialog.closeEdit"/>
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
                v-model="itemEditDialog.editedItem.category"
                :items="itemCategoryEditDialog.allLists.category"
                append-inner-icon="tabler-tags"
                chips
                closable-chips
                multiple
                variant="underlined"
                @click:append-inner="event => itemEditDialog.setItemContent(event, 'category')"
                @update:search="newValue => itemEditDialog.onSearchInput(newValue, 'category')"
              />
            </VCol>

            <!-- task（任务） -->
            <VCol
              cols="12"
              md="4"
              sm="4"
            >
              <VAutocomplete
                v-model="itemEditDialog.editedItem.task"
                :items="itemCategoryEditDialog.allLists.task"
                append-inner-icon="tabler-school"
                chips
                closable-chips
                multiple
                variant="underlined"
                @click:append-inner="event => itemEditDialog.setItemContent(event, 'task')"
                @update:search="newValue => itemEditDialog.onSearchInput(newValue, 'task')"
              />
            </VCol>
            <!-- target（具体任务对象） -->
            <VCol
              cols="12"
              md="4"
              sm="4"
            >
              <VAutocomplete
                v-model="itemEditDialog.editedItem.target"
                :items="itemCategoryEditDialog.allLists.target"
                append-inner-icon="tabler-note"
                chips
                closable-chips
                multiple
                variant="underlined"
                @click:append-inner="event => itemEditDialog.setItemContent(event, 'target')"
                @update:search="newValue => itemEditDialog.onSearchInput(newValue, 'target')"
              />
            </VCol>

            <!-- date（日期） -->
            <VCol
              cols="12"
              md="4"
              sm="4"
            >
              <VTextField
                v-model="itemEditDialog.editedItem.date"
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
                v-model="itemEditDialog.editedItem.slot"
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
                v-model="itemEditDialog.editedItem.location"
                :items="itemCategoryEditDialog.allLists.location"
                append-inner-icon="tabler-current-location"
                chips
                closable-chips
                multiple
                variant="underlined"
                @click:append-inner="event => itemEditDialog.setItemContent(event, 'location')"
                @update:search="newValue => itemEditDialog.onSearchInput(newValue, 'location')"
              />
            </VCol>

            <!-- detail（详细） -->
            <VCol cols="12">
              <VTextarea
                v-model="itemEditDialog.editedItem.detail"
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
            v-if="itemEditDialog.editedIndex !== -1"
            color="error"
            variant="tonal"
            @click="itemEditDialog.deleteItem(dataTable.tableItems)"
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
            @click="itemEditDialog.editItem"
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
      v-model="itemCategoryEditDialog.categoryDialog"
      max-width="800px"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="itemCategoryEditDialog.categoryDialog = false"/>
      <VCard title="Manage Categories">
        <VCardText>
          <VRow>
            <!-- Loop through different category types -->
            <VCol
              v-for="(itemList, listName) in itemCategoryEditDialog.allLists"
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
                  :color="getRandomChipColor()"
                  closable
                  @click:close="itemCategoryEditDialog.removeCatItem(index, listName)"
                >
                  {{ item }}
                </VChip>
              </div>
              <!-- Text field for entering new items -->
              <VTextField
                v-model="itemCategoryEditDialog.newItemCategories[listName]"
                append-inner-icon="mdi-plus"
                class="mb-0"
                variant="solo-filled"
                @click:append-inner="itemCategoryEditDialog.addCatItem(listName)"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>

  <!-- Similar dialog boxes for Task and Location -->
</template>
