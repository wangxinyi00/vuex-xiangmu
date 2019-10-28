<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <van-nav-bar
    fixed
    :title="$route.params.q+'搜索的结果'"
    left-arrow
    @click-left="$router.back()"
    />
    <!-- 文章列表 -->
  <van-list
    class="article-list"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <van-cell
    v-for="(item,index) in list"
    :key="index"
    :title="item.title"
    />
  </van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
// import { timingSafeEqual } from 'crypto'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页数，默认为1
        per_page: this.perPage, // 每页几条数据
        q: this.$route.params.q // 搜索关键词
      })

      // 2.将数据添加到数组中
      this.list.push(...data.data.results)
      // 3.结束loading状态
      this.loading = false
      // 4.判断是否还有数据
      if (data.data.results.length) {
        // 如果有 更新页码
        this.page++
      } else {
        // 如果没有  将finished 设置为 true
        this.finished = true
      }
      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 结束加载状态
      //   this.loading = false
      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
    }

  }

}
</script>

<style lang='less' scoped>
.article-list{
  margin-top: 45px;
}

</style>
