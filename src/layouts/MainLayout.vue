<template>
  <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2">
    <q-header class="bg-accent">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" color="primary" />
        <q-toolbar-title style="display: grid;">
          <span class="rulusuario"> {{ empresa }} </span>
          <span class="bienvenido">{{ nombreusuario }} "{{ rol }}"</span>
        </q-toolbar-title>
        <q-btn flat dense icon="logout" aria-label="Salir" @click="salir" color="primary" />
      </q-toolbar>
    </q-header>
    <!-- <q-drawer bordered overlay
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"
      show-if-above
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="inbox" ></q-icon>
            </q-item-section>

            <q-item-section>
              Inbox
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer> -->
    <q-drawer overlay bordered v-model="leftDrawerOpen" show-if-above :width="120" :breakpoint="600">
      <q-scroll-area style="height: calc(100% - 30px); margin-top: 20px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple @click="puntodeventa">
            <q-item-section>
              <div class="text-accent text-center"><q-icon color="accent" name="receipt_long" size="40px" />
              </div>
              <div class="text-accent text-center" style="font-size: 10px;">Punto de venta</div>
            </q-item-section>
          </q-item>
          <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="categorias">
            <q-item-section>
              <div class="text-accent text-center"><q-icon color="accent" name="collections_bookmark" size="40px" />
              </div>
              <div class="text-accent text-center" style="font-size: 10px;">Categorias</div>
            </q-item-section>
          </q-item>
          <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="productos">
            <q-item-section>
              <div class="text-accent text-center"><q-icon color="accent" name="inventory_2" size="40px" /></div>
              <div class="text-accent text-center" style="font-size: 10px;">Productos</div>
            </q-item-section>
          </q-item>
          <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="configuracion">
            <q-item-section>
              <div class="text-accent text-center"><q-icon color="accent" name="settings" size="40px" /></div>
              <div class="text-accent text-center" style="font-size: 10px;">Configuración</div>
            </q-item-section>
          </q-item>
          <q-item v-if="corol === '1'" clickable v-ripple @click="empresas">
            <q-item-section>
              <div class="text-accent text-center"><q-icon color="accent" name="store" size="40px" /></div>
              <div class="text-accent text-center" style="font-size: 10px;">Emisores</div>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="ventas">
            <q-item-section>
              <div class="text-accent text-center"><q-icon color="accent" name="payments" size="40px" /></div>
              <div class="text-accent text-center" style="font-size: 10px;">Ventas</div>
            </q-item-section>
          </q-item>
          <q-item v-if="corol === '1' || corol === '2'" clickable v-ripple @click="usuarios">
            <q-item-section>
              <div class="text-accent text-center"><q-icon color="accent" name="people" size="40px" /></div>
              <div class="text-accent text-center" style="font-size: 10px;">Usuarios</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <!-- <q-img class="absolute-top" src="logo_sit.jpg" style="height: 100px"></q-img> -->
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
  setup() {
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
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods: {

    salir() {
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
    usuarios() {
      this.$router.push('/usuarios')
    },
    empresas() {
      this.$router.push('/empresas')
    },
    ventas() {
      this.$router.push('/ventas')
    },
    puntodeventa() {
      this.$router.push('/puntodeventa')
    },
    categorias() {
      this.$router.push('/categorias')
    },
    productos() {
      this.$router.push('/productos')
    },
    configuracion() {
      this.$router.push('/configuracion')
    },
    async cargar() {
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
  font-size: 15px;
  /* font-weight: bolder; */
}

.rulusuario {
  font-size: 16px;
  font-weight: bolder;
  text-transform: capitalize;
}
</style>
