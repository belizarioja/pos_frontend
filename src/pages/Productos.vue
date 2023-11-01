<template>
  <q-page class="bg-white">
    <div class="row" style="display: flex;justify-content: center;">
      <div class="botones">
        <q-btn color="secondary" icon="add_circle" @click="buscaritem = true" label="Agregar producto" style="margin: 10px;" />
      </div>
      <div class="puntodeventa">
        <q-icon v-if="slide === 1" class="carritofondo" name="remove_shopping_cart"></q-icon>
        <div v-else class="puntodeventaconitem">
          <q-card v-for="item in rows" :key="item" class="my-card tarjetaitem">
            <q-item horizontal>
              <q-item-section>
                <q-item-label>{{item.producto}}</q-item-label>
                <q-item-label caption>{{item.categoria}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div style="display: flex;">
                  <q-btn flat round color="red" icon="delete" />
                  <q-btn flat round color="blue" icon="edit" />
                </div>
              </q-item-section>
            </q-item>

            <q-item horizontal>
              <q-item-section avatar style="padding-right: 15px;align-items: center;">
                <q-avatar color="primary" text-color="white">
                  {{primeraletra(item.categoria)}}
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
                    <div class="text-center">Costo</div>
                    <div class="text-secondary text-center">{{item.costo}}</div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-card>
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
            <q-input filled v-model="producto" label="Producto" stack-label />

          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-input
          v-model="descripcion"
          label="Descripción de producto"
          filled
          type="textarea"
        />
        </q-card-section>

        <q-separator />
        <q-card-section>
          <div class="">
            <q-select
             filled
             v-model="modeltax"
             :options="optionstax"
             option-label="impuesto"
             option-value="cod"
             label="Seleccione impuesto"
             dense=""
            />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-select
             filled
             v-model="modelunidad"
             :options="optionsunidad"
             option-label="unidad"
             option-value="cod"
             label="Seleccione unidad"
             dense=""
            />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <q-input style="margin-right: 5px;" class="col" filled v-model="costo" label="Costo" stack-label dense />
            <q-input style="margin-left: 5px;" class="col" filled v-model="precio" label="Precio" stack-label dense />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="crear" v-close-popup />
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
      descripcion: ref(''),
      costo: ref(''),
      precio: ref(''),
      buscaritem: ref(false),
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
          obj.descripcion = datos[i].descripcion
          obj.unidad = datos[i].unidad
          obj.impuesto = datos[i].impuesto
          obj.precio = datos[i].precio
          obj.costo = datos[i].costo
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Categorias ' + error)
      })
    },
    crear () {
      if (this.producto.length === 0) {
        return
      }
      if (this.descripcion.length === 0) {
        return
      }
      const data = {
        idcategoria: this.model.cod,
        idimpuesto: this.modeltax.cod,
        idunidad: this.modelunidad.cod,
        descripcion: this.descripcion,
        producto: this.producto,
        costo: this.costo,
        precio: this.precio
      }
      axios.post(ENDPOINT_PATH_V2 + 'productos', data).then(async response => {
        this.modalcrear = false
        console.log(response.data)
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
    height: 87vh;
    background: #ededed;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.carritofondo {
  font-size: 170px;
  color: cornflowerblue;
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
</style>
