<template>
  <q-page>
    <div class="col">
      <div class="botones row fondo-gris  shadow-up-9">

        <h6 class="p-2">Configuración</h6>

      </div>
      <div class="zonaconfiguracion row">
        <q-card class="my-card custom-shadow custom-border-radius" bordered style="margin-top: 20px; padding-top:10px">
          <q-img src="logo_bcv.png" style="width: 20%; height: auto; display: block; margin: auto" fit="contain" />

          <q-card-section>

            <div class="text-h5 q-mt-sm q-mb-xs color-texto">Tasa del Banco Central de Venezuela</div>
            <q-input class="" outlined standout bottom-slots v-model="tasabcv" label="Tasa BCV" stack-label dense
              style="margin: 10px;" />
          </q-card-section>
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
