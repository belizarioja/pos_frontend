<template>
   <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title style="display: grid;">
          <span class="bienvenido">Bienvenido {{ nombreusuario }} "{{rol}}"</span>
          <span class="rulusuario">{{ empresa }} </span>
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="200"
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 95px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item clickable v-ripple @click="puntodeventa" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="point_of_sale" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Punto de venta</div>
              </q-item-section>
            </q-item>
            <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="categorias" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="category" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Categorias</div>
              </q-item-section>
            </q-item>
            <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="productos" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="inventory_2" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Productos</div>
              </q-item-section>
            </q-item>
            <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="configuracion" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="settings" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Configuración</div>
              </q-item-section>
            </q-item>
            <q-item v-if="corol === '1'" clickable v-ripple @click="empresas" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="store" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Emisores</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="ventas" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="view_list" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Ventas</div>
              </q-item-section>
            </q-item>
            <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="usuarios" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="people" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Usuarios</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="salir" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="logout" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Salir</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-img class="absolute-top" src="logo_sit.jpg" style="height: 100px"></q-img>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const saldoactual = ref(0.00)
    const nombreusuario = ref(sessionStorage.getItem('tx_nombre'))
    const rol = ref(sessionStorage.getItem('tx_rol'))
    const corol = ref(sessionStorage.getItem('co_rol'))
    const empresa = ref(sessionStorage.getItem('tx_empresa'))

    return {
      rol,
      corol,
      empresa,
      saldoactual,
      nombreusuario,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods: {

    salir () {
      this.$q.dialog({
        title: 'Confirmación!',
        message: '¿Está seguro que quieres cerrar sesión?',
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
        sessionStorage.removeItem('id_usuario')
        sessionStorage.removeItem('tx_nombre')
        sessionStorage.removeItem('tx_empresa')
        sessionStorage.removeItem('co_empresa')
        sessionStorage.removeItem('tx_rol')
        sessionStorage.removeItem('co_rol')
        this.$router.push('/')
      })
    },
    usuarios () {
      this.$router.push('/usuarios')
    },
    empresas () {
      this.$router.push('/empresas')
    },
    ventas () {
      this.$router.push('/ventas')
    },
    puntodeventa () {
      this.$router.push('/puntodeventa')
    },
    categorias () {
      this.$router.push('/categorias')
    },
    productos () {
      this.$router.push('/productos')
    },
    configuracion () {
      this.$router.push('/configuracion')
    },
    async cargar () {
      const datos = await axios.get(ENDPOINT_PATH_V2 + 'configuracion/' + sessionStorage.getItem('co_empresa'))
        .catch(error => {
          Notify.create('Problemas al listar Configuracion ' + error)
        })
      console.log(datos)
      return datos.data.resp
    }
  }
})
</script>
<style>
.bienvenido {
  font-size: 16px;
  font-weight: bolder;
}
.rulusuario {
  font-size: 18px;
  font-weight: bolder;
}
</style>
