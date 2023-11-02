<template>
  <q-page class="bg-white">
    <div class="row" style="display: flex;justify-content: center;">
      <div class="totales">
        <q-card class="my-card" bordered style="margin: 10px;">
          <q-card-section style="padding: 7px 16px;">
            <div style="width: 100%;">
              <span style="color: #000213;">Cliente:</span>
              <span style="color: #1b2df5;margin-left: 20PX;">{{nombrecliente.length > 0 ? nombrecliente : 'GENERAL'}}</span>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section horizontal>
            <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px;">
              <span>Subtotal:</span>
              <span>Impuesto:</span>
              <span>Descuento:</span>
              <span class="itemtotal">Total:</span>
            </q-card-section>

            <q-separator vertical />

            <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px;">
              <span>Bs. 356,90</span>
              <span>Bs. 356,90</span>
              <span>Bs. 356,90</span>
              <span class="itemtotal">Bs. 356,90</span>
            </q-card-section>

            <q-separator vertical />

            <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px;">
              <span>$ 56,90</span>
              <span>$ 56,90</span>
              <span>$ 56,90</span>
              <span class="itemtotal">$ 56,90</span>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="botones row">
        <q-btn class="col-6" color="primary" icon="zoom_in" @click="buscaritem = true" label="Agregar item"/>
        <q-btn class="col-6"  color="secondary" icon-right="paid" label="Pagar"/>
        <q-btn class="col-6"  color="negative" icon="cancel" @click="buscarcliente = true" label="Cancelar venta"/>
        <q-btn class="col-6"  color="positive" icon-right="person_add_alt" @click="abrirBuscarCliente" label="Agregar cliente"/>

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
                  <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Cantidad</div>
                    <input
                      class="inputCantidad"
                      value="2"
                    />
                  </div>
                  <div style="display: grid;width: 25%;justify-content: center;">
                    <q-btn class="btncantidad"  color="blue" icon-right="add_circle" @click="buscarcliente = true"/>
                    <q-btn class="btncantidad"  color="red" icon="remove_circle" @click="buscarcliente = true"/>
                  </div>
                  <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
                    <div class="text-center">%Imp.</div>
                    <div class="text-secondary">exento</div>
                  </div>
                  <div style="display: grid;width: 25%;font-size: 11px; justify-content: center;">
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
    <q-dialog v-model="modalcliente" position="top">
      <q-card style="max-height: 87vh;">
        <q-card-section>
          <div class="text-h6">Buscar cliente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="">
            <q-select
             filled
             v-model="modeldocumento"
             :options="optionsdocumento"
             option-label="tipodocumento"
             option-value="cod"
             label="Seleccione tipo documento"
             dense
            />

          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <q-input class="col-10"  filled v-model="documento" label="Documento" stack-label />
            <q-btn class="col-2" icon="search" color="secondary" @click="buscarCliente" />
          </div>
        </q-card-section>
        <div v-if="noencontrado" class="noencontrado">
            CLIENTE NO ENCONTRADO
        </div>
        <div v-if="encontrado" class="encontrado">
            CLIENTE ENCONTRADO
        </div>
        <q-separator v-if="clientebuscado"  />

        <q-card-section v-if="clientebuscado" >
          <q-input filled v-model="nombrecliente" label="Nombre cliente" stack-label  />
        </q-card-section>

        <q-separator v-if="clientebuscado" />
        <q-card-section v-if="clientebuscado" >
          <q-input filled v-model="correocliente" label="Email cliente" stack-label />
        </q-card-section>
        <q-separator v-if="clientebuscado" />
        <q-card-section v-if="clientebuscado" >
          <q-input filled v-model="telefonocliente" label="Teléfono cliente" stack-label />
        </q-card-section>
        <q-separator v-if="clientebuscado" />
        <q-card-section v-if="clientebuscado" >
          <q-input filled v-model="direccioncliente" label="Dirección cliente" stack-label />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Aceptar" color="secondary" @click="crearCliente" :disable="dsbBtnCrearCliente" />
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
      textitem: ref(''),
      documento: ref(''),
      nombrecliente: ref(''),
      correocliente: ref(''),
      telefonocliente: ref(''),
      direccioncliente: ref(''),
      buscaritem: ref(false),
      noencontrado: ref(false),
      clientebuscado: ref(false),
      encontrado: ref(false),
      modalcliente: ref(false),
      dsbBtnCrearCliente: ref(true),
      modeldocumento: ref(null),
      optionsdocumento: []
    }
  },
  methods: {
    abrirBuscarCliente () {
      this.modalcliente = true
      this.documento = ''
      this.modeldocumento = null
      this.limpiarCliente()
    },
    limpiarCliente () {
      this.nombrecliente = ''
      this.telefonocliente = ''
      this.correocliente = ''
      this.direccioncliente = ''
      this.noencontrado = false
      this.encontrado = false
      this.clientebuscado = false
    },
    listarTiposDocumentos () {
      axios.get(ENDPOINT_PATH_V2 + 'tipodocumento').then(async response => {
        const datos = response.data.data
        this.optionsdocumento = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.tipodocumento = datos[i].tipodocumento
          this.optionsdocumento.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Tipos ' + error)
      })
    },
    buscarCliente () {
      this.limpiarCliente()
      if (!this.modeldocumento) {
        Notify.create('Debe seleccionar TIPO DOCUMENTO')
        return
      }
      if (this.documento.length === 0) {
        Notify.create('Debe agregar DOCUMENTO')
        return
      }
      const body = {
        idtipodocumento: this.modeldocumento.cod,
        documento: this.documento
      }
      axios.post(ENDPOINT_PATH_V2 + 'clientes/buscar', body).then(async response => {
        const datos = response.data.resp
        if (datos.length > 0) {
          this.nombrecliente = datos[0].nombre
          this.telefonocliente = datos[0].telefono
          this.correocliente = datos[0].correo
          this.direccioncliente = datos[0].direccion
          this.noencontrado = false
          this.encontrado = true
        } else {
          this.noencontrado = true
          this.encontrado = false
        }
        this.clientebuscado = true
        this.dsbBtnCrearCliente = false
      }).catch(error => {
        Notify.create('Problemas al buscar cliente ' + error)
      })
    },
    crearCliente () {
      // if (this.modeldocumento)
      console.log(this.modeldocumento)
      if (!this.modeldocumento) {
        Notify.create('Debe seleccionar TIPO DOCUMENTO')
        return
      }
      if (this.documento.length === 0) {
        Notify.create('Debe agregar DOCUMENTO')
        return
      }
      if (this.nombrecliente.length === 0) {
        Notify.create('Debe agregar NOMBRE')
        return
      }
      const body = {
        idtipodocumento: this.modeldocumento.cod,
        documento: this.documento,
        nombre: this.nombrecliente,
        telefono: this.telefonocliente,
        correo: this.correocliente,
        direccion: this.direccioncliente
      }
      axios.post(ENDPOINT_PATH_V2 + 'clientes/crear', body).then(async response => {
        const datos = response.data.resp
        if (datos) {
          this.modalcliente = false
          this.idclienteventa = datos.id
          this.nombreclienteventa = this.nombrecliente
          this.documentoclienteventa = this.modeldocumento.abrev + ' ' + this.modeldocumento.documento
        }
      }).catch(error => {
        Notify.create('Problemas al crear cliente ' + error)
      })
    }
  },
  mounted () {
    console.log('Modo producción')
    this.listarTiposDocumentos()
  }
})
</script>

<style>
.encontrado {
  margin-top: -16px;
  text-align: center;
  color: green;
  font-weight: bolder;
}
.noencontrado {
  margin-top: -16px;
  text-align: center;
  color: red;
  font-weight: bolder;
}
.btncantidad {
  font-size: 10px;
  width: 33px;
}
.totales {
    background: #ededed;
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
  text-align: center;
  border-radius: 7px;
  border-color: lightblue;
}
.tarjeticainside {
  background: #ededed;
  padding: 10px;
  border-radius: 10px;
}
</style>
