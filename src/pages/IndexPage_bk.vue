<template>
  <q-page class="bg-coral">
    <div class="col" style="">
      <div class="row">
        <div class="totales  col-md-6 col-sm-12 col-xs-12">
          <q-card class="my-card" bordered style="margin: 10px;">
            <q-card-section style="padding: 7px 16px;">
              <div style="width: 100%; background: #ddd; border-radius: 7px; display: flex; justify-content: space-between; padding: 3px 10px;">
                <span style="color: #000213;">Cliente:
                  <span style="color: blue; margin-left: 5PX;">{{nombrecliente.length > 0 ? nombrecliente : 'GENERAL'}}</span>
                </span>
               <span style="color: #000213;">Fecha venta:
                  <span style="color: blue; margin-left: 5PX;">{{nombrecliente.length > 0 ? fechaholds : fechahoy}}</span>
               </span>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section horizontal>
              <q-card-section class="column" style="padding: 7px;font-size: 12px;align-items: center;">
                  <q-avatar text-color="white" :style="'background: ' + colorLetra(nombrecliente.toUpperCase() || 'GENERAL')">
                    {{primeraletra(nombrecliente.toUpperCase() || 'GENERAL')}}
                  </q-avatar>
                  <q-badge color="blue" style="margin-top: 5px;">
                    {{documentoclienteventa || 'GENERAL'}}
                  </q-badge>
              </q-card-section>
              <q-separator vertical />
              <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px; width: 140px;">
                <span>Subtotal:</span>
                <span>Impuesto:</span>
                <span>Descuento:</span>
                <span class="itemtotal">$ {{totalusd}}</span>
              </q-card-section>

              <q-separator vertical />

              <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px;">
                <span>Bs. {{subtotal}}</span>
                <span>Bs. {{impuesto}}</span>
                <span>Bs. {{descuento}}</span>
                <span class="itemtotal">Bs. {{total}}</span>
              </q-card-section>
              <!-- <q-separator vertical />

              <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px; color:white;">
                <span>$ {{subtotalusd}}</span>
                <span>$ {{impuestousd}}</span>
                <span>$ {{descuentousd}}</span>
              </q-card-section> -->
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12" style="display: -webkit-box; align-items: center;">
          <div class="botones row">
            <q-btn class="col-6" color="primary" icon="zoom_in" @click="abrirBuscarItem" label="Agregar item" style="font-size: 12px;"/>
            <q-btn class="col-6" color="secondary" icon-right="paid" @click="abrirRealizarVenta" label="Realizar venta" style="font-size: 12px;" :disable="holds.length <= 0"/>
            <q-btn class="col-6" color="negative" icon="cancel" @click="openDeleteHolds" label="Cancelar venta" style="font-size: 12px;" :disable="holds.length <= 0"/>
            <q-btn class="col-6" color="positive" icon-right="person_add_alt" @click="abrirBuscarCliente" label="Agregar cliente" style="font-size: 12px;"/>
          </div>
        </div>
      </div>
      <div class="puntodeventa row">
        <q-icon v-if="slide === 1" class="carritofondo" name="remove_shopping_cart"></q-icon>
        <div v-else class="puntodeventaconitem col">
          <div class="row justify-center">
            <q-card v-for="item in holds" :key="item" class="my-card tarjetaitem col-md-5 col-sm-11 col-xs-11" style="height: fit-content;">
              <q-item horizontal>
                <q-item-section>
                  <q-item-label>{{item.producto}}</q-item-label>
                  <q-item-label caption>{{item.categoria}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="red" icon="delete" @click="deleteItemHolds(item)" />
                </q-item-section>
              </q-item>

              <q-item horizontal>
                <q-item-section avatar style="padding-right: 15px;align-items: center;">
                  <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)">
                    {{primeraletra(item.producto)}}
                  </q-avatar>
                  <q-badge color="blue" style="margin-top: 5px;">
                    Bs {{item.precio}}
                  </q-badge>
                </q-item-section>

                <q-item-section class="tarjeticainside">
                  <div style="display: flex;">
                    <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                      <div class="text-center">Cantidad</div>
                      <input
                        class="inputCantidad"
                        :id="'cantidad' + item.idproducto"
                        :value="item.cantidad"
                        @input="calcularMonto(item)"
                      />
                    </div>
                    <div style="display: grid;width: 25%;justify-content: center;">
                      <q-btn class="btncantidad"  color="blue" icon-right="add_circle" @click="actualizarCantidad(item, 1)" style="margin-bottom: 7px;"/>
                      <q-btn class="btncantidad"  color="red" icon="remove_circle" @click="actualizarCantidad(item, 2)"/>
                    </div>
                    <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                      <div class="text-center">%Imp.</div>
                      <div class="text-secondary">{{item.tasa}}</div>
                    </div>
                    <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                      <div class="text-center">Monto</div>
                      <div :id="'monto' + item.idproducto" class="text-secondary text-center">Bs. {{item.total}}</div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <!-- BUSCAR ITEMS DE PRODUCTOS -->
    <q-dialog v-model="buscaritem" position="top">
      <q-card style="background: #ddd;">
        <q-card-section style="padding: 10px 15px 7px;">
          <div class="">
            <q-input color="white" bg-color="primary"  rounded standout bottom-slots v-model="textitem" label="Buscar producto" counter autofocus>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="textitem = ''" class="cursor-pointer" />
              </template>

              <template v-slot:hint>
                Cantidad de letras
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 64vh" class="scroll">
          <q-card v-for="item in rowsproductosfiltre" :key="item.id" class="my-card tarjetaitem">
            <q-item horizontal>
              <q-item-section>
                <q-item-label>{{item.producto}}</q-item-label>
                <q-item-label caption>{{item.categoria}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div style="display: flex;">
                  <q-btn flat round color="blue" icon="add_shopping_cart" @click="additemholds(item)" />
                </div>
              </q-item-section>
            </q-item>

            <q-item horizontal>
              <q-item-section avatar style="padding-right: 15px;align-items: center;">
                <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)">
                  {{primeraletra(item.producto)}}
                </q-avatar>
                <q-badge color="blue" style="margin-top: 5px;">
                  Bs. {{item.precio}}
                </q-badge>
              </q-item-section>

              <q-item-section class="tarjeticainside">
                <div style="display: flex;">
                  {{item.descripcion}}
                </div>
                <div style="display: flex;">
                  <div style="display: grid;width: 48%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Unidad</div>
                    <div class="text-secondary">{{item.unidad}}</div>
                  </div>
                  <div style="display: grid;width: 48%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Impuesto.</div>
                    <div class="text-secondary">{{item.impuesto}}</div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="modalcliente" position="top">
      <q-card style="max-height: 87vh;">
        <q-card-section>
          <div class="text-h6">Buscar cliente</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="padding: 0 15px;">
          <div class="">
            <q-select
             filled
             v-model="modeldocumento"
             :options="optionsdocumento"
             option-label="tipodocumento"
             option-value="cod"
             label="Seleccione tipo documento"
             dense
            />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="padding: 10px 15px;">
          <div class="row">
            <q-input class="col-10"  filled v-model="documento" label="Documento" stack-label autofocus />
            <q-btn class="col-2" icon="search" color="secondary" @click="buscarCliente" />
          </div>
        </q-card-section>
        <div v-if="noencontrado" class="noencontrado">
            CLIENTE NO ENCONTRADO
        </div>
        <div v-if="encontrado" class="encontrado">
            CLIENTE ENCONTRADO
        </div>
        <q-separator v-if="clientebuscado"  />

        <q-card-section v-if="clientebuscado" style="padding: 0 15px;" >
          <q-input filled v-model="nombrecliente" label="Nombre cliente" stack-label  />
        </q-card-section>

        <q-separator v-if="clientebuscado" />
        <q-card-section v-if="clientebuscado"  style="padding: 0 15px;">
          <q-input filled v-model="correocliente" label="Email cliente" stack-label />
        </q-card-section>
        <q-separator v-if="clientebuscado" />
        <q-card-section v-if="clientebuscado" style="padding: 0 15px;" >
          <q-input filled v-model="telefonocliente" label="Teléfono cliente" stack-label />
        </q-card-section>
        <q-separator v-if="clientebuscado" />
        <q-card-section v-if="clientebuscado" style="padding: 0 15px;" >
          <q-input filled v-model="direccioncliente" label="Dirección cliente" stack-label />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" @click="limpiarCliente" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="crearCliente" :disable="dsbBtnCrearCliente" />
        </q-card-actions>

      </q-card>
    </q-dialog>
    <!-- LIMPIAR HOLDS DE VENTA -->
    <q-dialog v-model="modaldeleteholds" persistent>
      <q-card style="">
        <q-card-section style="display: flex; align-items: center;">
          <q-avatar color="primary" text-color="white">
            <q-icon name="delete"/>
          </q-avatar>
          <div class="text-h6" style="margin-left: 10px;">Eliminar Venta</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="">
          <div class="encontrado">
              ¿Desea eliminar esta venta?
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="deleteHolds" />
        </q-card-actions>

      </q-card>
    </q-dialog>
    <!-- MOSTRAR PREVIO DE VENTA -->
    <q-dialog v-model="modalrealizarventa" persistent>
      <q-card style="">
        <q-card-section style="display: flex; align-items: center;">
          <q-avatar color="primary" text-color="white">
            <q-icon name="shopping_cart_checkout"/>
          </q-avatar>
          <div class="text-h6" style="margin-left: 10px;"> Seguro de realizar esta venta?</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <table style="width: 100%;">
            <tr>
              <td style="width: 30%;">Razón social:</td>
              <td style="font-weight: bold;">{{ nombrecliente }}</td>
            </tr>
            <tr>
              <td>RIF/CI:</td>
              <td style="font-weight: bold;">{{ documentoclientesolo }}</td>
            </tr>
            <tr>
              <td>Fecha:</td>
              <td style="font-weight: bold;">{{ fechaholds }}</td>
            </tr>
          </table>
          <table style="width: 100%;">
            <tr style="font-weight: bold;">
              <td class="rayafactura rayaarriba">Producto</td>
              <td class="rayafactura rayaarriba">Precio</td>
              <td class="rayafactura rayaarriba">Cantidad</td>
              <td class="rayafactura rayaarriba">Tasa %</td>
              <td class="rayafactura rayaarriba">Total</td>
            </tr>
            <tr v-for="item in holds" :key="item">
              <td>{{item.producto}}</td>
              <td>{{item.precio}}</td>
              <td>{{item.cantidad}}</td>
              <td>{{item.tasa}}%</td>
              <td>{{item.total}}</td>
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
              <td style="width: 50%;"></td>
              <td>Subtotal Bs.:</td>
              <td>{{ subtotal }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Impuestos Bs.:</td>
              <td>{{ impuesto }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Descuentos Bs.:</td>
              <td>{{ descuento }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td class="rayafactura">IGTF 3% Bs.:</td>
              <td class="rayafactura">{{ igtf }}</td>
            </tr>
            <tr class="letratotalesfactura"  style="font-weight: bold;">
              <td></td>
              <td>Total Bs.:</td>
              <td>{{ total }}</td>
            </tr>
            <tr class="letratotalesfactura"  style="font-weight: bold;">
              <td></td>
              <td>Total $:</td>
              <td>{{ totalusd }}</td>
            </tr>
          </table>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="realizarVenta" />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'

const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'IndexPage',
  setup () {
    return {
      slide: ref(2),
      igtf: ref(0),
      textitem: ref(''),
      subtotal: ref(0),
      impuesto: ref(0),
      descuento: ref(0),
      total: ref(0),
      subtotalusd: ref(0),
      impuestousd: ref(0),
      descuentousd: ref(0),
      totalusd: ref(0),
      nombrecliente: ref(''),
      correocliente: ref(''),
      telefonocliente: ref(''),
      direccioncliente: ref(''),
      idclienteventa: ref(''),
      nombreclienteventa: ref(''),
      documentoclientesolo: ref(''),
      documentoclienteventa: ref(''),
      fechahoy: ref(moment().format('DD/MM/YYYY')),
      fechaholds: ref(''),
      idhold: ref(''),
      iditemhold: ref(''),
      buscaritem: ref(false),
      modalrealizarventa: ref(false),
      noencontrado: ref(false),
      clientebuscado: ref(false),
      encontrado: ref(false),
      modalcliente: ref(false),
      dsbBtnCrearCliente: ref(true),
      modeldocumento: ref(null),
      modaldeleteholds: ref(false),
      optionsdocumento: [],
      rowsproductos: [],
      rowsproductosfiltre: [],
      holds: [],
      tasausd: ref(0),
      idusuario: ref(sessionStorage.getItem('id_usuario'))
    }
  },
  methods: {
    async actualizarCantidad (item, accion) {
      const idcantidad = document.getElementById('cantidad' + item.idproducto)
      if (accion === 1) {
        idcantidad.value = Number(idcantidad.value) + 1
        this.subtotal = (Number(this.subtotal) + item.precio).toFixed(2)
        this.impuesto = (Number(this.impuesto) + (item.precio * item.tasa / 100)).toFixed(2)
        this.total = (Number(this.total) + (Number(item.precio) + item.precio * item.tasa / 100)).toFixed(2)
      } else {
        if (idcantidad.value > 1) {
          this.subtotal = (Number(this.subtotal) - item.precio).toFixed(2)
          this.impuesto = (Number(this.impuesto) - (item.precio * item.tasa / 100)).toFixed(2)
          this.total = (Number(this.total) - (Number(item.precio) + item.precio * item.tasa / 100)).toFixed(2)
        }
        idcantidad.value = idcantidad.value <= 1 ? 1 : Number(idcantidad.value) - 1
      }
      item.total = (Number(item.precio) + (item.precio * item.tasa / 100)) * idcantidad.value
      // this.subtotalusd = (this.subtotal / this.tasausd).toFixed(2)
      // this.impuestousd = (this.impuesto / this.tasausd).toFixed(2)
      this.totalusd = (this.total / this.tasausd).toFixed(2)
      const resp = await this.updItemHolds(item.iditemhold, idcantidad.value, idcantidad.value * (Number(item.precio) + item.precio * item.tasa / 100), item.idproducto, accion)
      if (resp) {
        await this.calcularMonto(item)
      } else {
        console.log('resp input false')
        console.log(resp)
        idcantidad.value = idcantidad.value <= 1 ? 1 : Number(idcantidad.value) - 1
      }
      // document.getElementById('monto' + item.cod).innerHTML = 'Bs.' + item.monto
    },
    calcularMonto (item) {
      const idcantidad = document.getElementById('cantidad' + item.idproducto)
      if (idcantidad) {
        const cantidad = idcantidad.value > 0 ? idcantidad.value : 1
        this.holds.map((product) => {
          if (product.cod === item.cod) {
            product.monto = (product.precio * product.tasa / 100 + product.precio) * cantidad
            item.monto = product.monto
            product.cantidad = cantidad
          }
          return product
        })
        document.getElementById('monto' + item.idproducto).innerHTML = 'Bs.' + item.monto.toFixed(2)
      }
    },
    /* async crearItemHolds (idhold, idproducto, precio, cantidad, tasa, total, idunidad) {
      const body = {
        idhold,
        idproducto,
        precio,
        cantidad,
        tasa,
        total,
        idunidad
      }
      // console.log(body)
      await axios.post(ENDPOINT_PATH_V2 + 'ventas/setitemholds', body).then(async response => {
        const datos = response.data.resp
        if (datos) {
          return datos.iditemhold
        }
      }).catch(error => {
        Notify.create('Problemas al crear itemhold de venta ' + error)
      })
    }, */
    async updItemHolds (iditemhold, cantidad, total, idproducto, accion) {
      const body = {
        idproducto,
        iditemhold,
        cantidad,
        accion,
        total
      }
      // console.log(body)
      const response = await axios.post(ENDPOINT_PATH_V2 + 'ventas/upditemholds', body)
      console.log('response.status')
      console.log(response.status)
      if (response.status === 202) {
        this.$q.dialog({
          title: 'Ooops! ' + response.data.resp,
          message: ' Contacte al administrador del sistema.',
          html: true,
          ok: {
            color: 'primary',
            label: 'Aceptar'
          }
        })
        return false
      } else {
        return true
      }
    },
    openDeleteHolds () {
      this.modaldeleteholds = true
    },
    deleteHolds () {
      axios.delete(ENDPOINT_PATH_V2 + 'ventas/deleteholds/' + this.idhold).then(async response => {
        // console.log(response.data.success)
        this.modaldeleteholds = false
        this.listarHolds()
      }).catch(error => {
        Notify.create('Problemas al ELIMINAR Hold de venta ' + error)
      })
    },
    deleteItemHolds (item) {
      // console.log(item)
      const body = {
        iditemhold: item.iditemhold,
        idproducto: item.idproducto,
        cantidad: item.cantidad
      }
      // console.log(body)
      this.$q.dialog({
        title: 'Eliminar Item!',
        message: '¿Desea eliminar este item?',
        html: true,
        ok: {
          color: 'secondary',
          label: 'Sí'
        },
        cancel: {
          color: 'negative',
          label: 'No'
        },
        persistent: true
      }).onOk(() => {
        axios.post(ENDPOINT_PATH_V2 + 'ventas/deleteitemholds', body).then(async response => {
          // console.log(response.data.success)
          this.nombrecliente = ''
          this.listarHolds()
        }).catch(error => {
          Notify.create('Problemas al ELIMINAR itemhold de venta ' + error)
        })
      })
    },
    async additemholds (item) {
      // console.log(item)
      // console.log(this.holds)
      const descuento = this.descuento // DESCUENTO CERO POR DEFECTO
      let resp = false
      const find = this.holds.findIndex(obj => obj.idproducto === item.idproducto)
      // console.log(find)
      if (find === -1) {
        const monto = (item.precio * item.tasa / 100 + item.precio)
        // const iditemhold = await this.crearItemHolds(this.idhold, item.cod, item.precio, 1, item.tasa, monto, item.idunidad)
        const body = {
          idhold: this.idhold,
          idproducto: item.idproducto,
          precio: item.precio,
          cantidad: 1,
          tasa: item.tasa,
          total: monto,
          idunidad: item.idunidad,
          descuento
        }
        // console.log(body)
        await axios.post(ENDPOINT_PATH_V2 + 'ventas/setitemholds', body).then(async response => {
          const datos = response.data.resp
          if (response.data.success) {
            const obj = {}
            obj.idhold = this.idhold
            obj.iditemhold = datos.iditemhold
            obj.idproducto = item.idproducto
            obj.precio = item.precio
            obj.cantidad = 1
            obj.tasa = item.tasa
            obj.total = monto
            obj.producto = item.producto
            obj.categoria = item.categoria
            obj.descripcion = item.descripcion
            obj.descuento = descuento

            this.subtotal = (Number(this.subtotal) + (obj.precio * obj.cantidad)).toFixed(2)
            this.impuesto = (Number(this.impuesto) + (item.precio * item.tasa / 100)).toFixed(2)
            this.total = (Number(this.total) + monto).toFixed(2)
            this.totalusd = (this.total / this.tasausd).toFixed(2)
            this.holds.push(obj)
            resp = true
          } else {
            this.buscaritem = false
            this.slide = 2
          }
        }).catch(error => {
          Notify.create('Problemas al crear itemhold de venta ' + error)
        })
      } else { // si find
        this.holds[find].cantidad = Number(this.holds[find].cantidad) + 1
        const monto = (item.precio * item.tasa / 100 + item.precio)
        document.getElementById('monto' + item.idproducto).innerHTML = 'Bs.' + (monto * this.holds[find].cantidad).toFixed(2)
        this.subtotal = (Number(this.subtotal) + item.precio).toFixed(2)
        this.impuesto = (Number(this.impuesto) + (item.precio * item.tasa / 100)).toFixed(2)
        this.total = (Number(this.total) + monto).toFixed(2)
        resp = await this.updItemHolds(this.holds[find].iditemhold, this.holds[find].cantidad, monto * this.holds[find].cantidad, item.idproducto, 1)
      }
        // this.totalusd = (this.total / this.tasausd).toFixed(2)
        this.buscaritem = false
        this.slide = 2
      }
    },
    listarProductos () {
      const idcategoria = 0
      axios.get(ENDPOINT_PATH_V2 + 'productos/' + sessionStorage.getItem('co_empresa') + '/' + idcategoria).then(async response => {
        const datos = response.data.resp
        this.rowsproductos = []
        for (const i in datos) {
          const obj = {}
          obj.idproducto = datos[i].id
          obj.producto = datos[i].producto
          obj.id = datos[i].id
          obj.categoria = datos[i].categoria
          obj.descripcion = datos[i].descripcion
          obj.unidad = datos[i].unidad
          obj.idunidad = datos[i].idunidad
          obj.impuesto = datos[i].impuesto
          obj.precio = datos[i].precio
          obj.inventario = Number(datos[i].inventario1)
          obj.costo = datos[i].costo
          obj.tasa = datos[i].tasa
          this.rowsproductos.push(obj)
        }
        this.rowsproductosfiltre = this.rowsproductos
      }).catch(error => {
        Notify.create('Problemas al listar Categorias ' + error)
      })
    },
    abrirRealizarVenta () {
      console.log(this.holds)
      this.modalrealizarventa = true
    },
    realizarVenta () {
      const $this = this
      const body = {
        idhold: this.idhold,
        tasausd: this.tasausd,
        totalusd: this.totalusd,
        idempresa: sessionStorage.getItem('co_empresa')
      }
      axios.post(ENDPOINT_PATH_V2 + 'ventas/setventa', body).then(async response => {
        const datos = response.data
        if (datos.success) {
          this.$q.dialog({
            title: 'En hora buena!',
            message: '¡Venta # ' + datos.resp.numerointerno + ' realizada con éxito!',
            ok: {
              color: 'secondary',
              label: 'Aceptar'
            },
            persistent: true
          }).onOk(() => {
            $this.deleteHolds()
            console.log('VENTA REALIZADA')
          })
        }
      }).catch(error => {
        Notify.create('Problemas al crear hold de venta ' + error)
      })
      this.modalrealizarventa = false
    },
    abrirBuscarItem () {
      // console.log(this.nombrecliente.length)
      if (this.nombrecliente.length === 0) {
        console.log('Debe buscar cliente')
        this.abrirBuscarCliente()
      } else {
        this.buscaritem = true
      }
    },
    abrirBuscarCliente () {
      this.modalcliente = true
      this.documento = ''
      // this.modeldocumento = null
      console.log(this.optionsdocumento[0])
      this.modeldocumento = this.optionsdocumento[0]
      this.limpiarCliente()
    },
    limpiarCliente () {
      this.nombrecliente = ''
      this.telefonocliente = ''
      this.correocliente = ''
      this.direccioncliente = ''
      this.noencontrado = false
      this.encontrado = false
      this.clientebuscado = false
      this.dsbBtnCrearCliente = true
    },
    listarTiposDocumentos () {
      axios.get(ENDPOINT_PATH_V2 + 'tipodocumento').then(async response => {
        const datos = response.data.data
        this.optionsdocumento = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.tipodocumento = datos[i].tipodocumento
          obj.abrev = datos[i].abrev
          this.optionsdocumento.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Tipos ' + error)
      })
    },
    buscarCliente () {
      this.limpiarCliente()
      if (!this.modeldocumento) {
        Notify.create('Debe seleccionar TIPO DOCUMENTO')
        return
      }
      if (this.documento.length === 0) {
        Notify.create('Debe agregar DOCUMENTO')
        return
      }
      const body = {
        idtipodocumento: this.modeldocumento.cod,
        documento: this.documento
      }
      axios.post(ENDPOINT_PATH_V2 + 'clientes/buscar', body).then(async response => {
        const datos = response.data.resp
        if (datos.length > 0) {
          this.idcliente = datos[0].id
          this.nombrecliente = datos[0].nombre
          this.telefonocliente = datos[0].telefono
          this.correocliente = datos[0].correo
          this.direccioncliente = datos[0].direccion
          this.noencontrado = false
          this.encontrado = true
        } else {
          this.noencontrado = true
          this.encontrado = false
        }
        this.clientebuscado = true
        this.dsbBtnCrearCliente = false
      }).catch(error => {
        Notify.create('Problemas al buscar cliente ' + error)
      })
    },
    crearCliente () {
      // if (this.modeldocumento)
      // console.log(this.modeldocumento)
      if (!this.modeldocumento) {
        Notify.create('Debe seleccionar TIPO DOCUMENTO')
        return
      }
      if (this.documento.length === 0) {
        Notify.create('Debe agregar DOCUMENTO')
        return
      }
      if (this.nombrecliente.length === 0) {
        Notify.create('Debe agregar NOMBRE')
        return
      }
      if (!this.encontrado) {
        const body = {
          idtipodocumento: this.modeldocumento.cod,
          documento: this.documento,
          nombre: this.nombrecliente,
          telefono: this.telefonocliente,
          correo: this.correocliente,
          direccion: this.direccioncliente
        }
        axios.post(ENDPOINT_PATH_V2 + 'clientes/crear', body).then(async response => {
          const datos = response.data.resp
          if (datos) {
            this.modalcliente = false
            this.idclienteventa = datos
            this.nombreclienteventa = this.nombrecliente
            this.documentoclienteventa = this.modeldocumento.abrev + ' ' + this.documento
            this.crearHolds(datos, this.idusuario)
          }
        }).catch(error => {
          Notify.create('Problemas al crear cliente ' + error)
        })
      } else {
        this.modalcliente = false
        this.idclienteventa = this.idcliente
        this.nombreclienteventa = this.nombrecliente
        this.documentoclienteventa = this.modeldocumento.abrev + ' ' + this.documento
        this.crearHolds(this.idcliente, this.idusuario)
      }
    },
    crearHolds (idcliente, idusuario) {
      const idtipofactura = 1 // TIPO FACTURA ES FACTURA POR DEFECTO
      const body = {
        idcliente,
        idusuario,
        idtipofactura
      }
      axios.post(ENDPOINT_PATH_V2 + 'ventas/setholds', body).then(async response => {
        const datos = response.data.resp
        if (datos) {
          this.idhold = datos.idhold
          this.fechaholds = datos.fecha
        }
      }).catch(error => {
        Notify.create('Problemas al crear hold de venta ' + error)
      })
    },
    async listarHolds () {
      this.nombrecliente = ''
      await axios.get(ENDPOINT_PATH_V2 + 'ventas/gethols/' + sessionStorage.getItem('id_usuario')).then(async response => {
        // console.log(response.data)
        const datos = response.data.resp.length > 0 ? response.data.resp[0] : null
        // console.log(datos)
        this.holds = []
        // const obj = {}
        this.slide = 1
        this.subtotal = 0
        this.impuesto = 0
        this.total = 0
        if (datos) {
          this.idcliente = datos.idcliente
          this.nombrecliente = datos.nombre
          this.documentoclienteventa = datos.abrev + ' ' + datos.documento
          this.documentoclientesolo = datos.documento
          this.idhold = datos.idhold
          this.fechaholds = moment(datos.fecha).format('DD/MM/YYYY')
          await axios.get(ENDPOINT_PATH_V2 + 'ventas/getitemshols/' + this.idhold).then(async response => {
            this.holds = response.data.resp
            for (const i in this.holds) {
              const obj = this.holds[i]
              const sbttl = obj.precio * obj.cantidad
              const impto = sbttl * obj.tasa / 100
              const monto = impto + sbttl
              this.subtotal = (Number(this.subtotal) + sbttl).toFixed(2)
              this.impuesto = (Number(this.impuesto) + impto).toFixed(2)
              this.total = (Number(this.total) + monto).toFixed(2)
            }
            this.slide = this.holds.length > 0 ? 2 : 1
          }).catch(error => {
            Notify.create('Problemas al listar items Holds ' + error)
          })
        }
        // this.subtotalusd = (this.subtotal / this.tasa).toFixed(2)
        // this.impuestousd = (this.impuesto / this.tasa).toFixed(2)
        this.totalusd = (this.total / this.tasausd).toFixed(2)
        // this.holds.push(obj)
        /* for (const i in datos) {
        } */
      }).catch(error => {
        Notify.create('Problemas al listar Holds ' + error)
      })
    },
    primeraletra (item) {
      return item[0]
    },
    colorLetra (item) {
      const asciicode = item[0].charCodeAt(0)
      return '#' + asciicode + '0'
    },
    async cargar () {
      const datos = await axios.get(ENDPOINT_PATH_V2 + 'configuracion/' + sessionStorage.getItem('co_empresa'))
        .catch(error => {
          Notify.create('Problemas al listar Configuracion ' + error)
        })
      console.log(datos)
      return datos.data.resp
    }
  },
  /* watch: {
    textitem (val) {
      console.log('textitem')
      console.log(val)
      if (val.length > 0) {
        this.rowsproductosfiltre = this.rowsproductos.filter(obj => {
          if (obj.producto.toUpperCase().includes(val.toUpperCase())) {
            return true
          } else {
            return false
          }
        })
      } else {
        this.rowsproductosfiltre = this.rowsproductos
      }
      this.rowsproductosfiltre = this.rowsproductosfiltre.slice().reverse()
      console.log(this.rowsproductosfiltre)
    }
  }, */
  async mounted () {
    const datos = await this.cargar()
    this.tasausd = datos.tasabcv
    console.log('this.tasausd')
    console.log(this.tasausd)
    await this.listarTiposDocumentos()
    await this.listarHolds()
    await this.listarProductos()
  }
})
</script>

<style>
.encontrado {
  text-align: center;
  color: green;
  font-weight: bolder;
}
.noencontrado {
  text-align: center;
  color: red;
  font-weight: bolder;
}
.btncantidad {
  font-size: 10px;
  width: 33px;
}
.totales {
    background: #ededed;
    width: 100%;
}
.botones {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 5px;
}
.puntodeventa {
    height: 59vh;
    background: coral;
    display: flex;
    justify-content: center;
    overflow: auto;
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
.puntodeventaconitem {
    width: 95%;
    overflow: auto;
}
.tarjetaitem {
  margin: 3px;
}
.inputCantidad {
  width: 50px;
  text-align: center;
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
