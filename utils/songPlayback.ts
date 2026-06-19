type SongLike = {
  id?: string;
  audioUrl?: string;
  audio_url?: string;
  playbackUrl?: string;
};

export function getSongAudioAssetUrl(song: SongLike | null | undefined): string | undefined {
  if (!song) return undefined;
  return song.audioUrl || song.audio_url || undefined;
}

export function getSongPlaybackUrl(song: SongLike | null | undefined): string | undefined {
  if (!song) return undefined;
  if (song.playbackUrl) return song.playbackUrl;

  const assetUrl = getSongAudioAssetUrl(song);
  if (!assetUrl) return undefined;

  if (song.id) {
    return `/api/songs/${encodeURIComponent(song.id)}/audio`;
  }

  return assetUrl;
}

export function hasSongPlaybackSource(song: SongLike | null | undefined): boolean {
  return Boolean(getSongPlaybackUrl(song));
}

export function getSongLyricsUrl(song: SongLike | null | undefined): string | undefined {
  const assetUrl = getSongAudioAssetUrl(song);
  if (!assetUrl) return undefined;
  return assetUrl.replace(/\.[^/.]+$/, '.lrc');
}
