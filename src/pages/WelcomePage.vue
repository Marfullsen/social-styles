<template>
  <div>
    <section>
      <article class="welcomePage mx-6" v-if="welcomeScreen">
        <section v-if="!resultsScreen">
          <h1 class="mb-0">Know your Social Style!</h1>
          <p class="message mt-1 fsize-large">
            Analytical - Expressive - Driver - Amiable
          </p>
          <i class="large material-icons">fingerprint</i>
        </section>
        <section v-else>
          <h1 class="mb-0">You are {{ playerStyle }}!</h1>
          <h5>{{ estilos[playerStyle].brief }}</h5>
          <mapa-cartesiano
            :assertividad="-asertividad"
            :emotividad="-emotividad"
          />
          <p class="badge inline m-23px message mt-1 large-font">
            Assertiveness: {{ -playerAnswers.a + playerAnswers.b }}
          </p>
          <p class="badge inline message mt-1 large-font">
            Responsiveness: {{ -playerAnswers.c + playerAnswers.d }}
          </p>
          <p class="message negrita xx-large-font">
            {{ estilos[playerStyle].the_most }}
          </p>
          <p class="message large-font">
            {{ estilos[playerStyle].desc }}
          </p>
          <p class="message negrita xx-large-font bold">
            {{ estilos[playerStyle].tends_to }}
          </p>
          <p class="message large-font">
            {{ estilos[playerStyle].under_pressure }}
          </p>
          <p class="message negrita xx-large-font bold">
            Things to improve:
          </p>
          <p
            v-for="a_mejorar in estilos[playerStyle].should_work_on"
            :key="a_mejorar"
            class="flex message large-font"
          >
            ⫸ {{ a_mejorar }}
          </p>
          <p class="message negrita xx-large-font bold">
            Time used: {{ tiempo_tomado }}
          </p>
          <p class="message mt-1 fsize-large">Try again!</p>
        </section>
        <!-- <p class="message">
          ¡En tal sólo 5 minutos podrás saber a cuál estilo perteneces!
        </p> -->
        <form class="questions-form" @submit.prevent="startTest">
          <h4 class="mb-0" for="name">Name:</h4>
          <input
            v-model="nombre_jugador"
            id="name"
            name="name"
            type="text"
            placeholder="Charles Bukowski"
            required
            autocomplete="off"
            autofocus
          />
          <!-- <input type="text" placeholder="perez@fulatinos.cl" /> -->
          <button
            class="btn waves-effect waves-light light-blue darken-1"
            type="submit"
            name="action"
          >
            Let's start!
            <i class="material-icons right">send</i>
          </button>
          <div class="mt-1">
            <div class="sharethis-inline-share-buttons"></div>
          </div>
          <div>
            <small
              >* When pressing -Let's Start- you accept the
              <span
                class="underlined"
                title="We might take the name and score for statistics purposes."
              >
                privacy policy.
              </span>
            </small>
          </div>
        </form>
      </article>
      <article v-else>
        <h3>
          {{ question.title }}
        </h3>
        <form>
          <p class="mt-50">
            <label>
              <input
                name="answer"
                type="radio"
                required
                @click="submitAnswer"
              />
              <span class="x-large">{{ question.answer_a }}</span>
            </label>
          </p>
          <p class="mt-50 mb-50">
            <label>
              <input name="answer" type="radio" @click="submitAnswer" />
              <span class="x-large">{{ question.answer_b }}</span>
            </label>
          </p>
        </form>
      </article>
    </section>
  </div>
</template>

<script>
import preguntas from "../assets/preguntas.json";
import estilos from "../assets/estilos.json";
import MapaCartesiano from "../components/MapaCartesiano.vue";

export default {
  name: "WelcomePage",
  setup() {
    const amountQuestions = Object.keys(preguntas).length;
    return {
      amountQuestions,
    };
  },
  components: { MapaCartesiano },
  data() {
    return {
      nombre_jugador: "",
      fecha_inicio: "",
      tiempo_tomado: "",
      token: this.$token,
      puntajes: {},
      canvas: null,
      welcomeScreen: true,
      resultsScreen: false,
      id_question: "1",
      question: {
        title: preguntas["1"]["title"],
        answer_a: preguntas["1"]["a"],
        answer_b: preguntas["1"]["b"],
        answer_c: "No sé",
      },
      playerAnswers: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      },
      playerStyle: "todo",
      asertividad: 0,
      emotividad: 0,
      estilos: estilos,
    };
  },
  methods: {
    startTest() {
      this.fecha_inicio = new Date();
      this.welcomeScreen = false;
      this.playerAnswers = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      };

      // Enfoque al input para permitir usar las flechas del teclado.
      // setTimeout(() => document.getElementsByName("answer")[0].focus(), 100);
    },
    submitAnswer() {
      // Primer y segundo radio button.
      const a_c = document.getElementsByName("answer")[0];
      const b_d = document.getElementsByName("answer")[1];

      // Determinamos si es A) B) C) D).
      this.id_question % 2
        ? a_c.checked
          ? this.playerAnswers.a++
          : this.playerAnswers.b++
        : b_d.checked
        ? this.playerAnswers.d++
        : this.playerAnswers.c++;

      // Reseteamos los rdio button.
      a_c.checked = false;
      b_d.checked = false;

      // Siguiente pregunta ó fin del test.
      this.id_question < this.amountQuestions
        ? this.id_question++
        : this.results();

      // Se actualizan los datos de la plantilla según la pregunta.
      this.question.title = preguntas[this.id_question]["title"];
      this.question.answer_a = preguntas[this.id_question]["a"];
      this.question.answer_b = preguntas[this.id_question]["b"];
    },
    calcularDuracionTest(fecha_inicio, fecha_termino) {
      let diff = fecha_inicio.getTime() - fecha_termino.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);

      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * (1000 * 60);

      const seconds = Math.floor(diff / 1000);
      diff -= seconds * 1000;

      const singularOrPlural = (amount, noun) => {
        if (amount < 2) return `${amount} ${noun}`;
        return `${amount} ${noun}s`;
      };

      const tiempos = [];
      if (days) tiempos.push(singularOrPlural(days, "day"));
      if (hours) tiempos.push(singularOrPlural(hours, "hour"));
      if (mins) tiempos.push(singularOrPlural(mins, "minute"));
      if (seconds) tiempos.push(singularOrPlural(seconds, "second"));

      let res = tiempos.join(", ") + ".";

      String.prototype.replaceAt = function (i, j, str) {
        return this.substr(0, i) + str + this.substr(j, this.length);
      };

      const lastIndex = res.lastIndexOf(",");
      res =
        lastIndex != -1 ? res.replaceAt(lastIndex, lastIndex + 1, " y") : res;

      return res;
    },
    results() {
      let fecha_termino = new Date();
      this.tiempo_tomado = this.calcularDuracionTest(
        fecha_termino,
        this.fecha_inicio
      );
      this.welcomeScreen = true;
      this.id_question = "1";
      this.resultsScreen = true;
      this.asertividad = this.playerAnswers.b - this.playerAnswers.a;
      this.emotividad = this.playerAnswers.d - this.playerAnswers.c;
      this.playerStyle = this.determinarEstilo(
        this.asertividad,
        this.emotividad
      );
      this.sendScore();
    },
    determinarEstilo(asertividad, emotividad) {
      let playerStyle = "";
      asertividad > 0
        ? emotividad > 0
          ? (playerStyle = "expressive")
          : (playerStyle = "driver")
        : emotividad > 0
        ? (playerStyle = "amiable")
        : (playerStyle = "analytical");
      return playerStyle;
    },
    getToken() {
      fetch(
        "https://proto-api2.herokuapp.com/api-token-auth/"
        //"http://127.0.0.1:8000/api-token-auth/"
      )
        .then((response) => response.json())
        .then((data) => {
          this.token = data.key;
        })
        .catch(() => this.token = "_");
    },
    sendScore() {
      const url = "https://proto-api2.herokuapp.com/api/paciente/nuevo/";
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          nombre: this.nombre_jugador,
          asertividad: this.asertividad,
          emotividad: this.emotividad,
          token: this.token.slice(0, 25),
        }),
      };
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
        })
        .catch((error) => {
          // Versión interna (local) en caso de fallar la conexión a internet.

          // Lee los puntajes del navegador.
          const puntajes_raw = localStorage.getItem("puntajes");
          const fecha_exacta = new Date().toISOString()
          let puntajes = []
          let count = 0

          // si hay algo, se parsea y se toma el último ID, que es el primer elemento.
          // sino, se crea un nuevo array de puntajesm y el ID será cero.
          if (puntajes_raw != null) {
            puntajes = JSON.parse(puntajes_raw)
            count = puntajes[0].id + 1
          }

          puntajes = [
            {
              id: count,
              fecha_tested: fecha_exacta,
              nombre: this.nombre_jugador,
              asertividad: this.asertividad,
              emotividad: this.emotividad
            },
            ...puntajes
          ]
          let puntajes_str = JSON.stringify(puntajes)
          localStorage.setItem("puntajes", puntajes_str);
        });
    },
  },
  mounted() {
    document.getElementById("name").focus();
    this.getToken();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Open+Sans&display=swap");

input[type="text"]:not(.browser-default):focus:not([readonly]) {
  border-bottom: 1px solid rgb(6, 177, 245);
  box-shadow: 0 1px 0 0 rgb(6, 177, 245);
}

[type="radio"]:checked + span:after,
[type="radio"].with-gap:checked + span:after {
  background-color: rgb(6, 177, 245);
}

[type="radio"]:checked + span:after,
[type="radio"].with-gap:checked + span:before,
[type="radio"].with-gap:checked + span:after {
  border: 2px solid rgb(6, 177, 245);
}

label {
  color: black;
}

.inline {
  display: inline;
}

.badge {
  border-radius: 25px;
  padding: 7px;
  color: white;
  background: deepskyblue;
  padding-inline: 20px;
}

.m-23px {
  margin-left: 23px;
}

.large-font {
  font-size: large;
}

.x-large {
  font-size: x-large !important;
}

.xx-large-font {
  font-size: xx-large;
}

.fontRed {
  color: red;
}

.message {
  font-family: "Open Sans";
}

.mb-0 {
  margin-bottom: 0;
}

.mt-1 {
  margin-top: 10px;
}

.mt-50 {
  margin-top: 50px;
}

.mb-50 {
  margin-bottom: 50px;
}

.font-black {
  color: black;
}

.fsize-large {
  font-size: x-large;
}

.flex {
  display: flex;
}

.justify-center {
  justify-items: center;
}

.align-center {
  align-content: center;
}

.negrita {
  font-weight: bold;
}

.questions-form {
  width: 150px;
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-bottom: 60px;
}

input {
  text-align: center;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
  bottom: 0;
  left: 0;
}

.block {
  display: block;
}

.underlined {
  text-decoration-line: underline;
}
</style>
