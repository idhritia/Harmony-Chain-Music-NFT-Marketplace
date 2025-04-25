import { useEffect } from 'react'
export default function MusicGallery({ allMusic, account, buyMusic }) {

    useEffect(() => {
        const audio = document.getElementById('limited-audio');
        if (!audio) return;

        const stopAtTwo = () => {
            if (audio.currentTime >= 2) {
                audio.pause();
                audio.currentTime = 0;
            }
        };

        audio.addEventListener('timeupdate', stopAtTwo);
        return () => audio.removeEventListener('timeupdate', stopAtTwo);
    }, []);

    return (
        <div className="w-screen h-screen overflow-y-scroll overflow-x-hidden">
            <div className="w-full h-full flex justify-center m-auto items-center">
                {
                    allMusic.length === 0 ? (

                        <div className="text-center text-teal-200 text-5xl bg-gradient-to-br from-[#ce12ac] via-black to-[#ce12ac] animate-bounce ring-4 ring-fuchsia-400 p-6 rounded-lg shadow-sm">
                            No music NFTs available yet. Be the first to mint one!
                        </div>

                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pt-60 h-[90vh] w-1/2">
                            {allMusic.map((item) => (
                                <div
                                    key={item.id}
                                    className=" mx-4 my-16 bg-gradient-to-br from-[#ce12ac] via-black to-[#ce12ac] animate-bounce hover:animate-none transition-all duration-200 ease-in-out hover:-translate-y-20 hover:scale-105 hover:ring-teal-200 ring-4 ring-fuchsia-400 px-6 py-2 rounded-lg shadow-sm"
                                >
                                    <div className="h-full w-full flex flex-col items-center">
                                        <img
                                            src={item.coverURI && item?.coverURI != "/image.png" ? item?.coverURI : "/music.png"}
                                            alt={item.title}
                                            className="h-1/6 p-3 object-contain text-teal-200"
                                        />
                                        <audio id="limited-audio" className="mt-6 mx-auto w-3/4" controls src={item?.audioURI}></audio>
                                        <div className="mt-6 space-y-6">
                                            <h5 className="text-3xl font-bold text-teal-200">{item.title}</h5>
                                            <p className="text-xl text-teal-200">
                                                <strong>Artist:</strong> {item.artist}<br />
                                                <strong>Genre:</strong> {item.genre}<br />
                                                <strong>Price:</strong> {item.price} ETH
                                            </p>
                                            <p className="text-teal-200">
                                                <small className="text-muted">
                                                    Creator: {item.creator?.substring(0, 6)}...{item.creator?.substring(item.creator.length - 4)} <br />

                                                    Owner: {item.owner?.substring(0, 6)}...{item.owner?.substring(item.owner.length - 4)}

                                                </small>
                                            </p>

                                        </div>
                                        <div className="mt-12">
                                            {item.isForSale ? (
                                                item.owner?.toLowerCase() !== account?.toLowerCase() ? (
                                                    <button
                                                        className="bg-black ring-2 ring-fuchsia-300 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out rounded-xl p-4 text-teal-200 font-bold"
                                                        onClick={() => buyMusic(item.id, item.price)}
                                                    >
                                                        Buy Now!
                                                    </button>
                                                ) : (
                                                    <span className=" text-teal-500 p-2 rounded-lg font-bold">You own this NFT!</span>
                                                )
                                            ) : (
                                                <span className="text-rose-300">Not For Sale</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    )
                }
            </div>
        </div>

    )
}
