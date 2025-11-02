<template>
  <div class="imgUploadContainer">
    <div class="imgUploadPanel">
      <div class="upBtn">
        <label
          for="imgUploadInput"
          class="imgUploadInputArea"
          @dragenter.stop.prevent
          @dragover.stop.prevent
          @drop.stop.prevent="onDrop"
          >点击此处选择图片、或拖动图片到此</label
        >
        <input
          type="file"
          accept="image/*"
          multiple
          id="imgUploadInput"
          @change="onImgUploadInputChange"
        />
      </div>
      <div class="uploadInfoBox">
        <div v-for="(img, index) in imageList" :key="index" class="previewItem">
          <div
            class="previewBox"
            :style="{ backgroundImage: `url('${img}')` }"
          ></div>
          <span class="delBtn el-icon-close" @click="deleteImg(index)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgUpload',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      files: [],
      imageList: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.imageList = Array.isArray(val) ? val : []
      }
    }
  },
  methods: {
    /**
     * @Author: 王林
     * @Date: 2019-12-22 19:47:19
     * @Desc: 图片选择事件
     */
    onImgUploadInputChange(e) {
      let files = Array.from(e.target.files)
      files.forEach(file => this.selectImg(file))
    },

    /**
     * @Author: 王林
     * @Date: 2019-12-22 20:32:31
     * @Desc: 拖动上传图片
     */
    onDrop(e) {
      let dt = e.dataTransfer
      let files = Array.from(dt.files)
      files.forEach(file => this.selectImg(file))
    },

    /**
     * @Author: 王林
     * @Date: 2021-06-06 16:56:14
     * @Desc: 选择图片
     */
    selectImg(file) {
      this.files.push(file)
      let fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = e => {
        this.imageList.push(e.target.result)
        this.$emit('change', [...this.imageList])
      }
    },

    /**
     * @Author: 王林
     * @Date: 2021-06-22 23:03:46
     * @Desc: 获取图片大小
     */
    async getSize() {
      const sizes = await Promise.all(
        this.imageList.map(
          url =>
            new Promise(resolve => {
              let img = new Image()
              img.src = url
              img.onload = () => {
                resolve({
                  width: img.width,
                  height: img.height
                })
              }
              img.onerror = () => {
                resolve({
                  width: 0,
                  height: 0
                })
              }
            })
        )
      )
      return sizes
    },

    /**
     * @Author: 王林
     * @Date: 2021-06-06 21:59:57
     * @Desc: 删除图片
     */
    deleteImg(index) {
      this.files.splice(index, 1)
      this.imageList.splice(index, 1)
      this.$emit('change', [...this.imageList])
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';

.imgUploadContainer {
  .imgUploadPanel {
    .uploadInfoBox {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      
      .previewItem {
        position: relative;
        width: 100px;
        height: 100px;

        .previewBox {
          width: 100%;
          height: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .delBtn {
          position: absolute;
          right: -6px;
          top: -6px;
          width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.3);
          color: #fff;
          border-radius: 50%;
          cursor: pointer;

          &:hover {
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
  }
}
</style>
