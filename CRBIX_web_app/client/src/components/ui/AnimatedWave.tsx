export default function AnimatedWave() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg
        className="relative block w-[200%] animate-wave"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C150,150 350,10 600,80 C850,150 1050,10 1200,80 L1200,200 L0,200 Z"
          fill="white"
          opacity="0.77"
        ></path>
      </svg>
    </div>
  );
}
