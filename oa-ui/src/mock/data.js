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
  { id: 1, empNo: 'EMP001', name: '张伟', gender: '男', birthDate: '1985-03-15', idCard: '320102198503151234', phone: '13800001001', email: 'zhangwei@company.com', nativePlace: '江苏南京', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '硕士', studyMode: '全日制', school: '南京大学', major: '工商管理', startDate: '2003-09', endDate: '2006-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '南京大学', major: '经济学', startDate: '1999-09', endDate: '2003-06', chsiProof: '学信网认证报告.pdf' }], deptId: 1, positionId: 1, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '南京市鼓楼区XX路100号', emergencyContact: '张丽', emergencyPhone: '13900001001', remark: '' },
  { id: 2, empNo: 'EMP002', name: '李强', gender: '男', birthDate: '1988-07-22', idCard: '320102198807221234', phone: '13800001002', email: 'liqiang@company.com', nativePlace: '浙江杭州', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '本科', studyMode: '全日制', school: '浙江大学', major: '软件工程', startDate: '2006-09', endDate: '2010-06', chsiProof: '学信网认证报告.pdf' }], deptId: 2, positionId: 2, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '杭州市西湖区文三路200号', emergencyContact: '陈丽', emergencyPhone: '13900001002', remark: '' },
  { id: 3, empNo: 'EMP003', name: '王芳', gender: '女', birthDate: '1992-11-08', idCard: '320102199211081234', phone: '13800001003', email: 'wangfang@company.com', nativePlace: '上海', ethnicity: '汉族', political: '共青团员', marital: '未婚', educations: [{ education: '本科', studyMode: '全日制', school: '复旦大学', major: '工业设计', startDate: '2010-09', endDate: '2014-06', chsiProof: '教育部学历证书电子注册备案表.pdf' }], deptId: 3, positionId: 8, entryDate: '2022-03-01', confirmDate: '2022-06-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '上海市浦东新区张江路300号', emergencyContact: '王建国', emergencyPhone: '13900001003', remark: '' },
  { id: 4, empNo: 'EMP004', name: '赵明', gender: '男', birthDate: '1990-01-30', idCard: '320102199001301234', phone: '13800001004', email: 'zhaoming@company.com', nativePlace: '广东深圳', ethnicity: '汉族', political: '群众', marital: '已婚', educations: [{ education: '硕士', studyMode: '非全日制', school: '中山大学', major: '市场营销', startDate: '2012-09', endDate: '2015-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '中山大学', major: '工商管理', startDate: '2008-09', endDate: '2012-06', chsiProof: '学信网认证报告.pdf' }], deptId: 4, positionId: 9, entryDate: '2022-02-01', confirmDate: '2022-05-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '深圳市南山区科技园路400号', emergencyContact: '赵建国', emergencyPhone: '13900001004', remark: '' },
  { id: 5, empNo: 'EMP005', name: '孙丽', gender: '女', birthDate: '1987-05-18', idCard: '320102198705181234', phone: '13800001005', email: 'sunli@company.com', nativePlace: '北京', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '本科', studyMode: '全日制', school: '北京大学', major: '人力资源管理', startDate: '2005-09', endDate: '2009-06', chsiProof: '学信网认证报告.pdf' }], deptId: 5, positionId: 10, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '北京市海淀区中关村路500号', emergencyContact: '李明', emergencyPhone: '13900001005', remark: '' },
  { id: 6, empNo: 'EMP006', name: '周杰', gender: '男', birthDate: '1986-09-25', idCard: '320102198609251234', phone: '13800001006', email: 'zhoujie@company.com', nativePlace: '湖北武汉', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '硕士', studyMode: '非全日制', school: '武汉大学', major: '会计学', startDate: '2008-09', endDate: '2011-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '武汉大学', major: '财务管理', startDate: '2004-09', endDate: '2008-06', chsiProof: '学信网认证报告.pdf' }], deptId: 6, positionId: 11, entryDate: '2022-01-01', confirmDate: '2022-04-01', contractEnd: '2027-12-31', empType: '正式员工', status: 1, address: '武汉市武昌区珞珈山路600号', emergencyContact: '周丽', emergencyPhone: '13900001006', remark: '' },
  { id: 7, empNo: 'EMP007', name: '吴昊', gender: '男', birthDate: '1993-04-12', idCard: '320102199304121234', phone: '13800001007', email: 'wuhao@company.com', nativePlace: '四川成都', ethnicity: '汉族', political: '群众', marital: '未婚', educations: [{ education: '本科', studyMode: '全日制', school: '电子科技大学', major: '计算机科学与技术', startDate: '2011-09', endDate: '2015-06', chsiProof: '教育部学历证书电子注册备案表.pdf' }], deptId: 7, positionId: 3, entryDate: '2022-06-01', confirmDate: '2022-09-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '成都市高新区天府大道700号', emergencyContact: '吴建国', emergencyPhone: '13900001007', remark: '' },
  { id: 8, empNo: 'EMP008', name: '郑宇', gender: '男', birthDate: '1991-12-03', idCard: '320102199112031234', phone: '13800001008', email: 'zhengyu@company.com', nativePlace: '湖南长沙', ethnicity: '汉族', political: '共青团员', marital: '未婚', educations: [{ education: '硕士', studyMode: '全日制', school: '中南大学', major: '软件工程', startDate: '2013-09', endDate: '2016-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '自考', school: '中南大学', major: '计算机科学与技术', startDate: '2009-09', endDate: '2013-06', chsiProof: '' }], deptId: 8, positionId: 5, entryDate: '2022-06-01', confirmDate: '2022-09-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '长沙市岳麓区麓山南路800号', emergencyContact: '郑建国', emergencyPhone: '13900001008', remark: '' },
  { id: 9, empNo: 'EMP009', name: '冯凯', gender: '男', birthDate: '1994-06-20', idCard: '320102199406201234', phone: '13800001009', email: 'fengkai@company.com', nativePlace: '河南郑州', ethnicity: '汉族', political: '群众', marital: '未婚', educations: [{ education: '本科', studyMode: '成人高考', school: '郑州大学', major: '计算机科学与技术', startDate: '2012-09', endDate: '2016-06', chsiProof: '' }], deptId: 9, positionId: 7, entryDate: '2023-01-01', confirmDate: '2023-04-01', contractEnd: '2026-12-31', empType: '正式员工', status: 1, address: '郑州市金水区文化路900号', emergencyContact: '冯建国', emergencyPhone: '13900001009', remark: '' },
  { id: 10, empNo: 'EMP010', name: '陈雪', gender: '女', birthDate: '1995-08-14', idCard: '320102199508141234', phone: '13800001010', email: 'chenxue@company.com', nativePlace: '安徽合肥', ethnicity: '汉族', political: '共青团员', marital: '未婚', educations: [{ education: '本科', studyMode: '全日制', school: '中国科学技术大学', major: '信息管理', startDate: '2013-09', endDate: '2017-06', chsiProof: '学信网认证报告.pdf' }], deptId: 3, positionId: 8, entryDate: '2023-03-01', confirmDate: '2023-06-01', contractEnd: '2026-12-31', empType: '正式员工', status: 1, address: '合肥市蜀山区黄山路1000号', emergencyContact: '陈建国', emergencyPhone: '13900001010', remark: '' },
  { id: 11, empNo: 'EMP011', name: '刘洋', gender: '男', birthDate: '1996-02-28', idCard: '320102199602281234', phone: '13800001011', email: 'liuyang@company.com', nativePlace: '重庆', ethnicity: '土家族', political: '群众', marital: '未婚', educations: [{ education: '本科', studyMode: '网络教育', school: '重庆大学', major: '软件工程', startDate: '2014-09', endDate: '2018-06', chsiProof: '' }], deptId: 7, positionId: 4, entryDate: '2023-07-01', confirmDate: '2023-10-01', contractEnd: '2026-12-31', empType: '正式员工', status: 1, address: '重庆市沙坪坝区大学城路1100号', emergencyContact: '刘建国', emergencyPhone: '13900001011', remark: '' },
  { id: 12, empNo: 'EMP012', name: '黄丽', gender: '女', birthDate: '1993-10-05', idCard: '320102199310051234', phone: '13800001012', email: 'huangli@company.com', nativePlace: '福建厦门', ethnicity: '汉族', political: '中共党员', marital: '已婚', educations: [{ education: '硕士', studyMode: '全日制', school: '厦门大学', major: '会计学', startDate: '2015-09', endDate: '2018-06', chsiProof: '学信网认证报告.pdf' }, { education: '本科', studyMode: '全日制', school: '厦门大学', major: '审计学', startDate: '2011-09', endDate: '2015-06', chsiProof: '学信网认证报告.pdf' }], deptId: 6, positionId: 11, entryDate: '2022-08-01', confirmDate: '2022-11-01', contractEnd: '2025-12-31', empType: '正式员工', status: 1, address: '厦门市思明区环岛路1200号', emergencyContact: '黄建国', emergencyPhone: '13900001012', remark: '' }
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
