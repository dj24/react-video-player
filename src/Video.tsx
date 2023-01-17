import ReactPlayer from "react-player";
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Pause, PlayArrow } from "@mui/icons-material";

type TQualityLevel = {
  index: number;
  resolution: string;
};

const Controls = ({ children }: { children: React.ReactNode }) => (
  <Stack
    p={1}
    spacing={2}
    direction="row"
    alignItems="center"
    position="absolute"
    width="100%"
    bottom={0}
    height={48}
    sx={{
      background: "rgba(255,255,255,0.5)",
      backdropFilter: "blur(8px)",
      boxSizing: "border-box",
    }}
  >
    {children}
  </Stack>
);

const QualitySelect = ({
  qualityLevels,
  value,
  onChange,
}: {
  value: number;
  qualityLevels: TQualityLevel[];
  onChange: (event: SelectChangeEvent<number>) => void;
}) => (
  <Select<number>
    sx={{ width: 200, height: "100%" }}
    value={value}
    onChange={onChange}
  >
    {qualityLevels?.map(({ index, resolution }) => (
      <MenuItem key={index} value={index}>
        {resolution}
      </MenuItem>
    ))}
    <MenuItem value={-1}>Auto</MenuItem>
  </Select>
);

export const Video = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [qualityLevels, setQualityLevels] = useState<TQualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);
  const ref = useRef<ReactPlayer>();

  useEffect(() => {
    if (ref.current) {
      ref.current.getInternalPlayer("hls").currentLevel = currentQuality;
    }
  }, [currentQuality]);

  console.log(isBuffering);

  return (
    <Box sx={{ position: "relative" }}>
      <ReactPlayer
        volume={0}
        url={src}
        onDuration={setDuration}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        onProgress={(progress) => setProgress(progress.playedSeconds)}
        onReady={(player) => {
          ref.current = player;
          const levels = player?.getInternalPlayer("hls")?.levels;
          if (levels) {
            setQualityLevels(
              levels.map((level: any, index: number) => ({
                index,
                resolution: level.attrs.RESOLUTION,
              }))
            );
          }
        }}
      />
      <Box
        position="absolute"
        width="100%"
        height="100%"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        display="flex"
        top={0}
      >
        {isBuffering && <CircularProgress />}
        <Controls>
          {isPlaying ? (
            <IconButton
              color="primary"
              onClick={() => ref.current?.getInternalPlayer().pause()}
            >
              <Pause />
            </IconButton>
          ) : (
            <IconButton
              color="primary"
              onClick={() => ref.current?.getInternalPlayer().play()}
            >
              <PlayArrow />
            </IconButton>
          )}
          <Slider
            onChange={(event, value) => {
              setProgress(value as number);
              ref.current?.seekTo(value as number);
            }}
            min={0}
            max={duration}
            value={progress}
            defaultValue={progress}
          ></Slider>
          <QualitySelect
            value={currentQuality}
            qualityLevels={qualityLevels}
            onChange={(event) =>
              setCurrentQuality(event.target.value as number)
            }
          ></QualitySelect>
        </Controls>
      </Box>
    </Box>
  );
};
