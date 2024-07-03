import { ref } from 'vue'

export function useCounter(initialValue: number) {
  const count = ref<number>(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count,
    increment,
    decrement
  }
}
