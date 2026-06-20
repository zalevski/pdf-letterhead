<script setup lang="ts">
import type { GeneratePdfsResult } from '../../shared/types'

defineProps<{
  title: string
  result: GeneratePdfsResult | null
  statusText: string
  progress: number
  canOpenOutput: boolean
  openOutputLabel: string
}>()

const emit = defineEmits<{
  (event: 'open-output'): void
}>()
</script>

<template>
  <UCard
    class="processing-card"
    :ui="{
      header: 'px-4 pt-4 pb-3 sm:px-5',
      body: 'px-4 pb-4 sm:px-5',
      base: 'border border-default/70 bg-elevated/80 shadow-sm backdrop-blur'
    }"
  >
    <template #header>
      <div class="processing-card__header">
        <UBadge
          :color="result?.errorCode ? 'error' : result && result.successCount > 0 ? 'success' : 'neutral'"
          variant="soft"
          class="processing-card__status"
        >
          {{ statusText }}
        </UBadge>
      </div>
    </template>

    <div class="processing-card__body">
      <UAlert
        v-if="result?.errorCode"
        :title="statusText"
        :description="result.errorMessage"
        icon="i-lucide-triangle-alert"
        color="error"
        variant="soft"
      />
      <UAlert
        v-else-if="result && result.successCount > 0"
        :title="statusText"
        icon="i-lucide-circle-check-big"
        color="success"
        variant="soft"
      />
      <UAlert
        v-else
        :title="statusText"
        icon="i-lucide-file-search"
        color="neutral"
        variant="soft"
      />

      <div class="processing-card__progress">
        <div class="processing-card__progress-row">
          <span class="processing-card__value">{{ progress }}%</span>
        </div>
        <UProgress :model-value="progress" :max="100" color="primary" size="md" />
      </div>

      <div class="processing-card__counts" v-if="result">
        <UBadge color="success" variant="soft">{{ result.successCount }}</UBadge>
        <UBadge color="error" variant="soft">{{ result.failureCount }}</UBadge>
      </div>
    </div>

    <template #footer>
      <div class="processing-card__footer">
        <UButton
          v-if="canOpenOutput"
          :label="openOutputLabel"
          icon="i-lucide-folder-open"
          color="primary"
          variant="soft"
          class="processing-card__button"
          @click="emit('open-output')"
        />
      </div>
    </template>
  </UCard>
</template>

<style scoped>
.processing-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.processing-card__status {
  max-width: 16rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.processing-card__body {
  display: grid;
  gap: 0.9rem;
}

.processing-card__progress {
  display: grid;
  gap: 0.45rem;
}

.processing-card__progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.processing-card__value {
  color: rgb(var(--ui-text-muted));
  font-size: 0.88rem;
}

.processing-card__counts {
  display: flex;
  gap: 0.5rem;
}

.processing-card__footer {
  display: flex;
  justify-content: flex-end;
}

.processing-card__button {
  flex-shrink: 0;
}
</style>
