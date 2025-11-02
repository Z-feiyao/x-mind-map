import Vue from 'vue'
import Vuex from 'vuex'
import exampleData from 'simple-mind-map/example/exampleData'
import { storeLocalConfig, setConfig } from '@/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 公共配置
    localConfig: {
      // 本地配置
      isZenMode: false, // 是否是禅模式
      // 是否开启节点富文本
      openNodeRichText: true,
      // 鼠标行为
      useLeftKeySelectionRightKeyDrag: false,
      // 是否显示滚动条
      isShowScrollbar: true,
      // 是否是暗黑模式
      isDark: false,
      extraTextOnExport: '',
    },

    mindMapData: null, // 思维导图数据
    isHandleLocalFile: false, // 是否操作的是本地文件
    activeSidebar: '', // 当前显示的侧边栏
    isOutlineEdit: false, // 是否是大纲编辑模式
    isReadonly: false, // 是否只读
    supportMark: false, // 是否支持标记
    supportNumbers: false, // 是否支持编号
    isDragOutlineTreeNode: false, // 当前是否正在拖拽大纲树的节点
    mindMaps: {} // 存储多个脑图的数据
  },
  mutations: {
    // 设置思维导图数据
    setMindMapData(state, data) {
      state.mindMapData = data
    },

    // 设置操作本地文件标志位
    setIsHandleLocalFile(state, data) {
      state.isHandleLocalFile = data
    },

    // 设置本地配置并写到缓存中
    setLocalConfig(state, data) {
      state.localConfig = {
        ...state.localConfig,
        ...data
      }
      storeLocalConfig(state.localConfig)
    },

    // 设置当前显示的侧边栏
    setActiveSidebar(state, data) {
      state.activeSidebar = data
    },

    // 设置大纲编辑模式
    setIsOutlineEdit(state, data) {
      state.isOutlineEdit = data
    },

    // 设置是否只读
    setIsReadonly(state, data) {
      state.isReadonly = data
    },


    // 设置导出时底部添加的文字
    setExtraTextOnExport(state, data) {
      state.localConfig.extraTextOnExport = data
    },

    // 设置是否支持标记
    setSupportMark(state, data) {
      state.supportMark = data
    },

    // 设置是否支持编号
    setSupportNumbers(state, data) {
      state.supportNumbers = data
    },

    // 设置树节点拖拽
    setIsDragOutlineTreeNode(state, data) {
      state.isDragOutlineTreeNode = data
    },

    SET_LOCAL_CONFIG(state, config) {
      state.localConfig = config
    },

    SET_ACTIVE_SIDEBAR(state, status) {
      state.activeSidebar = status
    },

    SET_MIND_MAP(state, { id, data }) {
      Vue.set(state.mindMaps, id, data)
    },

    UPDATE_MIND_MAP(state, { id, data }) {
      if (state.mindMaps[id]) {
        state.mindMaps[id] = { ...state.mindMaps[id], ...data }
      }
    }
  },
  actions: {
    // 设置初始思维导图数据
    getUserMindMapData(ctx) {
      console.log('ctx -> ', ctx);
      try {
        let { data } = {
          data: {
            data: {
              mindMapData: exampleData
            }
          }
        }
        ctx.commit('setMindMapData', data.data)
      } catch (error) {
        console.log(error)
      }
    },
    async getMindMap({ state, commit }, id) {
      // 这里需要实现从后端获取脑图数据的逻辑
      try {

        let initDate;
        if (state.mindMaps[id]) {
          initDate = state.mindMaps[id]
        }

        let { data } = {
          data: {
            data: {
              // 设置默认配置和数据
              mindMapData: initDate || exampleData
            }
          }
        }

        commit('SET_MIND_MAP', { id, data })
      } catch (error) {
        console.log(error)
      }
    },
    async saveMindMap({ state }, id) {
      if (state.mindMaps[id]) {
        // 这里需要实现保存脑图数据到后端的逻辑
        await setConfig(state.mindMaps[id])
      }
    }
  }
})

export default store
