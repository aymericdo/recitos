<template>
  <div class="reyka">
    <div class="col -big">
      <textarea name="zone" v-model="value" v-on:keyup="valueChanged($event)"></textarea>
    </div>
    <div class="col" v-if="sliderColor">
      <div class="loading-bar" :style="{ 'background-color': sliderColor[1], width: (100 * countdown / waitingTime) + '%' }"></div>
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
      <button v-on:click="pause()">{{ onPause ? 'Play' : 'Pause' }}</button>
    </div>
  </div>
</template>

<script>
import RoundSlider from 'vue-round-slider';
import { addCapitalize } from '../service/capitalize.js';

const INIT_WAITING_TIME = 5;

export default {
  name: 'HelloWorld',
  components: {
    RoundSlider,
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
  data: function () {
    return {
      value: '',
      waitingTime: INIT_WAITING_TIME,
      countdownId: null,
      history: [],
      onPause: false,
      sliderColor: null,
      countdown: INIT_WAITING_TIME,
    }
  },
  methods: {
    sliderChanged() {
      clearInterval(this.countdownId);
      this.valueChanged({ target: { value: this.value } });
    },
    valueChanged(event) {
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
    pause() {
      this.onPause = !this.onPause;
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

  .loading-bar {
    height: 2rem;
    background-color: red;
    transition: width 1s linear;
    margin-bottom: 1rem;
    border-radius: 4px;
    max-width: 100%;
  }

  .col {
    flex: 1;
    padding: 1em;
  }

  .col.-big {
    flex: 9;
  }
</style>
