const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 15;
const MONSTER_ATTACK_VALUE = 18;
const HEAL_VALUE = 12;

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const takenDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= takenDamage;

    if(currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be DEAD! But bonus life SAVED you!");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0)
    {
        alert("You win!");
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0)
    {
        alert("You lost!");
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ) {
        alert("It is a draw!");
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0 ) {
        reset();
    }
}

function attackMonster(mode) {
    let maxDamage;
    if(mode === 'ATTACK') {
        maxDamage = ATTACK_VALUE;
    } else if(mode === 'STRONG_ATTACK') {
        maxDamage = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    endRound();
}

function attackHandler() {
    attackMonster('ATTACK');
}

function strongAttackHandler() {
    attackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife-HEAL_VALUE) {
        alert("You cant heal more than your max life");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    endRound();
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);

