<template>
  <q-page class="bg-white">
    <div class="row" style="display: flex;justify-content: center;">
      <div style="width: 100%; padding: 10px;">
        <span style="font-size: 20px;color: #1b2df5;">Cliente:</span>
        <q-btn style="margin-left: 20px;" color="positive" icon-right="person_add_alt" @click="buscarcliente = true" label="Agregar cliente"/>
      </div>
      <div class="totales">
        <q-card class="my-card" bordered style="margin: 10px;">
          <q-card-section horizontal>
            <q-card-section style="display: grid;">
              <span>Subtotal:</span>
              <span>Impuesto:</span>
              <span>Descuento:</span>
              <span class="itemtotal">Total:</span>
            </q-card-section>

            <q-separator vertical />

            <q-card-section style="display: grid;">
              <span>Bs. 356,90</span>
              <span>Bs. 356,90</span>
              <span>Bs. 356,90</span>
              <span class="itemtotal">Bs. 356,90</span>
            </q-card-section>

            <q-separator vertical />

            <q-card-section style="display: grid;">
              <span>$ 56,90</span>
              <span>$ 56,90</span>
              <span>$ 56,90</span>
              <span class="itemtotal">$ 56,90</span>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="botones">
        <q-btn color="primary" icon="zoom_in" @click="buscaritem = true" label="Buscar" style="width: 50%;" />
        <q-btn color="secondary" icon-right="paid" label="Pagar" style="width: 50%;"/>
      </div>
      <div class="puntodeventa">
        <q-icon v-if="slide === 1" class="carritofondo" name="remove_shopping_cart"></q-icon>
        <div v-else class="puntodeventaconitem">
          <q-card v-for="i in 10" :key="i" class="my-card tarjetaitem">
            <q-item horizontal>
              <q-item-section>
                <q-item-label>{{i}} - Descripción del producto</q-item-label>
                <q-item-label caption>Categoría</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="red" icon="delete" />
              </q-item-section>
            </q-item>

            <q-item horizontal>
              <q-item-section avatar style="padding-right: 15px;align-items: center;">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                </q-avatar>
                <q-badge color="blue" style="margin-top: 5px;">
                  Bs 445
                </q-badge>
              </q-item-section>

              <q-item-section class="tarjeticainside">
                <div style="display: flex;">
                  <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Cantidad</div>
                    <input
                      class="inputCantidad"
                      value="2"
                    />
                  </div>
                  <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                    <div class="text-center">%Imp.</div>
                    <div class="text-secondary">exento</div>
                  </div>
                  <div style="display: grid;width: 33%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Monto</div>
                    <div class="text-secondary text-center">Bs. 556.99</div>
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
          <div class="">
            <q-input color="white" bg-color="orange"  rounded standout bottom-slots v-model="textitem" label="Buscar producto" counter>
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

        <q-card-section style="max-height: 65vh" class="scroll">
          <q-card v-for="i in 10" :key="i" class="my-card tarjetaitem">
            <q-item horizontal>
              <q-item-section avatar style="padding-right: 15px;align-items: center;">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                </q-avatar>
                <q-badge color="blue" style="margin-top: 5px;">
                  Bs 445
                </q-badge>
              </q-item-section>
              <q-item-section>
                <q-item-label>Descripción del producto - {{i}}</q-item-label>
                <q-item-label caption>Categoría - {{i}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="blue" icon="add_shopping_cart" />
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="buscarcliente" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6">Agregar cliente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-select filled v-model="modeldocumento" :options="optionsdocumento" label="Seleccione tipo documento" />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-input filled v-model="documento" label="Documento" stack-label />

          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-input filled v-model="nombre" label="Nombre cliente" stack-label />
        </q-card-section>

        <q-separator />
        <q-card-section>
          <q-input filled v-model="correo" label="Email cliente" stack-label />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input filled v-model="telefono" label="Teléfono cliente" stack-label />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Aceptar" color="secondary" v-close-popup />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    return {
      slide: ref(2),
      textitem: ref(''),
      documento: ref(''),
      nombre: ref(''),
      correo: ref(''),
      telefono: ref(''),
      buscaritem: ref(false),
      buscarcliente: ref(false),
      modeldocumento: ref(null),
      optionsdocumento: [
        'Cédula de identidad', 'Pasaporte', 'RIF', 'Extranjero'
      ]
    }
  },
  methods: {
    gotoHipismo () {
      this.$router.push('/hipismo')
    }
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
    height: 72vh;
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
    height: 70vh;
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
