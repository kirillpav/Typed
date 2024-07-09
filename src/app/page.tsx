"use client";
import quotes from "../json/quotes.json";
import { useState, useEffect, useMemo } from "react";
import classNames from "classnames";
import styles from "../styles/Home.module.css";

type Word = {
	word: string;
};

export default function Home() {
	const [words, setWords] = useState([]);
	const [text, setText] = useState<string>("");
	const [activeButton, setActiveButton] = useState<number>();
	const [currentWord, setCurrentWord] = useState<string>();
	const textSplit = useMemo(() => words.join(" ").split(" ") ?? [], [words]);
	const [wordIdx, setWordIdx] = useState<number>(0);

	const [score, setScore] = useState<number>(0);

	const [userSetLength, setUserSetLength] = useState<number>(20);

	const fetchRandomWord = (length: number) => {
		return fetch(`https://random-word-api.herokuapp.com/word?number=${length}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network resposne not ok");
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				setWords(data);
				return data;
			})
			.catch((error) => console.error(error));
	};

	const handleButtonClick = (length: number) => {
		setUserSetLength(length);
		setActiveButton(length);
		fetchRandomWord(length).then((fetchedWords) => {
			setWords(fetchedWords);
		});
	};

	useEffect(() => {
		fetchRandomWord(10);
	}, []);

	useEffect(() => {
		setWordIdx(0);
		setText("");
	}, [textSplit]);

	useEffect(() => {
		setCurrentWord(textSplit[wordIdx]);
	}, [wordIdx, textSplit]);

	// Use effect to evaluate user input
	useEffect(() => {
		const latestLetter = text?.charAt(text.length - 1);
		if (latestLetter != " " && wordIdx != textSplit.length - 1) return;
		const textWithoutTrailingSpace = text?.trim();
		if (textWithoutTrailingSpace === currentWord) {
			console.log(`Current Word: ${currentWord}`);

			setText("");
			setWordIdx(() => wordIdx + 1);
			setScore(() => score + 1);
		}
	}, [text, currentWord, wordIdx, textSplit]);

	// Quote reset
	// useEffect(() => {
	// 	setWords(fetchRandomWord(20));
	// }, []);

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
			<p>
				Your score is {score} out of {words.length}
			</p>
			<div className="bg-gray-100">
				<p className="font-mono">
					{textSplit.map((word, idx) => (
						<span
							key={idx}
							className={classNames({
								[styles.currentWord]: idx === wordIdx,
								[styles.otherWords]: idx !== wordIdx,
							})}
						>
							{word}{" "}
						</span>
					))}
				</p>
				<input
					className="w-full border-black border px-4 py-2"
					onChange={(text) => setText(text.target.value)}
					value={text}
				></input>
			</div>
		</div>
	);
}
