<template>
  <q-page class=" row">
    <div class="col">
      <div class="botones row fondo-gris  shadow-up-9">

        <h6 class="p-2">Usuarios</h6>

      </div>
      <div class="listarcategorias row" style="margin-top:20px">

        <q-btn no-caps unelevated dense icon-right="person_add" class="q-ml-sm col-md-4 col-sm-3 col-xs-3 gradient-btn"
          label="Crear Usuario" @click="openCreate()" style="width:150px" />
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
            <q-table title="Usuarios" :rows="rows" :columns="cols" row-key="num" :pagination="pagination"
              style="width: 95%; margin-top: 20px;" :loading="loading" :filter="filterTable"
              no-data-label="⚠ Sin registros " wrap-cells separator="cell"
              class="custom-shadow custom-border-radius-table">
              <template v-slot:body-cell-accion="props">
                <q-td :props="props">
                  <div align="center">
                    <q-btn round unelevated color="orange-1" text-color="orange-10" icon="edit"
                      @click.stop="openEdit(props.row)" />

                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-clave="props">
                <q-td :props="props">
                  <div align="center">
                    <q-btn icon="visibility" @click.stop="btnviewpass(props.row)" dense flat round color="grey-7" />
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

    <!-- MODAL PARA CREAR USUARIOS -->
    <q-dialog v-model="modalCreate" persistent>
      <q-card class="col-md-6 col-sm-11 col-xs-11" style="margin-top: 20px;">
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Crear Usuario</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-md-6 col-sm-12 col-xs-12" outlined v-model="usuario" label="Usuario" stack-label dense
              style="margin-bottom: 10px;" />
            <q-input class="col-md-5 col-sm-12 col-xs-12" outlined v-model="clave" label="Clave" stack-label dense />
          </div>
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-md-4 col-sm-12 col-xs-12" outlined v-model="nombre" label="Nombre" stack-label dense
              style="margin-bottom: 10px;" />
            <q-input class="col-md-7 col-sm-12 col-xs-12" outlined v-model="email" label="Email" stack-label dense />
          </div>
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-select dense class="col" outlined options-dense v-model="modelrol" :options="optionsrol"
              option-label="name" option-value="cod" label="Rol de usuario" style="margin: 10px;" />
          </div>
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-select dense class="col" outlined options-dense v-model="modelsede" :options="optionssede"
              option-label="name" option-value="cod" label="Emisores" style="margin: 10px;" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn outline no-caps label="Cancelar" icon-right="close" color="primary" v-close-popup />
          <q-btn unelevated no-caps label="Guardar" color="primary" icon-right="check" @click="crear" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- MODAL PARA EDITAR USUARIOS -->
    <q-dialog v-model="modalEdit" persistent>
      <q-card class="col-md-6 col-sm-11 col-xs-11" style="margin-top: 20px;">
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Editar usuario</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-md-6 col-sm-12 col-xs-12" outlined v-model="usuario" label="Usuario" stack-label dense
              style="margin-bottom: 10px;" />
            <q-input class="col-md-5 col-sm-12 col-xs-12" outlined v-model="clave" label="Clave" stack-label dense />
          </div>
        </q-card-section>
        <q-separator class="row" />
        <q-card-section>
          <div class="row justify-around">
            <q-input class="col-md-4 col-sm-12 col-xs-12" outlined v-model="nombre" label="Nombre" stack-label dense
              style="margin-bottom: 10px;" />
            <q-input class="col-md-7 col-sm-12 col-xs-12" outlined v-model="email" label="Email" stack-label dense />
          </div>
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
      <q-card>
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Actualizar Estatus</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div>
            ¿Desea {{ messageActualizar }} este usuario?
          </div>
        </q-card-section>
        <q-card-section align="center">
          <div style="display: flex; justify-content: space-evenly;margin-top: 20px;">
            <q-btn outline no-caps label="Cancelar" icon-right="close" color="primary" v-close-popup />
            <q-btn unelevated no-caps label="Aceptar (F4)" color="primary" icon-right="check" @click="actualizarEstatus"
              style="margin-left:10px" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- MODAL PARA VISUALIZAR CLAVE -->
    <q-dialog v-model="viewpass" persistent>
      <q-card style="width: auto;">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Esta información es secreta 🤫</span>
        </q-card-section>

        <q-card-section class="tarjeticainside">
          <q-item>
            <q-card-section avatar>
              <q-icon name="password_2" color="grey-7" />
            </q-card-section>
            <q-card-section>
              <q-card-label caption>Contraseña:</q-card-label>
              <p> {{ password }}</p>
            </q-card-section>
          </q-item>

        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Aceptar" color="primary" v-close-popup />
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
      cols: [
        { name: 'id', align: 'center', label: '🆔 ID', field: 'id' },
        { name: 'usuario', align: 'center', label: '👤 Usuario', field: 'usuario' },
        { name: 'clave', align: 'center', label: '🔑 Clave', field: 'clave' },
        { name: 'nombre', align: 'left', label: '📝 Nombre', field: 'nombre' },
        { name: 'email', align: 'left', label: '📧 Email', field: 'email' },
        { name: 'empresa', align: 'left', label: '🏢 Empresa', field: 'empresa' },
        { name: 'rol', align: 'left', label: '🎭 Rol', field: 'rol' },
        { name: 'estatus', align: 'left', label: '🔄 Estatus', field: 'estatus' },
        { name: 'accion', align: 'left', label: '🔧 Accion', field: 'accion' }
      ],
      co_rol: ref(sessionStorage.getItem('co_rol')),
      co_empresa: ref(sessionStorage.getItem('co_empresa')),
      filterTable: ref(''),
      buscaritem: ref(false),
      loading: ref(false),
      modalEdit: ref(false),
      modalCreate: ref(false),
      modalUpdEstatus: ref(false),
      usuario: ref(''),
      clave: ref(''),
      nombre: ref(''),
      email: ref(''),
      modelrol: ref(''),
      optionsrol: ref([]),
      modelsede: ref(''),
      viewpass: ref(false),
      optionssede: ref([]),
      pagination: {
        page: 1,
        rowsPerPage: 20 // 0 means all rows
      }
    }
  },
  methods: {
    listarSedes() {
      axios.get(ENDPOINT_PATH_V2 + 'sede').then(async response => {
        const datos = response.data.data
        this.optionssede = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].empresa
          if (this.co_rol === '1') {
            this.optionssede.push(obj)
          } else {
            if (this.co_empresa === obj.cod) {
              this.optionssede.push(obj)
              this.modelsede = this.optionssede[0]
            }
          }
        }
      }).catch(error => {
        Notify.create('Problemas al listar Sedes ' + error)
      })
    },
    listarRoles() {
      axios.get(ENDPOINT_PATH_V2 + 'usuario/roles').then(async response => {
        const datos = response.data.resp
        this.optionsrol = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].rol
          if (datos[i].id === '1') {
            if (this.co_rol === '1') {
              this.optionsrol.push(obj)
            }
          } else {
            this.optionsrol.push(obj)
          }
        }
      }).catch(error => {
        Notify.create('Problemas al listar Roles ' + error)
      })
    },
    openCreate() {
      this.idUpd = ''
      this.usuario = ''
      this.clave = ''
      this.email = ''
      this.nombre = ''
      this.modalCreate = true
    },
    openEdit(row) {
      console.log(row)
      this.idUpd = row.id
      this.usuario = row.usuario
      this.clave = row.clave
      this.email = row.email
      this.nombre = row.nombre
      this.modalEdit = true
    },
    crear() {
      console.log(this.modelrol)
      console.log(this.modelsede)
      const body = {
        usuario: this.usuario || '',
        clave: this.clave || '',
        email: this.email || '',
        idrol: this.modelrol.cod,
        idempresa: this.modelsede.cod,
        nombre: this.nombre || ''
      }
      axios.post(ENDPOINT_PATH_V2 + 'usuario/', body).then(async response => {
        console.log(response.status)
        if (response.status === 200) {
          const datos = response.data.resp
          console.log(datos)
          Notify.create(datos)
          this.modalCreate = false
          this.listar()
        }
      }).catch(error => {
        Notify.create('Problemas al actualizar Configuracion ' + error)
      })
    },
    guardar() {
      const body = {
        usuario: this.usuario || '',
        clave: this.clave || '',
        email: this.email || '',
        nombre: this.nombre || ''
      }
      axios.put(ENDPOINT_PATH_V2 + 'usuario/' + this.idUpd, body).then(async response => {
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
    btnOpenUpdEstatus(row) {
      this.idUpd = row.id
      this.messageActualizar = row.estatus === '1' ? 'desactivar' : 'activar'
      this.estatusAct = row.estatus
      this.modalUpdEstatus = true
    },
    actualizarEstatus() {
      const data = {
        estatus: this.estatusAct === '1' ? 0 : 1
      }
      axios.put(ENDPOINT_PATH_V2 + 'usuario/estatus/' + this.idUpd, data).then(async response => {
        if (response.status === 200) {
          const datos = response.data.resp
          console.log(datos)
          Notify.create(datos)
          this.modalUpdEstatus = false
          this.listar()
        }
      })
    },
    listar() {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'usuario').then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.usuario = datos[i].usuario
          obj.clave = datos[i].clave
          obj.nombre = datos[i].nombre
          obj.email = datos[i].email
          obj.rol = datos[i].rol
          obj.idrol = datos[i].idrol
          obj.empresa = datos[i].empresa
          obj.idempresa = datos[i].idempresa
          obj.estatus = datos[i].estatus
          if (this.co_rol === '1') {
            this.rows.push(obj)
          } else {
            if (this.co_empresa === obj.idempresa) {
              this.rows.push(obj)
            }
          }
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Emisores ' + error)
      })
    },
    btnviewpass(row) {
      console.log(row)
      this.password = row.clave
      this.viewpass = true
    }
  },
  mounted() {
    console.log('Listar emisores')
    this.listarSedes()
    this.listarRoles()
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

.botonesU {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 50px;
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
