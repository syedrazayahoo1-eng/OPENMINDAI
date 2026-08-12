export default function BackgroundEffects() {

  return (

    <>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" />

      <div className="absolute top-24 left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="absolute bottom-24 right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-[160px]" />

    </>

  );

}