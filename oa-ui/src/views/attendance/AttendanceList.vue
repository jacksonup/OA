<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, RefreshLeft, Edit, Timer } from '@element-plus/icons-vue'
import { users, attendanceRecords, getAttendance, getAttendanceOrEmpty, getYearCumulativeLeave } from '../../mock/data.js'
import { ElMessage } from 'element-plus'

const projectOptions = ['320（临平段）', '330（余杭段）', '340（城北段）', '350（市政段）']

const selectedYear = ref(2026)
const selectedMonth = ref('06')
const searchForm = reactive({ keyword: '', projectName: '', status: null })

const currentDateLabel = computed(() => `${selectedYear.value}年${selectedMonth.value}月`)

function getUserAttendanceOrNew(userId) {
  return getAttendanceOrEmpty(userId, selectedYear.value, selectedMonth.value)
}

const attendanceRows = computed(() => {
  return users.map((user, index) => {
    const record = getUserAttendanceOrNew(user.id)
    const yearLeave = getYearCumulativeLeave(user.id, selectedYear.value)
    return {
      ...user,
      displayName: `${user.name}(${9300 + user.id})`,
      projectName: projectOptions[index % projectOptions.length],
      employeeNo: String(601076 + index * 10),
      monthlySalary: user.status === 1 ? `${9000 + index * 500}` : '',
      attendance: record.attendance,
      compensatoryLeave: record.compensatoryLeave,
      personalLeave: record.personalLeave,
      sickLeave: record.sickLeave,
      annualLeave: record.annualLeave,
      deduction: record.deduction,
      remark: record.remark,
      yearCumulativeLeave: yearLeave,
      hasRecord: !!getAttendance(user.id, selectedYear.value, selectedMonth.value)
    }
  })
})

const filteredAttendanceRows = computed(() => {
  return attendanceRows.value.filter(u => {
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
  const rows = filteredAttendanceRows.value
  const total = rows.length
  const fullAttendance = rows.filter(r =>
    r.personalLeave === 0 && r.sickLeave === 0 && r.annualLeave === 0
  ).length
  const leaveCount = rows.filter(r =>
    r.personalLeave > 0 || r.sickLeave > 0 || r.annualLeave > 0
  ).length
  const totalDeduction = rows.reduce((sum, r) => sum + Number(r.deduction || 0), 0)
  return { total, fullAttendance, leaveCount, totalDeduction }
})

function onMonthChange(val) {
  if (val) {
    const [year, month] = val.split('-')
    selectedYear.value = Number(year)
    selectedMonth.value = month
  }
}

function handleSearch() {}
function handleReset() {
  searchForm.keyword = ''
  searchForm.projectName = ''
  searchForm.status = null
}

const dialogVisible = ref(false)
const editingUserId = ref(null)
const emptyForm = {
  attendance: 0, compensatoryLeave: 0, personalLeave: 0,
  sickLeave: 0, annualLeave: 0, deduction: 0, remark: ''
}
const attForm = reactive({ ...emptyForm })
const editingUserName = ref('')

function openEdit(row) {
  editingUserId.value = row.id
  editingUserName.value = row.displayName
  const record = getUserAttendanceOrNew(row.id)
  Object.assign(attForm, {
    attendance: record.attendance,
    compensatoryLeave: record.compensatoryLeave,
    personalLeave: record.personalLeave,
    sickLeave: record.sickLeave,
    annualLeave: record.annualLeave,
    deduction: record.deduction,
    remark: record.remark
  })
  dialogVisible.value = true
}

function saveAttendance() {
  if (!editingUserId.value) return
  const year = selectedYear.value
  const month = selectedMonth.value
  const key = `${editingUserId.value}-${year}-${month}`
  attendanceRecords[key] = {
    userId: editingUserId.value, year, month, ...attForm
  }
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

function autoCalcDeduction() {
  const days = Number(attForm.personalLeave || 0)
  if (days > 0 && !attForm.deduction) {
    attForm.deduction = days * 200
  }
}
</script>

<template>
  <div>
    <div class="attendance-summary-grid">
      <div class="attendance-summary-item">
        <div class="summary-label">应出勤人数</div>
        <div class="summary-value">{{ summaryStats.total }}</div>
        <div class="summary-note">{{ currentDateLabel }}在册员工</div>
      </div>
      <div class="attendance-summary-item">
        <div class="summary-label">全勤人数</div>
        <div class="summary-value">{{ summaryStats.fullAttendance }}</div>
        <div class="summary-note">当月无任何请假</div>
      </div>
      <div class="attendance-summary-item">
        <div class="summary-label">请假人次</div>
        <div class="summary-value">{{ summaryStats.leaveCount }}</div>
        <div class="summary-note">含事假/病假/年假</div>
      </div>
      <div class="attendance-summary-item">
        <div class="summary-label">扣款总额</div>
        <div class="summary-value">¥{{ summaryStats.totalDeduction.toLocaleString() }}</div>
        <div class="summary-note">{{ currentDateLabel }}累计</div>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :model="searchForm" inline class="toolbar-form">
        <el-form-item label="考勤月份">
          <el-date-picker
            :model-value="`${selectedYear}-${selectedMonth}`"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            style="width:160px"
            @update:model-value="onMonthChange"
          />
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
          <h2>{{ currentDateLabel }} 考勤记录</h2>
          <p class="page-subtitle">按月度维护员工出勤、休假与扣款信息，系统自动汇总年度累计休假</p>
        </div>
      </div>
      <div class="table-wrap">
        <el-table :data="filteredAttendanceRows" class="data-table" style="width:100%" max-height="calc(100vh - 400px)" row-class-name="user-row">
          <el-table-column prop="displayName" label="员工" width="130" fixed="left">
            <template #default="{ row }">
              <span class="cell-name">{{ row.displayName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属项目" width="140">
            <template #default="{ row }">
              <span class="soft-pill green">{{ row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="monthlySalary" label="月工资标准" width="120" align="right">
            <template #default="{ row }">{{ row.monthlySalary ? '¥' + row.monthlySalary : '-' }}</template>
          </el-table-column>
          <el-table-column label="当年累计休假" width="130" align="center">
            <template #default="{ row }">
              <span :class="row.yearCumulativeLeave > 0 ? 'soft-pill orange' : ''">{{ row.yearCumulativeLeave }}天</span>
            </template>
          </el-table-column>
          <el-table-column label="出勤(天)" width="100" align="center">
            <template #default="{ row }">
              <span class="attendance-days">{{ row.attendance || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="调休(天)" width="100" align="center">
            <template #default="{ row }">
              <span :class="row.compensatoryLeave > 0 ? 'soft-pill neutral' : ''">{{ row.compensatoryLeave || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="事假(天)" width="100" align="center">
            <template #default="{ row }">
              <span :class="row.personalLeave > 0 ? 'soft-pill yellow' : ''">{{ row.personalLeave || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="病假(天)" width="100" align="center">
            <template #default="{ row }">
              <span :class="row.sickLeave > 0 ? 'soft-pill yellow' : ''">{{ row.sickLeave || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年假(天)" width="100" align="center">
            <template #default="{ row }">
              <span :class="row.annualLeave > 0 ? 'soft-pill green' : ''">{{ row.annualLeave || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扣款(元)" width="110" align="right">
            <template #default="{ row }">
              <span :class="row.deduction > 0 ? 'deduction-text' : ''">{{ row.deduction > 0 ? '¥' + row.deduction : '-' }}</span>
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

    <el-dialog v-model="dialogVisible" :title="`考勤编辑 — ${editingUserName}`" width="560px" top="8vh" destroy-on-close>
      <div style="margin-bottom:16px;font-size:13px;color:var(--ios-text-secondary)">
        <el-icon :size="14" style="vertical-align:-2px"><Timer /></el-icon>
        {{ currentDateLabel }}
      </div>
      <el-form :model="attForm" label-width="100px" size="default">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="出勤天数">
              <el-input-number v-model="attForm.attendance" :min="0" :max="31" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调休天数">
              <el-input-number v-model="attForm.compensatoryLeave" :min="0" :max="31" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="事假天数">
              <el-input-number v-model="attForm.personalLeave" :min="0" :max="31" style="width:100%" controls-position="right" @change="autoCalcDeduction" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="病假天数">
              <el-input-number v-model="attForm.sickLeave" :min="0" :max="31" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="年假天数">
              <el-input-number v-model="attForm.annualLeave" :min="0" :max="31" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扣款金额">
              <el-input-number v-model="attForm.deduction" :min="0" :step="100" style="width:100%" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="attForm.remark" type="textarea" :rows="2" placeholder="扣款原因或其他备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="saveAttendance">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.attendance-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
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
  font-size: 28px;
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
.attendance-days {
  font-weight: 600;
  font-size: 14px;
  color: var(--ios-blue);
}
.deduction-text {
  color: var(--ios-red);
  font-weight: 500;
}
</style>
