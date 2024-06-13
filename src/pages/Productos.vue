<template>
  <q-page>
    <div class="col">
      <div class="botones row fondo-gris  shadow-up-9">

        <h6 class="p-4">Productos</h6>

      </div>
      <div class="botones ">
        <div class="row">
          <div class="col">
            <q-input color="blue-grey-3" bg-color="white" dense outlined v-model="textitem"
              label="Nombre o Sku de producto" style="margin: 5px; width: 310px;" autofocus>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="textitem = ''" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
          <div class="col" style="display: flex; justify-content: flex-end;">
            <q-btn no-caps unelevated dense class="gradient-btn " icon="add_circle" @click="openCrear"
              label="Agregar producto" style="margin: 10px;" />

          </div>
        </div>
      </div>

      <div class="listarproductos row">
        <q-icon v-if="slide === 1" class="carritofondo" name="remove_shopping_cart"></q-icon>
        <div v-else class="puntodeventaconitem col">
          <div v-if="buscadoproducto" class="row justify-center">
            <q-card v-for="item in rowsproductosfiltre" :key="item"
              class="my-card tarjetaitem col-md-5 col-sm-11 col-xs-11 custom-shadow custom-border-radius">
              <q-item horizontal>
                <q-item-section>
                  <q-item-label>{{ item.sku }} {{ item.producto }}</q-item-label>
                  <q-item-label caption>
                    <q-badge
                      :color="item.intipoproducto === '1' ? 'light-green-2' : item.intipoproducto === '2' ? 'deep-orange-2' : 'orange-2'"
                      style="margin-top: 5px;margin-right: 5px; color:#404d52">
                      {{ item.intipoproducto === '1' ? 'Simple' : item.intipoproducto === '2' ? 'Compuesto' :
                        'Servicio' }}
                    </q-badge>
                    {{ item.categoria }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div style="display: flex;">
                    <q-btn flat round v-if="item.intipoproducto === '2'" icon="dashboard_customize" style="margin: 3px;"
                      @click="openEditarCompuesto(item)" />
                    <q-btn flat round v-if="item.intipoproducto === '2'" icon="inventory_2" style="margin: 3px;"
                      @click="openAbrirCompuesto(item)" />
                    <q-btn v-show="false" flat round icon="delete" style="margin: 3px;" />
                    <q-btn flat round icon="edit" @click="openEditar(item)" style="margin: 3px;" />
                  </div>
                </q-item-section>
              </q-item>

              <q-item horizontal>
                <q-item-section avatar style="padding-right: 15px;align-items: center;">
                  <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)">
                    {{ primeraletra(item.producto) }}
                  </q-avatar>
                  <q-badge color="dark" style="margin-top: 5px;">
                    Bs.{{ item.precio }}
                  </q-badge>
                </q-item-section>

                <q-item-section class="tarjeticainside">
                  <div style="display: flex;">
                    {{ item.descripcion }}
                  </div>
                  <div style="display: flex;">
                    <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                      <div class="text-center">Unidad</div>
                      <div class="text-primary">{{ item.unidad }}</div>
                    </div>
                    <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                      <div class="text-center">Impuesto.</div>
                      <div class="text-primary">{{ item.impuesto }}</div>
                    </div>
                    <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                      <div class="text-center">Inventario</div>
                      <div class="text-center">
                        <q-badge v-if="item.inventario > 10" class="estatusbien">
                          {{ item.inventario }}
                        </q-badge>
                        <q-badge v-if="item.inventario > 0 && item.inventario <= 10" class="estatusmedio">
                          {{ item.inventario }}
                        </q-badge>
                        <q-badge v-if="item.inventario === 0" class="estatusmal">
                          {{ item.intipoproducto === '3' ? 'N/A' : 0 }}
                        </q-badge>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- CREAR PRODUCTOS -->
    <q-dialog v-model="buscaritem">
      <q-card class=" custom-shadow custom-border-radius">
        <q-card-section>
          <div class="text-h6 text-center color-texto">Crear producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row">
          <q-input class="col" filled v-model="sku" label="SKU" stack-label dense />
          <div class="col" style="padding: 0 10px;">
            <q-select filled v-model="modeltipoproducto" :options="optionstipoproducto" option-label="tipoproducto"
              option-value="id" label="Seleccione tipo" dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row">
          <div class="col" style="padding: 0 10px;">
            <q-select filled v-model="model" :options="options" option-label="categoria" option-value="cod"
              label="Seleccione categoría" dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-input filled v-model="producto" label="Producto" stack-label dense />

          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-input v-model="descripcion" label="Descripción de producto" filled rows="2" dense type="textarea" />
        </q-card-section>

        <q-separator />
        <q-card-section class="row">
          <div class="col">
            <q-select filled v-model="modeltax" :options="optionstax" option-label="impuesto" option-value="cod"
              label="Elija impuesto" dense />

          </div>
          <div class="col">
            <q-select filled v-model="modelunidad" :options="optionsunidad" option-label="unidad" option-value="cod"
              label="Elija unidad" dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <q-input style="margin-right: 5px;" type="number" min="0" class="col" filled v-model="costo"
              label="Costo Bs." stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="costousd" label="Costo USD" stack-label
              dense />
          </div>
          <div class="row">
            <q-input style="margin-right: 5px;" type="number" min="0" class="col" filled v-model="precio"
              label="Precio Bs." stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="preciousd" label="Precio USD" stack-label
              dense />
          </div>
          <div class="row">
            <q-input style="margin-right: 5px;" class="col" filled v-model="utilidad" label="Utilidad %" stack-label
              dense readonly />
            <q-input style="margin-left: 5px;" class="col" filled v-model="inventario" label="Inventario" stack-label
              dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">

          <q-btn outline no-caps icon-right="close" label="Cancelar" color="warning" v-close-popup />
          <q-btn unelevated no-caps label="Aceptar" color="warning" icon-right="check" @click="crear" v-close-popup />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- EDITAR PRODUCTOS -->
    <q-dialog v-model="editaritem" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row">
          <q-input class="col" filled v-model="sku" label="SKU" stack-label dense />
          <div class="col" style="padding: 0 10px;">
            <q-select filled disable v-model="modeltipoproducto" :options="optionstipoproducto"
              option-label="tipoproducto" option-value="id" label="Seleccione tipo" dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row">
          <div class="col" style="padding: 0 10px;">
            <q-select filled v-model="model" :options="options" option-label="categoria" option-value="cod"
              label="Seleccione categoría" dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-input filled v-model="producto" label="Producto" stack-label dense />

          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-input v-model="descripcion" label="Descripción de producto" filled dense type="textarea" />
        </q-card-section>

        <q-separator />
        <q-card-section class="row">
          <div class="col">
            <q-select filled v-model="modeltax" :options="optionstax" option-label="impuesto" option-value="cod"
              label="Elija impuesto" dense />

          </div>
          <div class="col">
            <q-select filled v-model="modelunidad" :options="optionsunidad" option-label="unidad" option-value="cod"
              label="Elija unidad" dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <q-input style="margin-right: 5px;" type="number" min="0" class="col" filled v-model="costo"
              label="Costo Bs." stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="costousd" label="Costo USD" stack-label
              dense />
          </div>
          <div class="row">
            <q-input style="margin-right: 5px;" type="number" min="0" class="col" filled v-model="precio"
              label="Precio Bs." stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="preciousd" label="Precio USD" stack-label
              dense />
          </div>
          <div class="row">
            <q-input style="margin-right: 5px;" class="col" filled v-model="utilidad" label="Utilidad %" stack-label
              dense readonly />
            <q-input style="margin-left: 5px;" class="col" filled v-model="inventario" label="Inventario" stack-label
              dense />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="editar" v-close-popup />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- BUSCAR y AGREGAR PRODUCTOS SIMPLES AL COMPUESTO-->
    <q-dialog v-model="buscarsimples" position="top" persistent>
      <q-card style="background: #ddd; width: 350px;">
        <q-card-section style="padding: 10px 15px 7px;">
          <div class="titulobuscar">Agregar item al Producto Compuesto</div>
          <div class="subtitulobuscar">{{ productocompuestoedit }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="padding: 10px 15px 7px;">
          <div class="">
            <q-input color="white" bg-color="primary" rounded standout bottom-slots v-model="textitemsimple"
              label="Nombre o Sku Producto Simple" counter autofocus>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="textitemsimple = ''" class="cursor-pointer" />
              </template>

              <template v-slot:hint>
                Cantidad de letras
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="buscadoproductosimple" style="max-height: 64vh" class="scroll">
          <q-card v-for="item in rowsproductosimple" :key="item.id" class="my-card tarjetaitem">
            <q-item horizontal>
              <q-item-section>
                <q-item-label>{{ item.producto }}</q-item-label>
                <q-item-label>SKU {{ item.sku }}</q-item-label>
                <q-item-label caption>{{ item.categoria }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div style="display: flex;">
                  <q-btn flat round color="blue" icon="add_box" @click="addproductosimple(item)"
                    style="font-size: 20px;"></q-btn>
                </div>
              </q-item-section>
            </q-item>

            <q-item horizontal>
              <q-item-section avatar style="padding-right: 15px;align-items: center;">
                <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)">
                  {{ primeraletra(item.producto) }}
                </q-avatar>
                <q-badge color="blue" style="margin-top: 5px;">
                  Bs. {{ item.precio }}
                </q-badge>
              </q-item-section>

              <q-item-section class="tarjeticainside">
                <div style="display: flex;">
                  {{ item.descripcion }}
                </div>
                <div style="display: flex;">
                  <div style="display: grid;width: 48%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Unidad</div>
                    <div class="text-secondary">{{ item.unidad }}</div>
                  </div>
                  <div style="display: grid;width: 48%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Impuesto.</div>
                    <div class="text-secondary">{{ item.impuesto }}</div>
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

    <!-- EDITAR PRODUCTOS SIMPLES DEL COMPUESTO -->
    <q-dialog v-model="buscarcompuestos" position="top" persistent>
      <q-card style="background: #ddd; width: 350px;">
        <q-card-section style="padding: 10px 15px 7px;">
          <div class="titulobuscar">Editar items del Producto Compuesto</div>
          <div class="subtitulobuscar">{{ productocompuestoedit }}</div>
        </q-card-section>

        <q-separator />
        <q-card-section v-if="rowsproductocompuesto.length === 0" style="padding: 10px 15px 7px;">
          <div class="titulonohay">No tiene item asignado</div>
        </q-card-section>
        <q-card-section style="max-height: 64vh" class="scroll">
          <q-card v-for="item in rowsproductocompuesto" :key="item.id" class="my-card tarjetaitem">
            <q-item horizontal>
              <q-item-section>
                <q-item-label>{{ item.producto }}</q-item-label>
                <q-item-label caption>SKU {{ item.sku }} - {{ item.categoria }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item horizontal>
              <q-item-section class="tarjeticainside">
                <div style="display: flex;">
                  <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Cantidad</div>
                    <input class="inputCantidad" :id="'cantidad' + item.cod" :value="item.cantidad"
                      pattern="^\d*(\.\d{0,2})?$" @input="calcularMonto(item)" />
                  </div>
                  <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Disponible</div>
                    <div class="text-secondary text-center">{{ item.inventario }}</div>
                  </div>
                  <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Unidad</div>
                    <div class="text-secondary text-center">{{ item.unidad }}</div>
                  </div>
                  <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Estimado</div>
                    <div :id="'estimado' + item.cod" class="text-secondary text-center">{{ item.estimado }}</div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cerrar" color="negative" v-close-popup />
          <q-btn label="Guardar" color="primary" @click="editarCompuesto" />
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
      slide: ref(2),
      inventariocompuesto: ref(0),
      rows: ref([]),
      rowsproductosfiltre: ref([]),
      rowsproductosimple: ref([]),
      rowsproductocompuesto: ref([]),
      textitemsimple: ref(''),
      textitem: ref(''),
      productocompuestoedit: ref(''),
      sku: ref(''),
      producto: ref(''),
      idproducto: ref(null),
      descripcion: ref(''),
      costo: ref(0),
      precio: ref(0),
      costousd: ref(0),
      preciousd: ref(0),
      utilidad: ref(0),
      inventario: ref(0),
      buscaritem: ref(false),
      buscarsimples: ref(false),
      buscarcompuestos: ref(false),
      editaritem: ref(false),
      model: ref(null),
      options: [],
      modeltax: ref(null),
      optionstax: [],
      modelunidad: ref(null),
      modeltipoproducto: ref(null),
      buscadoproducto: ref(true),
      buscadoproductosimple: ref(true),
      optionsunidad: ref([]),
      optionstipoproducto: ref([])
    }
  },
  methods: {
    calcularMonto(item) {
      console.log(item.inventario)
      const idcantidad = document.getElementById('cantidad' + item.cod)
      // console.log(idcantidad)
      if (idcantidad) {
        const cantidad = idcantidad.value > 0 ? idcantidad.value : 1
        console.log(item.inventario, cantidad)
        document.getElementById('estimado' + item.cod).innerHTML = (item.inventario / cantidad).toFixed(2)
      }
    },
    listar() {
      this.btndisable = false
      const idcategoria = 0
      axios.get(ENDPOINT_PATH_V2 + 'productos/' + sessionStorage.getItem('co_empresa') + '/' + idcategoria).then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.sku = datos[i].sku
          obj.producto = datos[i].producto
          obj.categoria = datos[i].categoria
          obj.idcategoria = datos[i].idcategoria
          obj.descripcion = datos[i].descripcion
          obj.unidad = datos[i].unidad
          obj.idunidad = datos[i].idunidad
          obj.impuesto = datos[i].impuesto
          obj.idimpuesto = datos[i].idimpuesto
          obj.intipoproducto = datos[i].intipoproducto
          obj.precio = datos[i].precio
          obj.costo = datos[i].costo
          obj.utilidad = datos[i].utilidad
          obj.preciousd = datos[i].preciousd
          obj.costousd = datos[i].costousd
          obj.inventario = Number(datos[i].inventario1) || 0
          this.rows.push(obj)
        }
        // console.log(this.rows)
        this.rowsproductosfiltre = this.rows
        this.rowsproductosimple = this.rows.filter(obj => Number(obj.intipoproducto) === 1)
        console.log('this.rowsproductosimple')
        console.log(this.rowsproductosimple)
      }).catch(error => {
        Notify.create('Problemas al listar Categorias ' + error)
      })
    },
    openEditarCompuesto(item) {
      console.log(item)
      this.idproducto = item.cod
      this.productocompuestoedit = item.producto
      this.buscarsimples = true
    },
    openAbrirCompuesto(item) {
      console.log(item)
      this.idproducto = item.cod
      this.productocompuestoedit = item.producto
      const body = {
        idproducto: item.cod
      }
      axios.post(ENDPOINT_PATH_V2 + 'productos/getcompuesto', body).then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rowsproductocompuesto = []
        this.minimacantidad = 1000000
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.sku = datos[i].sku
          obj.producto = datos[i].producto
          obj.categoria = datos[i].categoria
          obj.idcategoria = datos[i].idcategoria
          obj.descripcion = datos[i].descripcion
          obj.unidad = datos[i].unidad
          obj.idunidad = datos[i].idunidad
          obj.impuesto = datos[i].impuesto
          obj.idimpuesto = datos[i].idimpuesto
          obj.intipoproducto = datos[i].intipoproducto
          obj.precio = datos[i].precio
          obj.costo = datos[i].costo
          obj.utilidad = datos[i].utilidad
          obj.preciousd = datos[i].preciousd
          obj.costousd = datos[i].costousd
          obj.cantidad = datos[i].cantidad
          obj.inventario = Number(datos[i].inventario1) || 0
          obj.estimado = datos[i].cantidad > 0 ? (obj.inventario / datos[i].cantidad).toFixed(2) : 0

          this.rowsproductocompuesto.push(obj)
        }
        console.log(this.rowsproductocompuesto)
      }).catch(error => {
        Notify.create('Problemas al listar Productos Compuesto ' + error)
      })
      this.buscarcompuestos = true
    },
    addproductosimple(item) {
      console.log(item.idunidad)
      console.log(item.cod)
      console.log(this.idproducto)
      const data = {
        idunidad: item.idunidad,
        idproductohijo: item.cod,
        idproductopadre: this.idproducto,
        cantidad: 0
      }
      axios.post(ENDPOINT_PATH_V2 + 'productos/compuesto', data).then(async response => {
        this.modalcrear = false
        // console.log(response.data)
        Notify.create(response.data.message)
        // this.limpiar()
        this.buscarsimples = false
        this.listar()
      }).catch(error => {
        Notify.create('Problemas al Crear Producto Compuesto >>> ' + error)
      })
    },
    openEditar(item) {
      console.log(item.intipoproducto)
      console.log(this.optionstipoproducto)
      this.editaritem = true
      const find = this.options.find(obj => obj.cod === item.idcategoria)
      this.model = find
      const find2 = this.optionstax.find(obj => obj.cod === item.idimpuesto)
      this.modeltax = find2
      const find3 = this.optionsunidad.find(obj => obj.cod === item.idunidad)
      this.modelunidad = find3
      const find4 = this.optionstipoproducto.find(obj => obj.id === Number(item.intipoproducto))
      this.modeltipoproducto = find4
      console.log(find4)
      this.sku = item.sku
      this.descripcion = item.descripcion
      this.idproducto = item.cod
      this.producto = item.producto
      this.costo = item.costo
      this.inventario = item.inventario
      this.precio = item.precio
      this.costousd = item.costousd
      this.utilidad = item.utilidad
      this.preciousd = item.preciousd
    },
    openCrear() {
      // console.log(item)
      this.limpiar()
      this.buscaritem = true
    },
    limpiar() {
      this.model = null
      this.modeltax = null
      this.modelunidad = null
      this.sku = ''
      this.descripcion = ''
      this.producto = ''
      this.costo = 0
      this.costousd = 0
      this.inventario = ''
      this.precio = 0
      this.preciousd = 0
    },
    async editarCompuesto() {
      // console.log(this.idproducto)
      let minimo = 999999999
      for (const i in this.rowsproductocompuesto) {
        // console.log(this.rowsproductocompuesto[i])
        const item = this.rowsproductocompuesto[i]
        const cantidad = document.getElementById('cantidad' + item.cod).value
        const estimado = document.getElementById('estimado' + item.cod).innerHTML
        if (Number(estimado) < Number(minimo)) {
          minimo = estimado
        }
        const data = {
          idproductopadre: this.idproducto,
          idproductohijo: item.cod,
          cantidad
        }
        await axios.post(ENDPOINT_PATH_V2 + 'productos/updatecompuesto', data)
      }
      console.log(parseInt(minimo))
      const data2 = {
        idproducto: this.idproducto,
        inventario: parseInt(minimo)
      }
      await axios.post(ENDPOINT_PATH_V2 + 'productos/updateinventario', data2)
      this.buscarcompuestos = false

      this.listar()
    },
    editar() {
      if (this.producto.length === 0) {
        return
      }
      if (this.descripcion.length === 0) {
        return
      }
      if (this.precio.length === 0) {
        return
      }
      if (this.preciousd.length === 0) {
        return
      }
      if (this.inventario.length === 0) {
        return
      }
      const data = {
        id: this.idproducto,
        idcategoria: this.model.cod,
        idimpuesto: this.modeltax.cod,
        idunidad: this.modelunidad.cod,
        intipoproducto: this.modelunidad.id,
        descripcion: this.descripcion,
        producto: this.producto,
        sku: this.sku,
        costo: this.costo || 0,
        costousd: this.costousd || 0,
        inventario: Number(this.modeltipoproducto.id) === 3 ? 0 : this.inventario,
        utilidad: this.utilidad,
        precio: this.precio,
        preciousd: this.preciousd
      }
      axios.post(ENDPOINT_PATH_V2 + 'productos/updateproductos', data).then(async response => {
        this.modalcrear = false
        console.log(response.data)
        Notify.create(response.data.resp.message)
        // this.limpiar()
        this.listar()
      })
    },
    crear() {
      if (this.producto.length === 0) {
        return
      }
      if (this.descripcion.length === 0) {
        return
      }
      if (this.precio.length === 0) {
        return
      }
      if (this.preciousd.length === 0) {
        return
      }
      if (this.inventario.length === 0) {
        return
      }
      const data = {
        idcategoria: this.model.cod,
        idimpuesto: this.modeltax.cod,
        idunidad: this.modelunidad.cod,
        intipoproducto: this.modeltipoproducto.id,
        descripcion: this.descripcion,
        producto: this.producto,
        sku: this.sku,
        costo: this.costo,
        costousd: this.costousd,
        preciousd: this.preciousd,
        inventario: Number(this.modeltipoproducto.id) === 3 ? 0 : this.inventario,
        utilidad: this.utilidad,
        precio: this.precio
      }
      axios.post(ENDPOINT_PATH_V2 + 'productos', data).then(async response => {
        this.modalcrear = false
        // console.log(response.data)
        Notify.create(response.data.message)
        // this.limpiar()
        this.listar()
      }).catch(error => {
        Notify.create('Problemas al Crear Producto ' + error)
      })
    },
    listarCategoria() {
      axios.get(ENDPOINT_PATH_V2 + 'categoria/' + sessionStorage.getItem('co_empresa')).then(async response => {
        const datos = response.data.resp
        this.options = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.categoria = datos[i].categoria
          obj.descripcion = datos[i].descripcion
          this.options.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Categorias ' + error)
      })
    },
    listarImpuesto() {
      axios.get(ENDPOINT_PATH_V2 + 'impuestos').then(async response => {
        const datos = response.data.resp
        this.optionstax = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.impuesto = datos[i].impuesto
          obj.tasa = datos[i].tasa
          this.optionstax.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Impuestos ' + error)
      })
    },
    listarUnidades() {
      axios.get(ENDPOINT_PATH_V2 + 'unidades').then(async response => {
        const datos = response.data.resp
        this.optionsunidad = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.unidad = datos[i].unidad
          this.optionsunidad.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Unidades ' + error)
      })
    },
    primeraletra(item) {
      return item[0]
    },
    colorLetra(item) {
      const asciicode = item[0].charCodeAt(0)
      return '#' + asciicode + '0'
    },
    async cargar() {
      const datos = await axios.get(ENDPOINT_PATH_V2 + 'configuracion/' + sessionStorage.getItem('co_empresa'))
        .catch(error => {
          Notify.create('Problemas al listar Configuracion ' + error)
        })
      console.log(datos)
      return datos.data.resp
    }
  },
  watch: {
    textitem(val) {
      console.log('textitem')
      console.log(val)
      this.buscadoproducto = false
      if (val.length > 0) {
        this.rowsproductosfiltre = this.rowsproductosfiltre.filter(obj => {
          if (obj.producto.toUpperCase().includes(val.toUpperCase()) || (obj.sku && obj.sku.includes(val))) {
            return true
          } else {
            return false
          }
        })
      } else {
        this.rowsproductosfiltre = this.rows
      }
      this.buscadoproducto = true
    },
    textitemsimple(val) {
      console.log('textitemsimple')
      console.log(val)
      this.buscadoproductosimple = false
      if (val.length > 0) {
        this.rowsproductosimple = this.rowsproductosimple.filter(obj => {
          if (obj.producto.toUpperCase().includes(val.toUpperCase()) || (obj.sku && obj.sku.includes(val))) {
            return true
          } else {
            return false
          }
        })
      } else {
        this.rowsproductosimple = this.rows
      }
      this.buscadoproductosimple = true
    },
    costo() {
      if (this.costo > 0) {
        this.costousd = (this.costo / this.tasausd).toFixed(2)
        this.utilidad = ((this.precio - this.costo) / this.costo * 100).toFixed(2)
      } else {
        this.costousd = 0
        this.utilidad = 0
        this.costo = 0
      }
    },
    precio() {
      if (this.precio > 0) {
        this.preciousd = (this.precio / this.tasausd).toFixed(2)
        if (this.costo > 0) {
          this.utilidad = ((this.precio - this.costo) / this.costo * 100).toFixed(2)
        }
      } else {
        this.preciousd = 0
        this.utilidad = 0
        this.precio = 0
      }
    }
  },
  async mounted() {
    const datos = await this.cargar()
    this.tasausd = datos.tasabcv
    this.listar()
    this.listarCategoria()
    this.listarImpuesto()
    this.listarUnidades()
    let obj = {}
    obj.id = 1
    obj.tipoproducto = 'Simple'
    this.optionstipoproducto.push(obj)
    obj = {}
    obj.id = 2
    obj.tipoproducto = 'Compuesto'
    this.optionstipoproducto.push(obj)
    obj = {}
    obj.id = 3
    obj.tipoproducto = 'Servicio'
    this.optionstipoproducto.push(obj)
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

.listarproductos {
  display: flex;
  justify-content: center;
}

.carritofondo {
  font-size: 170px;
  color: white;
}

.itemtotal {
  font-size: 18px;
  color: #26a69a;
  font-weight: bolder;
}

.puntodeventaconitem {
  height: 85vh;
  width: 95%;
  overflow: auto;
}

.tarjetaitem {
  margin: 10px;
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

.estatusbien {
  color: #558B2F;
  background: #C5E1A5;
  width: 40px;
  justify-content: center;
}

.estatusmal {
  background: #EF9A9A;
  color: #C62828;
  width: 40px;
  justify-content: center;
}

.estatusmedio {
  background: #FFCC80;
  color: #EF6C00;
  width: 40px;
  justify-content: center;
}

.titulobuscar {
  font-size: 16px;
  font-weight: bolder;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subtitulobuscar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
}

.titulonohay {
  border: 1px solid #9c0707;
  font-size: 16px;
  font-weight: bolder;
  height: 81px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9c0707;
  border-radius: 10px;
  background: #d4b8b8;
}
</style>
