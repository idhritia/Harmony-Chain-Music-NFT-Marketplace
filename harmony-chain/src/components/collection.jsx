import { useState, useEffect } from "react"

export default function Collection({ music, toggleForSale, changePrice }) {
    const [editPriceId, setEditPriceId] = useState(null);
    const [newPrice, setNewPrice] = useState('');

    const handlePriceChange = (id) => {
        changePrice(id, newPrice);
        setEditPriceId(null);
        setNewPrice('');
    };

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
                    music.length === 0 ? (

                        <div className="text-center text-teal-200 text-5xl bg-gradient-to-br from-[#ce12ac] via-black to-[#ce12ac] animate-bounce ring-4 ring-fuchsia-400 p-6 rounded-lg shadow-sm">
                            You don't own any music NFTs yet. Browse the marketplace or mint your own!
                        </div>

                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pt-60 h-[90vh] w-1/2">
                            {music.map((item) => (
                                <div
                                    key={item.id}
                                    className=" mx-4 my-16 bg-gradient-to-br from-[#ce12ac] via-black to-[#ce12ac] animate-bounce hover:animate-none transition-all duration-200 ease-in-out hover:-translate-y-20 hover:scale-105 hover:ring-teal-200 ring-4 ring-fuchsia-400 px-6 py-2 rounded-lg shadow-sm"
                                >
                                    <div className="h-full w-full flex flex-col items-center">
                                        <img
                                            src={item?.coverURI && item?.coverURI != "/image.png" ? item?.coverURI : "/music.png"}
                                            alt={item.title}
                                            className="h-1/6 p-3 object-contain text-teal-200"
                                        />
                                        <audio id="limited-audio" className="mt-6 mx-auto w-3/4" controls src={item?.audioURI}></audio>
                                        <div className="mt-6 space-y-6">
                                            <h5 className="text-3xl font-bold text-teal-200">{item.title}</h5>
                                            <p className="text-xl text-teal-200">
                                                <strong>Genre:</strong> {item.genre}<br />
                                                <strong>Price:</strong> {item.price} ETH <br />
                                                <strong>Status:</strong> {item.isForSale ? 'For Sale' : 'Not For Sale'}
                                            </p>
                                        </div>

                                        <div className="mt-12 flex flex-col items-center ">


                                            <button
                                                className={`bg-black ring-2 ring-fuchsia-300 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out rounded-xl p-4 text-teal-200 font-bold`}
                                                onClick={() => toggleForSale(item.id)}
                                            >
                                                {item.isForSale ? 'Remove from Sale' : 'Put on Sale'}
                                            </button>

                                            {editPriceId === item.id ? (
                                                <div className="mt-10 flex-col flex items-center">
                                                    <input
                                                        type="number"
                                                        className="ring-1 ring-teal-200 text-teal-200 w-1/2 p-3 m-auto"
                                                        placeholder="New price in ETH"
                                                        value={newPrice}
                                                        onChange={(e) => setNewPrice(e.target.value)}
                                                        min="0.001"
                                                        step="0.001"
                                                    />
                                                    <span className="w-full space-x-6 flex justify-center items-center mt-6">
                                                        <button
                                                            className="bg-black flex justify-center items-center ring-2 w-1/3 ring-fuchsia-300 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out rounded-xl p-4 text-teal-200 font-bold"
                                                            onClick={() => handlePriceChange(item.id)}
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            className="bg-black flex justify-center items-center w-1/3 ring-2 ring-fuchsia-300 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out rounded-xl p-4 text-teal-200 font-bold"
                                                            onClick={() => setEditPriceId(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </span>
                                                </div>
                                            ) : (
                                                <button
                                                    className="bg-black ring-2  ring-fuchsia-300 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out rounded-xl p-4 text-teal-200 font-bold mt-12"
                                                    onClick={() => {
                                                        setEditPriceId(item.id);
                                                        setNewPrice(item.price);
                                                    }}
                                                >
                                                    Change Price
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </div >

    )
}