import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';

export function useColors() {
  const systemScheme = useColorScheme();
  const { data } = useApp();
  const palette = data.settings.darkMode ? colors.dark : systemScheme === 'dark' ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
