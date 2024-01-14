// eslint-disable-next-line valid-appcardcode-code-prop
import {defineStore} from 'pinia'
import {v4 as uuidv4} from 'uuid'
import {watch} from 'vue'
import {deleteTask, fetchAllCategories, fetchAllTasks, upsertCategory, upsertTask} from '@/store/api'

const defaultItem
  = {
    date: '',
    category: [],
    task: [],
    target: [],
    detail: '',
    slot: '',
    location: [],
    uuid: '',
}

export const useTasksStore = defineStore({
  id: 'tasks',

  state: () => ({
    // background task
    workingTasks: 0,

    // table data
    headers: [
      {
        title: 'Date',
        key: 'date',
        sortable: true,
        width: '10%',
      },
      {
        title: 'Slot',
        key: 'slot',
        sortable: true,
        width: '10%',
      },
      {
        title: 'Category',
        key: 'category',
        width: '10%',
      },
      {
        title: 'Task',
        key: 'task',
        width: '10%',
      },
      {
        title: 'target',
        key: 'target',
        width: '10%',
      },
      {
        title: 'Location',
        key: 'location',
        width: '5%',
      },
      {
        title: 'Detail',
        key: 'detail',
        width: '45%',
      },

    ],
    tableItems: [],
    options: {
      page: 1,
      itemsPerPage: 15,
      sortBy: ['slot', 'date'], // 首先按 'slot' 排序，然后按 'date' 排序
      sortDesc: [true, true], // 'slot' 升序，'date' 升序
    },
    tableSearch: '',
    loading: true,

    // edit dialog data
    editDialog: false,
    editedItem: defaultItem,
    autocompleteSearch: {
      location: null,
      category: null,
      target: null,
      task: null,
    },
    saveEdit: false,
    deleteUuid: null, // 需要删除的对象的 UUID

    // category data
    allLists: {
      task: [],
      location: [],
      target: [],
      category: [],
    },
    newItemCategories: {
      category: '',
      task: '',
      target: '',
      location: '',
    },
    categoryDialog: false,
    saveCategory: false,
    categoryUuid: null,

  }),

  getters: {
    isEmpty: state => {
      return state.tableItems.length === 0
    },
  },

  actions: {
    async initTable() {
      this.tableItems = await fetchAllTasks()

      const fetchedData = await fetchAllCategories()

      const {
        uuid: categoryUuid,
        ...allList
      } = fetchedData

      this.allLists = allList
      this.categoryUuid = categoryUuid

      // Watch saveEdit changes
      watch(() => this.saveEdit, async () => {
        if (this.editedItem) {
            try {
                this.workingTasks++
                await upsertTask(this.editedItem)
                this.tableItems = await fetchAllTasks()
                this.resetEditItem()
            } catch (error) {
                console.error('There was a problem with upsertTask:', error)
            } finally {
                this.workingTasks--
            }
        }
      })

      // Watch deleteUuid changes
      watch(() => this.deleteUuid, async newDeleteUuid => {
        if (newDeleteUuid) {
            try {
                this.workingTasks++
                await deleteTask(newDeleteUuid)
                this.tableItems = await fetchAllTasks()
                this.resetEditItem()
            } catch (error) {
                console.error('There was a problem with deleteTask:', error)
            } finally {
                this.workingTasks--
            }
        }
      })

      // TODO: Watch catergory changes
      watch(() => this.saveCategory, async () => {
        try {
            this.workingTasks++
            await upsertCategory({uuid: this.categoryUuid, ...this.allLists})

            const {
                uuid: categoryUuid,
                ...allList
            } = fetchedData

            this.allLists = allList
            this.categoryUuid = categoryUuid
        } catch (error) {
            console.error('There was a problem with upsertCategory:', error)
        } finally {
            this.workingTasks--
        }
      })
    },

    // tools
    getRandomChipColor() {
      const colors = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
      const randomIndex = Math.floor(Math.random() * colors.length)

      return colors[randomIndex]
    },

    // edit dialog action
    openEditDialog(item) {
      console.log('item:', item)
        if (!item.uuid)
            // this.editedItem.date = new Date().toLocaleDateString().replace(/\//g, '-')
            this.editedItem.date = new Date().toISOString().split('T')[0]
        else
            this.editedItem = item

      this.editDialog = true
    },
    onAutocompleteSearch(newValue, listname) {
      console.log('newvalue:', newValue, 'listname:', listname)
      this.autocompleteSearch[listname] = newValue
    },

    async setItemContent(event, listname) {
      // console.log('Event Target:', event.target)
      // console.log('Event Current Target:', event.currentTarget)
      console.log('this.autocompleteSearch:', this.autocompleteSearch)

      // set chosen value to v-model
      const chosen = this.autocompleteSearch[listname]
      if (chosen.length === 0)
        return

      // no-exist
      if (!this.allLists[listname].includes(chosen)) {
        this.editedItem[listname].push(chosen)
        this.autocompleteSearch[listname] = ''
        this.newItemCategories[listname] = chosen
        this.updateCategory(-1, listname)
      }
    },
    async saveEditedItem() {
      this.editDialog = false
      if (this.editedItem.uuid === '') {
          this.editedItem.uuid = uuidv4()
          this.tableItems.unshift(this.editedItem) // 插入头部
      }
      this.saveEdit = !this.saveEdit
    },
    deleteTask() {
      this.editDialog = false
      this.tableItems.splice(this.editedIndex, 1)
      this.deleteUuid = this.editedItem.uuid
    },
    resetEditItem() {
      console.log('close:')
      this.editedItem = { ...this.editedItem }
      this.editedItem.detail = ''
      this.editedItem.uuid = ''
    },

      // category action
    updateCategory(index, listname) {
        if (index === -1) {
            this.allLists[listname].push(this.newItemCategories[listname])
            this.newItemCategories[listname] = ''
        } else {
            this.allLists[listname].splice(index, 1)
        }
      this.saveCategory = !this.saveCategory
    },
  },
})
