<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="container">

          <div class="left-pane">
            <div class="left-content">
              <div class="left-text">
                <h4 class="text-left q-mb-md slogan">
                  Te ofrecemos la plataforma <span class="text-resaltado">más fácil, segura y confiable</span> del
                  mercado.
                </h4>
              </div>
              <div class="left-logo">
                <img src="img/logo_smart.avif" alt="Logo" class="img-logo">
              </div>
            </div>
          </div>
          <div class="right-pane">
            <div class="text-h6 text-center color-texto mb-2 mt-2">¡Bienvenido a Smart<br><b>proSales</b>! 🧾</div>
            <!-- Contenido de la mitad derecha -->
            <q-card bordered class="q-pa-md custom-shadow custom-border-radius card-width">
              <div class="text-h6 text-center color-texto">Iniciar sesión</div>
              <form @submit.prevent="submit" class="form-width-small">
                <q-card-section>
                  <q-form class="q-gutter-sm">
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
                <q-card-actions class="q-px-sm q-mt-sm">
                  <q-btn no-caps unelevated class="gradient-btn full-width" type="submit" :loading="loading" size="md"
                    label="Ingresar">
                    <template v-slot:loading>
                      <q-spinner-facebook />
                    </template>
                  </q-btn>
                </q-card-actions>
              </form>
              <q-separator />
              <div class="q-mt-sm text-center">
                <img src="img/logo-prosales.png" alt="Logo" class="img-logoPro q-mx-auto">
              </div>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
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
.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.left-pane {
  flex: 0.6;
  background: linear-gradient(360deg, rgba(204, 95, 2, 0.95) 0%, rgba(204, 95, 2, 0) 68%), url('../assets/log.avif') no-repeat center center;
  background-size: cover;
}

.left-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.left-text {
  margin-top: auto;
  margin-bottom: 5px;
  text-align: center;
  padding-left: 20px;
}

.left-text h4 {
  font-weight: bold;
  color: #fffaec;
}

.text-resaltado {
  color: #ffe6a5;
}

.left-logo {
  text-align: center;
}

.right-pane {
  flex: 0.4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.img-logo {
  width: 30%;
  padding: 4%;
}

.img-logoPro {
  width: 50%;
}

.form-width {
  max-width: 350px;
  margin: 0 auto;
}

.form-width-small {
  max-width: 300px;
  margin: 0 auto;
}

.card-width {
  max-width: 350px;
  width: 100%;
}

/* Media query para teléfonos móviles */
@media (max-width: 600px) {
  .container {
    flex-direction: column-reverse;
  }

  .left-pane {
    flex: 1;
    order: 1;
  }

  .right-pane {
    flex: 1;
    order: 2;
  }

  .left-content {
    justify-content: center;
  }

  .left-text {
    padding-left: 0;
  }

  .img-logo {
    width: 50%;
  }
}
</style>
