// eslint-disable-next-line valid-appcardcode-demo-sfc
import { reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import axios from '@axios'

const defaultItem = {
  date: '',
  category: [],
  task: [],
  target: [],
  detail: '',
  slot: '',
  location: [],
}

const getRandomChipColor = () => {
  const colors = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const randomIndex = Math.floor(Math.random() * colors.length)

  return colors[randomIndex]
}

const workingTasks = ref(0)

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

class ItemEditDialog {
  /*
    1. 添加记录
    2. 修改记录
    3. 删除记录
   */
  constructor() {
    // 添加修改记录的弹窗
    this.editDialog = ref(false)
    this.editedIndex = ref(-1)
    this.editedItem = reactive(defaultItem)
    this.searchInput = {
      location: null,
      category: null,
      target: null,
      task: null,
    }

    // console.log('ItemEditDialog constructor is called')
  }

  editConfirm = (event, { item }) => {
    // 在data中找到需要修改的对象和他的索引，并打开编辑对话框
    // console.log("event:",evnent)
    // console.log("item:",item.value)
    this.editedIndex.value = dataTable.tableItems.indexOf(item.value)

    // console.log("index=",this.editedIndex.value)

    this.editedItem = toReactive(item.value)

    // console.log("editedItem:",this.editedItem)
    this.editDialog.value = true
  }

  onSearchInput = (newValue, listname) => {
    console.log('newvalue:', newValue, 'listname:', listname)
    this.searchInput[listname] = newValue
  }

  setItemContent = (event, listname) => {
    // console.log('Event Target:', event.target)
    // console.log('Event Current Target:', event.currentTarget)
    // console.log('this.searchInput:', this.searchInput)
    // set chosen value to v-model
    const chosen = this.searchInput[listname]
    if (chosen.length === 0)
      return

    this.editedItem[listname].push(chosen)
    this.searchInput[listname] = ''

    // no-exist
    if (!itemCategoryEditDialog.allLists[listname].includes(chosen)) {
      itemCategoryEditDialog.newItemCategories[listname] = chosen
      itemCategoryEditDialog.addCatItem(listname)
    }
  }

  editItem = async event => {
    // console.log("event:",event)
    // console.log('Event Target:', event.target)
    // console.log('Event Current Target:', event.currentTarget)
    workingTasks.value++
    let rawData = deepCopy(this.editedItem)

    // Generate a UUID if it's a new entry
    if (this.editedIndex.value === -1)
      rawData.uuid = uuidv4()

    // Prepare the URL and method for Axios based on whether it's an update or new entry
    let url = 'http://localhost:5000/task_entries/add_entry'
    let method = 'post'
    if (this.editedIndex.value > -1) {
      url = `http://localhost:5000/task_entries/update_entry/${rawData.uuid}`
      method = 'put'
    }
    rawData = JSON.stringify(rawData)
    console.log('rawData', rawData)
    axios({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: rawData,
    })
      .then(response => {
        // console.log(response.data)
        dataTable.fetchData()
      })
      .catch(error => {
        console.error('There was a problem sending data:', error)
      })
      .finally(() => {
        workingTasks.value-- // 减少正在进行的异步任务的数量
      })
    this.closeEdit()
  }

  addNewConfirm = () => {
    // 变成2023-11-11这种格式
    this.editedItem.date = new Date().toLocaleDateString().replace(/\//g, '-')
    this.editDialog.value = true
  }

  deleteItem = async taskList => {
    const uuid = taskList[this.editedIndex.value].uuid

    workingTasks.value++ // 增加正在进行的异步任务的数量

    axios.delete(`http://localhost:5000/task_entries/delete_entry/${uuid}`)
      .then(response => {
        dataTable.fetchData()
      })
      .catch(error => {
        console.error('There was a problem deleting data:', error)
      })
      .finally(() => {
        workingTasks.value-- // 减少正在进行的异步任务的数量
      })
    this.closeEdit()
  }

  closeEdit = () => {
    this.editDialog.value = false
    this.editedIndex.value = -1
    this.editedItem = reactive(deepCopy(this.editedItem))
    this.editedItem.detail = ref('')
  }
}

class ItemCategoryEditDialog {
  /*
    1. 添加分类
    2. 删除分类
     */
  constructor() {
    this.categoryDialog = ref(false)

    // 已有的分类
    this.allLists = reactive({
      task: [],
      location: [],
      target: [],
      category: [],
    })
    this.newItemCategories = reactive({
      category: '',
      task: '',
      target: '',
      location: '',
    })

    // console.log('ItemCategoryEditDialog constructor is called')
  }

  init_category = async () => {
    // console.log('init_category ...')
    workingTasks.value++
    axios.get('http://localhost:5000/task_categories/get_all_task_category').then(response => {
      this.allLists = reactive(response.data)

      // console.log("data:",response.data)
    })
      .catch(error => {
        console.error('There was a problem with init_category:', error)
      })
      .finally(() => {
        workingTasks.value--
      })
  }

  addCatItem = async listName => {
    // console.log('Called addCatItem is called')
    workingTasks.value++ // 增加正在进行的异步任务的数量

    const newItem = this.newItemCategories[listName].trim()
    if (newItem !== '') {
      axios.put(`http://localhost:5000/task_categories/update_category/${listName}`, { add: newItem })
        .then(response => {
          if (response.data)
            this.allLists[listName].push(newItem)
        })
        .catch(error => {
          console.error('There was a problem adding category:', error)
        })
        .finally(() => {
          workingTasks.value-- // 减少正在进行的异步任务的数量
        })
    }
    this.newItemCategories[listName] = ''
  }

  removeCatItem = async (index, listName) => {
    // console.log('Called removeCatItem is called')
    workingTasks.value++ // 增加正在进行的异步任务的数量

    const itemToRemove = this.allLists[listName][index]

    // console.log("itemToRemove:",itemToRemove)
    axios.put(`http://localhost:5000/task_categories/update_category/${listName}`, { remove: itemToRemove })
      .then(response => {
        if (response.data)
          this.allLists[listName].splice(index, 1)
      })
      .catch(error => {
        console.error('There was a problem deleting category:', error)
      })
      .finally(() => {
        workingTasks.value-- // 减少正在进行的异步任务的数量
      })
  }
}

class DataTable {
  constructor() {
    // 搜索栏数据
    this.search = ref('')
    this.loading = ref('success')

    // 表头数据
    this.headers = [
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

    ]

    // 表格数据
    this.tableItems = ref([])

    // 分页数据
    this.options = ref({
      page: 1,
      itemsPerPage: 15,
      sortBy: ['slot', 'date'], // 首先按 'slot' 排序，然后按 'date' 排序
      sortDesc: [true, true], // 'slot' 升序，'date' 升序
    })

    // console.log('DataTable constructor is called')
  }

  fetchData = async () => {
    // console.log('Fetching data...')
    workingTasks.value++ // 增加正在进行的异步任务的数量

    axios.get('http://localhost:5000/task_entries/get_all_table_items')
      .then(response => {
        const all_data = response.data

        this.tableItems.value = all_data.map(reactive(item => {
          // const location = item.location.split(',')

          return {
            uuid: item.uuid,
            date: item.date,
            category: item.category,
            task: item.task,
            detail: item.detail,
            slot: item.slot,
            target: item.target,
            location: item.location,
          }
        }))
      })
      .catch(error => {
        console.error('There was a problem fetching data:', error)
      })
      .finally(() => {
        workingTasks.value-- // 减少正在进行的异步任务的数量
      })
  }

  isEmpty = () => {
    return this.tableItems.value.length === 0
  }
}

const itemEditDialog = reactive(new ItemEditDialog())
const itemCategoryEditDialog = reactive(new ItemCategoryEditDialog())
const dataTable = reactive(new DataTable())

export { itemEditDialog, itemCategoryEditDialog, dataTable, getRandomChipColor, workingTasks }
