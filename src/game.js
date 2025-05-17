import { randomInt } from './utils.js'

function getDepthFromDifficulty(difficulty) {
    if (difficulty < 25) return 1    // 2 terms
    if (difficulty < 50) return 2    // 3 terms
    return 3                         // 4 terms
  }


function createCorrectTerms(correctNumber, difficulty, depth) {
    if (depth === 0) {
        return [correctNumber];
    }

    let number1;

    if (difficulty === 100) {
        number1 = randomInt(-100, 100);
    } else if (difficulty > 75) {
        number1 = randomInt(1, correctNumber - 1);
    } else if (difficulty > 50) {
        number1 = randomInt(1, correctNumber - 1);
    } else if (difficulty > 25) {
        number1 = randomInt(1, correctNumber - 1);
    } else if (difficulty > 10) {
        number1 = randomInt(1, correctNumber - 1);
    } else {
        number1 = randomInt(1, correctNumber - 1);
    }

  const number2 = correctNumber - number1;

  const rest = createCorrectTerms(number2, difficulty, depth - 1);

  return [number1, ...rest];
}

/**
 * Generate a “wrong” expression by offsetting the true total by a random error.
 * Error‐margin % ↘ from 100% at difficulty=1 to 10% at difficulty=100.
 *
 * @param {number} correctNumber – the true target sum
 * @param {number} difficulty    – integer 1…100
 * @param {number} depth         – how many splits to make (as in createCorrectTerms)
 * @returns {number[]} an array of terms summing to something near correctNumber
 */
function createIncorrectTerms(correctNumber, difficulty, depth) {
    const absTarget = Math.abs(correctNumber);
  
    // marginPct: 100% when difficulty=1; 10% when difficulty=100
    const marginPct = 10 + ((100 - difficulty) * 90) / 99;
  
    // ensure we always have at least a ±1 margin
    const errorMargin = Math.max(
      1,
      Math.floor(absTarget * marginPct / 100)
    );
  
    // pick an offset in [ -errorMargin .. +errorMargin ]
    const offset = randomInt(-errorMargin, errorMargin);
  
    // now build a correct‐terms list for the “wrong” total
    return createCorrectTerms(correctNumber + offset, difficulty, depth);
  }

/**
 * Generate a random target number whose range depends on the given difficulty.
 *
 * Difficulty tiers and corresponding bounds:
 * 1–5     → positive only, small range [1, 10]
 * 6–10    → introduce small negatives, range [-10, 20]
 * 11–24   → mixed signs, still small range [-20, 50]
 * 25–49   → medium difficulty, range [-100, 100]
 * 50–84   → hard difficulty, range [-150, 150]
 * 85–100  → linear ramp:
 *            • at 85 → range [-50, 150]
 *            • at 100 → range [-200, 200]
 *
 * @param {number} difficulty - Integer from 1 to 100 indicating difficulty level.
 * @returns {number} A random integer between the computed lowerBound and upperBound.
 */
function createNumberFromDifficulty(difficulty) {
  let lowerBound, upperBound;

  if (difficulty >= 85) {
    // Linear ramp over [85…100]:
    //   d=85 → [-50, 150]
    //   d=100 → [-200, 200]
    const t = Math.max(0, Math.min(1, (difficulty - 85) / 15));
    lowerBound = Math.round(-50  + t * (-200 - (-50)));
    upperBound = Math.round(150  + t * ( 200 - 150));
  }
  else if (difficulty >= 50) {
    // Hard difficulty
    lowerBound = -150;
    upperBound =  150;
  }
  else if (difficulty >= 25) {
    // Medium difficulty
    lowerBound = -100;
    upperBound =  100;
  }
  else if (difficulty >= 11) {
    // Mixed small range
    lowerBound = -20;
    upperBound =  50;
  }
  else if (difficulty >= 6) {
    // Introduce small negatives
    lowerBound = -10;
    upperBound =  20;
  }
  else {
    // Easy: positive only
    lowerBound =   1;
    upperBound =  10;
  }

  return randomInt(lowerBound, upperBound);
}

export function generateRound(difficulty) {
    const target = createNumberFromDifficulty(difficulty);
    const depth = getDepthFromDifficulty(difficulty)

    const isBlue = Math.random() < 0.3;
    const expressions = [];
    let correctIndex = randomInt(0,5);

    if (isBlue) {
        // one correct, 5 wrong
        for (let i = 0; i < 6; i++) {
            expressions.push(i === correctIndex ? createCorrectTerms(target, difficulty, depth) : createIncorrectTerms(target, difficulty, depth))
        }
    } else {
        // five correct, 1 wrong
        for (let i = 0; i < 6; i++) {
            expressions.push(i === correctIndex ? createIncorrectTerms(target, difficulty, depth) : createCorrectTerms(target, difficulty, depth))
        }        
    }

    // correct index stores the position in the expressions array
    // for which object should be picked.
    return { target, isBlue, expressions, correctIndex}
}