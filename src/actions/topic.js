
import Ajax from '../common/ajax'
import Promise from 'promise'

import loadList from './common/load-list'

export function addTopic({ data, callback = ()=>{} }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken
    return new Promise(async (resolve, reject) => {
      Ajax({
        url: '/add-topic',
        type: 'post',
        data,
        headers: { AccessToken: accessToken },
        callback
      }).then(resolve).catch(reject)
    })
  }
}

/*
export function addTopic({ name, brief, avatar, description, parentId, callback = ()=>{} }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken

    Ajax({
      url: '/add-topic',
      type: 'post',
      data: {
        parent_id: parentId,
        name: name,
        brief: brief,
        avatar: avatar,
        description: description
      },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}
*/

export const updateTopic = ({ data }) => {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken
    return new Promise(async (resolve, reject) => {
      Ajax({
        url: '/topic/update',
        type: 'post',
        data,
        headers: { AccessToken: accessToken },
        callback: (res) => {
          console.log(res);
        }
      }).then(resolve).catch(reject)
    })
  }
}
/*
export function updateTopicById({ id, name, brief, avatar, description, parentId, callback = ()=>{} }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken
    let state = getState().topic

    Ajax({
      url: '/update-topic',
      type: 'post',
      data: {
        id: id,
        parent_id: parentId,
        name: name,
        brief: brief,
        avatar: avatar,
        description: description
      },
      headers: { AccessToken: accessToken },
      callback: (res)=>{

        if (res && res.success) {
          for (let i in state) {
            let data = state[i].data
            if (data.length > 0) {
              for (let n = 0, max = data.length; n < max; n++) {
                if (data[n]._id == id) {
                  state[i].data[n].name = name
                  state[i].data[n].brief = brief
                  state[i].data[n].avatar = avatar
                  state[i].data[n].description = description
                  state[i].data[n].parent_id = parentId
                }
              }
            }
          }
          dispatch({ type: 'SET_NODE', state })
        }

        callback(res)
      }
    })

  }
}
*/
export function followTopic({ id, callback }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken

    Ajax({
      url: '/add-follow',
      // url: '/follow-node/'+id,
      type: 'post',
      data: { topic_id: id },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'FOLLOW_NODE', nodeId: id, status: true })
        }
      }
    })

  }
}

export function unfollowTopic({ id, callback }) {
  return (dispatch, getState) => {
    const accessToken = getState().user.accessToken

    Ajax({
      url: '/remove-follow',
      type: 'post',
      data: { topic_id: id },
      headers: { AccessToken: accessToken },
      callback: (res)=>{
        if (res && res.success) {
          dispatch({ type: 'FOLLOW_NODE', nodeId: id, status: false })
        }
      }
    })

  }
}




export function loadTopics({ name, filters = {}, callback = ()=>{}, restart = false  }) {
  return (dispatch, getState) => {

    return loadList({
      dispatch,
      getState,

      name,
      restart,
      filters,

      // processList: processPostsList,

      reducerName: 'topic',
      api: '/topic',
      actionType: 'SET_TOPIC_LIST_BY_NAME'
    })
  }
}


export function loadTopicById({ id, callback = ()=>{} }) {
  return (dispatch, getState) => {

    return loadTopics({
      name: id,
      filters: {
        query: { _id: id }
      },
      callback,
      restart: true
    })(dispatch, getState)

    /*
    Ajax({
      url: '/topic',
      params: { topic_id: id },
      callback: (res)=>{
        if (res && res.success && res.data && res.data.length > 0) {
          dispatch({ type: 'ADD_NODE', node: res.data[0] })
          callback(res.data[0])
        } else {
          callback(null)
        }

      }
    })
    */

  }
}


/*
export function loadTopics({ name, filters = {}, callback = ()=>{} }) {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    let list = getState().topic[name] || {}

    if (typeof(list.more) != 'undefined' && !list.more || list.loading) return

    if (!Reflect.has(list, 'data')) list.data = []

    if (!Reflect.has(list, 'filters')) {

      if (!Reflect.has(filters, 'query')) filters.query = {}
      if (!Reflect.has(filters, 'select')) filters.select = { '__v': 0 }
      if (!Reflect.has(filters, 'options')) filters.options = {}
      if (!Reflect.has(filters.options, 'skip')) filters.options.skip = 0
      if (!Reflect.has(filters.options, 'limit')) filters.options.limit = 15

      list.filters = filters
    } else {
      // 如果以及存在筛选条件，那么下次请求，进行翻页
      filters = list.filters
      filters.options.skip += filters.options.limit
    }

    if (!Reflect.has(list, 'more')) list.more = true
    // if (!Reflect.has(list, 'count')) list.count = 0
    if (!Reflect.has(list, 'loading')) list.loading = true

    dispatch({ type: 'SET_TOPIC_LIST_BY_NAME', name, data: list })

    let headers = {}

    if (accessToken) {
      headers.AccessToken = accessToken
    } else {
      headers = null
    }

    return Ajax({ url: '/topic', data: filters, headers }).then((res)=>{

      list.loading = false

      if (res.success) {
        list.more = res.data.length < filters.options.limit ? false : true
        list.data = list.data.concat(res.data)
        list.filters = filters
        // list.count = 0
      }

      dispatch({ type: 'SET_TOPIC_LIST_BY_NAME', name, data: list })
      callback(res)
    })

  }
}
*/
