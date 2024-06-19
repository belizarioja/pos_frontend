<template>
  <q-page class="row">
    <div class="col">
      <div class="botones row fondo-gris  shadow-up-9">

        <h6 class="p-2">Categorías</h6>

      </div>

      <div class="listarcategorias row" style="margin-top:20px">
        <q-btn no-caps unelevated dense class="gradient-btn " icon-right="add_circle" @click="buscaritem = true"
          label="Agregar categoria" style="margin: 10px;" />
      </div>

      <div class="listarcategorias row">

        <q-img v-if="slide === 1" src="img/sin-productos.png"
          style="width: 35%; height: auto; display: block; margin: auto" fit="contain" />
        <div v-else class="listarcategoriasconitem col">
          <div class="row justify-center">
            <q-card v-for="item in rows" :key="item"
              class="my-card tarjetaitem col-md-5 col-sm-11 col-xs-11  custom-shadow custom-border-radius" bordered>
              <q-item horizontal>
                <q-item-section>
                  <div class="text-h6">
                    <q-avatar text-color="white" :style="'background: ' + colorLetra(item.categoria)">
                      {{ primeraletra(item.categoria) }}
                    </q-avatar>
                    <span class="text-h6 color-texto ml-2">{{ item.categoria }}</span>
                  </div>

                </q-item-section>
                <q-item-section side>
                  <div style="display: flex;">
                    <q-btn round unelevated color="red-1" text-color="red-10" icon="delete"
                      style="margin-right: 10px;" />
                    <q-btn round unelevated color="orange-1" text-color="orange-10" icon="edit" />
                  </div>
                </q-item-section>
              </q-item>

              <q-item horizontal>
                <q-item-section avatar style="padding-right: 15px;align-items: center;">

                </q-item-section>

                <q-item-section class="tarjeticainside">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="description" color="grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Descripción:</q-item-label>
                      <p> {{ item.descripcion }}</p>
                    </q-item-section>
                  </q-item>

                </q-item-section>

              </q-item>

            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogo para crear caregoria -->
    <q-dialog v-model="buscaritem">
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section style=" display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Crear categoría</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-input outlined v-model="categoria" label="Categoría" stack-label>
              <template v-slot:prepend>
                <q-icon name="collections_bookmark" />
              </template>

            </q-input>
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-input outlined v-model="descripcion" label="Descripción" filled type="textarea">
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center ">
          <q-btn outline no-caps label="Cancelar" icon-right="close" color="primary" v-close-popup />
          <q-btn unelevated no-caps label="Aceptar (F4)" color="primary" icon-right="check" @click="crear"
            v-close-popup />
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
      rows: ref([]),
      slide: ref(2),
      categoria: ref(''),
      descripcion: ref(''),
      buscaritem: ref(false)
    }
  },
  methods: {
    listar() {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'categoria/' + sessionStorage.getItem('co_empresa')).then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.categoria = datos[i].categoria
          obj.descripcion = datos[i].descripcion
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Categorias ' + error)
      })
    },
    crear() {
      if (this.categoria.length === 0) {
        return
      }
      if (this.descripcion.length === 0) {
        return
      }
      const data = {
        categoria: this.categoria,
        descripcion: this.descripcion,
        idempresa: sessionStorage.getItem('co_empresa')
      }
      console.log(data)
      axios.post(ENDPOINT_PATH_V2 + 'categoria', data).then(async response => {
        this.modalcrear = false
        console.log(response.data)
        Notify.create(response.data.message)
        // this.limpiar()
        this.listar()
      })
    },
    primeraletra(item) {
      return item[0]
    },
    colorLetra(item) {
      const asciicode = item[0].charCodeAt(0)
      return '#' + asciicode + '0'
    }
  },
  mounted() {
    console.log('Modo producción')
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
</style>
