<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      v-loading="usersLoading"
      :data="users"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column width="110" label="ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="name" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="password" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="createDate">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createDate | dateformat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">
            修改
          </el-button>
          <el-button v-if="scope.row.status=='0'" size="mini" type="success" @click="handleDisable(scope.row.id)">
            禁用
          </el-button>
          <el-button v-if="scope.row.status!='0'" size="mini" @click="handleEnable(scope.row.id)">
            正常
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="userForm" :rules="rules" :model="user" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="id">
          <el-input v-model="user.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
          <el-button type="primary" @click="onSubmit('userForm')">Submit</el-button>
          <el-button @click="onCancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, getUsers, getUsersByPage, deleteUser, disableUser, enableUser, updateUser } from '@/api/table'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      users: null,
      usersLoading: true,
      tableKey: 0,
      total: 0,
      listQuery: {
        page: 1,
        limit: 5,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      user: {
        id: '',
        name: '',
        password: '',
        status: '',
        createDate: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户',
        create: '创建用户'
      },
      dialogPvVisible: false,
      // 校验规则
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在2到20哥字符', trigger: 'blur' }],
        password: [{ required: true, message: 'password is required', trigger: 'blur' }],
        status: [{ required: true, message: 'status is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    // this.fetchData()
    this.getList()
  },
  methods: {
    getList() {
      this.usersLoading = true
      getUsersByPage(this.listQuery).then(response => {
        debugger
        this.users = response.datas
        this.total = response.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.usersLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    fetchData: function() {
      this.usersLoading = true
      getUsers().then(response => {
        // debugger;
        this.users = response.datas
        this.usersLoading = false
      })
    },
    // handleUpdate: function(id) {
    // this.$router.push("/example/editUser/" + id)
    // updateUser(row).then(response => {
    //   this.$notify({
    //     title: 'Success',
    //     message: 'Delete Successfully',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.fetchData()
    // })
    // },

    handleDelete: function(id) {
      deleteUser(id).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        // this.fetchData()
        this.getList()
      })
    },
    handleDisable: function(id) {
      disableUser(id).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Disable Successfully',
          type: 'success',
          duration: 2000
        })
        // this.fetchData()
        this.getList()
      })
    },
    handleEnable: function(id) {
      enableUser(id).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Enable Successfully',
          type: 'success',
          duration: 2000
        })
        // this.fetchData()
        this.getList()
      })
    },
    resetUser(id) {
      if (id > 0) {
        getUser(id).then(response => {
          this.user = response.data
        })
      } else {
        this.user = {
          id: '',
          name: '',
          password: '',
          status: 0,
          createDate: new Date()
        }
      }
    },
    handleCreate() {
      this.resetUser(0)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    handleUpdate: function(id) {
      this.resetUser(id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    onSubmit(fromName) {
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          updateUser(this.user).then(() => {
            this.dialogFormVisible = false
            if (this.user.id > 0) {
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success'
              })
            } else {
              this.$notify({
                title: 'Success',
                message: 'Create Successfully',
                type: 'success'
              })
            }
            // this.fetchData()
            this.getList()
          })
        }
      })
    },
    onCancel() {
      this.dialogFormVisible = false
      this.$message({
        message: '取消操作',
        type: 'warning'
      })
    }
  }
}
</script>
