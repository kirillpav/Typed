"use client";
import quotes from "../json/quotes.json";
import { useState, useEffect, useMemo } from "react";

type Word = {
	word: string;
};

const randomQuote = (): Word => {
	// return quotes[Math.floor(quotes.length * Math.random())];

	useEffect(() => {
		fetch(
			"https://api.api-ninjas.com/v1/randomword".then(
				(response) => response.json
			)
		);
	});
};

export default function Home() {
	const [quote, setQuote] = useState<Quote>();
	const [text, setText] = useState<string>("");
	const [currentWord, setCurrentWord] = useState<string>();
	const quotesSplit = useMemo(() => quote?.quote.split(" ") ?? [], [quote]);
	const [wordIdx, setWordIdx] = useState<number>(0);
	const [userSetLength, setUserSetLength] = useState<number>(20);

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
		const textWithoutTrailingSpace = text?.replace(/\s*$/, "");
		if (textWithoutTrailingSpace == currentWord) {
			console.log(text);
			setText("");
			setWordIdx(() => wordIdx + 1);
		}
	}, [text, currentWord, wordIdx, quotesSplit]);

	// Quote reset
	useEffect(() => {
		if (wordIdx == quotesSplit.length) {
			setQuote(randomQuote());
		}
	}, [wordIdx, quotesSplit]);

	return (
		<div className="px-20">
			<h1 className="mb-4">TYPERACER</h1>
			<div className="flex justify-between">
				<p className="font-mono">
					<span className="text-black">{quote?.quote}</span>
				</p>
				<div>
					<button>15</button>
					<span>/</span>
					<button>20</button>
					<span>/</span>
					<button>25</button>
					<span>/</span>
					<button>50</button>
				</div>
			</div>
			<input
				className="w-full border-black border px-4 py-2"
				onChange={(text) => setText(text.target.value)}
				value={text}
			></input>
		</div>
	);
}
