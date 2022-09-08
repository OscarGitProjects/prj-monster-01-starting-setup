function getRandomValue(min, max) {
  // Math.floor(Math.random() * (MAX - MIN)) + MIN;
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRoundNumber: 0,
      winner: -1,
      logMessages: [],
    };
  },
  computed: {
    monsterHealthBarStyle() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }

      return { width: this.monsterHealth + "%" };
    },
    playerHealthBarStyle() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }

      return { width: this.playerHealth + "%" };
    },
    isSpecialAttackButtonDisabled() {
      return this.currentRoundNumber % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = 0;
      } else if (value <= 0) {
        // Spelaren förlorar
        this.winner = 1;
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 0;
      } else if (value <= 0) {
        // Monster förlorar
        this.winner = 2;
      }
    },
  },
  methods: {
    /***** Button handlers *****/
    onClickAttackButtonHandler() {
      this.currentRoundNumber++;

      this.attackMonster();
      this.attackPlayer();
    },
    onClickSpecialAttackButtonHandler() {
      this.specialAttackMonster();
      this.attackPlayer();
    },
    onClickHealButtonHandler() {
      this.currentRoundNumber++;

      this.healPlayer();
      this.attackPlayer();
    },
    onClickSurrenderButtonHandler() {
      this.surrender();
    },
    onClickNewGameButtonHandler() {
      this.startGame();
    },
    /***** functions *****/
    attackMonster() {
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addMessageToLog("player", "attack", attackValue);
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addMessageToLog("monster", "attack", attackValue);
    },
    specialAttackMonster() {
      this.currentRoundNumber++;

      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addMessageToLog("player", "special attack", attackValue);
    },
    healPlayer() {
      const healValue = getRandomValue(8, 20);

      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }

      this.addMessageToLog("player", "heal", healValue);
    },
    surrender() {
      this.winner = 1;
      this.addMessageToLog("player", "surrender", 0);
    },
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRoundNumber = 0;
      this.winner = -1;
      this.logMessages = [];
    },
    addMessageToLog(sender, message, value) {
      // Add message to the beginning of the array
      this.logMessages.unshift({
        actionBy: sender,
        actionType: message,
        actionValue: value,
      });
    },
    firstToUpperCase(text) {
      let firstCharUpperCase = text.charAt(0).toUpperCase();
      return firstCharUpperCase + text.slice(1);
    },
    actorClass(actor) {
      if (actor === "player") {
        return { "log--player": true };
      } else {
        return { "log--monster": true };
      }
    },
  },
});

app.mount("#game");
