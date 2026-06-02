<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, RefreshLeft, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { positions, departments, users, addPosition, updatePosition, deletePosition } from '../../mock/data.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ keyword: '', deptId: null, status: null })
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref(null)

const emptyForm = { id: null, name: '', code: '', deptId: null, type: '', sort: 1, status: 1 }
const form = reactive({ ...emptyForm })

const positionTypes = ['管理岗', '技术岗', '产品岗', '设计岗', '市场岗', '职能岗', '销售岗', '运营岗', '财务岗']

const deptOptions = computed(() => departments.map(d => ({ value: d.id, label: d.name })))

const positionList = computed(() => {
  return positions.map(p => ({
    ...p,
    deptName: departments.find(d => d.id === p.deptId)?.name || ''
  }))
})

const filteredPositions = computed(() => {
  return positionList.value.filter(p => {
    if (searchForm.keyword && !p.name.includes(searchForm.keyword) && !p.code.includes(searchForm.keyword)) return false
    if (searchForm.deptId && p.deptId !== searchForm.deptId) return false
    if (searchForm.status !== null && searchForm.status !== '' && p.status !== searchForm.status) return false
    return true
  })
})

const enabledPositionCount = computed(() => positions.filter(p => p.status === 1).length)
const positionTypeCount = computed(() => new Set(positions.map(p => p.type)).size)
const positionDeptCount = computed(() => new Set(positions.map(p => p.deptId)).size)

function handleReset() {
  searchForm.keyword = ''
  searchForm.deptId = null
  searchForm.status = null
}

function openAdd() {
  dialogTitle.value = '新增岗位'
  isEdit.value = false
  Object.assign(form, { ...emptyForm })
  dialogVisible.value = true
}

function openEdit(row) {
  dialogTitle.value = '编辑岗位'
  isEdit.value = true
  Object.assign(form, { ...row, deptName: undefined })
  dialogVisible.value = true
}

function handleDelete(row) {
  const posUsers = users.filter(u => u.positionId === row.id)
  if (posUsers.length) {
    ElMessage.warning(`该岗位下有 ${posUsers.length} 名员工，无法删除`)
    return
  }
  ElMessageBox.confirm(`确定要删除岗位「${row.name}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      deletePosition(row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return
    if (isEdit.value) {
      updatePosition({ ...form })
      ElMessage.success('更新成功')
    } else {
      addPosition({ ...form })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

const rules = {
  name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择所属项目部', trigger: 'change' }]
}
</script>

<template>
  <div class="page-shell">
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-label">岗位总数</div>
        <div class="summary-value">{{ positions.length }}</div>
        <div class="summary-note">全部岗位配置</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">启用岗位</div>
        <div class="summary-value">{{ enabledPositionCount }}</div>
        <div class="summary-note">可用于员工任职</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">岗位类型</div>
        <div class="summary-value">{{ positionTypeCount }}</div>
        <div class="summary-note">覆盖职能分类</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">覆盖项目部</div>
        <div class="summary-value">{{ positionDeptCount }}</div>
        <div class="summary-note">岗位所属组织范围</div>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :model="searchForm" inline class="toolbar-form">
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="岗位名称/编码" clearable style="width:200px" />
        </el-form-item>
        <el-form-item label="项目部">
          <el-select v-model="searchForm.deptId" placeholder="全部" clearable style="width:160px">
            <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width:120px">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" round>查询</el-button>
          <el-button :icon="RefreshLeft" round @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="page-header">
        <div>
          <h2>岗位列表</h2>
          <p class="page-subtitle">管理系统中的岗位配置</p>
        </div>
        <el-button type="primary" :icon="Plus" round @click="openAdd">新增岗位</el-button>
      </div>
      <div class="table-wrap">
        <el-table :data="filteredPositions" class="data-table" style="width:100%" max-height="calc(100vh - 370px)">
          <el-table-column prop="code" label="岗位编码" width="120" fixed="left" />
          <el-table-column prop="name" label="岗位名称" width="170" />
          <el-table-column prop="deptName" label="所属项目部" width="130" />
          <el-table-column prop="type" label="岗位类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag>{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deptId" label="项目部ID" width="78" align="center" />
          <el-table-column prop="sort" label="排序" width="72" align="center" />
          <el-table-column prop="createTime" label="创建时间" width="112" align="center" />
          <el-table-column label="状态" width="76" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                {{ row.status === 1 ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link :icon="Edit" @click="openEdit(row)">编辑</el-button>
              <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="所属项目部" prop="deptId">
          <el-select v-model="form.deptId" style="width:100%">
            <el-option v-for="d in deptOptions" :key="d.value" :label="d.label" :value="d.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位类型">
          <el-select v-model="form.type" style="width:100%">
            <el-option v-for="t in positionTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sort" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
