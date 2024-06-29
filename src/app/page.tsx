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
	const quotesSplit = useMemo(() => quote?.text?.split(" ") ?? [], [quote]);
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

	useEffect(() => {
		setCurrentWord(quotesSplit[wordIdx]);
	}, [wordIdx, quotesSplit]);

	// Use effect to evaluate user input
	useEffect(() => {
		const latestLetter = text?.charAt(text.length - 1);
		if (latestLetter != " " && wordIdx != quotesSplit.length - 1) return;
		const textWithoutTrailingSpace = quote?.text.replace(/\s*$/, "");
		if (textWithoutTrailingSpace == currentWord) {
			setText("");
			setWordIdx(() => wordIdx + 1);
		}
	}, [text, currentWord, wordIdx, quotesSplit]);

	// Quote Reset
	useEffect(() => {
		if (wordIdx == quotesSplit.length) {
			setQuote(randomQuote());
		}
	}, [wordIdx, quotesSplit]);

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
