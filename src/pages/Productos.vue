<template>
  <q-page class="bg-white">
    <div class="col">
      <div class="botones row">
        <q-btn color="secondary" icon="add_circle" @click="buscaritem = true" label="Agregar producto" style="margin: 10px;" />
      </div>
      <div class="puntodeventa row">
        <q-icon v-if="slide === 1" class="carritofondo" name="remove_shopping_cart"></q-icon>
        <div v-else class="puntodeventaconitem col">
          <div class="row justify-center">
            <q-card v-for="item in rows" :key="item" class="my-card tarjetaitem col-md-5 col-sm-11 col-xs-11 ">
              <q-item horizontal>
                <q-item-section>
                  <q-item-label>{{item.producto}}</q-item-label>
                  <q-item-label caption>{{item.categoria}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div style="display: flex;">
                    <q-btn flat round color="red" icon="delete" />
                    <q-btn flat round color="blue" icon="edit" @click="openEditar(item)" />
                  </div>
                </q-item-section>
              </q-item>

              <q-item horizontal>
                <q-item-section avatar style="padding-right: 15px;align-items: center;">
                  <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)">
                    {{primeraletra(item.producto)}}
                  </q-avatar>
                  <q-badge color="blue" style="margin-top: 5px;">
                    {{item.precio}}
                  </q-badge>
                </q-item-section>

                <q-item-section class="tarjeticainside">
                  <div style="display: flex;">
                    {{item.descripcion}}
                  </div>
                  <div style="display: flex;">
                    <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                      <div class="text-center">Unidad</div>
                      <div class="text-secondary">{{item.unidad}}</div>
                    </div>
                    <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                      <div class="text-center">Impuesto.</div>
                      <div class="text-secondary">{{item.impuesto}}</div>
                    </div>
                    <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Inventario</div>
                    <div class="text-center">
                      <q-badge v-if="item.inventario > 10" class="estatusbien">
                        {{item.inventario}}
                      </q-badge>
                      <q-badge v-if="item.inventario > 0 && item.inventario <= 10" class="estatusmedio">
                        {{item.inventario}}
                      </q-badge>
                      <q-badge  v-if="item.inventario === 0" class="estatusmal">
                        {{item.inventario}}
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
    <q-dialog v-model="buscaritem" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">Crear producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-select
             filled
             v-model="model"
             :options="options"
             option-label="categoria"
             option-value="cod"
             label="Seleccione categoría"
             dense
            />

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
          <q-input
          v-model="descripcion"
          label="Descripción de producto"
          filled
          dense
          type="textarea"
        />
        </q-card-section>

        <q-separator />
        <q-card-section class="row">
          <div class="col">
            <q-select
             filled
             v-model="modeltax"
             :options="optionstax"
             option-label="impuesto"
             option-value="cod"
             label="Elija impuesto"
             dense
            />

          </div>
          <div class="col">
            <q-select
             filled
             v-model="modelunidad"
             :options="optionsunidad"
             option-label="unidad"
             option-value="cod"
             label="Elija unidad"
             dense
            />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <q-input style="margin-right: 5px;" class="col" filled v-model="costo" label="Costo" stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="precio" label="Precio" stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="inventario" label="Inventario" stack-label dense />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="crear" v-close-popup />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="editaritem" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-select
             filled
             v-model="model"
             :options="options"
             option-label="categoria"
             option-value="cod"
             label="Seleccione categoría"
             dense
            />

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
          <q-input
          v-model="descripcion"
          label="Descripción de producto"
          filled
          dense
          type="textarea"
        />
        </q-card-section>

        <q-separator />
        <q-card-section class="row">
          <div class="col">
            <q-select
             filled
             v-model="modeltax"
             :options="optionstax"
             option-label="impuesto"
             option-value="cod"
             label="Elija impuesto"
             dense
            />

          </div>
          <div class="col">
            <q-select
             filled
             v-model="modelunidad"
             :options="optionsunidad"
             option-label="unidad"
             option-value="cod"
             label="Elija unidad"
             dense
            />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <q-input style="margin-right: 5px;" class="col" filled v-model="costo" label="Costo" stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="precio" label="Precio" stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="inventario" label="Inventario" stack-label dense />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="editar" v-close-popup />
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
      slide: ref(2),
      rows: ref([]),
      producto: ref(''),
      idproducto: ref(null),
      descripcion: ref(''),
      costo: ref(''),
      precio: ref(''),
      inventario: ref(''),
      buscaritem: ref(false),
      editaritem: ref(false),
      model: ref(null),
      options: [],
      modeltax: ref(null),
      optionstax: [],
      modelunidad: ref(null),
      optionsunidad: []
    }
  },
  methods: {
    listar () {
      this.btndisable = false
      const idcategoria = 0
      axios.get(ENDPOINT_PATH_V2 + 'productos/' + sessionStorage.getItem('co_empresa') + '/' + idcategoria).then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.producto = datos[i].producto
          obj.categoria = datos[i].categoria
          obj.idcategoria = datos[i].idcategoria
          obj.descripcion = datos[i].descripcion
          obj.unidad = datos[i].unidad
          obj.idunidad = datos[i].idunidad
          obj.impuesto = datos[i].impuesto
          obj.idimpuesto = datos[i].idimpuesto
          obj.precio = datos[i].precio
          obj.costo = datos[i].costo
          obj.inventario = Number(datos[i].inventario1) || 0
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Categorias ' + error)
      })
    },
    openEditar (item) {
      // console.log(item)
      this.editaritem = true
      const find = this.options.find(obj => obj.cod === item.idcategoria)
      this.model = find
      const find2 = this.optionstax.find(obj => obj.cod === item.idimpuesto)
      this.modeltax = find2
      const find3 = this.optionsunidad.find(obj => obj.cod === item.idunidad)
      this.modelunidad = find3
      this.descripcion = item.descripcion
      this.idproducto = item.cod
      this.producto = item.producto
      this.costo = item.costo
      this.inventario = item.inventario
      this.precio = item.precio
    },
    limpiar () {
      this.model = null
      this.modeltax = null
      this.modelunidad = null
      this.descripcion = ''
      this.producto = ''
      this.costo = ''
      this.inventario = ''
      this.precio = ''
    },
    editar () {
      if (this.producto.length === 0) {
        return
      }
      if (this.descripcion.length === 0) {
        return
      }
      if (this.costo.length === 0) {
        return
      }
      if (this.precio.length === 0) {
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
        descripcion: this.descripcion,
        producto: this.producto,
        costo: this.costo,
        inventario: this.inventario,
        precio: this.precio
      }
      axios.post(ENDPOINT_PATH_V2 + 'productos/updateproductos', data).then(async response => {
        this.modalcrear = false
        // console.log(response.data)
        Notify.create(response.data.message)
        // this.limpiar()
        this.listar()
      })
    },
    crear () {
      if (this.producto.length === 0) {
        return
      }
      if (this.descripcion.length === 0) {
        return
      }
      if (this.costo.length === 0) {
        return
      }
      if (this.precio.length === 0) {
        return
      }
      if (this.inventario.length === 0) {
        return
      }
      const data = {
        idcategoria: this.model.cod,
        idimpuesto: this.modeltax.cod,
        idunidad: this.modelunidad.cod,
        descripcion: this.descripcion,
        producto: this.producto,
        costo: this.costo,
        inventario: this.inventario,
        precio: this.precio
      }
      axios.post(ENDPOINT_PATH_V2 + 'productos', data).then(async response => {
        this.modalcrear = false
        // console.log(response.data)
        Notify.create(response.data.message)
        // this.limpiar()
        this.listar()
      })
    },
    listarCategoria () {
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
    listarImpuesto () {
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
    listarUnidades () {
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
    primeraletra (item) {
      return item[0]
    },
    colorLetra (item) {
      const asciicode = item[0].charCodeAt(0)
      return '#' + asciicode + '0'
    }
  },
  mounted () {
    this.listar()
    this.listarCategoria()
    this.listarImpuesto()
    this.listarUnidades()
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
.puntodeventa {
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
  background: coral;
  width: 95%;
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
.estatusbien {
  color: white;
  background: blue;
  width: 40px;
  justify-content: center;
}
.estatusmal {
  background: red;
  color: white;
  width: 40px;
  justify-content: center;
}
.estatusmedio {
  background: yellow;
  color: black;
  width: 40px;
  justify-content: center;
}
</style>
