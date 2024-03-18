import { useState, Dispatch, SetStateAction } from 'react';

type VideoProgressData = {
  [key: string]: any;
};

type GetVideoProgressFn = (id: string) => any;
type UpdateVideoProgressFn = (id: string, data: any) => void;

function VideoProgressSave(): [GetVideoProgressFn, UpdateVideoProgressFn] {
  const [settings, setSettings] = useState<VideoProgressData>(() => {
    const storedSettings = localStorage.getItem('vidstack_settings');
    return storedSettings ? JSON.parse(storedSettings) : {};
  });

  const getVideoProgress: GetVideoProgressFn = (id) => {
    return settings[id];
  };

  const updateVideoProgress: UpdateVideoProgressFn = (id, data) => {
    const updatedSettings = { ...settings, [id]: data };
    setSettings(updatedSettings);

    localStorage.setItem('vidstack_settings', JSON.stringify(updatedSettings));
  };

  return [getVideoProgress, updateVideoProgress];
}

export default VideoProgressSave;
