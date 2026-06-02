<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, RefreshLeft, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { departments, users, addDepartment, updateDepartment, deleteDepartment } from '../../mock/data.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ keyword: '', status: null })
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref(null)

const emptyForm = { id: null, name: '', code: '', leader: '', parentId: null, sort: 1, status: 1 }
const form = reactive({ ...emptyForm })

// Build tree data
function buildTree(list, parentId = null) {
  return list
    .filter(d => d.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map(d => ({ ...d, children: buildTree(list, d.id) }))
}

const treeData = computed(() => buildTree(departments))

const parentOptions = computed(() => {
  return departments
    .filter(d => d.id !== form.id)
    .map(d => ({ value: d.id, label: d.name }))
})

const filteredDepts = computed(() => {
  return departments.filter(d => {
    if (searchForm.keyword && !d.name.includes(searchForm.keyword) && !d.code.includes(searchForm.keyword)) return false
    if (searchForm.status !== null && searchForm.status !== '' && d.status !== searchForm.status) return false
    return true
  })
})

const filteredTree = computed(() => buildTree(filteredDepts.value))
const enabledDeptCount = computed(() => departments.filter(d => d.status === 1).length)
const topDeptCount = computed(() => departments.filter(d => d.parentId === null).length)
const childDeptCount = computed(() => departments.filter(d => d.parentId !== null).length)

function handleReset() {
  searchForm.keyword = ''
  searchForm.status = null
}

function openAdd(parentId = null) {
  dialogTitle.value = '新增部门'
  isEdit.value = false
  Object.assign(form, { ...emptyForm, parentId })
  dialogVisible.value = true
}

function openEdit(row) {
  dialogTitle.value = '编辑部门'
  isEdit.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

function handleDelete(row) {
  const children = departments.filter(d => d.parentId === row.id)
  if (children.length) {
    ElMessage.warning('该部门下有子部门，无法删除')
    return
  }
  const deptUsers = users.filter(u => u.deptId === row.id)
  if (deptUsers.length) {
    ElMessage.warning(`该部门下有 ${deptUsers.length} 名员工，无法删除`)
    return
  }
  ElMessageBox.confirm(`确定要删除部门「${row.name}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      deleteDepartment(row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return
    if (isEdit.value) {
      updateDepartment({ ...form })
      ElMessage.success('更新成功')
    } else {
      addDepartment({ ...form })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

const rules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }]
}
</script>

<template>
  <div class="page-shell">
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-label">部门总数</div>
        <div class="summary-value">{{ departments.length }}</div>
        <div class="summary-note">组织架构全部节点</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">启用部门</div>
        <div class="summary-value">{{ enabledDeptCount }}</div>
        <div class="summary-note">可用于人员归属</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">一级部门</div>
        <div class="summary-value">{{ topDeptCount }}</div>
        <div class="summary-note">公司核心职能单元</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">子部门</div>
        <div class="summary-value">{{ childDeptCount }}</div>
        <div class="summary-note">细分团队与小组</div>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :model="searchForm" inline class="toolbar-form">
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="部门名称/编码" clearable style="width:200px" />
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
          <h2>部门列表</h2>
          <p class="page-subtitle">管理组织架构中的所有部门</p>
        </div>
        <el-button type="primary" :icon="Plus" round @click="openAdd(null)">新增部门</el-button>
      </div>
      <div class="table-wrap">
        <el-table :data="filteredTree" row-key="id" class="data-table" style="width:100%"
          :default-expand-all="true" :tree-props="{ children: 'children' }"
          max-height="calc(100vh - 370px)">
          <el-table-column prop="name" label="部门名称" width="240" fixed="left" />
          <el-table-column prop="code" label="部门编码" width="130" />
          <el-table-column prop="leader" label="负责人" width="100" />
          <el-table-column prop="parentId" label="上级部门ID" width="110" align="center">
            <template #default="{ row }">{{ row.parentId || '顶级部门' }}</template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="72" align="center" />
          <el-table-column prop="createTime" label="创建时间" width="112" align="center" />
          <el-table-column label="状态" width="76" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                {{ row.status === 1 ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link :icon="Plus" @click="openAdd(row.id)">添加子部门</el-button>
              <el-button type="primary" link :icon="Edit" @click="openEdit(row)">编辑</el-button>
              <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级部门">
          <el-select v-model="form.parentId" placeholder="无（顶级部门）" clearable style="width:100%">
            <el-option v-for="d in parentOptions" :key="d.value" :label="d.label" :value="d.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.leader" />
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
