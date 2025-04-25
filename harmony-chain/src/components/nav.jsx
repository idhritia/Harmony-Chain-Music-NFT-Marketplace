
export default function Navbar({ account, setCurrentView }) {
    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 shadow-2xl bg-gradient-to-br from-[#ce12ac] via-rose-900 to-fuchsia-700 w-3/4 rounded-xl px-8 py-4">
            <div className="w-full flex justify-between items-center">
                <span className=" text-xl">
                    {account ? (
                        <h1 className="text-teal-200">Connected: {account.slice(0, 6)}...{account.slice(-4)}</h1>
                    ) : (
                        <h1 className="text-gray-700">Not Connected</h1>
                    )}
                </span>
                <button onClick={() => setCurrentView('')} className="text-fuchsia-200 cursor-pointer font-bold text-2xl">Harmony Chain 🎼</button>
                <span className="flex flex-row space-x-6">
                    <button onClick={() => setCurrentView('collection')} className="text-black hover:text-teal-200 transition-all duration-200 ease-in-out hover:scale-103 text-2xl cursor-pointer">My Collection</button>
                    <button onClick={() => setCurrentView('mint')} className="text-black text-2xl hover:text-teal-200 transition-all duration-200 ease-in-out hover:scale-103 cursor-pointer">Mint</button>
                </span>
            </div>
        </div>
    )
}


