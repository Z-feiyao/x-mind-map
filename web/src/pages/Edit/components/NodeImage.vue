<template>
  <el-dialog
    class="nodeImageDialog"
    :title="$t('nodeImage.title')"
    :visible.sync="dialogVisible"
    :width="isMobile ? '90%' : '50%'"
    :top="isMobile ? '20px' : '15vh'"
  >
    <div class="title">方式一</div>
    <ImgUpload
      ref="ImgUpload"
      v-model="imgs"
      style="margin-bottom: 12px;"
    ></ImgUpload>
    <div class="title">方式二</div>
    <div class="inputBox">
      <span class="label">请输入图片地址</span>
      <el-input
        v-model="imgUrl"
        size="mini"
        placeholder="http://xxx.com/xx.jpg"
        @keydown.native.stop
      ></el-input>
      <el-button size="mini" @click="addImgUrl" style="margin-left: 10px;">添加</el-button>
    </div>
    <div class="title">可选</div>
    <div class="inputBox">
      <span class="label">{{ $t('nodeImage.imgTitle') }}</span>
      <el-input v-model="imgTitle" size="mini" @keydown.native.stop></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{
        $t('dialog.confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ImgUpload from '@/components/ImgUpload'
import { getImageSize, isMobile } from 'simple-mind-map/src/utils/index'

/**
 * @Author: 王林
 * @Date: 2021-06-24 22:53:45
 * @Desc: 节点图片内容设置
 */
export default {
  name: 'NodeImage',
  components: {
    ImgUpload
  },
  data() {
    return {
      dialogVisible: false,
      imgs: [],
      imgUrl: '',
      imgTitle: '',
      activeNodes: null,
      isMobile: isMobile()
    }
  },
  created() {
    this.$bus.$on('node_active', this.handleNodeActive)
    this.$bus.$on('showNodeImage', this.handleShowNodeImage)
  },
  beforeDestroy() {
    this.$bus.$off('node_active', this.handleNodeActive)
    this.$bus.$off('showNodeImage', this.handleShowNodeImage)
  },
  methods: {
    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
    },

    handleShowNodeImage() {
      this.reset()
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        let images = firstNode.getData('images') || []
        this.imgs = images.map(item => item.url)
        this.imgTitle = firstNode.getData('imageTitle') || ''
      }
      this.dialogVisible = true
    },

    cancel() {
      this.dialogVisible = false
      this.reset()
    },

    reset() {
      this.imgs = []
      this.imgTitle = ''
      this.imgUrl = ''
    },

    addImgUrl() {
      if (!this.imgUrl) return
      if (!/^https?:\/\//.test(this.imgUrl)) {
        this.$message.error('请输入正确的图片URL')
        return
      }
      this.imgs.push(this.imgUrl)
      this.imgUrl = ''
    },

    async confirm() {
      try {
        // 删除图片
        if (this.imgs.length === 0) {
          this.cancel()
          this.activeNodes.forEach(node => {
            node.setImages([])
          })
          return
        }
        
        const sizes = await Promise.all(
          this.imgs.map(async url => {
            const res = await getImageSize(url)
            return {
              url,
              width: res.width || 100,
              height: res.height || 100
            }
          })
        )

        this.activeNodes.forEach(node => {
          node.setImages(sizes.map(item => ({
            ...item,
            title: this.imgTitle
          })))
        })
        this.cancel()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nodeImageDialog {
  .title {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .inputBox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .label {
      width: 150px;
    }
  }
}
</style>
