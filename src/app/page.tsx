"use client";
import quotes from "../json/quotes.json";
import { useState, useEffect, useMemo } from "react";

type Word = {
	word: string;
};

export default function Home() {
	const [words, setWords] = useState([]);
	const [text, setText] = useState<string>("");
	const [currentWord, setCurrentWord] = useState<string>();
	// const quotesSplit = useMemo(() => quote?.quote.split(" ") ?? [], [quote]);
	const [wordIdx, setWordIdx] = useState<number>(0);

	const [userSetLength, setUserSetLength] = useState<number>(20);

	const fetchRandomWord = (length: number) => {
		// return quotes[Math.floor(quotes.length * Math.random())];
		return fetch(`https://random-word-api.herokuapp.com/word?number=${length}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network resposne not ok");
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				return data;
			})
			.catch((error) => console.error(error));
	};

	const handleButtonClick = (length: number) => {
		setUserSetLength(length);
		fetchRandomWord(length).then((fetchedWords) => {
			setWords(fetchedWords);
		});
	};

	// useEffect(() => {
	// 	fetchRandomWord();
	// }, []);

	// useEffect(() => {
	// 	setWordIdx(0);
	// 	setText("");
	// }, [quotesSplit]);

	// useEffect(() => {
	// 	setCurrentWord(quotesSplit[wordIdx]);
	// }, [wordIdx, quotesSplit]);

	// Use effect to evaluate user input
	// useEffect(() => {
	// 	const latestLetter = text?.charAt(text.length - 1);
	// 	if (latestLetter != " " && wordIdx != quotesSplit.length - 1) return;
	// 	const textWithoutTrailingSpace = text?.replace(/\s*$/, "");
	// 	if (textWithoutTrailingSpace == currentWord) {
	// 		console.log(text);
	// 		setText("");
	// 		setWordIdx(() => wordIdx + 1);
	// 	}
	// }, [text, currentWord, wordIdx, quotesSplit]);

	// Quote reset
	// useEffect(() => {
	// 	setQuote(fetchRandomWord());
	// }, []);

	// User Set Length Updates
	useEffect(() => {});

	return (
		<div className="px-20">
			<h1 className="mb-4">TYPERACER</h1>
			<div>
				<button onClick={() => handleButtonClick(15)}>15</button>
				<span>/</span>
				<button onClick={() => handleButtonClick(20)}>20</button>
				<span>/</span>
				<button onClick={() => handleButtonClick(25)}>25</button>
				<span>/</span>
				<button onClick={() => handleButtonClick(50)}>50</button>
			</div>
			<div className="bg-gray-100">
				<p className="font-mono">{words.join(" ")}</p>
				<input
					className="w-full border-black border px-4 py-2"
					// onChange={(text) => setText(text.target.value)}
					// value={text}
				></input>
			</div>
		</div>
	);
}
