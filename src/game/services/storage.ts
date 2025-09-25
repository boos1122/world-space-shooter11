// 本地存储服务，用于保存游戏设置和临时数据

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}

const STORAGE_KEYS = {
  SETTINGS: 'world-space-shooter-settings',
  HIGH_SCORE: 'world-space-shooter-high-score',
} as const;

export function getSettings(): GameSettings {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...getDefaultSettings(), ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }

  return getDefaultSettings();
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
}

export function getLocalHighScore(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.warn('Failed to load high score from localStorage:', error);
    return 0;
  }
}

export function saveLocalHighScore(score: number): void {
  if (typeof window === 'undefined') return;

  try {
    const currentHigh = getLocalHighScore();
    if (score > currentHigh) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    }
  } catch (error) {
    console.warn('Failed to save high score to localStorage:', error);
  }
}

function getDefaultSettings(): GameSettings {
  return {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal',
  };
}
