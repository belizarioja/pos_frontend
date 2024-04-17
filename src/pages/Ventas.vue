<template>
  <q-page class="bg-white row">
    <div class="col">
      <div class="botones row" style="background: #ededed;">
         <div class="text-h6">Reporte de Ventas</div>
      </div>
      <div class="listarcategorias row">
        <div class="listarcategoriasconitem col">
          <div class="row justify-center">
            <q-table
              dense
              :rows="rows"
              title="Ventas"
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
                    <q-btn icon-right="filter_alt" class="q-ml-sm col-md-4 col-sm-3 col-xs-3" color="secondary" label="Filtrar" @click="drawerFilters = true" />
                  </div>
                </template>
                <template v-slot:body-cell-estatus="props">
                  <q-td :props="props">
                    <div>
                      <q-badge :color="props.row.estatus === '1' ? 'info' : 'negative'" >
                        {{ props.row.estatus === '1' ? 'Procesada' : 'Anulada' }}
                      </q-badge>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-accion="props">
                  <q-td :props="props">
                    <div>
                      <q-btn color="primary" icon="plagiarism" @click.stop="abrirDetalleInvoive(props.row)" dense/>
                    </div>
                  </q-td>
                </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>

    <!-- MOSTRAR DETALLE DE VENTA -->
    <q-dialog v-model="modaldetalleinvoice" persistent>
      <q-card style="width: 320px;">
        <q-card-section style="justify-content: center;">
          <div class="text-center letratotalesfactura " style=""> {{ empresa }} - {{ rif }}</div>
          <div class="text-center letratotalesfactura " style=""> {{ direccion }}</div>
          <div class="text-center letratotalesfactura " style=""> {{ telefono }}</div>
          <div class="text-center letratotalesfactura " style=""> {{ email }}</div>
          <q-separator style="margin: 10px 0px;" />
          <div v-if="detalleventa.estatus === '2'" class="anulada" style="display: flex; justify-content: center; align-items: center;width: 100%;">ANULADA</div>
          <div style="display: flex; align-items: left;width: 100%;">
            <div class="numero" style="margin-left: 10px;"> {{ detalleventa.tipofactura }}</div>
            <div class="numero" style="margin-left: 10px;"> {{ detalleventa.numerointerno }}</div>
          </div>
          <div style="display: flex; align-items: center;">
            <div class="control" style="margin-left: 10px;"> N° de control:</div>
            <div class="control" style="margin-left: 10px;"> {{ detalleventa.numerocontrol }}</div>
          </div>
          <q-separator style="margin: 10px 0px;" />
          <table style="width: 100%;">
            <tr class="letratotalesfactura">
              <td style="width: 30%;">Razón social:</td>
              <td style="font-weight: bold;">{{ detalleventa.cliente }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td>{{ detalleventa.abrev }}</td>
              <td style="font-weight: bold;">{{ detalleventa.documentosolo }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td>Fecha:</td>
              <td style="font-weight: bold;">{{ detalleventa.fecha }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td>Cajero:</td>
              <td style="font-weight: bold;">{{ detalleventa.usuario }}</td>
            </tr>
          </table>
          <table style="width: 100%;">
            <tr style="font-weight: bold; font-size: 11px;">
              <td class="rayafactura rayaarriba">Producto</td>
              <td class="rayafactura rayaarriba">Precio</td>
              <td class="rayafactura rayaarriba">Cant.</td>
              <td class="rayafactura rayaarriba">Imp %</td>
              <td class="rayafactura rayaarriba">Total</td>
            </tr>
            <tr v-for="item in ventas" :key="item" style="font-size: 11px;">
              <td>{{item.producto}}</td>
              <td>{{item.precio}}</td>
              <td>{{item.cantidad}}</td>
              <td>{{item.tasa}}%</td>
              <td style="text-align: right;">{{item.subtotal}}</td>
            </tr>

            <tr>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
            </tr>
          </table>
          <table style="width: 100%;">
            <tr class="letratotalesfactura">
              <td style="width: 40%;"></td>
              <td>Subtotal Bs.:</td>
              <td style="text-align: right;">{{ detalleventa.subtotal }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Impuestos Bs.:</td>
              <td style="text-align: right;">{{ detalleventa.impuesto }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Descuentos Bs.:</td>
              <td style="text-align: right;">{{ detalleventa.descuentos }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td class="rayafactura">IGTF 3% Bs.:</td>
              <td class="rayafactura" style="text-align: right;">{{ detalleventa.igtf }}</td>
            </tr>
            <tr class="letratotalesfactura"  style="font-weight: bold;">
              <td></td>
              <td>Total Bs.:</td>
              <td style="text-align: right;">{{ detalleventa.total }}</td>
            </tr>
            <tr class="letratotalesfactura"  style="font-weight: bold;">
              <td></td>
              <td>Total $:</td>
              <td style="text-align: right;">{{ detalleventa.totalusd }}</td>
            </tr>
          </table>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Imprimir" color="secondary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Notify } from 'quasar'
import moment from 'moment'
import axios from 'axios'
const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'IndexPage',
  setup () {
    return {
      modaldetalleinvoice: ref(false),
      rows: ref([]),
      ventas: ref([]),
      cols: [
        { name: 'tipofactura', align: 'center', label: 'Tipo Documento', field: 'tipofactura' },
        { name: 'numerointerno', align: 'center', label: 'N° Interno', field: 'numerointerno' },
        { name: 'numerocontrol', align: 'center', label: '# Control', field: 'numerocontrol' },
        { name: 'fecha', align: 'center', label: 'Fecha', field: 'fecha' },
        { name: 'cliente', align: 'left', label: 'Cliente', field: 'cliente' },
        { name: 'documento', align: 'left', label: 'Identificación', field: 'documento' },
        { name: 'usuario', align: 'left', label: 'Usuario', field: 'usuario' },
        { name: 'subtotal', align: 'left', label: 'Subtotal', field: 'subtotal' },
        { name: 'impuesto', align: 'left', label: 'Impuesto', field: 'impuesto' },
        { name: 'total', align: 'center', label: 'Total', field: 'total' },
        { name: 'estatus', align: 'center', label: 'Estatus', field: 'estatus' },
        { name: 'accion', align: 'left', label: 'Accion', field: 'accion' }
      ],
      filterTable: ref(''),
      empresa: ref(''),
      direccion: ref(''),
      rif: ref(''),
      telefono: ref(''),
      email: ref(''),
      buscaritem: ref(false),
      detalleventa: ref({}),
      loading: ref(false),
      id_usuario: ref(sessionStorage.getItem('id_usuario')),
      co_rol: ref(sessionStorage.getItem('co_rol')),
      pagination: {
        page: 1,
        rowsPerPage: 20 // 0 means all rows
      }
    }
  },
  methods: {
    async abrirDetalleInvoive (item) {
      console.log(item)
      this.detalleventa = item
      await axios.get(ENDPOINT_PATH_V2 + 'ventas/getitemsventas/' + item.cod).then(async response => {
        this.ventas = response.data.resp
        for (const i in this.holds) {
          const obj = this.ventas[i]
          this.ventas.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar items Ventas ' + error)
      })
      this.modaldetalleinvoice = true
    },
    listar () {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'ventas/getventas/' + sessionStorage.getItem('co_empresa')).then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.numerointerno = datos[i].numerointerno
          obj.numerocontrol = datos[i].numerocontrol
          obj.fecha = moment(datos[i].fecha).format('DD/MM/YYYY HH:mm:ss')
          obj.subtotal = datos[i].subtotal
          obj.impuesto = datos[i].impuesto
          obj.total = datos[i].total
          obj.totalusd = datos[i].totalusd
          obj.igtf = datos[i].igtf
          obj.descuentos = datos[i].descuentos
          obj.usuario = datos[i].usuario
          obj.documentosolo = datos[i].documento
          obj.documento = datos[i].abrev + '-' + datos[i].documento
          obj.cliente = datos[i].nombrecliente
          obj.abrev = datos[i].abrev
          obj.tipofactura = datos[i].tipofactura
          obj.estatus = datos[i].estatus
          if (this.co_rol === '3') {
            if (datos[i].idusuario === this.id_usuario) {
              this.rows.push(obj)
            }
          } else {
            this.rows.push(obj)
          }
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Ventas ' + error)
      })
    },
    async cargar () {
      const resp = await axios.get(ENDPOINT_PATH_V2 + 'configuracion/' + sessionStorage.getItem('co_empresa'))
        .catch(error => {
          Notify.create('Problemas al listar Configuracion ' + error)
        })
      const datos = resp.data.resp
      this.empresa = datos.empresa
      this.rif = datos.rif
      this.direccion = datos.direccion
      this.telefono = datos.telefono
      this.email = datos.email
    }
  },
  mounted () {
    console.log('Listar ventas')
    this.cargar()
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
    background: rgb(187, 193, 194);
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
.numero{
  font-size: 14px;
}
.control{
  font-size: 12px;
}
.anulada{
  font-size: 30px;
  color: red;
  font-weight: bold;
}
</style>
