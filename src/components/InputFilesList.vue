<script setup lang="ts">
import type { ManagedInputFile } from '../composables/usePdfGenerator'
import type { FileStatus } from '../../shared/types'

defineProps<{
  title: string
  files: ManagedInputFile[]
  statusLabel: (status: FileStatus) => string
  emptyTitle: string
  emptyDescription: string
}>()
</script>

<template>
  <UCard
    class="inputs-card"
    :ui="{
      header: 'px-4 pt-4 pb-3 sm:px-5',
      body: 'px-4 pb-4 sm:px-5',
      base: 'border border-default/70 bg-elevated/80 shadow-sm backdrop-blur'
    }"
  >
    <template #header>
      <div class="inputs-card__header">
        <h2>{{ title }}</h2>
        <UBadge color="neutral" variant="soft">
          {{ files.length }}
        </UBadge>
      </div>
    </template>

    <UAlert
      v-if="files.length === 0"
      :title="emptyTitle"
      :description="emptyDescription"
      icon="i-lucide-file-text"
      color="neutral"
      variant="soft"
    />

    <ul v-else class="inputs-card__list">
      <li v-for="file in files" :key="file.path" class="inputs-card__item">
        <div class="inputs-card__meta">
          <span class="inputs-card__name">{{ file.name }}</span>
        </div>
        <UBadge :color="file.status === 'error' ? 'error' : file.status === 'done' ? 'success' : file.status === 'processing' ? 'primary' : 'neutral'" variant="soft">
          {{ statusLabel(file.status) }}
        </UBadge>
      </li>
    </ul>
  </UCard>
</template>

<style scoped>
.inputs-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

h2 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.2;
  color: rgb(var(--ui-text-highlighted));
}

.inputs-card__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.inputs-card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0.9rem;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.28);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.inputs-card__meta {
  min-width: 0;
}

.inputs-card__name {
  display: block;
  color: rgb(var(--ui-text-default));
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
