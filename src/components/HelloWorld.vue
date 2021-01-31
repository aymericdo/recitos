<template>
  <div v-if="sliderColor" class="reyka">
    <div class="col -big">
      <textarea
        name="zone"
        :style="textareaStyles"
        v-model="value"
        @focus="textareaFocused = true"
        @blur="textareaFocused = false"
        @keyup="valueChanged($event)"></textarea>
    </div>
    <div class="col -option">
      <div class="loading-bar" :style="loadingBarStyles"></div>
      <round-slider
        v-model="waitingTime"
        :change="sliderChanged"
        start-angle="315"
        end-angle="+270"
        line-cap="round"
        max="45"
        min="1"
        :pathColor="sliderColor[0]"
        :rangeColor="sliderColor[1]"
        :tooltipColor="sliderColor[1]"
      />
      <div class="pause-button" @click="togglePause()">
        <transition name="fade">
          <PlayButton class="svg" v-if="onPause" :color="sliderColor[1]" />
          <PauseButton class="svg" v-else :color="sliderColor[0]" />
        </transition>
      </div>
      <div class="cpt">
        <span class="chars-cpt">{{value.length}} signe{{value.length > 1 ? 's' : '' }}</span>
        <span class="words-cpt">{{value.split(' ').filter(Boolean).length}} mot{{value.split(' ').filter(Boolean).length > 1 ? 's' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import RoundSlider from 'vue-round-slider';
import { addCapitalize } from '../service/capitalize.js';
import PlayButton from './svg/PlayButton.vue';
import PauseButton from './svg/PauseButton.vue';

const INIT_WAITING_TIME = 15;

export default {
  name: 'HelloWorld',
  components: {
    RoundSlider,
    PlayButton,
    PauseButton,
  },
  mounted: function() {
    const sliderColors = [
      ['#38ada9', '#fa983a'],
      ['#8e44ad', '#f1c40f'],
      ['#c8d6e5', '#2e86de'],
      ['#6D214F', '#FD7272'],
      ['#218c74', '#33d9b2'],
      ['#9980FA', '#009432'],
    ];
    const rand = Math.floor(Math.random() * Math.floor(sliderColors.length));
    this.sliderColor = sliderColors[rand];
  },
  created: function() {
    window.addEventListener('keydown', this.cmdPListener);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('beforeunload', this.beforeunload);
  },
  destroyed: function() {
    window.removeEventListener('keydown', this.cmdPListener);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('beforeunload', this.beforeunload);
  },
  data: function () {
    return {
      value: '',
      waitingTime: INIT_WAITING_TIME,
      countdownId: null,
      history: [],
      onPause: false,
      sliderColor: null,
      countdown: INIT_WAITING_TIME,
      textareaFocused: false,
    }
  },
  computed: {
    textareaStyles() {
      if (!this.textareaFocused) return {}
      return {
        "box-shadow": `0 0 10px ${this.sliderColor[1]}`,
        border: `2px solid ${this.sliderColor[0]}`
      };
    },
    loadingBarStyles() {
      return {
        'background-color': this.sliderColor[1],
        width: (100 * this.countdown / this.waitingTime) + '%',
      };
    }
  },
  methods: {
    onBlur() {
      if (this.value.length) {
        this.pause();
      }
    },
    beforeunload(event) {
      const confirmationMessage = 'Certain·e ?';
      (event || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    },
    cmdPListener(event) {
      if (event.metaKey && event.code === "KeyP") {
        this.togglePause();
        event.preventDefault();
        return false;
      }
    },
    sliderChanged() {
      clearInterval(this.countdownId);
      this.valueChanged({ target: { value: this.value } });
    },
    valueChanged(event) {
      if (event.code === 'MetaLeft') return;

      const value = event.target.value;

      if (event.code === 'Space') {
        this.value = addCapitalize(value, event)
      }

      if (this.history[this.history.length - 1] !== this.value) {
        this.history.push(this.value);
      }

      this.countdown = this.waitingTime;
      clearInterval(this.countdownId);
      this.countdownId = setInterval(() => {
        if (!this.onPause && this.value.length) {
          if (this.countdown > 0) {
            this.countdown -= 1;
          } else {
            this.value = this.value.slice(0, -1);
          }
        }
      }, 1000);
    },
    togglePause() {
      this.onPause = !this.onPause;
    },
    pause() {
      this.onPause = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .reyka {
    display: flex;
    height: 100%;
  }

  textarea {
    resize: none;
    width: 100%;
    height: 100%;
    padding: 1rem;
    box-sizing: border-box;
    font-size: 16px;
    font-family: Georgia, 'Times New Roman', Times, serif;
  }

  textarea:focus {
    outline: none !important;
  }

  .loading-bar {
    height: 2rem;
    transition: width 1s linear;
    border-radius: 4px;
    max-width: 100%;
  }

  .pause-button {
    cursor: pointer;
    width: 4rem;
    height: 4rem;
    align-self: center;
    position: relative;
  }

  .pause-button .svg {
    position: absolute;
    top: 0;
    left: 0;
  }

  .col {
    flex: 1;
    padding: 1em;
  }

  .cpt {
    display: flex;
    flex-direction: column;
  }

  .col.-option {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .col.-option > * {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .col.-big {
    flex: 9;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
