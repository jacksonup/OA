<script setup>
import { ref, reactive, computed } from 'vue'
import { Upload, Download, Search, RefreshLeft, Delete, UserFilled } from '@element-plus/icons-vue'
import { departments, ledgerRecords, addLedgerRecord, deleteLedgerRecord } from '../../mock/data.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'

// --- 模板表头映射 ---
// 模板固定 39 列，表头在 row 1（row 0 是合并标题）
const HEADER_MAP = [
  { col: 0,  header: '序号',                key: '_seq',               skip: true },
  { col: 1,  header: '所属项目',            key: 'projectName',        required: true },
  { col: 2,  header: '姓名',                key: 'name',               required: true },
  { col: 3,  header: '岗位',                key: 'positionTitle' },
  { col: 4,  header: '性别',                key: 'gender' },
  { col: 5,  header: '身份证号',            key: 'idCard' },
  { col: 6,  header: '年龄',                key: '_age',               skip: true },
  { col: 7,  header: '是否退休',            key: 'retired' },
  { col: 8,  header: '联系方式',            key: 'phone' },
  { col: 9,  header: '入职公司后首个项目名称', key: 'firstProject' },
  { col: 10, header: '入职公司时间',         key: 'entryDate',          convert: 'excelDate' },
  { col: 11, header: '司龄',                key: '_tenure',            skip: true },
  { col: 12, header: '本项目进场时间',       key: 'projectEntryDate',   convert: 'excelDate' },
  { col: 13, header: '本项目是否报备',       key: 'projectFiled' },
  { col: 14, header: '紧急联系人关系',       key: 'primaryRelation' },
  { col: 15, header: '紧急联系人姓名',       key: 'primaryName' },
  { col: 16, header: '紧急联系人电话',       key: 'primaryPhone' },
  { col: 17, header: '职称',                key: 'jobTitle' },
  { col: 18, header: '有无职称证明',         key: 'hasTitleProof' },
  { col: 19, header: '第一学历_学历',         key: 'edu1Level' },
  { col: 20, header: '第一学历_学习形式',     key: 'edu1StudyMode' },
  { col: 21, header: '第一学历_毕业学校',     key: 'edu1School' },
  { col: 22, header: '第一学历_所学专业',     key: 'edu1Major' },
  { col: 23, header: '第一学历_有无学信网证明', key: 'edu1Chsi' },
  { col: 24, header: '第二学历_学历',         key: 'edu2Level' },
  { col: 25, header: '第二学历_学习形式',     key: 'edu2StudyMode' },
  { col: 26, header: '第二学历_毕业学校',     key: 'edu2School' },
  { col: 27, header: '第二学历_所学专业',     key: 'edu2Major' },
  { col: 28, header: '第二学历_有无学信网证明', key: 'edu2Chsi' },
  { col: 29, header: '执业证书-部监',         key: 'certMinistry' },
  { col: 30, header: '执业证书-国注',         key: 'certRegistered' },
  { col: 31, header: '执业证书-一造',         key: 'certCost' },
  { col: 32, header: '执业证书-一建',         key: 'certConstructor' },
  { col: 33, header: '执业证书-注安',         key: 'certSafety' },
  { col: 34, header: '执业证书-检测',         key: 'certInspector' },
  { col: 35, header: '未注册的执业资格证书及原因', key: 'unregisteredCertReason' },
  { col: 36, header: '有无挂证',             key: 'certFraud' },
  { col: 37, header: '备注',                key: 'remark' },
]

const certKeys = ['certMinistry','certRegistered','certCost','certConstructor','certSafety','certInspector']
const certLabels = { certMinistry:'部监', certRegistered:'国注', certCost:'一造', certConstructor:'一建', certSafety:'注安', certInspector:'检测' }

function excelDateToStr(serial) {
  if (serial == null || serial === '') return ''
  const n = Number(serial)
  if (isNaN(n) || n < 1) return String(serial)
  const date = new Date(Math.round((n - 25569) * 86400 * 1000))
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function normalizeHeader(raw) {
  return String(raw || '').replace(/\n/g, '').replace(/\s+/g, '').replace(/[（(].*?[）)]/g, '').trim()
}

// --- 状态 ---
const searchForm = reactive({ keyword: '', projectName: '' })
const fileInputRef = ref(null)
const previewData = ref([])
const previewErrors = ref([])
const fileName = ref('')

// --- 解析 Excel ---
function handleFileChange(file) {
  fileName.value = file.name
  previewErrors.value = []
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      if (!ws) { ElMessage.error('未找到工作表'); return }

      // 用 header:1 取原始二维数组
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', blankrows: false })
      if (raw.length < 2) { ElMessage.error('模板至少需要标题行和表头行'); return }

      // 找表头行：包含"姓名"且包含"身份证号"
      let headerRowIdx = -1
      for (let i = 0; i < raw.length; i++) {
        const row = raw[i]
        const joined = row.map(c => String(c)).join('')
        if (joined.includes('姓名') && joined.includes('身份证号')) { headerRowIdx = i; break }
      }
      if (headerRowIdx < 0) { ElMessage.error('未识别到表头行，请确认使用正确模板'); return }

      const headerRow = raw[headerRowIdx].map(h => normalizeHeader(h))

      // 建立列映射：模板表头名 → 列索引
      const colIndex = {}
      for (let c = 0; c < headerRow.length; c++) {
        colIndex[headerRow[c]] = c
      }

      // 找出每一列的映射
      function findCol(headerDef) {
        const norm = normalizeHeader(headerDef.header)
        if (colIndex[norm] !== undefined) return colIndex[norm]
        // 模糊匹配
        for (const [h, idx] of Object.entries(colIndex)) {
          if (h.includes(norm.split('_')[0]) || norm.includes(h)) return idx
        }
        return -1
      }

      const colMap = HEADER_MAP.map(m => ({ ...m, _colIdx: findCol(m) }))

      const nameCol = colMap.find(m => m.key === 'name')
      if (nameCol._colIdx < 0) { ElMessage.error('未找到"姓名"列'); return }

      const errors = []
      const preview = []

      for (let r = headerRowIdx + 1; r < raw.length; r++) {
        const srcRow = raw[r]
        const row = {}
        const rowErrors = []

        // 跳过完全空行
        const hasContent = srcRow.some(c => c !== '' && c != null)
        if (!hasContent) continue

        for (const map of colMap) {
          if (map.skip) continue
          const val = map._colIdx >= 0 ? String(srcRow[map._colIdx] ?? '').trim() : ''

          if (map.convert === 'excelDate') {
            row[map.key] = excelDateToStr(Number(val) || val)
          } else {
            row[map.key] = val
          }

          if (map.required && !row[map.key]) {
            rowErrors.push(`缺少${map.header}`)
          }
        }

        // 电话校验
        if (row.phone && !/^1[3-9]\d{9}$/.test(row.phone)) {
          rowErrors.push('手机号格式不正确')
        }

        row._rowNum = r + 1
        row._valid = rowErrors.length === 0
        row._errors = rowErrors

        // 构建证书摘要
        const certs = certKeys.filter(k => row[k] && (row[k] === '√' || row[k] === '有' || row[k] === '是'))
        row._certSummary = certs.map(k => certLabels[k]).join('、')

        // 构建学历摘要
        row._eduSummary = [row.edu1Level, row.edu2Level].filter(Boolean).join(' → ')

        if (rowErrors.length) {
          errors.push({ row: r + 1, name: row.name || '(空)', errors: rowErrors })
        }
        preview.push(row)
      }

      previewData.value = preview
      previewErrors.value = errors
      if (preview.length === 0) ElMessage.warning('未读取到数据行')
    } catch (err) {
      ElMessage.error('解析失败: ' + err.message)
    }
  }
  reader.readAsArrayBuffer(file.raw)
}

// --- 导入 ---
function confirmImport() {
  const validRows = previewData.value.filter(r => r._valid)
  if (!validRows.length) { ElMessage.warning('没有有效数据行'); return }

  let imported = 0
  for (const row of validRows) {
    const record = {
      projectName: row.projectName || '',
      name: row.name || '',
      positionTitle: row.positionTitle || '',
      gender: row.gender || '',
      idCard: row.idCard || '',
      retired: row.retired || '',
      phone: row.phone || '',
      firstProject: row.firstProject || '',
      entryDate: row.entryDate || '',
      projectEntryDate: row.projectEntryDate || '',
      projectFiled: row.projectFiled || '',
      primaryRelation: row.primaryRelation || '',
      primaryName: row.primaryName || '',
      primaryPhone: row.primaryPhone || '',
      jobTitle: row.jobTitle || '',
      hasTitleProof: row.hasTitleProof || '',
      edu1Level: row.edu1Level || '',
      edu1StudyMode: row.edu1StudyMode || '',
      edu1School: row.edu1School || '',
      edu1Major: row.edu1Major || '',
      edu1Chsi: row.edu1Chsi || '',
      edu2Level: row.edu2Level || '',
      edu2StudyMode: row.edu2StudyMode || '',
      edu2School: row.edu2School || '',
      edu2Major: row.edu2Major || '',
      edu2Chsi: row.edu2Chsi || '',
      certMinistry: row.certMinistry || '',
      certRegistered: row.certRegistered || '',
      certCost: row.certCost || '',
      certConstructor: row.certConstructor || '',
      certSafety: row.certSafety || '',
      certInspector: row.certInspector || '',
      unregisteredCertReason: row.unregisteredCertReason || '',
      certFraud: row.certFraud || '',
      remark: row.remark || ''
    }
    addLedgerRecord(record)
    imported++
  }
  clearPreview()
  ElMessage.success(`成功导入 ${imported} 条台账记录`)
}

function clearPreview() {
  previewData.value = []
  previewErrors.value = []
  fileName.value = ''
}

// --- 已导入记录 ---
const projectOptions = computed(() => [...new Set(ledgerRecords.map(r => r.projectName).filter(Boolean))])

const filteredRecords = computed(() => {
  return ledgerRecords.filter(r => {
    if (searchForm.keyword && !r.name.includes(searchForm.keyword) && !r.idCard.includes(searchForm.keyword) && !r.phone.includes(searchForm.keyword)) return false
    if (searchForm.projectName && r.projectName !== searchForm.projectName) return false
    return true
  })
})

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除「${row.name}」的记录吗？`, '提示', { type: 'warning' })
    .then(() => { deleteLedgerRecord(row.id); ElMessage.success('已删除') })
    .catch(() => {})
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.projectName = ''
}

// --- 学历展开子表 ---
const expandKey = ref(null)

const ledgerColumns = [
  { key: 'projectName', label: '所属项目', width: 130 },
  { key: 'name', label: '姓名', width: 80 },
  { key: 'positionTitle', label: '岗位', width: 110 },
  { key: 'gender', label: '性别', width: 60 },
  { key: 'idCard', label: '身份证号', width: 180 },
  { key: 'phone', label: '联系方式', width: 120 },
  { key: 'retired', label: '退休', width: 60 },
  { key: 'entryDate', label: '入职时间', width: 110 },
  { key: 'projectEntryDate', label: '进场时间', width: 110 },
  { key: 'primaryName', label: '紧急联系人', width: 100 },
  { key: 'primaryPhone', label: '联系人电话', width: 120 },
  { key: 'jobTitle', label: '职称', width: 90 },
  { key: '_certSummary', label: '持证情况', width: 130 },
  { key: '_eduSummary', label: '学历', width: 100 },
]
</script>

<template>
  <div class="page-shell">
    <!-- 导入区 -->
    <el-card class="import-card">
      <div class="page-header">
        <div>
          <h2>人员台账导入</h2>
          <p class="page-subtitle">按"人员台账模版"格式上传 Excel，自动解析字段并入库</p>
        </div>
      </div>

      <div v-if="!previewData.length" class="import-drop-zone">
        <div class="import-drop-icon">
          <el-icon :size="48"><Upload /></el-icon>
        </div>
        <p class="import-drop-title">上传 人员台账模版.xlsx</p>
        <p class="import-drop-hint">
          模板表头共 38 列，含项目信息、学历、执业证书、紧急联系人等<br>
          表头固定不可修改，请严格按照模板格式填写
        </p>
        <el-upload
          ref="fileInputRef"
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
          :show-file-list="false"
          style="margin-top:16px"
        >
          <el-button type="primary" :icon="Upload" size="large" round>选择 Excel 文件</el-button>
        </el-upload>
      </div>

      <!-- 预览 -->
      <template v-else>
        <div class="import-preview-toolbar">
          <div>
            <span style="font-size:14px;color:var(--ios-text);font-weight:600">预览：{{ fileName }}</span>
            <span style="margin-left:16px;font-size:13px;color:var(--ios-text-secondary)">
              共 <strong>{{ previewData.length }}</strong> 行，
              有效 <strong style="color:var(--ios-green)">{{ previewData.filter(r=>r._valid).length }}</strong> 行
              <template v-if="previewErrors.length">
                ，<strong style="color:var(--ios-red)">有误 {{ previewErrors.length }} 行</strong>
              </template>
            </span>
          </div>
          <div>
            <el-button link type="primary" @click="clearPreview">重新选择</el-button>
          </div>
        </div>

        <div v-if="previewErrors.length" class="import-error-box">
          <div v-for="err in previewErrors" :key="err.row" class="import-error-row">
            <strong>第 {{ err.row }} 行「{{ err.name }}」</strong>：
            {{ err.errors.join('；') }}
          </div>
        </div>

        <div class="table-wrap" style="max-height:340px;overflow:auto;margin-top:10px">
          <el-table :data="previewData" size="small" class="data-table preview-table" style="width:100%">
            <el-table-column prop="_rowNum" label="#" width="44" />
            <el-table-column prop="projectName" label="所属项目" width="120" />
            <el-table-column prop="name" label="姓名" width="72" fixed="left">
              <template #default="{ row }">
                <span :style="{ color: row._valid ? 'var(--ios-text)' : 'var(--ios-red)' }">{{ row.name || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="positionTitle" label="岗位" width="100" />
            <el-table-column prop="gender" label="性别" width="52" />
            <el-table-column prop="idCard" label="身份证号" width="170" />
            <el-table-column prop="phone" label="联系方式" width="115" />
            <el-table-column prop="entryDate" label="入职时间" width="100" />
            <el-table-column prop="projectEntryDate" label="进场时间" width="100" />
            <el-table-column prop="primaryName" label="紧急联系人" width="90" />
            <el-table-column prop="primaryPhone" label="联系人电话" width="115" />
            <el-table-column prop="jobTitle" label="职称" width="80" />
            <el-table-column prop="_certSummary" label="持证" min-width="120" />
            <el-table-column label="状态" width="62">
              <template #default="{ row }">
                <span v-if="row._valid" class="soft-pill green">有效</span>
                <span v-else class="soft-pill" style="background:rgba(255,59,48,.1);color:var(--ios-red)">有误</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="margin-top:16px;text-align:right">
          <el-button round @click="clearPreview">取消</el-button>
          <el-button type="primary" round :disabled="!previewData.filter(r=>r._valid).length" @click="confirmImport">
            确认导入 {{ previewData.filter(r=>r._valid).length }} 条
          </el-button>
        </div>
      </template>
    </el-card>

    <!-- 已导入记录 -->
    <el-card class="table-card">
      <el-card class="search-card">
        <el-form :model="searchForm" inline class="toolbar-form">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.keyword" placeholder="姓名/身份证号/手机号" clearable style="width:220px" />
          </el-form-item>
          <el-form-item label="所属项目">
            <el-select v-model="searchForm.projectName" placeholder="全部" clearable style="width:160px">
              <el-option v-for="p in projectOptions" :key="p" :label="p" :value="p" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" round @click="() => {}">查询</el-button>
            <el-button :icon="RefreshLeft" round @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <div class="page-header">
        <div>
          <h2>台账记录</h2>
          <p class="page-subtitle">已导入 {{ ledgerRecords.length }} 条人员台账，支持关键字与项目筛选</p>
        </div>
      </div>

      <div class="table-wrap">
        <el-table :data="filteredRecords" class="data-table ledger-table" style="width:100%"
          max-height="calc(100vh - 540px)" row-key="id" row-class-name="user-row">

          <el-table-column type="expand">
            <template #default="{ row }">
              <div class="ledger-detail">
                <div class="ledger-detail-section">
                  <span class="ledger-detail-label">第一学历</span>
                  <span>{{ row.edu1Level || '-' }} / {{ row.edu1StudyMode || '-' }} / {{ row.edu1School || '-' }} / {{ row.edu1Major || '-' }}
                    <span v-if="row.edu1Chsi" class="soft-pill green" style="margin-left:8px">学信网: {{ row.edu1Chsi }}</span>
                  </span>
                </div>
                <div class="ledger-detail-section" v-if="row.edu2Level">
                  <span class="ledger-detail-label">第二学历</span>
                  <span>{{ row.edu2Level }} / {{ row.edu2StudyMode || '-' }} / {{ row.edu2School || '-' }} / {{ row.edu2Major || '-' }}
                    <span v-if="row.edu2Chsi" class="soft-pill green" style="margin-left:8px">学信网: {{ row.edu2Chsi }}</span>
                  </span>
                </div>
                <div class="ledger-detail-section">
                  <span class="ledger-detail-label">首个项目</span>
                  <span>{{ row.firstProject || '-' }}</span>
                  <span class="ledger-detail-label" style="margin-left:24px">本项目报备</span>
                  <span>{{ row.projectFiled || '-' }}</span>
                  <span class="ledger-detail-label" style="margin-left:24px">退休</span>
                  <span>{{ row.retired || '-' }}</span>
                  <span class="ledger-detail-label" style="margin-left:24px">挂证</span>
                  <span>{{ row.certFraud || '-' }}</span>
                </div>
                <div class="ledger-detail-section" v-if="row.unregisteredCertReason">
                  <span class="ledger-detail-label">未注册证书</span>
                  <span style="color:var(--ios-orange)">{{ row.unregisteredCertReason }}</span>
                </div>
                <div class="ledger-detail-section" v-if="row.remark">
                  <span class="ledger-detail-label">备注</span>
                  <span>{{ row.remark }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-for="col in ledgerColumns"
            :key="col.key"
            :prop="col.key"
            :label="col.label"
            :width="col.width"
          >
            <template #header>
              <span class="table-header-label">
                <el-icon v-if="col.key==='name'" :size="15"><UserFilled /></el-icon>
                {{ col.label }}
              </span>
            </template>
            <template #default="{ row }">
              <span v-if="col.key==='name'" class="cell-name">{{ row.name }}</span>
              <span v-else-if="col.key==='projectName'" class="soft-pill green">{{ row.projectName }}</span>
              <span v-else-if="col.key==='positionTitle'" class="soft-pill orange">{{ row.positionTitle }}</span>
              <span v-else-if="col.key==='jobTitle'" class="soft-pill yellow">{{ row.jobTitle }}</span>
              <span v-else-if="col.key==='_certSummary'" style="font-size:12px;color:var(--ios-text-secondary)">{{ row._certSummary || '-' }}</span>
              <span v-else-if="col.key==='_eduSummary'">{{ row._eduSummary || '-' }}</span>
              <span v-else>{{ row[col.key] || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="danger" link size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.import-card {
  margin-bottom: 16px;
}
.import-drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  border: 2px dashed var(--ios-border);
  border-radius: var(--ios-radius-lg);
  background: #ffffff;
  text-align: center;
}
.import-drop-icon {
  color: var(--ios-text-placeholder);
  margin-bottom: 10px;
}
.import-drop-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ios-text);
  margin-bottom: 6px;
}
.import-drop-hint {
  font-size: 13px;
  color: var(--ios-text-secondary);
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}
.import-preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}
.import-error-box {
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: var(--ios-radius);
  background: rgba(255,59,48,.06);
  max-height: 120px;
  overflow-y: auto;
}
.import-error-row {
  font-size: 12px;
  color: var(--ios-red);
  line-height: 1.7;
}
.ledger-detail {
  padding: 10px 22px 14px 48px;
}
.ledger-detail-section {
  padding: 4px 0;
  font-size: 13px;
  color: var(--ios-text-secondary);
}
.ledger-detail-label {
  font-weight: 600;
  color: var(--ios-text);
  margin-right: 8px;
}

/* 复用 UserList 的样式 */
.soft-pill {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  line-height: 24px;
  white-space: nowrap;
  font-size: 12px;
}
.soft-pill.green { background: #d7f0dc; color: #0f6b2f; }
.soft-pill.yellow { background: #fff5c4; color: #715200; }
.soft-pill.orange { background: #fde2d8; color: #9a3412; }
.cell-name { font-weight: 600; color: var(--ios-text); }
.table-header-label { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
.table-header-label .el-icon { color: #1f2937; }
</style>
