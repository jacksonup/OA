import { reactive } from 'vue'

export const departments = reactive([
  { id: 1, name: '总经办', code: 'DEPT001', leader: '张伟', parentId: null, sort: 1, status: 1, createTime: '2022-01-01' },
  { id: 2, name: '技术项目部', code: 'DEPT002', leader: '李强', parentId: null, sort: 2, status: 1, createTime: '2022-01-01' },
  { id: 3, name: '产品项目部', code: 'DEPT003', leader: '王芳', parentId: null, sort: 3, status: 1, createTime: '2022-01-01' },
  { id: 4, name: '市场项目部', code: 'DEPT004', leader: '赵明', parentId: null, sort: 4, status: 1, createTime: '2022-01-01' },
  { id: 5, name: '人事项目部', code: 'DEPT005', leader: '孙丽', parentId: null, sort: 5, status: 1, createTime: '2022-01-01' },
  { id: 6, name: '财务项目部', code: 'DEPT006', leader: '周杰', parentId: null, sort: 6, status: 1, createTime: '2022-01-01' },
  { id: 7, name: '前端项目部', code: 'DEPT007', leader: '吴昊', parentId: 2, sort: 1, status: 1, createTime: '2022-03-01' },
  { id: 8, name: '后端项目部', code: 'DEPT008', leader: '郑宇', parentId: 2, sort: 2, status: 1, createTime: '2022-03-01' },
  { id: 9, name: '测试项目部', code: 'DEPT009', leader: '冯凯', parentId: 2, sort: 3, status: 1, createTime: '2022-03-01' }
])

export const positions = reactive([
  { id: 1, name: '总经理', code: 'POS001', deptId: 1, type: '管理岗', sort: 1, status: 1, createTime: '2022-01-01' },
  { id: 2, name: '技术总监', code: 'POS002', deptId: 2, type: '管理岗', sort: 1, status: 1, createTime: '2022-01-01' },
  { id: 3, name: '高级前端工程师', code: 'POS003', deptId: 7, type: '技术岗', sort: 2, status: 1, createTime: '2022-01-01' },
  { id: 4, name: '前端工程师', code: 'POS004', deptId: 7, type: '技术岗', sort: 3, status: 1, createTime: '2022-01-01' },
  { id: 5, name: '高级后端工程师', code: 'POS005', deptId: 8, type: '技术岗', sort: 2, status: 1, createTime: '2022-01-01' },
  { id: 6, name: '后端工程师', code: 'POS006', deptId: 8, type: '技术岗', sort: 3, status: 1, createTime: '2022-01-01' },
  { id: 7, name: '测试工程师', code: 'POS007', deptId: 9, type: '技术岗', sort: 2, status: 1, createTime: '2022-01-01' },
  { id: 8, name: '产品经理', code: 'POS008', deptId: 3, type: '产品岗', sort: 1, status: 1, createTime: '2022-01-01' },
  { id: 9, name: '市场经理', code: 'POS009', deptId: 4, type: '管理岗', sort: 1, status: 1, createTime: '2022-01-01' },
  { id: 10, name: '人事经理', code: 'POS010', deptId: 5, type: '管理岗', sort: 1, status: 1, createTime: '2022-01-01' },
  { id: 11, name: '财务经理', code: 'POS011', deptId: 6, type: '管理岗', sort: 1, status: 1, createTime: '2022-01-01' },
  { id: 12, name: '行政专员', code: 'POS012', deptId: 5, type: '职能岗', sort: 2, status: 1, createTime: '2022-01-01' }
])

const baseUsers = [
  { id: 1, empNo: 'EMP001', name: '张伟', gender: '男', birthDate: '1985-03-15', idCard: '320102198503151234', phone: '13800001001', email: 'zhangwei@company.com', nativePlace: '江苏南京', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '硕士', studyMode: '全日制', school: '南京大学', major: '工商管理', startDate: '2003-09', endDate: '2006-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '南京大学', major: '经济学', startDate: '1999-09', endDate: '2003-06', chsiProof: '学信网认证报告.pdf' }], deptId: 1, positionId: 1, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '南京市鼓楼区XX路100号', projectName: '320（临平段）', jobTitle: '高级工程师', certificates: '部监、检师、部监、检师', monthlySalary: '9000', primaryName: '张丽华', primaryRelation: '配偶', primaryPhone: '13900001001', secondaryName: '赵秀兰', secondaryRelation: '姐妹', secondaryPhone: '13810000000', remark: '' },
  { id: 2, empNo: 'EMP002', name: '李强', gender: '男', birthDate: '1988-07-22', idCard: '320102198807221234', phone: '13800001002', email: 'liqiang@company.com', nativePlace: '浙江杭州', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '本科', studyMode: '全日制', school: '浙江大学', major: '软件工程', startDate: '2006-09', endDate: '2010-06', chsiProof: '学信网认证报告.pdf' }], deptId: 2, positionId: 2, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '杭州市西湖区文三路200号', projectName: '330（余杭段）', jobTitle: '总监', certificates: '部监、部监', monthlySalary: '9500', primaryName: '李秀英', primaryRelation: '父亲', primaryPhone: '13900001002', secondaryName: '陈明', secondaryRelation: '兄弟', secondaryPhone: '13810000251', remark: '' },
  { id: 3, empNo: 'EMP003', name: '王芳', gender: '女', birthDate: '1992-11-08', idCard: '320102199211081234', phone: '13800001003', email: 'wangfang@company.com', nativePlace: '上海', ethnicity: '汉族', political: '共青团员', marital: '未婚', educations: [{ education: '本科', studyMode: '全日制', school: '复旦大学', major: '工业设计', startDate: '2010-09', endDate: '2014-06', chsiProof: '教育部学历证书电子注册备案表.pdf' }], deptId: 3, positionId: 8, entryDate: '2022-03-01', confirmDate: '2022-06-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '上海市浦东新区张江路300号', projectName: '340（城北段）', jobTitle: '试验室主任', certificates: '国注、检师、国注、检师', monthlySalary: '10000', primaryName: '王建国', primaryRelation: '母亲', primaryPhone: '13900001003', secondaryName: '刘芳', secondaryRelation: '姐妹', secondaryPhone: '13810000502', remark: '' },
  { id: 4, empNo: 'EMP004', name: '赵明', gender: '男', birthDate: '1990-01-30', idCard: '320102199001301234', phone: '13800001004', email: 'zhaoming@company.com', nativePlace: '广东深圳', ethnicity: '汉族', political: '群众', marital: '已婚', educations: [{ education: '硕士', studyMode: '非全日制', school: '中山大学', major: '市场营销', startDate: '2012-09', endDate: '2015-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '中山大学', major: '工商管理', startDate: '2008-09', endDate: '2012-06', chsiProof: '学信网认证报告.pdf' }], deptId: 4, positionId: 9, entryDate: '2022-02-01', confirmDate: '2022-05-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '深圳市南山区科技园路400号', projectName: '350（市政段）', jobTitle: '工程师', certificates: '一建、造价师', monthlySalary: '10500', primaryName: '赵秀兰', primaryRelation: '子女', primaryPhone: '13900001004', secondaryName: '黄伟', secondaryRelation: '父亲', secondaryPhone: '13810000753', remark: '' },
  { id: 5, empNo: 'EMP005', name: '孙丽', gender: '女', birthDate: '1987-05-18', idCard: '320102198705181234', phone: '13800001005', email: 'sunli@company.com', nativePlace: '北京', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '本科', studyMode: '全日制', school: '北京大学', major: '人力资源管理', startDate: '2005-09', endDate: '2009-06', chsiProof: '学信网认证报告.pdf' }], deptId: 5, positionId: 10, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '北京市海淀区中关村路500号', projectName: '320（临平段）', jobTitle: '专业负责人', certificates: '安全员、资料员', monthlySalary: '11000', primaryName: '李明', primaryRelation: '兄弟', primaryPhone: '13900001005', secondaryName: '周敏', secondaryRelation: '母亲', secondaryPhone: '13810001004', remark: '' },
  { id: 6, empNo: 'EMP006', name: '周杰', gender: '男', birthDate: '1986-09-25', idCard: '320102198609251234', phone: '13800001006', email: 'zhoujie@company.com', nativePlace: '湖北武汉', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '硕士', studyMode: '非全日制', school: '武汉大学', major: '会计学', startDate: '2008-09', endDate: '2011-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '武汉大学', major: '财务管理', startDate: '2004-09', endDate: '2008-06', chsiProof: '学信网认证报告.pdf' }], deptId: 6, positionId: 11, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '武汉市武昌区珞珈山路600号', projectName: '330（余杭段）', jobTitle: '高级工程师', certificates: '部监、检师、部监、检师', monthlySalary: '11500', primaryName: '周敏', primaryRelation: '配偶', primaryPhone: '13900001006', secondaryName: '吴强', secondaryRelation: '子女', secondaryPhone: '13810001255', remark: '' },
  { id: 7, empNo: 'EMP007', name: '吴昊', gender: '男', birthDate: '1993-04-12', idCard: '320102199304121234', phone: '13800001007', email: 'wuhao@company.com', nativePlace: '四川成都', ethnicity: '汉族', political: '群众', marital: '未婚', educations: [{ education: '本科', studyMode: '全日制', school: '电子科技大学', major: '计算机科学与技术', startDate: '2011-09', endDate: '2015-06', chsiProof: '教育部学历证书电子注册备案表.pdf' }], deptId: 7, positionId: 3, entryDate: '2022-06-01', confirmDate: '2022-09-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '成都市高新区天府大道700号', projectName: '340（城北段）', jobTitle: '总监', certificates: '部监、部监', monthlySalary: '12000', primaryName: '吴强', primaryRelation: '父亲', primaryPhone: '13900001007', secondaryName: '郑红', secondaryRelation: '兄弟', secondaryPhone: '13810001506', remark: '' },
  { id: 8, empNo: 'EMP008', name: '郑宇', gender: '男', birthDate: '1991-12-03', idCard: '320102199112031234', phone: '13800001008', email: 'zhengyu@company.com', nativePlace: '湖南长沙', ethnicity: '汉族', political: '共青团员', marital: '未婚', educations: [{ education: '硕士', studyMode: '全日制', school: '中南大学', major: '软件工程', startDate: '2013-09', endDate: '2016-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '自考', school: '中南大学', major: '计算机科学与技术', startDate: '2009-09', endDate: '2013-06', chsiProof: '' }], deptId: 8, positionId: 5, entryDate: '2022-06-01', confirmDate: '2022-09-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '长沙市岳麓区麓山南路800号', projectName: '350（市政段）', jobTitle: '试验室主任', certificates: '国注、检师、国注、检师', monthlySalary: '12500', primaryName: '郑红', primaryRelation: '母亲', primaryPhone: '13900001008', secondaryName: '冯涛', secondaryRelation: '姐妹', secondaryPhone: '13810001757', remark: '' },
  { id: 9, empNo: 'EMP009', name: '冯凯', gender: '男', birthDate: '1994-06-20', idCard: '320102199406201234', phone: '13800001009', email: 'fengkai@company.com', nativePlace: '河南郑州', ethnicity: '汉族', political: '群众', marital: '未婚', educations: [{ education: '本科', studyMode: '成人高考', school: '郑州大学', major: '计算机科学与技术', startDate: '2012-09', endDate: '2016-06', chsiProof: '' }], deptId: 9, positionId: 7, entryDate: '2023-01-01', confirmDate: '2023-04-01', contractEnd: '2026-12-31', empType: '正式员工', status: 1, address: '郑州市金水区文化路900号', projectName: '320（临平段）', jobTitle: '工程师', certificates: '一建、造价师', monthlySalary: '13000', primaryName: '冯涛', primaryRelation: '子女', primaryPhone: '13900001009', secondaryName: '孙婷', secondaryRelation: '父亲', secondaryPhone: '13810002008', remark: '' },
  { id: 10, empNo: 'EMP010', name: '陈雪', gender: '女', birthDate: '1995-08-14', idCard: '320102199508141234', phone: '13800001010', email: 'chenxue@company.com', nativePlace: '安徽合肥', ethnicity: '汉族', political: '共青团员', marital: '未婚', educations: [{ education: '本科', studyMode: '全日制', school: '中国科学技术大学', major: '信息管理', startDate: '2013-09', endDate: '2017-06', chsiProof: '学信网认证报告.pdf' }], deptId: 3, positionId: 8, entryDate: '2023-03-01', confirmDate: '2023-06-01', contractEnd: '2026-12-31', empType: '正式员工', status: 1, address: '合肥市蜀山区黄山路1000号', projectName: '330（余杭段）', jobTitle: '专业负责人', certificates: '安全员、资料员', monthlySalary: '13500', primaryName: '孙婷', primaryRelation: '兄弟', primaryPhone: '13900001010', secondaryName: '张丽华', secondaryRelation: '母亲', secondaryPhone: '13810002259', remark: '' },
  { id: 11, empNo: 'EMP011', name: '刘洋', gender: '男', birthDate: '1996-02-28', idCard: '320102199602281234', phone: '13800001011', email: 'liuyang@company.com', nativePlace: '重庆', ethnicity: '土家族', political: '群众', marital: '未婚', educations: [{ education: '本科', studyMode: '网络教育', school: '重庆大学', major: '软件工程', startDate: '2014-09', endDate: '2018-06', chsiProof: '' }], deptId: 7, positionId: 4, entryDate: '2023-07-01', confirmDate: '2023-10-01', contractEnd: '2026-12-31', empType: '正式员工', status: 1, address: '重庆市沙坪坝区大学城路1100号', projectName: '340（城北段）', jobTitle: '高级工程师', certificates: '部监、检师、部监、检师', monthlySalary: '14000', primaryName: '张丽华', primaryRelation: '配偶', primaryPhone: '13900001011', secondaryName: '李秀英', secondaryRelation: '子女', secondaryPhone: '13810002510', remark: '' },
  { id: 12, empNo: 'EMP012', name: '黄丽', gender: '女', birthDate: '1993-10-05', idCard: '320102199310051234', phone: '13800001012', email: 'huangli@company.com', nativePlace: '福建厦门', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '硕士', studyMode: '全日制', school: '厦门大学', major: '会计学', startDate: '2015-09', endDate: '2018-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '厦门大学', major: '审计学', startDate: '2011-09', endDate: '2015-06', chsiProof: '学信网认证报告.pdf' }], deptId: 6, positionId: 11, entryDate: '2022-08-01', confirmDate: '2022-11-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '厦门市思明区环岛路1200号', projectName: '350（市政段）', jobTitle: '总监', certificates: '部监、部监', monthlySalary: '14500', primaryName: '李秀英', primaryRelation: '父亲', primaryPhone: '13900001012', secondaryName: '王建国', secondaryRelation: '兄弟', secondaryPhone: '13810002761', remark: '' }
]

export const users = reactive(baseUsers.map(u => ({
  ...u,
  deptName: departments.find(d => d.id === u.deptId)?.name || '',
  positionName: positions.find(p => p.id === u.positionId)?.name || ''
})))

let nextUserId = baseUsers.length + 1

export function addUser(user) {
  user.id = nextUserId++
  user.empNo = 'EMP' + String(user.id).padStart(3, '0')
  user.deptName = departments.find(d => d.id === user.deptId)?.name || ''
  user.positionName = positions.find(p => p.id === user.positionId)?.name || ''
  users.push(user)
}

export function updateUser(user) {
  const idx = users.findIndex(u => u.id === user.id)
  if (idx !== -1) {
    user.deptName = departments.find(d => d.id === user.deptId)?.name || ''
    user.positionName = positions.find(p => p.id === user.positionId)?.name || ''
    users[idx] = { ...user }
  }
}

export function deleteUser(id) {
  const idx = users.findIndex(u => u.id === id)
  if (idx !== -1) users.splice(idx, 1)
}

let nextDeptId2 = departments.length + 1
export function addDepartment(dept) {
  dept.id = nextDeptId2++
  departments.push(dept)
  return dept
}

export function updateDepartment(dept) {
  const idx = departments.findIndex(d => d.id === dept.id)
  if (idx !== -1) departments[idx] = { ...dept }
}

export function deleteDepartment(id) {
  const idx = departments.findIndex(d => d.id === id)
  if (idx !== -1) departments.splice(idx, 1)
}

let nextPosId = positions.length + 1
export function addPosition(pos) {
  pos.id = nextPosId++
  positions.push(pos)
  return pos
}

export function updatePosition(pos) {
  const idx = positions.findIndex(p => p.id === pos.id)
  if (idx !== -1) positions[idx] = { ...pos }
}

export function deletePosition(id) {
  const idx = positions.findIndex(p => p.id === id)
  if (idx !== -1) positions.splice(idx, 1)
}

// --- 考勤 Mock ---
export const attendanceRecords = reactive({})

function ensureAttendance() {
  if (Object.keys(attendanceRecords).length > 0) return
  users.forEach((user, index) => {
    for (let m = 1; m <= 6; m++) {
      const key = `${user.id}-2026-${String(m).padStart(2, '0')}`
      const baseAttendance = [22, 21, 23, 20, 22, 21][m - 1]
      const personalLeave = (index + m) % 5 === 0 ? 1 : (index + m) % 7 === 0 ? 2 : 0
      const sickLeave = (index + m) % 6 === 0 ? 2 : (index + m) % 9 === 0 ? 1 : 0
      const annualLeave = m >= 3 && (index + m) % 4 === 0 ? 3 : m >= 5 && index % 3 === 0 ? 5 : 0
      const compLeave = (index + m) % 3 === 0 ? 1 : 0
      const actualAttendance = Math.max(0, baseAttendance - personalLeave - sickLeave - annualLeave)
      const deduction = personalLeave > 0 ? personalLeave * 200 : sickLeave > 0 ? sickLeave * 100 : 0
      attendanceRecords[key] = {
        userId: user.id, year: 2026, month: String(m).padStart(2, '0'), attendance: actualAttendance,
        compensatoryLeave: compLeave, personalLeave, sickLeave, annualLeave,
        deduction, remark: personalLeave > 0 ? `${personalLeave}天事假扣款` : sickLeave > 0 ? `${sickLeave}天病假` : ''
      }
    }
  })
}

export function getAttendance(userId, year, month) {
  ensureAttendance()
  return attendanceRecords[`${userId}-${year}-${month}`] || null
}

export function getAttendanceOrEmpty(userId, year, month) {
  return getAttendance(userId, year, month) || {
    userId, year, month, attendance: 0, compensatoryLeave: 0,
    personalLeave: 0, sickLeave: 0, annualLeave: 0, deduction: 0, remark: ''
  }
}

export function getYearCumulativeLeave(userId, year) {
  ensureAttendance()
  let total = 0
  for (let m = 1; m <= 12; m++) {
    const r = attendanceRecords[`${userId}-${year}-${String(m).padStart(2, '0')}`]
    if (r) total += r.personalLeave + r.sickLeave + r.annualLeave + r.compensatoryLeave
  }
  return total
}

export function getMonthDeduction(userId, year, month) {
  const r = getAttendance(userId, year, month)
  return r ? r.deduction : 0
}

// --- 薪酬 Mock ---
export const salaryRecords = reactive({})

function ensureSalary() {
  if (Object.keys(salaryRecords).length > 0) return
  users.forEach((user, index) => {
    for (let m = 1; m <= 6; m++) {
      const key = `${user.id}-2026-${String(m).padStart(2, '0')}`
      const baseSalary = 9000 + index * 500
      const positionPerformance = [1500, 2000, 2500, 3000, 3500, 4000, 1800, 2200, 1600, 2000, 1500, 2800][index]
      const travelAllowance = (index + m) % 3 === 0 ? 800 : (index + m) % 4 === 0 ? 1200 : 0
      const deduction = getMonthDeduction(user.id, 2026, String(m).padStart(2, '0'))
      const netPay = baseSalary + positionPerformance + travelAllowance - deduction
      salaryRecords[key] = {
        userId: user.id, year: 2026, month: String(m).padStart(2, '0'),
        baseSalary, positionPerformance, travelAllowance, deduction, netPay,
        remark: deduction > 0 ? '含考勤扣款' : ''
      }
    }
  })
}

export function getSalary(userId, year, month) {
  ensureSalary()
  return salaryRecords[`${userId}-${year}-${month}`] || null
}

export function getSalaryOrEmpty(userId, year, month) {
  const existing = getSalary(userId, year, month)
  if (existing) return existing
  const bs = users.find(u => u.id === userId)
  const baseSalary = bs ? (9000 + (userId - 1) * 500) : 0
  const deduction = getMonthDeduction(userId, year, month)
  return {
    userId, year, month, baseSalary, positionPerformance: 0,
    travelAllowance: 0, deduction, netPay: baseSalary - deduction, remark: ''
  }
}

export const salaryMonths = (() => {
  const months = []
  for (let m = 1; m <= 6; m++) {
    months.push({ value: `2026-${String(m).padStart(2, '0')}`, label: `2026年${String(m).padStart(2, '0')}月` })
  }
  return months
})()

// --- 人员台账导入 ---
export const ledgerRecords = reactive([])
let nextLedgerId = 1

export function addLedgerRecord(record) {
  record.id = nextLedgerId++
  record.createdAt = new Date().toISOString().slice(0, 10)
  // 计算证书摘要和学历摘要
  const certKeys = ['certMinistry','certRegistered','certCost','certConstructor','certSafety','certInspector']
  const certLabels = { certMinistry:'部监', certRegistered:'国注', certCost:'一造', certConstructor:'一建', certSafety:'注安', certInspector:'检测' }
  record._certSummary = certKeys.filter(k => record[k] && (record[k] === '√' || record[k] === '有' || record[k] === '是')).map(k => certLabels[k]).join('、')
  record._eduSummary = [record.edu1Level, record.edu2Level].filter(Boolean).join(' → ')
  ledgerRecords.push(record)
  return record
}

export function deleteLedgerRecord(id) {
  const idx = ledgerRecords.findIndex(r => r.id === id)
  if (idx !== -1) ledgerRecords.splice(idx, 1)
}
