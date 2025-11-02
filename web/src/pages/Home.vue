<template>
    <div class="home-container">
        <div class="header">
            <h1>我的脑图</h1>
            <el-button type="primary" @click="createNewMap">新建脑图</el-button>
        </div>
        <div class="content">
            <div class="map-list">
                <div v-for="item in mindMaps" :key="item.id" class="map-item" @click="openMap(item.id)">
                    <el-card>
                        <div class="map-id">{{ item.id || '未命名' }}</div>
                        <div class="map-title" v-html="item.root?.data?.text || '未命名'"></div>
                    </el-card>
                </div>
            </div>
            <div class="edit-container" v-if="editTabs.length > 0">
                <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab">
                    <el-tab-pane v-for="item in editTabs" :key="item.id" :label="item.title || '未命名'" :name="item.id">
                    </el-tab-pane>
                </el-tabs>
                <div class="iframe-container">
                    <iframe v-for="item in editTabs" :key="item.id" :src="getEditUrl(item.id)"
                        :class="['edit-frame', { active: activeTab === item.id }]" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            mindMaps: [],
            editTabs: [],
            activeTab: ''
        }
    },
    created() {
        this.getExistMindMaps()
    },
    methods: {
        // 获取脑图列表
        getExistMindMaps() {
            const maps = Object.keys(localStorage)
                .filter(key => key.startsWith('SIMPLE_MIND_MAP_DATA_'))
                .map(key => {
                    const data = JSON.parse(localStorage.getItem(key))
                    return {
                        id: key.replace('SIMPLE_MIND_MAP_DATA_', ''),
                        ...data
                    }
                })
            console.log('getMindMaps', maps)
            this.mindMaps = maps || []
        },
        // 获取编辑页面URL
        getEditUrl(id) {
            const baseUrl = window.location.href.split('#')[0]
            return `${baseUrl}#/edit/${id}`
        },
        createNewMap() {
            const id = Date.now().toString()
            this.addTab({
                id,
                title: '新建脑图'
            })
            // 刷新列表
            this.getExistMindMaps()
        },
        openMap(id) {
            this.addTab({
                id,
                title: id
            })
        },
        addTab(map) {
            // 如果已经打开，则激活对应tab
            const existTab = this.editTabs.find(tab => tab.id === map.id)
            console.log('addTab..');
            if (existTab) {
                this.activeTab = map.id
                return
            }
            // 添加新的tab
            this.editTabs.push(map)
            this.activeTab = map.id
        },
        removeTab(targetId) {
            const tabs = this.editTabs
            let activeName = this.activeTab
            if (activeName === targetId) {
                tabs.forEach((tab, index) => {
                    if (tab.id === targetId) {
                        const nextTab = tabs[index + 1] || tabs[index - 1]
                        if (nextTab) {
                            activeName = nextTab.id
                        }
                    }
                })
            }
            this.activeTab = activeName
            this.editTabs = tabs.filter(tab => tab.id !== targetId)
        }
    }
}
</script>

<style scoped>
.home-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.content {
    flex: 1;
    overflow: hidden;
    position: relative;
    display: flex;
}

.map-list {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    overflow-y: auto;
    height: 100%;
    width: 300px;
    flex-shrink: 0;
}

.map-item {
    cursor: pointer;
    transition: all 0.3s;
}

.map-item:hover {
    transform: translateY(-5px);
}

.map-item .el-card {
    height: 100px;
}

.map-title {
    font-size: 16px;
    margin-bottom: 10px;
}

.map-time {
    font-size: 12px;
    color: #999;
}

.edit-container {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #ddd;
}

.iframe-container {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.edit-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    display: none;
}

.edit-frame.active {
    display: block;
}

:deep(.el-tabs__header) {
    margin-bottom: 0;
}
</style>