import video from "../../assets/videos/login.mp4";

export default function BackgroundVideo() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden">

      <video
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-20
          scale-110
        "
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-[#05060B]/80" />

      {/* Blue Gradient */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-blue-950/40
        via-transparent
        to-violet-950/30
        "
      />

    </div>
  );
}