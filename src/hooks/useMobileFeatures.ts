// Adicionar haptic feedback para mobile
export function useHapticFeedback() {
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const pattern = {
        light: 10,
        medium: 20,
        heavy: 30
      }
      navigator.vibrate(pattern[style])
    }
  }

  return { triggerHaptic }
}