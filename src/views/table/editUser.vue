<template>
  <div class="app-container">
    <el-form ref="user" :model="user" label-width="120px">
      <el-form-item label="id">
        <el-input v-model="user.id" disabled="true" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.password" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="user.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-col :span="11">
          <el-date-picker v-model="user.createDate" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUser, updateUser } from '@/api/table'

export default {
  data() {
    return {
      user: {
        id: '',
        name: '',
        password: '',
        status: '',
        createDate: ''
      }
    }
  },
  created() {
    this.fatchDataById()
  },
  methods: {
    fatchDataById() {
      var id = this.$route.params.id
      getUser(id).then(response => {
        this.user = response.data
      })
    },
    onSubmit() {
      // debugger;
      updateUser(this.user).then(response => {
        this.$message({
          message: '修改成功！',
          type: 'success'
        })
        this.$router.push("/example/users")
      })
    },
    onCancel() {
      this.$message({
        message: '取消操作',
        type: 'warning'
      })
      this.$router.push("/example/users")
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

