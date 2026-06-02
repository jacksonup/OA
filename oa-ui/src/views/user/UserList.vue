<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Search, RefreshLeft, Plus, Edit, Delete, Setting, Star,
  Medal, Trophy, School, Phone, UserFilled, Calendar, Postcard, Collection
} from '@element-plus/icons-vue'
import { users, departments, positions, addUser, updateUser, deleteUser } from '../../mock/data.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ keyword: '', projectName: '', status: null, education: '', certificate: '', experience: '' })
const route = useRoute()
const dialogVisible = ref(false)
const practiceDialogVisible = ref(false)
const projectDialogVisible = ref(false)
const fieldConfigVisible = ref(false)
const activeEmployeeModule = ref('master')
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref(null)
const editingProjectIndex = ref(-1)

const emptyForm = {
  id: null, empNo: '', name: '', gender: '', birthDate: '', idCard: '',
  phone: '', email: '', nativePlace: '', ethnicity: '汉族', political: '群众',
  marital: '未婚', educations: [],
  deptId: null, positionId: null, entryDate: '', confirmDate: '', contractEnd: '',
  empType: '正式员工', status: 1, address: '', emergencyContact: '', emergencyPhone: '', remark: ''
}

const educationOrder = ['初中及以下', '高中', '大专', '本科', '硕士', '博士']

function getHighestEducation(educations) {
  if (!educations || !educations.length) return ''
  let highest = educations[0]
  for (const edu of educations) {
    if (educationOrder.indexOf(edu.education) > educationOrder.indexOf(highest.education)) {
      highest = edu
    }
  }
  return highest.education
}

function addEducation() {
  form.educations.push({ education: '', school: '', major: '', startDate: '', endDate: '' })
}

function removeEducation(index) {
  form.educations.splice(index, 1)
}
const form = reactive({ ...emptyForm })
const emptyPracticeForm = {
  userId: null,
  jobTitle: '',
  jobTitleProof: '',
  certificateStatus: '',
  ministrySupervisor: '',
  registeredEngineer: '',
  costEngineer: '',
  constructor: '',
  safetyEngineer: '',
  inspector: '',
  practiceCertificateScan: '',
  unregisteredQualificationReason: ''
}
const practiceForm = reactive({ ...emptyPracticeForm })
const practiceRecordMap = reactive({})
const emptyProjectForm = {
  userId: null,
  projectName: '',
  role: '',
  startDate: '',
  endDate: '',
  remark: ''
}
const projectForm = reactive({ ...emptyProjectForm })
const projectRecordMap = reactive({})

const genderOptions = ['男', '女']
const ethnicityOptions = ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族']
const politicalOptions = ['中共党员', '中共预备党员', '共青团员', '群众', '民主党派']
const maritalOptions = ['未婚', '已婚', '离异', '丧偶']
const educationOptions = ['博士', '硕士', '本科', '大专', '高中', '初中及以下']
const empTypeOptions = ['正式员工', '合同制员工', '劳务派遣', '实习生', '兼职']
const statusOptions = ['离职', '在职']
const employeeModules = [
  { key: 'master', title: '员工主档', path: '/user/master', icon: Star },
  { key: 'practice', title: '执业相关', path: '/user/practice', icon: Medal },
  { key: 'project', title: '项目经历', path: '/user/project', icon: Trophy },
  { key: 'education', title: '学历信息', path: '/user/education', icon: School },
  { key: 'emergency', title: '紧急联系人信息', path: '/user/emergency', icon: Phone }
]

const projectOptions = ['320（临平段）', '330（余杭段）', '340（城北段）', '350（市政段）']
const projectRoleOptions = ['项目经理', '总监', '专业负责人', '监理工程师', '试验室主任', '资料员']
const projectNameOptions = [
  '320国道临平段改建工程',
  '330国道余杭段综合提升工程',
  '城北快速路监理项目',
  '市政道路品质提升工程',
  '未来科技城配套道路工程'
]
const jobTitles = ['高级工程师', '总监', '试验室主任', '工程师', '专业负责人']
const certificateOptions = [
  '部监、检师、部监、检师',
  '部监、部监',
  '国注、检师、国注、检师',
  '一建、造价师',
  '安全员、资料员'
]
const practiceTitles = ['高级工程师', '工程师', '总监理工程师', '试验检测师', '一级建造师']
const practiceCertificateFiles = ['执业证书.pdf', '注册证扫描件.pdf', '职称证书.pdf', '资格证扫描件.pdf']
const unregisteredReasons = ['待单位注册', '资料补正中', '原单位转出中', '本周期无需注册', '']

const FIELD_STORAGE_KEY = 'oa-employee-master-visible-fields'
const defaultVisibleFields = [
  'employeeNo', 'displayName', 'name', 'projectName', 'idCard', 'gender',
  'birthDate', 'phone', 'status', 'positionName', 'jobTitle', 'education',
  'certificates', 'entryDate', 'leaveDate', 'contractStart', 'contractEnd',
  'monthlySalary', 'createdAt', 'updatedAt', 'syncStatus'
]
const userFieldOptions = [
  { key: 'employeeNo', label: '员工工号' },
  { key: 'displayName', label: '显示名' },
  { key: 'name', label: '姓名' },
  { key: 'projectName', label: '所属项目' },
  { key: 'idCard', label: '身份证号' },
  { key: 'gender', label: '性别' },
  { key: 'birthDate', label: '出生日期' },
  { key: 'phone', label: '手机号' },
  { key: 'status', label: '员工状态' },
  { key: 'positionName', label: '岗位' },
  { key: 'jobTitle', label: '职称' },
  { key: 'education', label: '最高学历' },
  { key: 'certificates', label: '持证情况' },
  { key: 'entryDate', label: '入职日期' },
  { key: 'leaveDate', label: '离职日期' },
  { key: 'contractStart', label: '当前合同开始日期' },
  { key: 'contractEnd', label: '当前合同结束日期' },
  { key: 'monthlySalary', label: '月工资标准' },
  { key: 'createdAt', label: '创建时间' },
  { key: 'updatedAt', label: '更新时间' },
  { key: 'syncStatus', label: '同步状态' }
]

const employeeMasterColumns = [
  { key: 'employeeNo', label: '员工工号', width: 104, icon: Postcard, fixed: 'left' },
  { key: 'displayName', label: '显示名', width: 128, icon: Collection },
  { key: 'name', label: '姓名', width: 96, icon: UserFilled },
  { key: 'projectName', label: '所属项目', width: 148 },
  { key: 'idCard', label: '身份证号', width: 186, icon: Postcard },
  { key: 'gender', label: '性别', width: 72 },
  { key: 'birthDate', label: '出生日期', width: 118, icon: Calendar },
  { key: 'phone', label: '联系方式', width: 128, icon: Phone },
  { key: 'status', label: '员工状态', width: 96 },
  { key: 'positionName', label: '岗位', width: 126 },
  { key: 'jobTitle', label: '职称', width: 126 },
  { key: 'education', label: '最高学历', width: 112, icon: School },
  { key: 'certificates', label: '持证情况', width: 260 },
  { key: 'entryDate', label: '入职日期', width: 118, icon: Calendar },
  { key: 'leaveDate', label: '离职日期', width: 118, icon: Calendar },
  { key: 'contractStart', label: '当前合同开始日期', width: 170, icon: Calendar },
  { key: 'contractEnd', label: '当前合同结束日期', width: 170, icon: Calendar },
  { key: 'monthlySalary', label: '月工资标准', width: 128 },
  { key: 'createdAt', label: '创建时间', width: 118, icon: Calendar },
  { key: 'updatedAt', label: '更新时间', width: 118, icon: Calendar },
  { key: 'syncStatus', label: '同步状态', width: 112 }
]

const practiceColumns = [
  { key: 'relatedEmployee', label: '关联员工', width: 136, fixed: 'left', icon: UserFilled },
  { key: 'jobTitle', label: '职称', width: 136 },
  { key: 'jobTitleProof', label: '职称证明', width: 156, icon: Postcard },
  { key: 'certificateStatus', label: '持证情况', width: 260 },
  { key: 'ministrySupervisor', label: '部监', width: 92 },
  { key: 'registeredEngineer', label: '国注', width: 92 },
  { key: 'costEngineer', label: '一造', width: 92 },
  { key: 'constructor', label: '一建', width: 92 },
  { key: 'safetyEngineer', label: '注安', width: 92 },
  { key: 'inspector', label: '检师', width: 92 },
  { key: 'practiceCertificateScan', label: '执业证书扫描件', width: 176, icon: Postcard },
  { key: 'unregisteredQualificationReason', label: '未注册的执业资格证书及原因', width: 250 }
]

function getInitialVisibleFields() {
  try {
    const savedFields = JSON.parse(localStorage.getItem(FIELD_STORAGE_KEY) || '[]')
    const validKeys = new Set(userFieldOptions.map(item => item.key))
    const fields = savedFields.filter(key => validKeys.has(key))
    return fields.length ? fields : [...defaultVisibleFields]
  } catch {
    return [...defaultVisibleFields]
  }
}

const visibleFields = ref(getInitialVisibleFields())
const visibleFieldSet = computed(() => new Set(visibleFields.value))
const visibleFieldCount = computed(() => visibleFields.value.length)
const visibleEmployeeMasterColumns = computed(() => {
  return employeeMasterColumns.filter(column => isFieldVisible(column.key))
})

function isFieldVisible(key) {
  return visibleFieldSet.value.has(key)
}

function selectAllFields() {
  visibleFields.value = userFieldOptions.map(item => item.key)
}

function resetFields() {
  visibleFields.value = [...defaultVisibleFields]
}

watch(visibleFields, fields => {
  localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(fields))
}, { deep: true })

const deptOptions = computed(() => departments.map(d => ({ value: d.id, label: d.name })))
const positionOptions = computed(() => {
  if (!form.deptId) return positions.map(p => ({ value: p.id, label: p.name }))
  return positions.filter(p => p.deptId === form.deptId).map(p => ({ value: p.id, label: p.name }))
})
const userOptions = computed(() => {
  return employeeMasterRows.value.map(user => ({ value: user.id, label: user.displayName }))
})

const employeeMasterRows = computed(() => {
  return users.map((user, index) => {
    const projectName = projectOptions[index % projectOptions.length]
    return {
      ...user,
      employeeNo: String(601076 + index * 10),
      displayName: `${user.name}(${String(9300 + user.id)})`,
      projectName,
      jobTitle: jobTitles[index % jobTitles.length],
      certificates: certificateOptions[index % certificateOptions.length],
      leaveDate: user.status === 1 ? '' : '2026-06',
      contractStart: user.confirmDate || user.entryDate,
      monthlySalary: user.status === 1 ? `${9000 + index * 500}` : '',
      createdAt: '2026-06-01',
      updatedAt: '2026-06-01',
      syncStatus: '已同步'
    }
  })
})

const practiceRows = computed(() => {
  return employeeMasterRows.value.map((user, index) => {
    const hasMinistrySupervisor = index % 2 === 0
    const hasRegisteredEngineer = index % 3 === 0
    const hasCostEngineer = index % 4 === 0
    const hasConstructor = index % 3 === 1
    const hasSafetyEngineer = index % 5 === 0
    const hasInspector = index % 2 === 1
    const certificates = [
      hasMinistrySupervisor ? '部监' : '',
      hasRegisteredEngineer ? '国注' : '',
      hasCostEngineer ? '一造' : '',
      hasConstructor ? '一建' : '',
      hasSafetyEngineer ? '注安' : '',
      hasInspector ? '检师' : ''
    ].filter(Boolean)

    const defaultPractice = {
      jobTitle: practiceTitles[index % practiceTitles.length],
      jobTitleProof: index % 4 === 2 ? '待上传' : practiceCertificateFiles[index % practiceCertificateFiles.length],
      certificateStatus: certificates.join('、') || '暂无',
      ministrySupervisor: hasMinistrySupervisor ? '已取得' : '',
      registeredEngineer: hasRegisteredEngineer ? '已注册' : '',
      costEngineer: hasCostEngineer ? '已注册' : '',
      constructor: hasConstructor ? '已注册' : '',
      safetyEngineer: hasSafetyEngineer ? '已注册' : '',
      inspector: hasInspector ? '已取得' : '',
      practiceCertificateScan: index % 4 === 2 ? '' : practiceCertificateFiles[(index + 1) % practiceCertificateFiles.length],
      unregisteredQualificationReason: unregisteredReasons[index % unregisteredReasons.length]
    }
    const savedPractice = practiceRecordMap[user.id] || {}

    return {
      ...user,
      ...defaultPractice,
      ...savedPractice,
      userId: user.id,
      relatedEmployee: user.displayName
    }
  })
})

function getDefaultProjectExperiences(user, index) {
  const count = 2 + (index % 2)
  return Array.from({ length: count }).map((_, projectIndex) => {
    const startYear = 2021 + projectIndex
    const startMonth = ((index + projectIndex * 3) % 9) + 1
    const endYear = startYear + (projectIndex === count - 1 && index % 3 === 0 ? 0 : 1)
    const endMonth = projectIndex === count - 1 && index % 3 === 0 ? '' : ((startMonth + 5) % 12) + 1
    const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}`
    const endDate = endMonth ? `${endYear}-${String(endMonth).padStart(2, '0')}` : ''

    return {
      projectName: projectNameOptions[(index + projectIndex) % projectNameOptions.length],
      role: projectRoleOptions[(index + projectIndex) % projectRoleOptions.length],
      startDate,
      endDate,
      remark: projectIndex === count - 1 && !endDate ? '当前在岗项目' : '已归档'
    }
  })
}

function monthDiff(startDate, endDate) {
  if (!startDate) return 0
  const [startYear, startMonth] = startDate.split('-').map(Number)
  const finalDate = endDate || '2026-06'
  const [endYear, endMonth] = finalDate.split('-').map(Number)
  return Math.max((endYear - startYear) * 12 + endMonth - startMonth + 1, 1)
}

function formatTenure(months) {
  const years = Math.floor(months / 12)
  const restMonths = months % 12
  if (years && restMonths) return `${years}年${restMonths}个月`
  if (years) return `${years}年`
  return `${restMonths}个月`
}

const projectRows = computed(() => {
  return employeeMasterRows.value.map((user, index) => {
    const projects = (projectRecordMap[user.id] || getDefaultProjectExperiences(user, index))
      .map(project => {
        const tenureMonths = monthDiff(project.startDate, project.endDate)
        return {
          ...project,
          tenureMonths,
          tenureText: formatTenure(tenureMonths),
          status: project.endDate ? '已结束' : '进行中'
        }
      })
      .sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''))
    const currentProject = projects.find(project => !project.endDate) || projects[0]
    const totalMonths = projects.reduce((sum, project) => sum + project.tenureMonths, 0)

    return {
      ...user,
      userId: user.id,
      relatedEmployee: user.displayName,
      projects,
      projectCount: projects.length,
      currentProjectName: currentProject?.projectName || '',
      currentRole: currentProject?.role || '',
      totalTenureText: formatTenure(totalMonths),
      latestStartDate: currentProject?.startDate || '',
      latestEndDate: currentProject?.endDate || ''
    }
  })
})

const filteredUsers = computed(() => {
  return employeeMasterRows.value.filter(u => {
    const keywordHit = !searchForm.keyword ||
      u.name.includes(searchForm.keyword) ||
      u.employeeNo.includes(searchForm.keyword) ||
      u.displayName.includes(searchForm.keyword) ||
      u.phone.includes(searchForm.keyword) ||
      u.idCard.includes(searchForm.keyword)
    if (!keywordHit) return false
    if (searchForm.projectName && u.projectName !== searchForm.projectName) return false
    if (searchForm.status !== null && searchForm.status !== '' && u.status !== searchForm.status) return false
    if (searchForm.education && getHighestEducation(u.educations) !== searchForm.education) return false
    if (searchForm.certificate && !u.certificates.includes(searchForm.certificate)) return false
    if (searchForm.experience) {
      const userProjects = projectRecordMap[u.id] || getDefaultProjectExperiences(u, employeeMasterRows.value.indexOf(u))
      const expHit = userProjects.some(p =>
        p.projectName.includes(searchForm.experience) || p.role.includes(searchForm.experience)
      )
      if (!expHit) return false
    }
    return true
  })
})

const filteredPracticeRows = computed(() => {
  return practiceRows.value.filter(u => {
    const keywordHit = !searchForm.keyword ||
      u.name.includes(searchForm.keyword) ||
      u.employeeNo.includes(searchForm.keyword) ||
      u.relatedEmployee.includes(searchForm.keyword) ||
      u.jobTitle.includes(searchForm.keyword) ||
      u.certificateStatus.includes(searchForm.keyword)
    if (!keywordHit) return false
    if (searchForm.projectName && u.projectName !== searchForm.projectName) return false
    if (searchForm.status !== null && searchForm.status !== '' && u.status !== searchForm.status) return false
    return true
  })
})

const filteredProjectRows = computed(() => {
  return projectRows.value.filter(u => {
    const keywordHit = !searchForm.keyword ||
      u.name.includes(searchForm.keyword) ||
      u.employeeNo.includes(searchForm.keyword) ||
      u.relatedEmployee.includes(searchForm.keyword) ||
      u.projects.some(project => project.projectName.includes(searchForm.keyword) || project.role.includes(searchForm.keyword))
    if (!keywordHit) return false
    if (searchForm.projectName && !u.projects.some(project => project.projectName.includes(searchForm.projectName.slice(0, 3)))) return false
    if (searchForm.status !== null && searchForm.status !== '' && u.status !== searchForm.status) return false
    return true
  })
})

const activeUserCount = computed(() => users.filter(u => u.status === 1).length)
const regularUserCount = computed(() => users.filter(u => u.empType === '正式员工').length)
const userDeptCount = computed(() => new Set(users.map(u => u.deptId)).size)

function handleSearch() {}
function handleReset() {
  searchForm.keyword = ''
  searchForm.projectName = ''
  searchForm.status = null
  searchForm.education = ''
  searchForm.certificate = ''
  searchForm.experience = ''
}

function openAddPractice() {
  Object.assign(practiceForm, emptyPracticeForm)
  practiceDialogVisible.value = true
}

function openEditPractice(row) {
  Object.assign(practiceForm, {
    userId: row.userId,
    jobTitle: row.jobTitle,
    jobTitleProof: row.jobTitleProof,
    certificateStatus: row.certificateStatus,
    ministrySupervisor: row.ministrySupervisor,
    registeredEngineer: row.registeredEngineer,
    costEngineer: row.costEngineer,
    constructor: row.constructor,
    safetyEngineer: row.safetyEngineer,
    inspector: row.inspector,
    practiceCertificateScan: row.practiceCertificateScan,
    unregisteredQualificationReason: row.unregisteredQualificationReason
  })
  practiceDialogVisible.value = true
}

function savePractice() {
  if (!practiceForm.userId) {
    ElMessage.warning('请选择关联员工')
    return
  }
  practiceRecordMap[practiceForm.userId] = { ...practiceForm }
  practiceDialogVisible.value = false
  ElMessage.success('保存成功')
}

function openAddProject(row = null) {
  Object.assign(projectForm, emptyProjectForm, row ? { userId: row.userId } : {})
  editingProjectIndex.value = -1
  projectDialogVisible.value = true
}

function openEditProject(row, project, index) {
  Object.assign(projectForm, {
    userId: row.userId,
    projectName: project.projectName,
    role: project.role,
    startDate: project.startDate,
    endDate: project.endDate,
    remark: project.remark
  })
  editingProjectIndex.value = index
  projectDialogVisible.value = true
}

function saveProject() {
  if (!projectForm.userId) {
    ElMessage.warning('请选择关联员工')
    return
  }
  if (!projectForm.projectName || !projectForm.role || !projectForm.startDate) {
    ElMessage.warning('请完善项目名称、角色和开始时间')
    return
  }
  const user = employeeMasterRows.value.find(item => item.id === projectForm.userId)
  const defaultProjects = user ? getDefaultProjectExperiences(user, employeeMasterRows.value.indexOf(user)) : []
  const projects = [...(projectRecordMap[projectForm.userId] || defaultProjects)]
  const nextProject = { ...projectForm }
  if (editingProjectIndex.value > -1) {
    projects.splice(editingProjectIndex.value, 1, nextProject)
  } else {
    projects.unshift(nextProject)
  }
  projectRecordMap[projectForm.userId] = projects
  projectDialogVisible.value = false
  ElMessage.success('保存成功')
}

watch(
  () => route.path,
  path => {
    const matchedModule = employeeModules.find(item => item.path === path)
    activeEmployeeModule.value = matchedModule?.key || 'master'
  },
  { immediate: true }
)

function openAdd() {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  Object.assign(form, emptyForm)
  dialogVisible.value = true
}

function openEdit(row) {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除用户「${row.name}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      deleteUser(row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return
    if (isEdit.value) {
      updateUser({ ...form })
      ElMessage.success('更新成功')
    } else {
      addUser({ ...form })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }]
}
</script>

<template>
  <div class="page-shell">
    <div class="employee-workspace">
      <section class="employee-module-content">
        <template v-if="activeEmployeeModule === 'master'">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">员工总数</div>
              <div class="summary-value">{{ users.length }}</div>
              <div class="summary-note">覆盖全部员工主档</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">在职员工</div>
              <div class="summary-value">{{ activeUserCount }}</div>
              <div class="summary-note">当前可调配人员</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">正式员工</div>
              <div class="summary-value">{{ regularUserCount }}</div>
              <div class="summary-note">按用工形式统计</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">覆盖部门</div>
              <div class="summary-value">{{ userDeptCount }}</div>
              <div class="summary-note">员工所属组织范围</div>
            </div>
          </div>

          <el-card class="search-card">
            <el-form :model="searchForm" inline class="toolbar-form">
              <el-form-item label="关键字">
                <el-input v-model="searchForm.keyword" placeholder="姓名/工号/手机号/身份证" clearable style="width:230px" />
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
              <el-form-item label="学历">
                <el-select v-model="searchForm.education" placeholder="全部" clearable style="width:140px">
                  <el-option v-for="item in educationOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="证书">
                <el-input v-model="searchForm.certificate" placeholder="持证名称" clearable style="width:160px" />
              </el-form-item>
              <el-form-item label="项目经历">
                <el-input v-model="searchForm.experience" placeholder="项目名称/角色" clearable style="width:170px" />
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
                <h2>员工主档</h2>
                <p class="page-subtitle">集中维护员工身份、项目、任职、合同与同步信息</p>
              </div>
              <div class="header-actions">
                <el-button :icon="Setting" round @click="fieldConfigVisible = true">
                  字段配置
                </el-button>
                <el-button type="primary" :icon="Plus" round @click="openAdd">新增员工</el-button>
              </div>
            </div>
            <div class="table-wrap">
              <el-table :data="filteredUsers" class="data-table employee-master-table" style="width:100%" max-height="calc(100vh - 370px)" row-class-name="user-row">
                <el-table-column
                  v-for="column in visibleEmployeeMasterColumns"
                  :key="column.key"
                  :prop="column.key"
                  :width="column.width"
                  :fixed="column.fixed"
                  align="left"
                >
                  <template #header>
                    <span class="table-header-label">
                      <el-icon v-if="column.icon" :size="15"><component :is="column.icon" /></el-icon>
                      {{ column.label }}
                    </span>
                  </template>
                  <template #default="{ row }">
                    <span v-if="column.key === 'projectName'" class="soft-pill green">{{ row.projectName }}</span>
                    <span v-else-if="column.key === 'status'" class="soft-pill yellow">{{ statusOptions[row.status] }}</span>
                    <span v-else-if="column.key === 'positionName'" class="soft-pill orange">{{ row.positionName }}</span>
                    <span v-else-if="column.key === 'jobTitle'" class="soft-pill yellow">{{ row.jobTitle }}</span>
                    <span v-else-if="column.key === 'education'" class="soft-pill neutral">{{ getHighestEducation(row.educations) }}</span>
                    <span v-else-if="column.key === 'syncStatus'" class="soft-pill green">{{ row.syncStatus }}</span>
                    <span v-else-if="column.key === 'monthlySalary'">{{ row.monthlySalary }}</span>
                    <span v-else>{{ row[column.key] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="126" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" :icon="Edit" @click="openEdit(row)">编辑</el-button>
                    <el-button type="danger" link size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </template>

        <template v-else-if="activeEmployeeModule === 'practice'">
          <el-card class="search-card">
            <el-form :model="searchForm" inline class="toolbar-form">
              <el-form-item label="关键字">
                <el-input v-model="searchForm.keyword" placeholder="员工/职称/证书" clearable style="width:230px" />
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
                <h2>执业相关</h2>
                <p class="page-subtitle">维护员工职称、执业资格、注册情况与证书扫描件</p>
              </div>
              <div class="header-actions">
                <el-button type="primary" :icon="Plus" round @click="openAddPractice">新增记录</el-button>
              </div>
            </div>
            <div class="table-wrap">
              <el-table :data="filteredPracticeRows" class="data-table practice-table" style="width:100%" max-height="calc(100vh - 270px)" row-class-name="user-row">
                <el-table-column
                  v-for="column in practiceColumns"
                  :key="column.key"
                  :prop="column.key"
                  :width="column.width"
                  :fixed="column.fixed"
                  align="left"
                >
                  <template #header>
                    <span class="table-header-label">
                      <el-icon v-if="column.icon" :size="15"><component :is="column.icon" /></el-icon>
                      {{ column.label }}
                    </span>
                  </template>
                  <template #default="{ row }">
                    <span v-if="column.key === 'relatedEmployee'" class="cell-name">{{ row.relatedEmployee }}</span>
                    <span v-else-if="column.key === 'jobTitle'" class="soft-pill yellow">{{ row.jobTitle }}</span>
                    <span v-else-if="column.key === 'certificateStatus'" class="certificate-text">{{ row.certificateStatus }}</span>
                    <span v-else-if="['ministrySupervisor', 'registeredEngineer', 'costEngineer', 'constructor', 'safetyEngineer', 'inspector'].includes(column.key)">
                      <span v-if="row[column.key]" class="soft-pill green">{{ row[column.key] }}</span>
                      <span v-else class="empty-mark">-</span>
                    </span>
                    <span v-else-if="column.key === 'jobTitleProof' || column.key === 'practiceCertificateScan'">
                      <el-button v-if="row[column.key]" type="primary" link size="small">{{ row[column.key] }}</el-button>
                      <span v-else class="empty-mark">未上传</span>
                    </span>
                    <span v-else>{{ row[column.key] || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="96" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" :icon="Edit" @click="openEditPractice(row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </template>

        <template v-else-if="activeEmployeeModule === 'project'">
          <el-card class="search-card">
            <el-form :model="searchForm" inline class="toolbar-form">
              <el-form-item label="关键字">
                <el-input v-model="searchForm.keyword" placeholder="员工/项目/角色" clearable style="width:230px" />
              </el-form-item>
              <el-form-item label="项目范围">
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
                <h2>项目经历</h2>
                <p class="page-subtitle">按员工聚合项目履历，展开查看完整时间线</p>
              </div>
              <div class="header-actions">
                <el-button type="primary" :icon="Plus" round @click="openAddProject()">新增经历</el-button>
              </div>
            </div>
            <div class="table-wrap">
              <el-table :data="filteredProjectRows" class="data-table project-table" style="width:100%" max-height="calc(100vh - 270px)" row-key="userId">
                <el-table-column type="expand" width="46">
                  <template #default="{ row }">
                    <div class="project-timeline">
                      <div
                        v-for="(project, index) in row.projects"
                        :key="`${row.userId}-${project.projectName}-${project.startDate}`"
                        class="project-timeline-item"
                      >
                        <div class="timeline-dot" :class="{ active: !project.endDate }"></div>
                        <div class="project-card">
                          <div class="project-card-main">
                            <div>
                              <div class="project-card-title">{{ project.projectName }}</div>
                              <div class="project-card-meta">
                                {{ project.startDate }} 至 {{ project.endDate || '今' }} · {{ project.tenureText }}
                              </div>
                            </div>
                            <div class="project-card-actions">
                              <span class="soft-pill" :class="project.status === '进行中' ? 'green' : 'neutral'">{{ project.status }}</span>
                              <el-button type="primary" link size="small" :icon="Edit" @click="openEditProject(row, project, index)">编辑</el-button>
                            </div>
                          </div>
                          <div class="project-card-bottom">
                            <span class="soft-pill yellow">{{ project.role }}</span>
                            <span class="project-remark">{{ project.remark || '暂无备注' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="关联员工" width="150" fixed="left">
                  <template #default="{ row }">
                    <span class="cell-name">{{ row.relatedEmployee }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="当前/最近项目" min-width="240">
                  <template #default="{ row }">
                    <div class="project-summary-title">{{ row.currentProjectName }}</div>
                    <div class="project-summary-sub">{{ row.latestStartDate }} 至 {{ row.latestEndDate || '今' }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="当前/最近角色" width="140">
                  <template #default="{ row }">
                    <span class="soft-pill yellow">{{ row.currentRole }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="项目数" width="96" align="center">
                  <template #default="{ row }">
                    <span class="project-count">{{ row.projectCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="累计任职时长" width="136">
                  <template #default="{ row }">{{ row.totalTenureText }}</template>
                </el-table-column>
                <el-table-column label="操作" width="126" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" :icon="Plus" @click="openAddProject(row)">添加经历</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </template>

        <div v-else class="module-placeholder">
          <el-icon :size="42"><component :is="employeeModules.find(item => item.key === activeEmployeeModule)?.icon" /></el-icon>
          <h3>{{ employeeModules.find(item => item.key === activeEmployeeModule)?.title }}</h3>
          <p>已完成二级菜单入口，后续可在此模块维护对应员工明细。</p>
        </div>
      </section>
    </div>

    <el-dialog v-model="fieldConfigVisible" title="字段配置" width="620px" destroy-on-close>
      <div class="field-config-header">
        <span>已显示 {{ visibleFieldCount }} / {{ userFieldOptions.length }} 个字段</span>
        <div>
          <el-button link type="primary" @click="selectAllFields">全选</el-button>
          <el-button link @click="resetFields">恢复默认</el-button>
        </div>
      </div>
      <el-checkbox-group v-model="visibleFields" class="field-config-grid">
        <el-checkbox
          v-for="field in userFieldOptions"
          :key="field.key"
          :label="field.key"
          :disabled="visibleFields.length === 1 && visibleFields.includes(field.key)"
        >
          {{ field.label }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" round @click="fieldConfigVisible = false">完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="practiceDialogVisible" title="执业相关记录" width="760px" destroy-on-close>
      <el-form :model="practiceForm" label-width="150px" size="default">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="关联员工" required>
              <el-select v-model="practiceForm.userId" filterable placeholder="请选择员工" style="width:100%">
                <el-option v-for="user in userOptions" :key="user.value" :label="user.label" :value="user.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职称">
              <el-input v-model="practiceForm.jobTitle" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="职称证明">
              <el-input v-model="practiceForm.jobTitleProof" placeholder="文件名或上传状态" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="持证情况">
              <el-input v-model="practiceForm.certificateStatus" placeholder="如：部监、国注、检师" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8"><el-form-item label="部监"><el-input v-model="practiceForm.ministrySupervisor" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="国注"><el-input v-model="practiceForm.registeredEngineer" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="一造"><el-input v-model="practiceForm.costEngineer" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8"><el-form-item label="一建"><el-input v-model="practiceForm.constructor" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="注安"><el-input v-model="practiceForm.safetyEngineer" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="检师"><el-input v-model="practiceForm.inspector" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="执业证书扫描件">
              <el-input v-model="practiceForm.practiceCertificateScan" placeholder="文件名或上传状态" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="未注册资格及原因">
              <el-input v-model="practiceForm.unregisteredQualificationReason" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button round @click="practiceDialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="savePractice">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="projectDialogVisible" title="项目经历记录" width="720px" destroy-on-close>
      <el-form :model="projectForm" label-width="110px" size="default">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="关联员工" required>
              <el-select v-model="projectForm.userId" filterable placeholder="请选择员工" style="width:100%">
                <el-option v-for="user in userOptions" :key="user.value" :label="user.label" :value="user.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目角色" required>
              <el-select v-model="projectForm.role" filterable allow-create placeholder="请选择或输入角色" style="width:100%">
                <el-option v-for="role in projectRoleOptions" :key="role" :label="role" :value="role" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目名称" required>
          <el-select v-model="projectForm.projectName" filterable allow-create placeholder="请选择或输入项目名称" style="width:100%">
            <el-option v-for="project in projectNameOptions" :key="project" :label="project" :value="project" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="开始时间" required>
              <el-date-picker v-model="projectForm.startDate" type="month" placeholder="选择月份" style="width:100%" value-format="YYYY-MM" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker v-model="projectForm.endDate" type="month" placeholder="留空表示进行中" style="width:100%" value-format="YYYY-MM" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="projectForm.remark" type="textarea" :rows="3" placeholder="例如：当前在岗项目、已归档、参与阶段等" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="projectDialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="saveProject">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="780px" top="3vh" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" size="default">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="form.gender" style="width:100%">
                <el-option v-for="g in genderOptions" :key="g" :label="g" :value="g" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期">
              <el-date-picker v-model="form.birthDate" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="身份证号"><el-input v-model="form.idCard" maxlength="18" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="民族">
              <el-select v-model="form.ethnicity" style="width:100%">
                <el-option v-for="e in ethnicityOptions" :key="e" :label="e" :value="e" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="籍贯"><el-input v-model="form.nativePlace" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="政治面貌">
              <el-select v-model="form.political" style="width:100%">
                <el-option v-for="p in politicalOptions" :key="p" :label="p" :value="p" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="婚姻状况">
              <el-select v-model="form.marital" style="width:100%">
                <el-option v-for="m in maritalOptions" :key="m" :label="m" :value="m" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" maxlength="11" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现住址"><el-input v-model="form.address" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="紧急联系人"><el-input v-model="form.emergencyContact" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系电话"><el-input v-model="form.emergencyPhone" maxlength="11" /></el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">
          学历信息
          <el-button type="primary" link size="small" style="margin-left:12px" @click="addEducation">+ 添加学历</el-button>
        </el-divider>
        <div v-if="form.educations.length === 0" style="color:var(--ios-text-secondary);font-size:13px;padding:8px 0">
          暂未添加学历信息，点击"添加学历"开始填写
        </div>
        <div v-for="(edu, idx) in form.educations" :key="idx" style="margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:12px;color:var(--ios-text-secondary);font-weight:500">学历 #{{ idx + 1 }}</span>
            <el-button type="danger" link size="small" @click="removeEducation(idx)">删除</el-button>
          </div>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="学历">
                <el-select v-model="edu.education" style="width:100%">
                  <el-option v-for="e in educationOptions" :key="e" :label="e" :value="e" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="毕业院校"><el-input v-model="edu.school" /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专业"><el-input v-model="edu.major" /></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="入学时间">
                <el-date-picker v-model="edu.startDate" type="month" placeholder="选择月份" style="width:100%" value-format="YYYY-MM" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="毕业时间">
                <el-date-picker v-model="edu.endDate" type="month" placeholder="选择月份" style="width:100%" value-format="YYYY-MM" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-divider content-position="left">工作信息</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="部门" prop="deptId">
              <el-select v-model="form.deptId" style="width:100%" @change="form.positionId = null">
                <el-option v-for="d in deptOptions" :key="d.value" :label="d.label" :value="d.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位" prop="positionId">
              <el-select v-model="form.positionId" style="width:100%">
                <el-option v-for="p in positionOptions" :key="p.value" :label="p.label" :value="p.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用工形式">
              <el-select v-model="form.empType" style="width:100%">
                <el-option v-for="t in empTypeOptions" :key="t" :label="t" :value="t" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="入职日期" prop="entryDate">
              <el-date-picker v-model="form.entryDate" type="date" style="width:100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转正日期">
              <el-date-picker v-model="form.confirmDate" type="date" style="width:100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同到期日">
              <el-date-picker v-model="form.contractEnd" type="date" style="width:100%" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :value="1">在职</el-radio>
                <el-radio :value="0">离职</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="2" /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.employee-workspace {
  display: block;
  min-width: 0;
}

.employee-module-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.table-header-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.table-header-label .el-icon {
  color: #1f2937;
}

.soft-pill {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  line-height: 24px;
  white-space: nowrap;
}

.soft-pill.green {
  background: #d7f0dc;
  color: #0f6b2f;
}

.soft-pill.yellow {
  background: #fff5c4;
  color: #715200;
}

.soft-pill.orange {
  background: #fde2d8;
  color: #9a3412;
}

.soft-pill.neutral {
  background: #eef2f7;
  color: #475569;
}

.certificate-text {
  display: inline-block;
  max-width: 238px;
  overflow: hidden;
  color: var(--ios-text);
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.empty-mark {
  color: var(--ios-text-placeholder);
}

.project-summary-title {
  max-width: 100%;
  overflow: hidden;
  color: var(--ios-text);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-summary-sub {
  margin-top: 3px;
  color: var(--ios-text-secondary);
  font-size: 12px;
}

.project-count {
  display: inline-flex;
  width: 28px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #eaf2ff;
  color: var(--ios-blue);
  font-weight: 700;
}

.project-timeline {
  padding: 14px 22px 16px 34px;
}

.project-timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  gap: 12px;
}

.project-timeline-item:not(:last-child) {
  padding-bottom: 14px;
}

.project-timeline-item:not(:last-child)::before {
  position: absolute;
  top: 18px;
  bottom: -4px;
  left: 7px;
  width: 2px;
  background: var(--ios-separator);
  content: '';
}

.timeline-dot {
  position: relative;
  z-index: 1;
  width: 16px;
  height: 16px;
  margin-top: 9px;
  border: 3px solid #cbd5e1;
  border-radius: 50%;
  background: #ffffff;
}

.timeline-dot.active {
  border-color: var(--ios-green);
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
}

.project-card {
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid var(--ios-separator);
  border-radius: var(--ios-radius);
  background: #ffffff;
}

.project-card-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.project-card-title {
  color: var(--ios-text);
  font-size: 14px;
  font-weight: 700;
}

.project-card-meta {
  margin-top: 4px;
  color: var(--ios-text-secondary);
  font-size: 12px;
}

.project-card-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
}

.project-card-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.project-remark {
  min-width: 0;
  overflow: hidden;
  color: var(--ios-text-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-placeholder {
  display: flex;
  min-height: 360px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--ios-border);
  border-radius: var(--ios-radius-lg);
  background: #ffffff;
  color: var(--ios-text-secondary);
  text-align: center;
}

.module-placeholder .el-icon {
  color: #94a3b8;
}

.module-placeholder h3 {
  margin-top: 14px;
  color: var(--ios-text);
  font-size: 20px;
}

.module-placeholder p {
  margin-top: 8px;
  font-size: 13px;
}

.field-config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--ios-text-secondary);
  font-size: 13px;
  margin-bottom: 14px;
}

.field-config-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 12px;
}

.field-config-grid :deep(.el-checkbox) {
  height: 34px;
  margin-right: 0;
  padding: 0 10px;
  border: 1px solid var(--ios-separator);
  border-radius: var(--ios-radius);
  background: #f8fafc;
}

.field-config-grid :deep(.el-checkbox__label) {
  color: var(--ios-text);
  font-size: 13px;
  white-space: nowrap;
}

.cell-name {
  font-weight: 600;
  color: var(--ios-text);
}
.cell-education {
  font-size: 12px;
  color: var(--ios-text-secondary);
}
.cell-status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}
.cell-status.active {
  background: rgba(52, 199, 89, 0.12);
  color: var(--ios-green);
}
.cell-status.inactive {
  background: rgba(255, 59, 48, 0.08);
  color: var(--ios-red);
}

</style>
