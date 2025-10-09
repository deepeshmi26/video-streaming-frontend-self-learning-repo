import { colors, spacing, borderRadius, transitions, shadows } from './theme';

export const progressContainer = {
  position: 'relative',
  height: '4px',
  background: colors.progress.background,
  cursor: 'pointer',
  transition: transitions.fast,

  '&:hover': {
    height: '6px',
  },
};

export const progressBar = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  background: colors.progress.played,
  transition: transitions.fast,
};

export const bufferBar = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  background: colors.progress.buffer,
  transition: transitions.fast,
};

export const thumbnailPreview = {
  position: 'absolute',
  bottom: '100%',
  transform: 'translateX(-50%)',
  marginBottom: spacing.md,
  border: `2px solid ${colors.background.dark}`,
  borderRadius: borderRadius.sm,
  overflow: 'hidden',
  boxShadow: shadows.thumbnails,
  transition: transitions.fast,
  zIndex: 10,
};

export const timeTooltip = {
  position: 'absolute',
  bottom: '100%',
  transform: 'translateX(-50%)',
  marginBottom: spacing.xs,
  padding: `${spacing.xs} ${spacing.sm}`,
  background: colors.background.dark,
  color: colors.text.primary,
  borderRadius: borderRadius.sm,
  fontSize: '12px',
  pointerEvents: 'none',
  boxShadow: shadows.tooltip,
};
