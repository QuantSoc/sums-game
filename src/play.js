import readline from 'readline';
import { generateRound } from './game.js';

async function gameLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = (query) =>
    new Promise(resolve => rl.question(query, answer => resolve(answer)));

  let difficulty    = 1;
  let roundCount    = 0;
  let correctCount  = 0;
  let lives         = 3;

  console.log('Welcome to QuantSoc Expression Challenge!');
  console.log('----------------------------------------');
  console.log(`You have ${lives} lives. Get 3 wrong and it’s game over!\n`);

  // continue until out of lives or user quits
  while (lives > 0) {
    roundCount += 1;
    console.log(`--- Round ${roundCount} (Difficulty: ${difficulty}) ---`);

    const { target, isBlue, expressions, correctIndex } =
      generateRound(difficulty);

    console.log(`Round color : ${isBlue ? 'BLUE (pick the one equal)' : 'RED (pick the one NOT equal)'}`);
    console.log('');

    expressions.forEach((terms, idx) => {
      const expr = terms
        .map((t, i) =>
          i === 0
            ? `${t}`
            : t >= 0
              ? ` + ${t}`
              : ` - ${Math.abs(t)}`
        )
        .join('');
      console.log(`  [${idx}] ${expr}`);
    });

    const answer = await ask('\nYour choice (0–5), or Q to quit: ');
    if (answer.trim().toLowerCase() === 'q') {
      console.log('\nThanks for playing!');
      break;
    }

    const choice = parseInt(answer);
    if (Number.isNaN(choice) || choice < 0 || choice > 5) {
      console.log('Invalid choice – please enter a number between 0 and 5.');
      roundCount -= 1;
      continue;
    }

    if (choice === correctIndex) {
      console.log('✅ Correct!');
      correctCount += 1;
      difficulty = Math.min(100, difficulty + 1);
    } else {
      lives -= 1;
      console.log(`❌ Wrong! Lives remaining: ${lives}`);
      if (lives === 0) {
        console.log('\n💥 Game Over 💥');
        break;
      }
    }

    console.log(`Score: ${correctCount} / ${roundCount}`);
    console.log('');
  }

  console.log(`\nFinal Score: ${correctCount}`);
  rl.close();
}

// auto-start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  gameLoop();
}

export { gameLoop };
