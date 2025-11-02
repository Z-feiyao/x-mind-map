<template>
  <viewer :images="images">
    <img v-for="src in images" :key="src" :src="src" />
  </viewer>
</template>

<script>
export default {
  props: {
    mindMap: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      images: []
    }
  },
  mounted() {
    this.mindMap.on('node_img_dblclick', this.onNodeTmgDblclick)
  },
  beforeDestroy() {
    this.mindMap.off('node_img_dblclick', this.onNodeTmgDblclick)
  },
  methods: {
    onNodeTmgDblclick(node, e) {
      e.stopPropagation()
      e.preventDefault()
      const images = node.getData('images') || []
      this.images = images.map(item => item.url)
      this.$viewerApi({
        images: this.images
      })
    }
  }
}
</script>

<style></style>
