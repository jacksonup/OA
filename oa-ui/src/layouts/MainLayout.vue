<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  User, OfficeBuilding, Briefcase, Fold, Expand,
  Star, Medal, Trophy, School, Phone, Timer, Money, Upload
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const menuItems = [
  {
    path: '/user',
    title: '用户管理',
    icon: User,
    children: [
      { path: '/user/master', title: '员工主档', icon: Star },
      { path: '/user/practice', title: '执业相关', icon: Medal },
      { path: '/user/project', title: '项目经历', icon: Trophy },
      { path: '/user/education', title: '学历信息', icon: School },
      { path: '/user/emergency', title: '紧急联系人信息', icon: Phone }
    ]
  },
  { path: '/department', title: '项目部管理', icon: OfficeBuilding },
  { path: '/position', title: '岗位管理', icon: Briefcase },
  {
    path: '/salary',
    title: '薪酬管理',
    icon: Money,
    children: [
      { path: '/attendance', title: '考勤管理', icon: Timer },
      { path: '/salary/month', title: '月度薪酬核算', icon: Money }
    ]
  },
  { path: '/import-ledger', title: '人员台账导入', icon: Upload }
]

const activeMenu = computed(() => route.path)

function onMenuSelect(path) {
  router.push(path)
}
</script>

<template>
  <el-container style="height: 100vh">
    <el-aside :width="isCollapse ? '72px' : '220px'" class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">O</div>
        <span v-if="!isCollapse" class="logo-text">OA 系统</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="transparent"
        text-color="var(--ios-text-secondary)"
        active-text-color="var(--ios-blue)"
        :default-openeds="['/user', '/salary']"
        @select="onMenuSelect"
      >
        <template v-for="item in menuItems" :key="item.path">
          <el-sub-menu v-if="item.children" :index="item.path">
            <template #title>
              <el-icon :size="18"><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
              <el-icon :size="16"><component :is="child.icon" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon :size="18"><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>

      <div v-if="!isCollapse" class="sidebar-footer">
        <div class="user-avatar">A</div>
        <span class="user-name">管理员</span>
      </div>
    </el-aside>

    <el-container class="main-area">
      <el-header class="main-header">
        <div class="header-left">
          <button class="collapse-btn" @click="isCollapse = !isCollapse">
            <el-icon :size="18"><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
          </button>
          <span class="header-title">{{ route.meta.title }}</span>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.sidebar {
  background: var(--ios-sidebar);
  border-right: 1px solid var(--ios-separator);
  transition: width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 18px;
}
.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--ios-blue), #0f766e);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}
.logo-text {
  font-size: 17px;
  font-weight: 600;
  color: var(--ios-text);
  letter-spacing: 0;
  white-space: nowrap;
}

.sidebar-footer {
  margin-top: auto;
  padding: 12px 16px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--ios-separator);
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 122, 255, 0.12);
  color: var(--ios-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.user-name {
  font-size: 13px;
  color: var(--ios-text-secondary);
  font-weight: 500;
}

.main-area {
  background: var(--ios-bg);
  min-width: 0;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px !important;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid var(--ios-separator);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--ios-radius-sm);
  border: none;
  background: var(--ios-bg);
  color: var(--ios-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.collapse-btn:hover {
  background: var(--ios-blue-light);
  color: var(--ios-blue);
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--ios-text);
  letter-spacing: 0;
}

.main-content {
  padding: 16px;
  min-width: 0;
  overflow: auto;
}
</style>
