import fastapiClient from '@/plugins/fastapiClient'
import axios from "axios/index"

export const fetchAllTasks = async () => {
  try {
    const response = await fastapiClient.get('task_entries/get_all_table_items')

    return response.data.map(item => {
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
    })
  } catch (error) {
    console.error('There was a problem fetching data:', error)
  }
}

export const upsertTask = async taskData => {
  try {
    const response = await fastapiClient.post('task_entries/upsert_entry', taskData)

    return response.data
  } catch (error) {
    console.error('There was a problem with upsertTask:', error)
  }
}

export const deleteTask = async uuid => {
  try {
    await fastapiClient.delete(`task_entries/delete_entry/${uuid}`)
  } catch (error) {
    console.error('There was a problem with deleteTask:', error)
  }
}

export const fetchAllCategories = async () => {
  try {
    const response = await fastapiClient.get('task_categories/get_all_task_category')

    return response.data
  } catch (error) {
    console.error('There was a problem fetching categories:', error)
  }
}

export const upsertCategory = async allList => {
  try {
    // console.log('allList:', allList)
    await fastapiClient.put(`task_categories/update_category`, allList)
  } catch (error) {
    console.error('There was a problem updating category:', error)
  }
}
export const upload_bill = async formData => {
  try {
    await fastapiClient.post('consumption/update_consumption', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    alert('文件成功上传并处理。')
  } catch (error) {
    alert('文件上传失败。')
  }
}

