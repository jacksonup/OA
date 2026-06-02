<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, RefreshLeft, Edit, Printer } from '@element-plus/icons-vue'
import { users, salaryRecords, getSalary, getSalaryOrEmpty, salaryMonths } from '../../mock/data.js'
import { ElMessage } from 'element-plus'

const projectOptions = ['320（临平段）', '330（余杭段）', '340（城北段）', '350（市政段）']

const selectedMonth = ref('2026-06')
const searchForm = reactive({ keyword: '', projectName: '', status: null })

const currentDateLabel = computed(() => {
  const [y, m] = selectedMonth.value.split('-')
  return `${y}年${m}月`
})

const salaryRows = computed(() => {
  const [year, month] = selectedMonth.value.split('-')
  return users.map((user, index) => {
    const record = getSalaryOrEmpty(user.id, Number(year), month)
    return {
      ...user,
      displayName: `${user.name}(${9300 + user.id})`,
      projectName: projectOptions[index % projectOptions.length],
      employeeNo: String(601076 + index * 10),
      baseSalary: record.baseSalary,
      positionPerformance: record.positionPerformance,
      travelAllowance: record.travelAllowance,
      deduction: record.deduction,
      netPay: record.netPay,
      remark: record.remark,
      hasRecord: !!getSalary(user.id, Number(year), month)
    }
  })
})

const filteredSalaryRows = computed(() => {
  return salaryRows.value.filter(u => {
    const keywordHit = !searchForm.keyword ||
      u.name.includes(searchForm.keyword) ||
      u.employeeNo.includes(searchForm.keyword) ||
      u.displayName.includes(searchForm.keyword)
    if (!keywordHit) return false
    if (searchForm.projectName && u.projectName !== searchForm.projectName) return false
    if (searchForm.status !== null && searchForm.status !== '' && u.status !== searchForm.status) return false
    return true
  })
})

const summaryStats = computed(() => {
  const rows = filteredSalaryRows.value
  const total = rows.reduce((s, r) => s + r.netPay, 0)
  const totalBase = rows.reduce((s, r) => s + r.baseSalary, 0)
  const totalPerformance = rows.reduce((s, r) => s + r.positionPerformance, 0)
  const totalDeduction = rows.reduce((s, r) => s + r.deduction, 0)
  return {
    count: rows.length,
    totalNetPay: total,
    totalBase: totalBase,
    totalPerformance: totalPerformance,
    totalDeduction: totalDeduction,
    avgNetPay: rows.length ? Math.round(total / rows.length) : 0
  }
})

function handleSearch() {}
function handleReset() {
  searchForm.keyword = ''
  searchForm.projectName = ''
  searchForm.status = null
}

const dialogVisible = ref(false)
const editingUserId = ref(null)
const editingUserName = ref('')
const emptyForm = {
  baseSalary: 0, positionPerformance: 0, travelAllowance: 0, deduction: 0, netPay: 0, remark: ''
}
const salaryForm = reactive({ ...emptyForm })

function recalcNetPay() {
  salaryForm.netPay =
    (Number(salaryForm.baseSalary) || 0) +
    (Number(salaryForm.positionPerformance) || 0) +
    (Number(salaryForm.travelAllowance) || 0) -
    (Number(salaryForm.deduction) || 0)
}

function openEdit(row) {
  editingUserId.value = row.id
  editingUserName.value = row.displayName
  const [year, month] = selectedMonth.value.split('-')
  const record = getSalaryOrEmpty(row.id, Number(year), month)
  Object.assign(salaryForm, {
    baseSalary: record.baseSalary,
    positionPerformance: record.positionPerformance,
    travelAllowance: record.travelAllowance,
    deduction: record.deduction,
    netPay: record.netPay,
    remark: record.remark
  })
  dialogVisible.value = true
}

function saveSalary() {
  if (!editingUserId.value) return
  const [year, month] = selectedMonth.value.split('-')
  const key = `${editingUserId.value}-${year}-${month}`
  salaryRecords[key] = {
    userId: editingUserId.value, year: Number(year), month, ...salaryForm
  }
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

</script>

<template>
  <div>
    <div class="attendance-summary-grid">
      <div class="attendance-summary-item">
        <div class="summary-label">核算人数</div>
        <div class="summary-value">{{ summaryStats.count }}</div>
        <div class="summary-note">{{ currentDateLabel }}在职员工</div>
      </div>
      <div class="attendance-summary-item">
        <div class="summary-label">基本工资合计</div>
        <div class="summary-value">¥{{ summaryStats.totalBase.toLocaleString() }}</div>
        <div class="summary-note">月度基础薪酬</div>
      </div>
      <div class="attendance-summary-item">
        <div class="summary-label">绩效/补贴合计</div>
        <div class="summary-value">¥{{ summaryStats.totalPerformance.toLocaleString() }}</div>
        <div class="summary-note">岗位绩效 + 差旅/项目补贴</div>
      </div>
      <div class="attendance-summary-item">
        <div class="summary-label">考勤扣款合计</div>
        <div class="summary-value deduction-summary">¥{{ summaryStats.totalDeduction.toLocaleString() }}</div>
        <div class="summary-note">{{ currentDateLabel }}累计</div>
      </div>
      <div class="attendance-summary-item">
        <div class="summary-label">实发合计</div>
        <div class="summary-value net-summary">¥{{ summaryStats.totalNetPay.toLocaleString() }}</div>
        <div class="summary-note">人均 ¥{{ summaryStats.avgNetPay.toLocaleString() }}</div>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :model="searchForm" inline class="toolbar-form">
        <el-form-item label="核算月份">
          <el-select v-model="selectedMonth" placeholder="选择月份" style="width:180px">
            <el-option v-for="m in salaryMonths" :key="m.value" :label="m.label" :value="m.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="姓名/工号" clearable style="width:200px" />
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select v-model="searchForm.projectName" placeholder="全部" clearable style="width:160px">
            <el-option v-for="project in projectOptions" :key="project" :label="project" :value="project" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width:120px">
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" round @click="handleSearch">查询</el-button>
          <el-button :icon="RefreshLeft" round @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="page-header">
        <div>
          <h2>{{ currentDateLabel }} 薪酬核算</h2>
          <p class="page-subtitle">月度薪酬 = 基本工资 + 岗位绩效 + 出差/项目补贴 − 考勤扣款</p>
        </div>
        <div class="header-actions">
          <el-button :icon="Printer" round disabled>导出工资条</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table :data="filteredSalaryRows" class="data-table" style="width:100%" max-height="calc(100vh - 400px)" row-class-name="user-row"
          :row-class-name="({ row }) => row.netPay > 15000 ? 'salary-premium-row' : ''"
        >
          <el-table-column prop="displayName" label="姓名" width="130" fixed="left">
            <template #default="{ row }">
              <span class="cell-name">{{ row.displayName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属项目" width="140">
            <template #default="{ row }">
              <span class="soft-pill green">{{ row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="基本工资" width="120" align="right">
            <template #default="{ row }">¥{{ row.baseSalary.toLocaleString() }}</template>
          </el-table-column>
          <el-table-column label="岗位绩效" width="120" align="right">
            <template #default="{ row }">
              <span :class="row.positionPerformance > 2000 ? 'salary-highlight' : ''">¥{{ row.positionPerformance.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出差/项目补贴" width="140" align="right">
            <template #default="{ row }">
              <span v-if="row.travelAllowance > 0">¥{{ row.travelAllowance.toLocaleString() }}</span>
              <span v-else class="empty-mark">-</span>
            </template>
          </el-table-column>
          <el-table-column label="考勤扣款" width="110" align="right">
            <template #default="{ row }">
              <span v-if="row.deduction > 0" class="deduction-text">−¥{{ row.deduction.toLocaleString() }}</span>
              <span v-else class="empty-mark">-</span>
            </template>
          </el-table-column>
          <el-table-column label="实发工资" width="130" align="right" fixed="right">
            <template #default="{ row }">
              <span class="net-pay-value">¥{{ row.netPay.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="140">
            <template #default="{ row }">{{ row.remark || '-' }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <span :class="['soft-pill', row.status === 1 ? 'green' : 'red']">{{ row.status === 1 ? '在职' : '离职' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="`薪酬核算 — ${editingUserName}`" width="560px" top="8vh" destroy-on-close>
      <div style="margin-bottom:16px;font-size:13px;color:var(--ios-text-secondary)">
        {{ currentDateLabel }}
      </div>
      <el-form :model="salaryForm" label-width="130px" size="default">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="基本工资">
              <el-input-number v-model="salaryForm.baseSalary" :min="0" :step="100" style="width:100%" controls-position="right" @change="recalcNetPay" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位绩效">
              <el-input-number v-model="salaryForm.positionPerformance" :min="0" :step="100" style="width:100%" controls-position="right" @change="recalcNetPay" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="出差/项目补贴">
              <el-input-number v-model="salaryForm.travelAllowance" :min="0" :step="100" style="width:100%" controls-position="right" @change="recalcNetPay" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考勤扣款">
              <el-input-number v-model="salaryForm.deduction" :min="0" :step="100" style="width:100%" controls-position="right" @change="recalcNetPay" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="实发工资" label-width="80px">
              <span class="net-pay-result">¥{{ salaryForm.netPay.toLocaleString() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计算公式" label-width="80px">
              <span style="font-size:12px;color:var(--ios-text-secondary)">
                {{ salaryForm.baseSalary }} + {{ salaryForm.positionPerformance }} + {{ salaryForm.travelAllowance }} − {{ salaryForm.deduction }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="salaryForm.remark" type="textarea" :rows="2" placeholder="核算备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="saveSalary">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.attendance-summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}
.attendance-summary-item {
  background: var(--ios-card);
  border-radius: var(--ios-radius-lg);
  padding: 16px 20px;
  box-shadow: var(--ios-shadow-card);
}
.attendance-summary-item .summary-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ios-text-secondary);
  letter-spacing: 0.02em;
  margin-bottom: 4px;
}
.attendance-summary-item .summary-value {
  font-size: 26px;
  font-weight: 600;
  color: var(--ios-text);
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.attendance-summary-item .summary-note {
  font-size: 11px;
  color: var(--ios-text-placeholder);
  margin-top: 4px;
}
.deduction-summary {
  color: var(--ios-red);
}
.net-summary {
  color: var(--ios-green);
}
.net-pay-value {
  font-weight: 600;
  font-size: 15px;
  color: var(--ios-blue);
}
.net-pay-result {
  font-weight: 600;
  font-size: 22px;
  color: var(--ios-blue);
  letter-spacing: -0.02em;
}
.deduction-text {
  color: var(--ios-red);
  font-weight: 500;
}
.salary-highlight {
  font-weight: 500;
  color: var(--ios-green);
}
.empty-mark {
  color: var(--ios-text-placeholder);
  font-size: 13px;
}
</style>
