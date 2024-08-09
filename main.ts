#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import fetch from "node-fetch";

const apiLink: string =
  "https://opentdb.com/api.php?amount=5&category=18&type=multiple";

// Function to shuffle the answers array
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchData(data: string) {
  let fetchQuiz: any = await fetch(data);
  let res = await fetchQuiz.json();
  return res.results;
}

let data = await fetchData(apiLink);

async function startQuiz() {
  let score: number = 0;

  for (let i = 0; i < 5; i++) {
    let answers = [...data[i].incorrect_answers, data[i].correct_answer];
    answers = shuffle(answers); // Shuffle the answers array

    let question = await inquirer.prompt([
      {
        name: "user",
        type: "list",
        message: chalk.bold.italic.blue(`${data[i].question}`),
        choices: answers.map((val: any) => val),
      },
    ]);

    if (question.user == data[i].correct_answer) {
      ++score;
      console.log(chalk.bold.green.italic(`Correct Answer`));
    } else {
      console.log(chalk.bold.red.italic(`Wrong Answer`));
      console.log(
        chalk.bold.italic.yellow(`Correct Answer is ${data[i].correct_answer}`)
      );
    }
  }
  console.log(`Your score: ${score}`);
}

startQuiz();
