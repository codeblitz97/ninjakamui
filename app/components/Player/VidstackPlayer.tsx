'use client';

import '@vidstack/react/player/styles/base.css';
import styles from './components/layouts/vidstackstyles.module.css';

import { useEffect, useRef } from 'react';

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  PlayButton,
  Gesture,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';

type Props = {
  hsl: string;
  title: string;
  cover: string;
};

export default function Player({ hsl, title, cover }: Readonly<Props>) {
  let player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', state.paused);
      // console.log('is audio view?', '->', state.viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(
    detail: MediaCanPlayDetail,
    nativeEvent: MediaCanPlayEvent
  ) {
    // ...
  }

  return (
    <MediaPlayer
      className={`w-full h-full overflow-hidden cursor-pointer rounded-lg ${styles.mediaplayer}`}
      title="Sprite Fight"
      src={hsl}
      crossorigin
      playsinline
      aspectRatio={`16 / 9`}
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={player}
    >
      <div className={styles.bigplaycontainer}>
        <PlayButton className={styles.vdsbutton}>
          <span className="backdrop-blur-sm scale-[160%] absolute duration-200 ease-out flex shadow bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
            <svg
              className="w-7 h-7 m-2"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6667 6.6548C10.6667 6.10764 11.2894 5.79346 11.7295 6.11862L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.3771 16.5357L11.7295 25.8813C11.2895 26.2065 10.6667 25.8923 10.6667 25.3451L10.6667 6.6548Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </PlayButton>
      </div>
      <MediaProvider>
        <Poster
          className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
          src={cover}
          alt={title}
        />
      </MediaProvider>
      <Gesture
        className="vds-gesture"
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className="vds-gesture"
        event="pointerup"
        action="toggle:controls"
      />
      <Gesture className="vds-gesture" event="dblpointerup" action="seek:-5" />
      <Gesture className="vds-gesture" event="dblpointerup" action="seek:5" />
      <Gesture
        className="vds-gesture"
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <VideoLayout />
    </MediaPlayer>
  );
}
