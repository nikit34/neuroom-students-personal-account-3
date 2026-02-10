import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  fullWidth = true,
}: ButtonProps) {
  const sizeStyles = {
    small: { height: 40, paddingHorizontal: 16, fontSize: 14 },
    medium: { height: 48, paddingHorizontal: 20, fontSize: 16 },
    large: { height: 56, paddingHorizontal: 24, fontSize: 18 },
  };

  const s = sizeStyles[size];

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            { height: s.height, paddingHorizontal: s.paddingHorizontal },
            disabled && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              {icon}
              <Text style={[styles.text, { fontSize: s.fontSize }, icon ? { marginLeft: 8 } : undefined]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantBg: Record<string, ViewStyle> = {
    primary: { backgroundColor: Colors.primary },
    secondary: { backgroundColor: Colors.surfaceSecondary },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
    danger: { backgroundColor: Colors.error },
  };

  const textColors: Record<string, string> = {
    primary: '#FFF',
    secondary: Colors.primary,
    outline: Colors.primary,
    danger: '#FFF',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        variantBg[variant],
        { height: s.height, paddingHorizontal: s.paddingHorizontal },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { fontSize: s.fontSize, color: textColors[variant] },
              icon ? { marginLeft: 8 } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    color: '#FFF',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});
