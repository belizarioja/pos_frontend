<template>
  <div class="window-height window-width row justify-center">
    <div class="col">
      <div class="row justify-center">
        <img src="login_sid.png" style="max-width: 150px;margin-top: 20px;" />
      </div>
      <div class="row justify-center">
        <h5 class="text-h5 text-primary q-my-md">Identificarse</h5>
      </div>
      <div class="formulario">
        <form @submit.prevent="submit" class="">
          <q-card bordered class="q-pa-lg shadow-1" style="border-radius: 10px;">
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input square filled clearable v-model="usuarioCentro" type="text" label="Usuario" >
                  <template v-slot:prepend>
                    <q-icon name="account_circle" />
                  </template>
                </q-input>
                <q-input square filled clearable v-model="claveCentro" type="password" label="Clave" >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="primary" type="submit"  :loading="loading"  size="lg" class="full-width" label="Ingresar" >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </q-card-actions>
            <!-- <q-card-section class="text-center q-pa-none">
              <p class="text-grey-6">¿Olvidó contraseña?</p>
            </q-card-section> -->
          </q-card>
        </form>
      </div>
      <div class="bg-primary fondoabajo"></div>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import axios from 'axios'
const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default {
  name: 'LoginLayout',
  data () {
    return {
      term: '',
      usuarioCentro: '',
      claveCentro: '',
      loading: false
    }
  },

  methods: {
    submit () {
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
            // this.$router.push('/dashboard')
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
  mounted () {
    console.log('Modo producción')
  }
}
</script>

<style>
.fondoabajo {
    border-radius: 20px 20px 0 0;
    height: 72vh;
    width: 100%;
    position: absolute;
    top: 245;
    left: 0;
    z-index: 0;
}
.formulario {
    z-index: 1;
    position: absolute;
    top: 225px;
    left: 10px;
    right: 10px;
}
</style>
