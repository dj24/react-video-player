import ReactPlayer from "react-player";

export const Video = ({ src }: { src: string }) => {
  const ref = (player: any) => {
    if (!player) {
      return;
    }
    console.log({ player });
  };

  return (
    <div style={{ width: 640 }}>
      <ReactPlayer ref={ref} controls url={src} />
    </div>
  );
};
