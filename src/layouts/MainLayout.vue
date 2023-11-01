<template>
   <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title style="display: grid;">
          <span class="bienvenido">Bienvenido {{ nombreusuario }}</span>
          <span class="rulusuario">{{rol}} {{ empresa }} </span>
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
            <q-item clickable v-ripple @click="categorias" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="category" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Categorias</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="productos" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="secondary" name="inventory_2" />
              </q-item-section>
              <q-item-section>
                <div class="text-secondary">Productos</div>
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

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const saldoactual = ref(0.00)
    const nombreusuario = ref(sessionStorage.getItem('tx_nombre'))
    const rol = ref(sessionStorage.getItem('tx_rol'))
    const empresa = ref(sessionStorage.getItem('tx_empresa'))

    return {
      rol,
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
      this.$router.push('/')
    },
    puntodeventa () {
      this.$router.push('/puntodeventa')
    },
    categorias () {
      this.$router.push('/categorias')
    },
    productos () {
      this.$router.push('/productos')
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
