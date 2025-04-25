"use client"
import { useState } from "react";

export default function MintMusic({ mintMusic }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        let coverURI = imageUrl
        if (coverURI == "") {
            coverURI = "/music.png"
        }
        mintMusic(title, artist, genre, price, coverURI, audioUrl);
    };

    return (
        <div className="w-screen h-screen">
            <div className="w-full h-full flex justify-center m-auto items-center">
                <div className="text-center text-teal-200 bg-gradient-to-br from-[#ce12ac] via-black to-[#ce12ac] ring-4 ring-fuchsia-400  p-6 rounded-lg shadow-sm">
                    <h1 className="text-5xl">Mint New Music NFT</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mt-12 space-x-4">
                            <label htmlFor="title" className="text-3xl">Song Title</label>
                            <input
                                type="text"
                                id="title"
                                className="ring-1 ring-teal-200"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-12 space-x-4">
                            <label htmlFor="artist" className="text-3xl">Artist</label>
                            <input
                                type="text"
                                id="artist"
                                className="ring-1 ring-teal-200"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-12 space-x-4">
                            <label htmlFor="genre" className="text-3xl">Genre</label>
                            <select
                                className="text-2xl"
                                id="genre"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                required
                            >
                                <option value="">Select Genre</option>
                                <option value="Pop">Pop</option>
                                <option value="Rock">Rock</option>
                                <option value="Hip Hop">Hip Hop</option>
                                <option value="R&B">R&B</option>
                                <option value="Jazz">Jazz</option>
                                <option value="Classical">Classical</option>
                                <option value="Electronic">Electronic</option>
                                <option value="Country">Country</option>
                                <option value="Folk">Folk</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="mt-12 space-x-4">
                            <label htmlFor="price" className="text-3xl">Price (ETH)</label>
                            <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                className="ring-1 ring-teal-200"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-12 space-x-4">
                            <label htmlFor="imageUrl" className="text-3xl">Cover Image URL (Optional)</label>
                            <input
                                type="url"
                                className="ring-1 ring-teal-200"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />

                        </div>

                        <div className="mt-12 space-x-4">
                            <label htmlFor="audioUrl" className="text-3xl">Audio URL</label>
                            <input
                                type="url"
                                className="ring-1 ring-teal-200"
                                id="audioUrl"
                                value={audioUrl}
                                onChange={(e) => setAudioUrl(e.target.value)}
                                placeholder="https://example.com/audio.mp3"
                                required
                            />

                        </div>
                        <div className="mt-12">
                            <button type="submit" className="bg-black ring-2 ring-fuchsia-300 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out rounded-xl p-4">
                                Mint Music NFT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}