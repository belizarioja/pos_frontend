<template>
  <q-page>
    <div class="col">
      <div class="botones row fondo-gris  shadow-up-9">

        <h6 class="p-4">Configuración</h6>

      </div>
      <div class="zonaconfiguracion row">
        <q-card class="col-md-6 col-sm-11 col-xs-11 custom-shadow custom-border-radius" style="margin-top: 20px;">
          <q-card-section>
            <div class="text-center color-texto">
              <!-- <img src="logo_bcv.png" style="width: 100px; "> -->
              <h6>🏦 Tasa BCV</h6>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row justify-around">

              <q-input class="col-md-3 col-sm-12 col-xs-12" outlined standout bottom-slots v-model="tasabcv"
                label="Tasa BCV" stack-label dense style="margin-bottom: 10px;" />
            </div>
          </q-card-section>

          <!-- <q-card-section>
            <div class="row justify-around">
              <q-input class="col-md-3 col-sm-12 col-xs-12" filled v-model="rif" label="RIF" stack-label dense style="margin-bottom: 10px;" />
              <q-input class="col-md-8 col-sm-12 col-xs-12" filled v-model="empresa" label="Razón Social" stack-label dense />
            </div>
          </q-card-section>
          <q-separator class="row" />
          <q-card-section>
            <div class="row justify-around">
              <q-input class="col-md-5 col-sm-12 col-xs-12" filled v-model="telefono" label="Teléfono" stack-label dense style="margin-bottom: 10px;" />
              <q-input class="col-md-6 col-sm-12 col-xs-12" filled v-model="email" label="Email" stack-label dense />
            </div>
          </q-card-section>
          <q-separator class="row" />
          <q-card-section>
            <div class="row justify-around">
              <q-input class="col-12" filled v-model="direccion" label="Dirección" stack-label dense style="margin-bottom: 10px;" />
            </div>
          </q-card-section> -->

          <q-separator />
          <q-card-actions align="center">
            <q-btn unelevated no-caps color="warning" icon-right="check" label="Actualizar" @click="guardar" />
          </q-card-actions>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'IndexPage',
  setup() {
    return {
      tasabcv: ref('')
    }
  },
  methods: {
    guardar() {
      const body = {
        tasabcv: this.tasabcv || ''
      }
      axios.put(ENDPOINT_PATH_V2 + 'configuracion/' + sessionStorage.getItem('co_empresa'), body).then(async response => {
        // console.log(response.status)
        if (response.status === 200) {
          const datos = response.data.resp
          // console.log(datos)
          Notify.create(datos)
        }
      }).catch(error => {
        Notify.create('Problemas al actualizar Configuracion ' + error)
      })
    },
    async cargar() {
      const resp = await axios.get(ENDPOINT_PATH_V2 + 'configuracion/' + sessionStorage.getItem('co_empresa'))
        .catch(error => {
          Notify.create('Problemas al listar Configuracion ' + error)
        })
      console.log(resp)
      const datos = resp.data.resp
      this.tasabcv = datos.tasabcv
      this.tokenfacturacion = datos.tokenfacturacion
      this.urlfacturacion = datos.urlfacturacion
      this.empresa = datos.empresa
      this.rif = datos.rif
      this.direccion = datos.direccion
      this.telefono = datos.telefono
      this.email = datos.email
    }
  },
  mounted() {
    this.cargar()
  }
})
</script>

<style>
.zonaconfiguracion {
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: baseline;
}
</style>
