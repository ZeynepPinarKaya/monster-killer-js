const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 15;
const MONSTER_ATTACK_VALUE = 18;
const HEAL_VALUE = 12;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt("Maximum life for you and the monster.", "100");

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
    }
    if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';
    }
    else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry.target = 'MONSTER';
    }
    else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry.target = 'PLAYER';
    }
    else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry.target = 'PLAYER';
    }
    battleLog.push(logEntry);
}

function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
    hasBonusLife = true;
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const takenDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= takenDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, takenDamage, currentMonsterHealth, currentPlayerHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be DEAD! But bonus life SAVED you!");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("You won!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("You lost!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert("It is a draw!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        );
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    let maxDamage;
    let logEvent;
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You cant heal more than your max life");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function printLogHandler() {
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);

