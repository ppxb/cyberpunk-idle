<script setup lang="ts">
import { computed, ref } from 'vue'
import BattleView from '@/components/BattleView.vue'
import CharacterView from '@/components/CharacterView.vue'
import SkillTreeSelector from '@/components/SkillTreeSelector.vue'
import { useSkillStore } from '@/store/skill'
import { usePlayerStore } from '@/store/user'

const playerStore = usePlayerStore()
const skillStore = useSkillStore()

// 响应式数据
const currentView = ref<'battle' | 'character' | 'skills'>('battle')

// 计算属性
const gameStarted = computed(() => playerStore.gameStarted)
const currentPlayer = computed(() => playerStore.currentPlayer)
const availableClasses = computed(() => {
  const classes: Record<string, any> = {}
  skillStore.availableClasses.forEach((cls) => {
    classes[cls.id] = cls
  })
  return classes
})

// 方法
function startGame(classId: string) {
  playerStore.initializePlayer(classId)
}

// 模拟的组件（需要实现）
</script>

<template>
  <div class="idle-lumina-app font-sans bg-slate-50 flex flex-col min-h-screen">
    <!-- 开始界面 -->
    <div v-if="!gameStarted" class="p-4 bg-slate-50/95 flex items-center inset-0 justify-center fixed z-60">
      <div class="rounded-3xl bg-white flex flex-col max-w-4xl w-full shadow-2xl overflow-hidden md:flex-row">
        <!-- 左侧游戏信息 -->
        <div class="text-white p-10 bg-indigo-600 flex flex-col justify-center md:w-1/3">
          <i class="i-heroicons-sword-20-solid text-6xl mb-4" />
          <h1 class="text-4xl font-black mb-2">
            光之远征
          </h1>
          <p class="text-indigo-200">
            Idle Lumina
          </p>
        </div>

        <!-- 右侧职业选择 -->
        <div class="p-10 md:w-2/3">
          <h2 class="text-2xl text-slate-800 font-bold mb-6">
            选择你的职业
          </h2>
          <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div
              v-for="(info, key) in availableClasses"
              :key="key"
              class="group p-6 text-center border-2 border-slate-100 rounded-xl cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-50"
              @click="startGame(key)"
            >
              <div class="text-4xl text-indigo-300 mb-3 transition-colors group-hover:text-indigo-600">
                <i :class="info.icon || 'i-heroicons-sword-20-solid'" />
              </div>
              <div class="text-lg text-slate-800 font-bold">
                {{ info.name }}
              </div>
              <div class="text-sm text-slate-500 mt-1 uppercase">
                {{ info.primaryStats.join('/') }}
              </div>
              <p class="text-sm text-slate-600 mt-2">
                {{ info.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主游戏界面 -->
    <div v-else class="flex flex-1 flex-col h-full w-full">
      <!-- 头部 -->
      <header class="px-4 border-b border-slate-200 bg-white flex h-14 shadow-sm items-center justify-between">
        <div class="flex gap-3 items-center">
          <div class="text-white rounded-lg bg-indigo-500 flex h-8 w-8 items-center justify-center">
            <i :class="currentPlayer.class.icon || 'i-heroicons-sword-20-solid'" />
          </div>
          <div>
            <div class="text-sm text-slate-800 font-bold">
              {{ currentPlayer.name }}
              <span class="text-xs text-slate-400">Lv.{{ currentPlayer.level }}</span>
            </div>
            <div class="rounded-full bg-slate-100 h-1 w-24 overflow-hidden">
              <div
                class="bg-indigo-500 h-full transition-all duration-300"
                :style="{ width: `${currentPlayer.experience / currentPlayer.nextLevelExp * 100}%` }"
              />
            </div>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="p-1 rounded-lg bg-slate-100 flex">
          <button
            class="text-xs font-bold px-4 py-1.5 rounded flex gap-1 transition-colors items-center"
            :class="currentView === 'battle' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'"
            @click="currentView = 'battle'"
          >
            <i class="i-heroicons-sword-20-solid" /> 战斗
          </button>
          <button
            class="text-xs font-bold px-4 py-1.5 rounded flex gap-1 transition-colors items-center"
            :class="currentView === 'character' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'"
            @click="currentView = 'character'"
          >
            <i class="i-heroicons-user-20-solid" /> 角色
          </button>
          <button
            class="text-xs font-bold px-4 py-1.5 rounded flex gap-1 transition-colors items-center"
            :class="currentView === 'skills' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'"
            @click="currentView = 'skills'"
          >
            <i class="i-heroicons-academic-cap-20-solid" /> 技能
          </button>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <main class="flex-1 relative overflow-hidden">
        <!-- 战斗视图 -->
        <BattleView v-show="currentView === 'battle'" />

        <!-- 角色视图 -->
        <CharacterView v-show="currentView === 'character'" />

        <!-- 技能树视图 -->
        <div v-show="currentView === 'skills'" class="h-full">
          <SkillTreeSelector />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.idle-lumina-app {
  font-family: 'Inter', system-ui, sans-serif;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 动画 */
@keyframes damageFloat {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(1.2);
  }
}

.damage-number {
  position: absolute;
  animation: damageFloat 0.8s forwards;
  pointer-events: none;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
  z-index: 50;
  font-family: 'Nunito', sans-serif;
}

/* 稀有度颜色 */
.text-rarity-1 {
  color: #64748b;
} /* 普通 */
.text-rarity-2 {
  color: #3b82f6;
} /* 魔法 */
.text-rarity-3 {
  color: #d97706;
} /* 稀有 */
.text-rarity-4 {
  color: #9333ea;
} /* 传说 */

.border-rarity-1 {
  border-color: #cbd5e1;
}
.border-rarity-2 {
  border-color: #93c5fd;
}
.border-rarity-3 {
  border-color: #fcd34d;
}
.border-rarity-4 {
  border-color: #d8b4fe;
}

.bg-rarity-1 {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}
.bg-rarity-2 {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}
.bg-rarity-3 {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}
.bg-rarity-4 {
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
}
</style>
