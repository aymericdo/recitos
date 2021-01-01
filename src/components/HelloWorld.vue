<template>
  <div class="reyka">
    <div class="col -big">
      <textarea name="zone" v-model="value" v-on:keyup="valueChanged($event)"></textarea>
    </div>
    <div class="col" v-if="sliderColor">
      <round-slider
        v-model="tempo"
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
      tempo: 5,
      intervalId: null,
      history: [],
      onPause: false,
      sliderColor: null,
    }
  },
  methods: {
    sliderChanged() {
      clearInterval(this.intervalId);
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

      const startInterval = (_interval) => {
        clearInterval(this.intervalId);

        // Store the id of the interval so we can clear it later
        this.intervalId = setInterval(() => {
          if (!this.onPause) {
            this.value = this.value.slice(0, -1);
            startInterval(1000);
          }
        }, _interval);
      }

      startInterval(this.tempo * 1000);
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

  .col {
    flex: 1;
    padding: 1em;
  }

  .col.-big {
    flex: 9;
  }
</style>
