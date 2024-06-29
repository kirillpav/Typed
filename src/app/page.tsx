"use client";

import { useState, useEffect, useMemo } from "react";

type Quote = {
	text: string;
	author: string;
};

const randomQuote = () => {
	return fetch("https://type.fit/api/quotes")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const randomIndex = Math.floor(Math.random() * data.length);
			return data[randomIndex];
		});
};

export default function Home() {
	const [quote, setQuote] = useState<Quote>();
	const [text, setText] = useState<string>("");
	const [currentWord, setCurrentWord] = useState<string>();
	const quotesSplit = useMemo(() => quote?.quote.split(" ") ?? [], [quote]);
	const [wordIdx, setWordIdx] = useState<number>(0);

	useEffect(() => {
		const fetchQuote = async () => {
			const quote = await randomQuote();
			setQuote(quote);
		};
		fetchQuote();
	}, []);

	useEffect(() => {
		setWordIdx(0);
		setText("");
	}, [quotesSplit]);

	return (
		<div className="px-20">
			<h1 className="mb-4">TYPERACER</h1>
			<p className="font-mono">
				<span className="text-black">{quote?.text}</span>
			</p>
			<input
				className="w-full border-black border px-4 py-2"
				onChange={(text) => setText(text.target.value)}
				value={text}
			></input>
		</div>
	);
}
