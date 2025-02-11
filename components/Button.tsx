import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

export function Button({ onPress, title, disabled }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <ThemedView style={[styles.button, disabled && styles.disabled]}>
        <ThemedText style={styles.text}>{title}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 