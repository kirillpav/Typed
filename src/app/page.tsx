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
	const [correctWords, setCorrectWords] = useState<Array<boolean | null>>(
		Array(20).fill(null)
	);
	const [topScore, setTopScore] = useState<number>(0);

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
			setCorrectWords(Array(length).fill(null));
			setScore(0);
			setWordIdx(0);
			setText("");
		});
	};

	const handleTryAgain = () => {
		setCorrectWords(Array(length).fill(null));
		fetchRandomWord(userSetLength);
		setScore(0);
		setWordIdx(0);
		setText("");
	};

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
			setScore(score + 1);
			setCorrectWords((prev) => {
				const newCorrectWords = [...prev];
				newCorrectWords[wordIdx] = true;
				return newCorrectWords;
			});
		} else {
			setCorrectWords((prev) => {
				setText("");
				setWordIdx(() => wordIdx + 1);
				const newCorrectWords = [...prev];
				newCorrectWords[wordIdx] = false;
				return newCorrectWords;
			});
		}
	}, [text, currentWord, wordIdx, textSplit]);

	useEffect(() => {
		if (wordIdx > words.length) {
		}
	});

	return (
		<div className="px-20">
			<h1 className={styles.title}>TYPERACER</h1>
			{/* <p>Top Score: {topScore}</p> */}
			<div className={styles.container}>
				<div className={styles.settingsContainer}>
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
				</div>
				<div className={styles.wordsContainer}>
					<p className={styles.mainText}>
						{textSplit.map((word, idx) => (
							<>
								<span
									key={idx}
									className={classNames({
										[styles.currentWord]: idx === wordIdx,
										[styles.correctWord]: correctWords[idx] === true,
										[styles.wrongWord]: correctWords[idx] === false,
									})}
								>
									{word}
								</span>
								<span> </span>
							</>
						))}
					</p>
					<div className={styles.inputContainer}>
						<input
							className={styles.input}
							onChange={(text) => setText(text.target.value)}
							value={text}
						></input>
						<button onClick={handleTryAgain} className={styles.btn}>
							Try Again
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
