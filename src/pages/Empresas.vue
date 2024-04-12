<template>
  <q-page class="bg-white row">
    <div class="col">
      <div class="botones row" style="background: #ededed;">
         <div class="text-h6">Módulo de Emisores</div>
      </div>
      <div class="listarcategorias row">
        <div class="listarcategoriasconitem col">
          <div class="row justify-center">
            <q-table
              dense
              :rows="rows"
              title="Emisores"
              :columns="cols"
              row-key="num"
              :pagination="pagination"
              style="width: 95%; margin-top: 20px;"
              :loading="loading"
              :filter="filterTable"
              no-data-label="No hay registros!"
              >
                <template v-slot:top-left>
                  <q-input dense debounce="300" color="primary" v-model="filterTable" placeholder="Buscar">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:top-right>
                  <div style="display: inline;">
                    <q-btn icon-right="add_business" class="q-ml-sm col-md-4 col-sm-3 col-xs-3" color="secondary" label="Crear Emisor" @click="drawerFilters = true" />
                  </div>
                </template>
                <template v-slot:body-cell-token="props">
                  <q-td :props="props">
                    <div>
                      <q-btn icon="visibility" @click.stop="btnviewtoken(props.row)" dense flat/>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-accion="props">
                  <q-td :props="props">
                    <div>
                      <q-btn color="primary" icon="app_registration" @click.stop="openEdit(props.row)" dense/>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-estatus="props">
                  <q-td :props="props">
                    <div>
                      <q-btn :color="props.row.estatus === '1' ? 'secondary' : 'negative'" :icon="props.row.estatus === '1' ? 'toggle_on' : 'toggle_off'" @click.stop="abrirDetalleInvoive(props.row)" dense/>
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
      <q-card style="width: auto;">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Token del Cliente Emisor {{ razonsocialtitulo + ' - ' + riftitulo}}</span>
        </q-card-section>
        <q-card-section class="row items-center" style="word-break: break-all;">
          <div style="">
            {{ tokenservicios }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Aceptar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- MODAL PARA EDITAR EMISOR -->
    <q-dialog v-model="modalEdit" persistent>
      <q-card class="col-md-6 col-sm-11 col-xs-11" style="margin-top: 20px;">
          <q-card-section class="row">
            <div class="text-h6">Editar Emisor</div>
          </q-card-section>
          <q-separator class="row" />
          <q-card-section>
            <div class="row justify-around">
              <q-input class="col-md-3 col-sm-12 col-xs-12" filled v-model="tasabcv" label="Tasa BCV" stack-label dense style="margin-bottom: 10px;" />
              <q-input class="col-md-8 col-sm-12 col-xs-12" filled v-model="urlfacturacion" label="Url facturación" stack-label dense />
            </div>
          </q-card-section>
          <q-separator class="row" />
          <q-card-section>
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
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-input
              v-model="tokenfacturacion"
              label="Token facturación"
              filled
              dense
              type="textarea"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="negative"  v-close-popup />
            <q-btn label="Guardar" color="secondary" @click="guardar" />
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
  setup () {
    return {
      modaldetalleinvoice: ref(false),
      tokenfacturacion: ref(''),
      rows: ref([]),
      cols: [
        { name: 'rif', align: 'center', label: 'Rif', field: 'rif' },
        { name: 'empresa', align: 'center', label: 'Razón Social', field: 'empresa' },
        { name: 'direccion', align: 'center', label: 'Dirección', field: 'direccion' },
        { name: 'telefono', align: 'left', label: 'Teléfono', field: 'telefono' },
        { name: 'email', align: 'left', label: 'Email', field: 'email' },
        { name: 'token', align: 'left', label: 'Token', field: 'token' },
        { name: 'url', align: 'left', label: 'Url Integración', field: 'url' },
        { name: 'tasabcv', align: 'left', label: 'Tasa BCV', field: 'tasabcv' },
        { name: 'estatus', align: 'left', label: 'Estatus', field: 'estatus' },
        { name: 'accion', align: 'left', label: 'Accion', field: 'accion' }
      ],
      filterTable: ref(''),
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
    btnviewtoken (row) {
      console.log(row)
      this.razonsocialtitulo = row.empresa
      this.riftitulo = row.rif
      this.tokenservicios = row.token
      this.viewtoken = true
    },
    openEdit (row) {
      console.log(row)
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
    guardar () {
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
      axios.put(ENDPOINT_PATH_V2 + 'configuracion/' + this.idUpd, body).then(async response => {
        console.log(response.status)
        if (response.status === 200) {
          const datos = response.data.resp
          console.log(datos)
          Notify.create(datos)
          this.modalEdit = false
          this.listar()
        }
      }).catch(error => {
        Notify.create('Problemas al actualizar Configuracion ' + error)
      })
    },
    listar () {
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
  mounted () {
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
    background: coral;
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
.letratotalesfactura{
  font-size: 12px;
}
</style>
