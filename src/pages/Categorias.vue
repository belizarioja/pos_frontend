<template>
  <q-page class="bg-white row">
    <div class="col">
      <div class="botones row" style="background: #ededed;">
        <q-btn color="secondary" icon="add_circle" @click="buscaritem = true" label="Agregar categoria" style="margin: 10px;" />
      </div>
      <div class="listarcategorias row">
        <q-icon v-if="slide === 1" class="carritofondo" name="remove_shopping_cart"></q-icon>
        <div v-else class="listarcategoriasconitem col">
          <div class="row justify-center">
            <q-card v-for="item in rows" :key="item" class="my-card tarjetaitem col-md-5 col-sm-11 col-xs-11">
              <q-item horizontal>
                <q-item-section>
                  <q-item-label>{{item.categoria}}</q-item-label>
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
                  <q-avatar text-color="white" :style="'background: ' + colorLetra(item.categoria)">
                    {{primeraletra(item.categoria)}}
                  </q-avatar>
                </q-item-section>

                <q-item-section class="tarjeticainside">
                  <div style="display: flex;">
                    {{item.descripcion}}
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
          <div class="text-h6">Crear categotía</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-input filled v-model="categoria" label="Categoría" stack-label />

          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-input
          v-model="descripcion"
          label="Descripción de categoría"
          filled
          type="textarea"
        />
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
      rows: ref([]),
      slide: ref(2),
      categoria: ref(''),
      descripcion: ref(''),
      buscaritem: ref(false)
    }
  },
  methods: {
    listar () {
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
    crear () {
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
    primeraletra (item) {
      return item[0]
    },
    colorLetra (item) {
      const asciicode = item[0].charCodeAt(0)
      return '#' + asciicode + '0'
    }
  },
  mounted () {
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
</style>
