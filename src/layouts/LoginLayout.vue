<template>

  <div class="full-height full-width q-pa-md p-0 no-scroll-y">
    <div class="row q-col-gutter-md full-height">
      <div class="left-image col-12 col-md-7 flex flex-center column">
        <h4 class="text-left q-mb-md slogan">
          Te ofrecemos la plataforma <span class="text-resaltado">más fácil, segura y confiable</span> del mercado.
        </h4>
        <img src="img/logo_smart.avif" alt="Pequeña Imagen" class="small-image q-mt-md">
      </div>

      <div class="col-12 col-md-5 bg-color-yellow flex flex-center">
        <div class="center-form q-pa-md">
          <h5 class="titulo">¡Bienvenido a Smart <br><b>proSales</b>!</h5>
          <form @submit.prevent="submit" class="form-width">
            <q-card bordered class="q-pa-lg custom-shadow custom-border-radius">
              <h6 class="p-0"><b>Iniciar sesión</b></h6>
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input outlined clearable v-model="usuarioCentro" type="text" label="Usuario">
                    <template v-slot:prepend>
                      <q-icon name="account_circle" />
                    </template>
                  </q-input>
                  <q-input outlined clearable v-model="claveCentro" type="password" label="Clave">
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                </q-form>
              </q-card-section>
              <q-card-actions class="q-px-md">
                <q-btn no-caps unelevated class="gradient-btn full-width" type="submit" :loading="loading" size="lg"
                  label="Ingresar">
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </q-card-actions>
              <hr />
              <img src="img/logo-prosales.png" alt="Logo" class="img-logo q-mx-auto">
            </q-card>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import axios from 'axios'
const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default {
  name: 'LoginLayout',
  data() {
    return {
      term: '',
      usuarioCentro: '',
      claveCentro: '',
      loading: false
    }
  },

  methods: {
    submit() {
      // this.$router.push('/puntodeventa')
      if (this.usuarioCentro === '') {
        Notify.create('El Usuario es requerido para iniciar sesión')
      } else if (this.claveCentro === '') {
        Notify.create('La contraseña es requerida para iniciar sesión')
      } else {
        this.loading = true
        axios.post(ENDPOINT_PATH_V2 + 'usuario/login', {
          usuario: this.usuarioCentro,
          clave: this.claveCentro
        }).then(async response => {
          this.loading = false
          if (response.status === 200) {
            sessionStorage.setItem('id_usuario', response.data.resp.id)
            sessionStorage.setItem('tx_nombre', response.data.resp.nombre)
            sessionStorage.setItem('tx_empresa', response.data.resp.empresa)
            sessionStorage.setItem('co_empresa', response.data.resp.idempresa)
            sessionStorage.setItem('tx_rol', response.data.resp.rol)
            sessionStorage.setItem('co_rol', response.data.resp.idrol)
            this.$router.push('/puntodeventa')
          } else {
            this.loading = false
            Notify.create(response.data.message)
          }
        }).catch(error => {
          this.loading = false
          Notify.create('Error ' + error)
        })
      }
    }
  },
  mounted() {
    console.log('Modo producción')
  }
}
</script>

<style scoped>
.full-height {
  height: 100vh;
}

.full-width {
  width: 100vw;
}

.no-scroll-y {
  overflow-y: hidden;
}

.form-width {
  width: 100%;
  max-width: 350px;
}

.left-image {
  background: linear-gradient(360deg, rgba(204, 95, 2, 0.95) 0%, rgba(204, 95, 2, 0) 68%), url('img/log.avif');
  background-position: center;
  background-size: cover;
  padding: 10%;
  margin-top: 1%;
  border-radius: 5%;
}

.slogan {
  margin: 0
}

.titulo {
  margin-bottom: 5%;
  margin-top: -10%;

}

.center-form {
  display: grid;
  justify-content: center;
  text-align: center;
}

.img-logo {
  width: 65%;
  padding: 4%;
}

.custom-shadow {
  box-shadow: 0px 10px 10px rgba(139, 139, 139, 0.25);
}

.custom-border-radius {
  border-radius: 20px;
}

.left-image h4 {
  margin-top: 60%;
  font-weight: bold;
  color: #FFFAEC;
}

.text-resaltado {
  color: #FFE6A5;
}

.gradient-btn {
  background: linear-gradient(90deg, #FF9A0A 39%, #FFD26D 100%);
  color: #fff;
  border: none;
}

.gradient-btn:hover {
  opacity: 0.9;
}

.gradient-btn.q-btn--unelevated {
  box-shadow: none;
}

.small-image {
  width: 150px;
  /* Ajusta el tamaño de la imagen según tus necesidades */
  height: auto;
  margin: 0;

  filter: drop-shadow(0 0 20px rgb(255, 251, 227));
  /* Sombra blanca */

}
</style>
