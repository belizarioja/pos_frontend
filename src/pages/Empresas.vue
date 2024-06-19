<template>
  <q-page class=" row">
    <div class="col">
      <div class="botones row fondo-gris  shadow-up-9">

        <h6 class="p-2">Módulo emisores</h6>

      </div>
      <div class="listarcategorias row" style="margin-top:20px">
        <q-btn no-caps unelevated dense icon-right="add_business"
          class="q-ml-sm col-md-4 col-sm-3 col-xs-3 gradient-btn " label="Crear Emisor" @click="openCrear"
          style="width:150px" />
      </div>
      <div class="listarcategorias row" style="margin-top:20px">
        <q-input color="blue-grey-3" bg-color="white" outlined standout bottom-slots dense debounce="500"
          v-model="filterTable" placeholder="Buscar" style="width:30%">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="listarcategorias row">
        <div class="listarcategoriasconitem col">
          <div class="row justify-center">
            <q-table :rows="rows" title="Emisores" :columns="cols" row-key="num" :pagination="pagination"
              style="width: 95%; margin-top: 20px;" :loading="loading" :filter="filterTable"
              no-data-label="⚠ Sin registros " wrap-cells separator="cell"
              class="custom-shadow custom-border-radius-table">

              <template v-slot:body-cell-token="props">
                <q-td :props="props">
                  <div align="center">
                    <q-btn icon="visibility" @click.stop="btnviewtoken(props.row)" dense flat round color="grey-7" />
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-accion="props">
                <q-td :props="props">
                  <div align="center">
                    <q-btn round unelevated color="orange-1" text-color="orange-10" icon="edit"
                      @click.stop="openEdit(props.row)" />

                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-estatus="props">
                <q-td :props="props">
                  <div align="center">
                    <q-btn :color="props.row.estatus === '1' ? 'green' : 'grey'"
                      :icon="props.row.estatus === '1' ? 'toggle_on' : 'toggle_off'"
                      @click.stop="btnOpenUpdEstatus(props.row)" dense />

                  </div>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL PARA VISUALIZAR TOKEN -->
    <q-dialog v-model="viewtoken" persistent>
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Esta información es secreta 🤫</span>
        </q-card-section>
        <q-separator />
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Cliente Emisor: <b>{{ razonsocialtitulo + ' - ' + riftitulo }}</b></span>
        </q-card-section>
        <q-card-section class="tarjeticainside" style="word-break: break-all;">
          <q-item>
            <q-card-section avatar>
              <q-icon name="token" color="grey-7" />
            </q-card-section>
            <q-card-section>
              <q-card-label caption>Token:</q-card-label>
              <p> {{ tokenservicios }}</p>
            </q-card-section>
          </q-item>

        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn unelevated no-caps label="Aceptar" color="primary" icon-right="check" v-close-popup />

        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL PARA EDITAR/CREAR EMISOR -->
    <q-dialog v-model="modalEdit" persistent>
      <q-card class="col-md-6 col-sm-11 col-xs-11" style="margin-top: 20px;">
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>{{ titulomodal }} Emisor</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-md-3 col-sm-12 col-xs-12" outlined v-model="tasabcv" label="Tasa BCV" stack-label dense
              style="margin-bottom: 10px;" />
            <q-input class="col-md-8 col-sm-12 col-xs-12" outlined v-model="urlfacturacion" label="Url facturación"
              stack-label dense />
          </div>
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-md-3 col-sm-12 col-xs-12" outlined v-model="rif" label="RIF" stack-label dense
              style="margin-bottom: 10px;" />
            <q-input class="col-md-8 col-sm-12 col-xs-12" outlined v-model="empresa" label="Razón Social" stack-label
              dense />
          </div>
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-md-5 col-sm-12 col-xs-12" outlined v-model="telefono" label="Teléfono" stack-label dense
              style="margin-bottom: 10px;" />
            <q-input class="col-md-6 col-sm-12 col-xs-12" outlined v-model="email" label="Email" stack-label dense />
          </div>
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-12" outlined v-model="direccion" label="Dirección" stack-label dense
              style="margin-bottom: 10px;" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input v-model="tokenfacturacion" label="Token facturación" outlined dense type="textarea" />
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn outline no-caps label="Cancelar" icon-right="close" color="primary" v-close-popup />
          <q-btn unelevated no-caps label="Guardar" color="primary" icon-right="check" @click="guardar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- MODAL PARA EDITAR ESTATUS -->
    <q-dialog v-model="modalUpdEstatus" persistent>
      <q-card style="width: 250px;">
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Actualizar Estatus</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-card-section class="tarjeticainside">

            <q-card-label caption></q-card-label>
            <p> ¿Desea {{ messageActualizar }} este usuario?</p>

          </q-card-section>

        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn outline no-caps label="Cancelar" icon-right="close" color="primary" v-close-popup />
          <q-btn unelevated no-caps label="Aceptar" color="primary" icon-right="check" @click="actualizarEstatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      modalUpdEstatus: ref(false),
      tokenfacturacion: ref(''),
      urlfacturacion: ref(''),
      rif: ref(''),
      empresa: ref(''),
      direccion: ref(''),
      telefono: ref(''),
      email: ref(''),
      tasabcv: ref(''),
      rows: ref([]),
      cols: [
        { name: 'rif', align: 'left', label: '🆔 Rif', field: 'rif' },
        { name: 'empresa', align: 'left', label: '🏢 Razón Social', field: 'empresa', style: 'min-width: 200px; width: 200px' },
        { name: 'direccion', align: 'left', label: '📍 Dirección', field: 'direccion', style: 'min-width: 200px; width: 200px' },
        { name: 'telefono', align: 'left', label: '📞 Teléfono', field: 'telefono' },
        { name: 'email', align: 'left', label: '📧 Email', field: 'email' },
        { name: 'token', align: 'left', label: '🔑 Token', field: 'token' },
        { name: 'url', align: 'left', label: '🌐 Url Integración', field: 'url' },
        { name: 'tasabcv', align: 'left', label: '💹 Tasa BCV', field: 'tasabcv' },
        { name: 'estatus', align: 'left', label: '🔄 Estatus', field: 'estatus' },
        { name: 'accion', align: 'left', label: '🔧 Accion', field: 'accion' }
      ],
      filterTable: ref(''),
      titulomodal: ref(''),
      idUpd: ref(''),
      buscaritem: ref(false),
      detalleventa: ref({}),
      loading: ref(false),
      viewtoken: ref(false),
      modalEdit: ref(false),
      pagination: {
        page: 1,
        rowsPerPage: 20 // 0 means all rows
      }
    }
  },
  methods: {
    btnviewtoken(row) {
      console.log(row)
      this.razonsocialtitulo = row.empresa
      this.riftitulo = row.rif
      this.tokenservicios = row.token
      this.viewtoken = true
    },
    openEdit(row) {
      console.log(row)
      this.titulomodal = 'Editar'
      this.idUpd = row.cod
      this.tasabcv = row.tasabcv
      this.tokenfacturacion = row.token
      this.urlfacturacion = row.url
      this.empresa = row.empresa
      this.rif = row.rif
      this.direccion = row.direccion
      this.telefono = row.telefono
      this.email = row.email
      this.modalEdit = true
    },
    openCrear() {
      this.idUpd = undefined
      this.titulomodal = 'Crear'
      this.tasabcv = ''
      this.tokenfacturacion = ''
      this.urlfacturacion = ''
      this.empresa = ''
      this.rif = ''
      this.direccion = ''
      this.telefono = ''
      this.email = ''
      this.modalEdit = true
    },
    crear() {
      const body = {
        empresa: this.empresa || '',
        email: this.email || '',
        telefono: this.telefono || '',
        direccion: this.direccion || '',
        rif: this.rif || '',
        urlfacturacion: this.urlfacturacion || '',
        tasabcv: this.tasabcv || 0,
        tokenfacturacion: this.tokenfacturacion || ''
      }
      axios.post(ENDPOINT_PATH_V2 + 'sede', body).then(async response => {
        // console.log(response.status)
        if (response.status === 200) {
          const datos = response.data.resp
          // console.log(datos)
          Notify.create(datos)
          this.modalEdit = false
          this.listar()
        }
      }).catch(error => {
        Notify.create('Problemas al Crear Cliente Emisor ' + error)
      })
    },
    guardar() {
      if (this.titulomodal === 'Editar') {
        // console.log(this.titulomodal)
        this.editar()
      } else {
        // console.log(this.titulomodal)
        this.crear()
      }
    },
    editar() {
      const body = {
        empresa: this.empresa || '',
        email: this.email || '',
        telefono: this.telefono || '',
        direccion: this.direccion || '',
        rif: this.rif || '',
        urlfacturacion: this.urlfacturacion || '',
        tasabcv: this.tasabcv || 0,
        tokenfacturacion: this.tokenfacturacion || ''
      }
      axios.put(ENDPOINT_PATH_V2 + 'sede/' + this.idUpd, body).then(async response => {
        // console.log(response.status)
        if (response.status === 200) {
          const datos = response.data.resp
          // console.log(datos)
          Notify.create(datos)
          this.modalEdit = false
          this.listar()
        }
      }).catch(error => {
        Notify.create('Problemas al actualizar Configuracion ' + error)
      })
    },
    btnOpenUpdEstatus(row) {
      // console.log(row)
      this.idUpd = row.cod
      this.messageActualizar = row.estatus === '1' ? 'desactivar' : 'activar'
      this.estatusAct = row.estatus
      this.modalUpdEstatus = true
    },
    actualizarEstatus() {
      const data = {
        estatus: this.estatusAct === '1' ? 0 : 1
      }
      axios.put(ENDPOINT_PATH_V2 + 'sede/estatus/' + this.idUpd, data).then(async response => {
        if (response.status === 200) {
          const datos = response.data.resp
          // console.log(datos)
          Notify.create(datos)
          this.modalUpdEstatus = false
          this.listar()
        }
      })
    },
    listar() {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'sede').then(async response => {
        // console.log(response.data)
        const datos = response.data.data
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.rif = datos[i].rif
          obj.empresa = datos[i].empresa
          obj.direccion = datos[i].direccion
          obj.email = datos[i].email
          obj.token = datos[i].tokenfacturacion
          obj.url = datos[i].urlfacturacion
          obj.telefono = datos[i].telefono
          obj.tasabcv = datos[i].tasabcv
          obj.estatus = datos[i].estatus
          this.rows.push(obj)
        }
        // console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Emisores ' + error)
      })
    }
  },
  mounted() {
    console.log('Listar emisores')
    this.listar()
  }
})
</script>

<style>
.totales {
  background: #ededed;
  height: 150px;
  width: 100%;
}

.botones {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.listarcategorias {
  display: flex;
  justify-content: center;
}

.carritofondo {
  font-size: 170px;
  color: white;
  margin-top: 114px;
}

.itemtotal {
  font-size: 18px;
  color: #26a69a;
  font-weight: bolder;
}

.listarcategoriasconitem {
  height: 85vh;

  overflow: auto;
}

.tarjetaitem {
  margin: 10px;
}

.inputCantidad {
  width: 50px;
  border-radius: 7px;
  border-color: lightblue;
}

.tarjeticainside {
  background: #ededed;
  padding: 10px;
  border-radius: 10px;
}

.rayafactura {
  border-bottom: 1px dashed;
}

.rayaarriba {
  border-top: 1px dashed;
}

.letratotalesfactura {
  font-size: 12px;
}
</style>
