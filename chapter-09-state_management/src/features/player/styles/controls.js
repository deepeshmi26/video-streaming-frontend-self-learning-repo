import { colors, spacing, borderRadius, transitions } from './theme';

export const controlsContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: `linear-gradient(to top, ${colors.background.dark}, ${colors.background.dark}CC)`,
  padding: spacing.md,
  color: colors.text.primary,
  flexWrap: 'wrap',
  gap: spacing.sm,
  borderRadius: `0 0 ${borderRadius.md} ${borderRadius.md}`,
};

export const button = {
  background: 'transparent',
  border: 'none',
  color: colors.text.primary,
  padding: `${spacing.sm} ${spacing.md}`,
  cursor: 'pointer',
  borderRadius: borderRadius.md,
  transition: transitions.fast,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.xs,
  fontSize: '16px',

  '&:hover': {
    background: colors.hover.background,
  },
};

export const volumeSlider = {
  width: '100px',
  height: '4px',
  WebkitAppearance: 'none',
  background: colors.background.light,
  borderRadius: borderRadius.full,
  outline: 'none',
  opacity: '0.8',
  transition: transitions.fast,

  '&::-webkit-slider-thumb': {
    WebkitAppearance: 'none',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: colors.primary,
    cursor: 'pointer',
    transition: transitions.fast,
  },

  '&::-moz-range-thumb': {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: colors.primary,
    cursor: 'pointer',
    transition: transitions.fast,
  },

  '&:hover': {
    opacity: '1',
  },
};

export const select = {
  background: colors.background.medium,
  border: 'none',
  color: colors.text.primary,
  padding: `${spacing.xs} ${spacing.md}`,
  borderRadius: borderRadius.md,
  cursor: 'pointer',
  outline: 'none',
  transition: transitions.fast,

  '&:hover': {
    background: colors.background.light,
  },

  '& option': {
    background: colors.background.dark,
    color: colors.text.primary,
  },
};
