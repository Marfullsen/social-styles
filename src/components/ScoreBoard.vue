<template>
  <section>
    <article class="desktop">
      <table class="w-500">
        <tr>
          <th>
            <i class="medio material-icons">person</i>
          </th>
          <th>
            <i class="medio material-icons">palette</i>
          </th>
          <th>
            <i class="medio material-icons">access_time</i>
          </th>
        </tr>
        <tr v-for="persona in puntajes" :key="persona">
          <td>{{ persona.nombre }}</td>
          <td>
            <span
              class="insignia"
              :class="calcularEstilo(persona.asertividad, persona.emotividad)"
            >
              {{ calcularEstilo(persona.asertividad, persona.emotividad) }}
            </span>
          </td>
          <td>{{ lapso(persona.fecha_tested) }}</td>
        </tr>
      </table>
    </article>
    <table class="mobile">
      <tr>
        <th>
          <i class="medio material-icons">person</i>
          <i class="medio material-icons">palette</i>
        </th>
        <th>
          <i class="medio material-icons">access_time</i>
        </th>
      </tr>
      <tr v-for="persona in puntajes" :key="persona">
        <td style="display: flex; flex-direction: column-reverse">
          <span
            class="insignia insignia-mobile"
            :class="calcularEstilo(persona.asertividad, persona.emotividad)"
          >
            {{ calcularEstilo(persona.asertividad, persona.emotividad) }}
          </span>
          <span>{{ persona.nombre }}</span>
        </td>
        <td>{{ lapso(persona.fecha_tested) }}</td>
      </tr>
    </table>
  </section>
</template>

<script>
import humanizar_lapso from "../formatters";

export default {
  data() {
    return {
      puntajes: [
        {
          id: 5,
          fecha_tested: "2021-02-24T21:47:35.390546-03:00",
          nombre: "Loading...",
          asertividad: -3,
          emotividad: 5,
        },
        {
          id: 3,
          fecha_tested: "2016-08-02T17:01:48.627203-03:00",
          nombre: "Loading...",
          asertividad: 1,
          emotividad: 5,
        },
        {
          id: 2,
          fecha_tested: "2018-03-10T16:04:55.155035-03:00",
          nombre: "Loading...",
          asertividad: 1,
          emotividad: -5,
        },
        {
          id: 1,
          fecha_tested: "2020-03-24T16:02:20.887012-03:00",
          nombre: "Loading...",
          asertividad: -1,
          emotividad: -4,
        },
      ],
    };
  },
  methods: {
    calcularEstilo(asertividad, emotividad) {
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
    lapso(fecha) {
      return humanizar_lapso(fecha);
    },
  },
  mounted() {
    fetch("https://proto-api2.herokuapp.com/api/paciente/puntajes/")
      .then((response) => response.json())
      .then((data) => {
        this.puntajes = data;
      })
      .catch((error) => {
        console.error(error);
        const puntajes_raw = localStorage.getItem("puntajes");
        if (puntajes_raw != null) {
          this.puntajes = JSON.parse(puntajes_raw)
        }
      });
  },
};
</script>

<style>
.expressive {
  background: #f0ad4e;
}

.driver {
  background: #d9534f;
}

.analytical {
  background: #5bc0de;
}

.amiable {
  background: #5cb85c;
}

.insignia {
  border-radius: 25px;
  color: white;
  padding: 10px;
}

.insignia-mobile {
  padding: 0px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 14px;
  text-align: center !important;
  border-bottom: 1px solid #ddd;
  font-size: x-large !important;
}

tr:hover {
  background-color: #c4e4ff;
}

.desktop {
  display: none;
}

.w-500 {
  width: 500px;
}

@media (min-width: 1024px) {
  .desktop {
    display: initial;
    display: flex;
    justify-content: center;
  }
  .mobile {
    display: none;
  }
}
</style>
