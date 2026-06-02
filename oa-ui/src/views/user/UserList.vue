<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Search, RefreshLeft, Plus, Edit, Delete, Setting, Star,
  Medal, Trophy, School, Phone, UserFilled, Calendar, Postcard, Collection,
  Upload, Download
} from '@element-plus/icons-vue'
import { users, departments, positions, addUser, updateUser, deleteUser } from '../../mock/data.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'

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
  empType: '正式员工', status: 1, address: '',
  projectName: '', jobTitle: '', certificates: '', monthlySalary: '',
  primaryName: '', primaryRelation: '', primaryPhone: '',
  secondaryName: '', secondaryRelation: '', secondaryPhone: '',
  remark: ''
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
  form.educations.push({ education: '', studyMode: '', school: '', major: '', startDate: '', endDate: '', chsiProof: '' })
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

const educationSearchForm = reactive({ keyword: '', education: '', studyMode: '' })
const educationDialogVisible = ref(false)
const currentEducationUserId = ref(null)
const editingEducationIndex = ref(-1)
const emptyEducationForm = {
  education: '', studyMode: '', school: '', major: '', startDate: '', endDate: '', chsiProof: ''
}
const educationForm = reactive({ ...emptyEducationForm })
const educationRecordMap = reactive({})

const emergencyRelations = ['配偶', '父亲', '母亲', '子女', '兄弟', '姐妹', '朋友', '同事', '其他']
const emergencyContactNames = [
  '张丽华', '李秀英', '王建国', '赵秀兰', '陈明', '刘芳',
  '黄伟', '周敏', '吴强', '郑红', '冯涛', '孙婷'
]
const emergencyDialogVisible = ref(false)
const emptyEmergencyForm = {
  userId: null,
  primaryName: '',
  primaryRelation: '',
  primaryPhone: '',
  secondaryName: '',
  secondaryRelation: '',
  secondaryPhone: ''
}
const emergencyForm = reactive({ ...emptyEmergencyForm })
const emergencyRecordMap = reactive({})

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
const studyModeOptions = ['全日制', '非全日制', '自考', '网络教育', '成人高考', '开放教育']

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

const emergencyColumns = [
  { key: 'relatedEmployee', label: '关联员工', width: 150, fixed: 'left', icon: UserFilled },
  { key: 'primaryName', label: '第一联系人', width: 120 },
  { key: 'primaryRelation', label: '关系', width: 100 },
  { key: 'primaryPhone', label: '联系电话', width: 140, icon: Phone },
  { key: 'secondaryName', label: '第二联系人', width: 120 },
  { key: 'secondaryRelation', label: '关系', width: 100 },
  { key: 'secondaryPhone', label: '联系电话', width: 140, icon: Phone }
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
    return {
      ...user,
      employeeNo: String(601076 + index * 10),
      displayName: `${user.name}(${String(9300 + user.id)})`,
      projectName: user.projectName || projectOptions[index % projectOptions.length],
      jobTitle: user.jobTitle || jobTitles[index % jobTitles.length],
      certificates: user.certificates || certificateOptions[index % certificateOptions.length],
      leaveDate: user.status === 1 ? '' : '2026-06',
      contractStart: user.confirmDate || user.entryDate,
      monthlySalary: user.monthlySalary || (user.status === 1 ? `${9000 + index * 500}` : ''),
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

function getDefaultEmergencyContacts(user, index) {
  const primaryIdx = index % emergencyContactNames.length
  const secondaryIdx = (index + 3) % emergencyContactNames.length
  return {
    primaryName: user.primaryName || emergencyContactNames[primaryIdx],
    primaryRelation: user.primaryRelation || emergencyRelations[index % 5],
    primaryPhone: user.primaryPhone || `139${String(10000000 + index * 137).slice(0, 8)}`,
    secondaryName: user.secondaryName || emergencyContactNames[secondaryIdx],
    secondaryRelation: user.secondaryRelation || emergencyRelations[(index + 2) % 5 + 1],
    secondaryPhone: user.secondaryPhone || `138${String(10000000 + index * 251).slice(0, 8)}`
  }
}

const emergencyRows = computed(() => {
  return employeeMasterRows.value.map((user, index) => {
    const defaults = getDefaultEmergencyContacts(user, index)
    const saved = emergencyRecordMap[user.id] || {}
    return {
      ...user,
      userId: user.id,
      relatedEmployee: user.displayName,
      ...defaults,
      ...saved
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

const educationRows = computed(() => {
  return employeeMasterRows.value.map((user, index) => {
    const rawEducations = user.educations || []
    const highest = rawEducations.length ? rawEducations.reduce((a, b) =>
      educationOrder.indexOf(a.education) >= educationOrder.indexOf(b.education) ? a : b
    ) : null
    const recordMap = educationRecordMap[user.id]
    const allEducations = recordMap || rawEducations
    return {
      ...user,
      displayName: user.displayName || `${user.name}(${9300 + user.id})`,
      educations: allEducations,
      educationCount: allEducations.length,
      highestEducation: highest ? highest.education : '',
      highestStudyMode: highest ? highest.studyMode : '',
      highestSchool: highest ? highest.school : '',
      highestMajor: highest ? highest.major : '',
      highestChsiProof: highest ? highest.chsiProof : '',
      expanded: false
    }
  })
})

const filteredEducationRows = computed(() => {
  return educationRows.value.filter(u => {
    const keywordHit = !educationSearchForm.keyword ||
      u.name.includes(educationSearchForm.keyword) ||
      u.employeeNo.includes(educationSearchForm.keyword) ||
      u.displayName.includes(educationSearchForm.keyword)
    if (!keywordHit) return false
    if (educationSearchForm.education && u.highestEducation !== educationSearchForm.education) return false
    if (educationSearchForm.studyMode && !u.educations.some(e => e.studyMode === educationSearchForm.studyMode)) return false
    return true
  })
})

const filteredEmergencyRows = computed(() => {
  return emergencyRows.value.filter(u => {
    const keywordHit = !searchForm.keyword ||
      u.name.includes(searchForm.keyword) ||
      u.employeeNo.includes(searchForm.keyword) ||
      u.relatedEmployee.includes(searchForm.keyword) ||
      u.primaryName.includes(searchForm.keyword) ||
      u.primaryPhone.includes(searchForm.keyword) ||
      u.secondaryName.includes(searchForm.keyword) ||
      u.secondaryPhone.includes(searchForm.keyword)
    if (!keywordHit) return false
    if (searchForm.projectName && u.projectName !== searchForm.projectName) return false
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

function handleEducationSearch() {}
function handleEducationReset() {
  educationSearchForm.keyword = ''
  educationSearchForm.education = ''
  educationSearchForm.studyMode = ''
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

function openAddEducation(user = null) {
  Object.assign(educationForm, emptyEducationForm)
  currentEducationUserId.value = user ? user.id : null
  editingEducationIndex.value = -1
  educationDialogVisible.value = true
}

function openEditEducation(user, edu, index) {
  Object.assign(educationForm, { ...edu })
  currentEducationUserId.value = user.id
  editingEducationIndex.value = index
  educationDialogVisible.value = true
}

function saveEducation() {
  if (!currentEducationUserId.value) {
    ElMessage.warning('请先选择员工')
    return
  }
  if (!educationForm.education || !educationForm.school || !educationForm.major) {
    ElMessage.warning('请完善学历、学校、专业')
    return
  }
  const userId = currentEducationUserId.value
  const user = users.find(u => u.id === userId)
  const defaults = user ? (user.educations || []) : []
  const records = [...(educationRecordMap[userId] || defaults)]
  const entry = { ...educationForm }
  if (editingEducationIndex.value > -1) {
    records.splice(editingEducationIndex.value, 1, entry)
  } else {
    records.push(entry)
  }
  educationRecordMap[userId] = records
  educationDialogVisible.value = false
  ElMessage.success('保存成功')
}

function deleteEducation(user, index) {
  const userId = user.id
  const defaults = user.educations || []
  const records = [...(educationRecordMap[userId] || defaults)]
  records.splice(index, 1)
  educationRecordMap[userId] = records
  ElMessage.success('已删除')
}

function getEducationRowsForUser(user) {
  return (educationRecordMap[user.id] || user.educations || []).map((edu, index) => ({
    ...edu,
    _index: index
  }))
}

function openEditEmergency(row) {
  const idx = employeeMasterRows.value.indexOf(row)
  const defaults = getDefaultEmergencyContacts(row, idx >= 0 ? idx : row.id)
  const saved = emergencyRecordMap[row.userId] || {}
  const data = { ...defaults, ...saved }
  Object.assign(emergencyForm, {
    userId: row.userId,
    primaryName: data.primaryName || '',
    primaryRelation: data.primaryRelation || '',
    primaryPhone: data.primaryPhone || '',
    secondaryName: data.secondaryName || '',
    secondaryRelation: data.secondaryRelation || '',
    secondaryPhone: data.secondaryPhone || ''
  })
  emergencyDialogVisible.value = true
}

function saveEmergency() {
  if (!emergencyForm.userId) {
    ElMessage.warning('请选择关联员工')
    return
  }
  if (!emergencyForm.primaryName || !emergencyForm.primaryPhone) {
    ElMessage.warning('请填写第一联系人姓名和电话')
    return
  }
  emergencyRecordMap[emergencyForm.userId] = { ...emergencyForm }
  emergencyDialogVisible.value = false
  ElMessage.success('保存成功')
}

// --- 导入功能 ---
const importDialogVisible = ref(false)
const importFile = ref(null)
const importPreview = ref([])
const importErrors = ref([])
const importUploadRef = ref(null)

const importFieldMap = [
  { col: '员工工号', key: 'empNo' },
  { col: '姓名', key: 'name', required: true },
  { col: '性别', key: 'gender' },
  { col: '出生日期', key: 'birthDate' },
  { col: '身份证号', key: 'idCard' },
  { col: '手机号', key: 'phone', required: true },
  { col: '邮箱', key: 'email' },
  { col: '籍贯', key: 'nativePlace' },
  { col: '民族', key: 'ethnicity' },
  { col: '政治面貌', key: 'political' },
  { col: '婚姻状况', key: 'marital' },
  { col: '所属项目部', key: 'deptName', required: true },
  { col: '所属岗位', key: 'positionName', required: true },
  { col: '所属项目', key: 'projectName' },
  { col: '职称', key: 'jobTitle' },
  { col: '持证情况', key: 'certificates' },
  { col: '入职日期', key: 'entryDate', required: true },
  { col: '转正日期', key: 'confirmDate' },
  { col: '合同到期日', key: 'contractEnd' },
  { col: '用工形式', key: 'empType' },
  { col: '员工状态', key: 'status' },
  { col: '月工资标准', key: 'monthlySalary' },
  { col: '现住址', key: 'address' },
  { col: '第一联系人姓名', key: 'primaryName' },
  { col: '第一联系人关系', key: 'primaryRelation' },
  { col: '第一联系人电话', key: 'primaryPhone' },
  { col: '第二联系人姓名', key: 'secondaryName' },
  { col: '第二联系人关系', key: 'secondaryRelation' },
  { col: '第二联系人电话', key: 'secondaryPhone' },
  { col: '备注', key: 'remark' }
]

function downloadTemplate() {
  const headers = importFieldMap.map(f => f.col)
  const ws = XLSX.utils.aoa_to_sheet([headers])
  ws['!cols'] = headers.map(() => ({ wch: 18 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '员工信息')
  XLSX.writeFile(wb, '员工导入模板.xlsx')
  ElMessage.success('模板已下载')
}

function handleImportFile(file) {
  importFile.value = file
  importErrors.value = []
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' })
      const sheetName = wb.SheetNames[0]
      if (!sheetName) {
        ElMessage.error('Excel 文件中没有工作表')
        return
      }
      const ws = wb.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(ws, { defval: '' })

      if (!jsonData.length) {
        ElMessage.error('未读取到数据行')
        return
      }

      const excelHeaders = Object.keys(jsonData[0])
      const colMap = {}
      for (const h of excelHeaders) {
        const match = importFieldMap.find(f => f.col === h)
        if (match) colMap[h] = match
      }

      if (!colMap[Object.keys(colMap).find(k => colMap[k].key === 'name')]) {
        ElMessage.error('未找到"姓名"列，请使用模板文件')
        return
      }

      const errors = []
      const preview = jsonData.map((row, rowIdx) => {
        const mapped = { educations: [] }
        const rowErrors = []

        for (const [header, value] of Object.entries(row)) {
          const mapping = colMap[header]
          if (!mapping) continue
          const strVal = String(value).trim()
          if (!strVal) continue
          mapped[mapping.key] = strVal
        }

        for (const field of importFieldMap) {
          if (field.required && !mapped[field.key]) {
            rowErrors.push(`缺少必填项: ${field.col}`)
          }
        }

        if (mapped.phone && !/^1[3-9]\d{9}$/.test(mapped.phone)) {
          rowErrors.push('手机号格式不正确')
        }
        if (mapped.status === '在职') mapped.status = 1
        else if (mapped.status === '离职') mapped.status = 0
        else if (mapped.status) mapped.status = Number(mapped.status) || 1

        if (mapped.deptName) {
          const dept = departments.find(d => d.name === mapped.deptName)
          if (!dept) rowErrors.push(`项目部"${mapped.deptName}"不存在`)
          else mapped.deptId = dept.id
        }
        if (mapped.positionName) {
          const pos = positions.find(p => p.name === mapped.positionName)
          if (!pos) rowErrors.push(`岗位"${mapped.positionName}"不存在`)
          else mapped.positionId = pos.id
        }

        if (rowErrors.length) {
          errors.push({ row: rowIdx + 2, name: mapped.name || '(空)', errors: rowErrors })
        }

        mapped._valid = rowErrors.length === 0
        mapped._rowNum = rowIdx + 2
        mapped._errors = rowErrors
        return mapped
      })

      importErrors.value = errors
      importPreview.value = preview

      if (!preview.filter(r => r._valid).length) {
        ElMessage.warning('没有可导入的有效数据行')
      }
    } catch (err) {
      ElMessage.error('解析 Excel 文件失败: ' + err.message)
    }
  }
  reader.readAsArrayBuffer(file.raw)
}

function confirmImport() {
  const validRows = importPreview.value.filter(r => r._valid)
  if (!validRows.length) {
    ElMessage.warning('没有可导入的有效数据')
    return
  }
  let imported = 0
  for (const row of validRows) {
    const user = {
      name: row.name,
      empNo: row.empNo || '',
      gender: row.gender || '',
      birthDate: row.birthDate || '',
      idCard: row.idCard || '',
      phone: row.phone || '',
      email: row.email || '',
      nativePlace: row.nativePlace || '',
      ethnicity: row.ethnicity || '汉族',
      political: row.political || '群众',
      marital: row.marital || '未婚',
      educations: [],
      deptId: row.deptId || null,
      positionId: row.positionId || null,
      entryDate: row.entryDate || '',
      confirmDate: row.confirmDate || '',
      contractEnd: row.contractEnd || '',
      empType: row.empType || '正式员工',
      status: row.status || 1,
      address: row.address || '',
      projectName: row.projectName || '',
      jobTitle: row.jobTitle || '',
      certificates: row.certificates || '',
      monthlySalary: row.monthlySalary || '',
      primaryName: row.primaryName || '',
      primaryRelation: row.primaryRelation || '',
      primaryPhone: row.primaryPhone || '',
      secondaryName: row.secondaryName || '',
      secondaryRelation: row.secondaryRelation || '',
      secondaryPhone: row.secondaryPhone || '',
      remark: row.remark || ''
    }
    addUser(user)
    imported++
  }
  importDialogVisible.value = false
  importFile.value = null
  importPreview.value = []
  importErrors.value = []
  ElMessage.success(`成功导入 ${imported} 条员工记录`)
}

function closeImport() {
  importDialogVisible.value = false
  importFile.value = null
  importPreview.value = []
  importErrors.value = []
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
  deptId: [{ required: true, message: '请选择项目部', trigger: 'change' }],
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
              <div class="summary-label">覆盖项目部</div>
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
                <el-button :icon="Download" round @click="downloadTemplate">
                  下载模板
                </el-button>
                <el-button :icon="Upload" round @click="importDialogVisible = true">
                  导入
                </el-button>
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

        <template v-else-if="activeEmployeeModule === 'education'">
          <el-card class="search-card">
            <el-form :model="educationSearchForm" inline class="toolbar-form">
              <el-form-item label="关键字">
                <el-input v-model="educationSearchForm.keyword" placeholder="姓名/工号" clearable style="width:230px" />
              </el-form-item>
              <el-form-item label="最高学历">
                <el-select v-model="educationSearchForm.education" placeholder="全部" clearable style="width:140px">
                  <el-option v-for="item in educationOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="学习形式">
                <el-select v-model="educationSearchForm.studyMode" placeholder="全部" clearable style="width:140px">
                  <el-option v-for="item in studyModeOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" round @click="handleEducationSearch">查询</el-button>
                <el-button :icon="RefreshLeft" round @click="handleEducationReset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card class="table-card">
            <div class="page-header">
              <div>
                <h2>学历信息</h2>
                <p class="page-subtitle">维护员工学历、学习形式、毕业院校与学信网证明，默认展示最高学历</p>
              </div>
            </div>
            <div class="table-wrap">
              <el-table :data="filteredEducationRows" class="data-table" style="width:100%" max-height="calc(100vh - 270px)" row-class-name="user-row" row-key="id">
                <el-table-column type="expand">
                  <template #default="{ row }">
                    <div class="education-sub-table-wrap">
                      <el-table :data="getEducationRowsForUser(row)" size="small" class="education-sub-table" style="width:100%">
                        <el-table-column prop="education" label="学历" width="110">
                          <template #default="{ row: edu }">
                            <span class="soft-pill neutral">{{ edu.education }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="studyMode" label="学习形式" width="120">
                          <template #default="{ row: edu }">{{ edu.studyMode || '-' }}</template>
                        </el-table-column>
                        <el-table-column prop="school" label="毕业学校" min-width="140" />
                        <el-table-column prop="major" label="专业" min-width="140" />
                        <el-table-column label="起止时间" width="200">
                          <template #default="{ row: edu }">{{ edu.startDate }} 至 {{ edu.endDate }}</template>
                        </el-table-column>
                        <el-table-column label="学信网证明" width="240">
                          <template #default="{ row: edu }">
                            <el-button v-if="edu.chsiProof" type="primary" link size="small">{{ edu.chsiProof }}</el-button>
                            <span v-else class="empty-mark">未上传</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120" align="center">
                          <template #default="{ row: edu }">
                            <el-button type="primary" link size="small" :icon="Edit" @click="openEditEducation(row, edu, edu._index)">编辑</el-button>
                            <el-button type="danger" link size="small" :icon="Delete" @click="deleteEducation(row, edu._index)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="displayName" label="员工" width="136" fixed="left">
                  <template #default="{ row }">
                    <span class="cell-name">{{ row.displayName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="最高学历" width="110">
                  <template #default="{ row }">
                    <span class="soft-pill neutral">{{ row.highestEducation }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="highestStudyMode" label="学习形式" width="120" />
                <el-table-column prop="highestSchool" label="毕业学校" min-width="150" />
                <el-table-column prop="highestMajor" label="专业" min-width="150" />
                <el-table-column label="学信网证明" width="240">
                  <template #default="{ row }">
                    <el-button v-if="row.highestChsiProof" type="primary" link size="small">{{ row.highestChsiProof }}</el-button>
                    <span v-else class="empty-mark">未上传</span>
                  </template>
                </el-table-column>
                <el-table-column prop="educationCount" label="学历数" width="80" align="center">
                  <template #default="{ row }">
                    <span class="project-count">{{ row.educationCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="96" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" :icon="Plus" @click="openAddEducation(row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </template>

        <template v-else-if="activeEmployeeModule === 'emergency'">
          <el-card class="search-card">
            <el-form :model="searchForm" inline class="toolbar-form">
              <el-form-item label="关键字">
                <el-input v-model="searchForm.keyword" placeholder="员工/联系人姓名/电话" clearable style="width:230px" />
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
                <h2>紧急联系人信息</h2>
                <p class="page-subtitle">维护每位员工的第一联系人及第二联系人，含关系与联系电话</p>
              </div>
            </div>
            <div class="table-wrap">
              <el-table :data="filteredEmergencyRows" class="data-table emergency-table" style="width:100%" max-height="calc(100vh - 270px)" row-class-name="user-row">
                <el-table-column
                  v-for="column in emergencyColumns"
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
                    <span v-else-if="column.key === 'primaryRelation' || column.key === 'secondaryRelation'" class="soft-pill neutral">{{ row[column.key] || '-' }}</span>
                    <span v-else-if="column.key === 'primaryPhone' || column.key === 'secondaryPhone'" style="font-variant-numeric:tabular-nums">{{ row[column.key] || '-' }}</span>
                    <span v-else>{{ row[column.key] || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="96" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" :icon="Edit" @click="openEditEmergency(row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </template>

        <div v-else class="module-placeholder">
          <el-icon :size="42"><Phone /></el-icon>
          <h3>未知模块</h3>
          <p>请从左侧菜单选择子模块查看。</p>
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

    <el-dialog v-model="emergencyDialogVisible" title="紧急联系人信息" width="680px" destroy-on-close>
      <el-form :model="emergencyForm" label-width="120px" size="default">
        <el-form-item label="关联员工" required>
          <el-select v-model="emergencyForm.userId" filterable placeholder="请选择员工" style="width:100%">
            <el-option v-for="user in userOptions" :key="user.value" :label="user.label" :value="user.value" />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">第一联系人</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="联系人姓名" required>
              <el-input v-model="emergencyForm.primaryName" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关系">
              <el-select v-model="emergencyForm.primaryRelation" placeholder="请选择" style="width:100%" clearable>
                <el-option v-for="r in emergencyRelations" :key="r" :label="r" :value="r" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" required>
              <el-input v-model="emergencyForm.primaryPhone" placeholder="手机号" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">第二联系人</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="联系人姓名">
              <el-input v-model="emergencyForm.secondaryName" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关系">
              <el-select v-model="emergencyForm.secondaryRelation" placeholder="请选择" style="width:100%" clearable>
                <el-option v-for="r in emergencyRelations" :key="r" :label="r" :value="r" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话">
              <el-input v-model="emergencyForm.secondaryPhone" placeholder="手机号" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button round @click="emergencyDialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="saveEmergency">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="importDialogVisible" title="导入员工" width="960px" top="3vh" destroy-on-close @closed="closeImport">
      <template v-if="!importPreview.length">
        <div class="import-upload-area">
          <div class="import-upload-icon">
            <el-icon :size="48"><Upload /></el-icon>
          </div>
          <p class="import-upload-title">上传 Excel 文件导入员工数据</p>
          <p class="import-upload-hint">支持 .xlsx / .xls 格式，请先下载模板按格式填写</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:16px">
            <el-button type="primary" :icon="Download" round @click="downloadTemplate">下载模板</el-button>
            <el-upload
              ref="importUploadRef"
              :auto-upload="false"
              :limit="1"
              accept=".xlsx,.xls"
              :on-change="handleImportFile"
              :show-file-list="false"
            >
              <el-button :icon="Upload" round>选择文件</el-button>
            </el-upload>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="import-summary">
          <span>共解析 <strong>{{ importPreview.length }}</strong> 行，
            有效 <strong style="color:var(--ios-green)">{{ importPreview.filter(r => r._valid).length }}</strong> 行，
            错误 <strong style="color:var(--ios-red)">{{ importErrors.length }}</strong> 行</span>
          <el-button link type="primary" @click="closeImport">重新选择</el-button>
        </div>
        <div v-if="importErrors.length" class="import-error-list">
          <div v-for="err in importErrors" :key="err.row" class="import-error-item">
            <span>第 {{ err.row }} 行「{{ err.name }}」：</span>
            <span v-for="(e, ei) in err.errors" :key="ei">{{ e }}{{ ei < err.errors.length - 1 ? '；' : '' }}</span>
          </div>
        </div>
        <div class="table-wrap" style="max-height:400px;overflow:auto;margin-top:12px">
          <el-table :data="importPreview" size="small" class="data-table" style="width:100%">
            <el-table-column prop="_rowNum" label="#" width="50" />
            <el-table-column prop="name" label="姓名" width="90" fixed="left">
              <template #default="{ row }">
                <span :style="{ color: row._valid ? 'var(--ios-text)' : 'var(--ios-red)' }">{{ row.name || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="empNo" label="工号" width="90" />
            <el-table-column prop="gender" label="性别" width="60" />
            <el-table-column prop="phone" label="手机号" width="120" />
            <el-table-column prop="deptName" label="项目部" width="120" />
            <el-table-column prop="positionName" label="岗位" width="130" />
            <el-table-column prop="projectName" label="所属项目" width="130" />
            <el-table-column prop="jobTitle" label="职称" width="110" />
            <el-table-column prop="entryDate" label="入职日期" width="110" />
            <el-table-column prop="empType" label="用工形式" width="100" />
            <el-table-column label="状态" width="70">
              <template #default="{ row }">
                <span v-if="row._valid" class="soft-pill green">有效</span>
                <span v-else class="soft-pill" style="background:rgba(255,59,48,.1);color:var(--ios-red)">错误</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template #footer>
        <el-button round @click="closeImport">取消</el-button>
        <el-button type="primary" round :disabled="!importPreview.filter(r => r._valid).length" @click="confirmImport">
          确认导入（{{ importPreview.filter(r => r._valid).length }} 条）
        </el-button>
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

    <el-dialog v-model="educationDialogVisible" title="学历信息" width="680px" top="5vh" destroy-on-close>
      <el-form :model="educationForm" label-width="100px" size="default">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学历" required>
              <el-select v-model="educationForm.education" placeholder="请选择学历" style="width:100%">
                <el-option v-for="item in educationOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学习形式" required>
              <el-select v-model="educationForm.studyMode" placeholder="请选择学习形式" style="width:100%">
                <el-option v-for="item in studyModeOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="毕业学校" required>
              <el-input v-model="educationForm.school" placeholder="学校全称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" required>
              <el-input v-model="educationForm.major" placeholder="专业名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="开始时间" required>
              <el-date-picker v-model="educationForm.startDate" type="month" placeholder="选择月份" value-format="YYYY-MM" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" required>
              <el-date-picker v-model="educationForm.endDate" type="month" placeholder="选择月份" value-format="YYYY-MM" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="学信网证明">
          <el-input v-model="educationForm.chsiProof" placeholder="文件名或备案表编号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button round @click="educationDialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="saveEducation">保存</el-button>
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

        <el-divider content-position="left">紧急联系人</el-divider>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="第一联系人"><el-input v-model="form.primaryName" /></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关系">
              <el-select v-model="form.primaryRelation" style="width:100%" clearable>
                <el-option v-for="r in emergencyRelations" :key="r" :label="r" :value="r" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电话"><el-input v-model="form.primaryPhone" maxlength="11" /></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="第二联系人"><el-input v-model="form.secondaryName" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="二联系人关系">
              <el-select v-model="form.secondaryRelation" style="width:100%" clearable>
                <el-option v-for="r in emergencyRelations" :key="r" :label="r" :value="r" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二联系人电话"><el-input v-model="form.secondaryPhone" maxlength="11" /></el-form-item>
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
            <el-col :span="12">
              <el-form-item label="学历">
                <el-select v-model="edu.education" style="width:100%">
                  <el-option v-for="e in educationOptions" :key="e" :label="e" :value="e" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学习形式">
                <el-select v-model="edu.studyMode" style="width:100%">
                  <el-option v-for="item in studyModeOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="毕业院校"><el-input v-model="edu.school" /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专业"><el-input v-model="edu.major" /></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item label="入学时间">
                <el-date-picker v-model="edu.startDate" type="month" placeholder="选择月份" style="width:100%" value-format="YYYY-MM" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="毕业时间">
                <el-date-picker v-model="edu.endDate" type="month" placeholder="选择月份" style="width:100%" value-format="YYYY-MM" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="24">
              <el-form-item label="学信网证明">
                <el-input v-model="edu.chsiProof" placeholder="文件名或备案表编号" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-divider content-position="left">工作信息</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="项目部" prop="deptId">
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

.import-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  border: 2px dashed var(--ios-border);
  border-radius: var(--ios-radius-lg);
  background: #ffffff;
  text-align: center;
}
.import-upload-icon {
  color: var(--ios-text-placeholder);
  margin-bottom: 12px;
}
.import-upload-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ios-text);
  margin-bottom: 6px;
}
.import-upload-hint {
  font-size: 13px;
  color: var(--ios-text-secondary);
}
.import-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 13px;
  color: var(--ios-text-secondary);
}
.import-error-list {
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: var(--ios-radius);
  background: rgba(255, 59, 48, .06);
}
.import-error-item {
  font-size: 12px;
  color: var(--ios-red);
  line-height: 1.7;
}

</style>
