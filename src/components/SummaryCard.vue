<script setup lang="ts">
defineProps<{
  title: string
  letterheadLabel: string
  letterheadStatus: string
  letterheadStatusColor: 'neutral' | 'warning' | 'primary' | 'success' | 'error'
  inputDocumentsLabel: string
  inputDocumentsValue: string
  outputLabel: string
  outputStatus: string
  outputStatusColor: 'neutral' | 'warning' | 'primary' | 'success' | 'error'
  generationModeLabel: string
  generationModeDescription: string
}>()
</script>

<template>
  <UCard
    class="summary-card"
    :ui="{
      header: 'px-4 pt-4 pb-3 sm:px-5',
      body: 'px-4 pb-4 sm:px-5',
      base: 'border border-default/70 bg-elevated/80 shadow-sm backdrop-blur'
    }"
  >
    <template #header>
      <div class="summary-card__header">
        <h2>{{ title }}</h2>
      </div>
    </template>

    <div class="summary-card__list">
      <div class="summary-card__row">
        <span class="summary-card__label">{{ letterheadLabel }}</span>
        <UBadge :color="letterheadStatusColor" variant="soft">{{ letterheadStatus }}</UBadge>
      </div>
      <USeparator />
      <div class="summary-card__row">
        <span class="summary-card__label">{{ inputDocumentsLabel }}</span>
        <span class="summary-card__value">{{ inputDocumentsValue }}</span>
      </div>
      <USeparator />
      <div class="summary-card__row">
        <span class="summary-card__label">{{ outputLabel }}</span>
        <UBadge :color="outputStatusColor" variant="soft">{{ outputStatus }}</UBadge>
      </div>
    </div>

    <div class="summary-card__mode">
      <UAlert
        :title="generationModeLabel"
        :description="generationModeDescription"
        icon="i-lucide-sparkles"
        color="primary"
        variant="soft"
      />
    </div>
  </UCard>
</template>

<style scoped>
.summary-card__header {
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

.summary-card__list {
  display: grid;
  gap: 0.65rem;
}

.summary-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.summary-card__label {
  color: rgb(var(--ui-text-muted));
  font-size: 0.88rem;
}

.summary-card__value {
  color: rgb(var(--ui-text-default));
  font-size: 0.92rem;
  text-align: right;
}

.summary-card__mode {
  margin-top: 1rem;
}
</style>
