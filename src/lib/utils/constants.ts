/**
 * Atributos inline legados de autoplay para <video> de fundo.
 * Navegadores antigos (iOS Safari e WebViews) so respeitam o autoplay
 * silencioso quando esses atributos vem no HTML, por isso ficam separados:
 * o React nao reconhece os prefixados e eles precisam ser espalhados.
 */
export const HERO_BACKGROUND_VIDEO_LEGACY_INLINE_ATTRS = {
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
  "x5-video-player-type": "h5",
} as const;
