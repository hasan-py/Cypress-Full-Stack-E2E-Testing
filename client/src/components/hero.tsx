function Hero() {
  return (
    <div className="relative w-full h-[350px] overflow-hidden bg-[url('https://store-images.s-microsoft.com/image/apps.5449.13966330883349940.7f6f94b3-b7a2-48d4-b2fe-e39da839e6a8.db7e42ee-30c8-4377-856e-69146d02ac44?q=90&w=480&h=270')] bg-cover bg-center">
      <div className="w-full h-full flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md">
        <div className="text-protest absolute text-center">
          <span className="text-yellow-500 text-[4rem] font-bold uppercase w-full">
            Games
          </span>
          <p className="text-white text-[2rem] font-semibold tracking-widest">
            Find your next captivating gaming moment
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
