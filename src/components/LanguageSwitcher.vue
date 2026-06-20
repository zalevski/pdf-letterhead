<script setup lang="ts">
import { computed } from 'vue'
import type { AppLanguage } from '../../shared/types'

type LanguageOption = {
  label: string
  value: AppLanguage
}

const props = defineProps<{
  locale: AppLanguage
  items: LanguageOption[]
  ariaLabel: string
}>()

const emit = defineEmits<{
  (event: 'update:locale', value: AppLanguage): void
}>()

const selectedLocale = computed({
  get: () => props.locale,
  set: (value) => emit('update:locale', value)
})
</script>

<template>
  <USelectMenu
    v-model="selectedLocale"
    :items="props.items"
    value-key="value"
    label-key="label"
    :aria-label="props.ariaLabel"
    :placeholder="props.ariaLabel"
    :search-input="false"
    class="language-switcher"
  />
</template>

<style scoped>
.language-switcher {
  min-width: 11rem;
}
</style>
