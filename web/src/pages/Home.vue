<template>
  <div class="home-container">
    <div class="header">
      <h1>我的脑图</h1>
      <el-button type="primary" @click="createNewMap">新建脑图</el-button>
    </div>
    <div class="map-list">
      <el-card v-for="item in mindMaps" :key="item.id" class="map-item" @click="openMap(item.id)">
        <div class="map-title">{{ item.title || '未命名' }}</div>
        <div class="map-time">最后编辑：{{ item.updateTime }}</div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      mindMaps: []
    }
  },
  created() {
    this.getMindMaps()
  },
  methods: {
    // 获取脑图列表
    getMindMaps() {
      const maps = localStorage.getItem('mindMaps')
      this.mindMaps = maps ? JSON.parse(maps) : []
    },
    createNewMap() {
      const id = Date.now()
      this.$router.push(`/edit/${id}`)
    },
    openMap(id) {
      this.$router.push(`/edit/${id}`)
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.map-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.map-item {
  cursor: pointer;
}
.map-title {
  font-size: 16px;
  margin-bottom: 10px;
}
.map-time {
  font-size: 12px;
  color: #999;
}
</style> 