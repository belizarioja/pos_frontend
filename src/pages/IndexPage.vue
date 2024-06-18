<template>
  <q-page>

    <!-- Banner con 3 secciones -->

    <q-banner class="fondo-gris shadow-up-9">
      <div class="row">
        <!-- Columna con información del cliente -->
        <div class="col ">
          <div class="texto-pequeno ellipsis">Cliente:</div>
          <div class="negrita ellipsis">{{ nombrecliente.length > 0 ? nombrecliente : 'S/INF' }}</div>
          <div>{{ documentoclienteventa }}</div>
        </div>

        <!-- Columna con fecha de venta y tasa BCV -->
        <div class="col  bd-left ">
          <div class="row">
            <div class="col-1 logo-bcv ">
              <img src="public/logo_bcv.png">
            </div>
            <div class="col ">
              <div class="texto-pequeno ellipsis">🗓️ Fecha de venta:</div>
              <div class="negrita ellipsis">{{ nombrecliente.length > 0 ? fechaholds : fechahoy }}</div>
              <div class="texto-pequeno ellipsis">Tasa del día (BCV):</div>
              <q-chip dense color="green-2" text-color="green-9" class="negrita ellipsis">🇻🇪 Bs.{{
                parseFloat(tasausd).toFixed(2) }}</q-chip>
            </div>
          </div>
        </div>

        <!-- Columna con subtotal, impuesto, descuento y total en USD -->
        <div class="col  bd-left ">
          <div class="row">
            <div class="col-1">
              <div class="texto-pequeno ellipsis">💵
              </div>
              <div class="texto-pequeno ellipsis">🏛️
              </div>
              <div class="texto-pequeno ellipsis">🏷️
              </div>

            </div>
            <div class="col">
              <div class="texto-pequeno ellipsis">Subtotal:
              </div>
              <div class="texto-pequeno ellipsis">Impuesto:
              </div>
              <div class="texto-pequeno ellipsis">Descuento:
              </div>
              <q-chip dense color="green-2" text-color="green-9" class="negrita ellipsis">$ {{ totalusd
                }}</q-chip>
            </div>
            <div class="col">
              <div class="negrita ellipsis">Bs. {{ subtotal }}</div>
              <div class="negrita ellipsis">Bs. {{ impuesto }}</div>
              <div class="negrita ellipsis">Bs. {{ descuento }}</div>
              <q-chip dense class="color-degradado-vnz negrita ellipsis text-degradado color-texto">Bs. {{ total
                }}</q-chip>
            </div>
          </div>
        </div>

      </div>
    </q-banner>

    <!-- Sección de botones principales y secundarios -->
    <div class="q-px-md q-py-sm q-gutter-sm row items-center justify-between">
      <!-- Botones principales -->
      <div class="col-10 col-md-auto text-center">
        <q-btn-group unelevated>
          <q-btn no-caps unelevated color="accent" icon-right="add" @click="abrirBuscarItem"
            label="Agregar item (F2)" />
          <q-btn outline no-caps unelevated color="accent" icon-right="person" @click="abrirBuscarCliente"
            label="Agregar cliente (F3)" />
          <q-btn outline unelevated no-caps color="accent" icon="cancel_presentation" @click="abrirBuscarFactura"
            label="Anular documento" class="boton-banner" />
          <q-btn outline unelevated no-caps color="accent" icon="settings_backup_restore" @click="abrirBuscarFactura"
            label="Devoluciones" class="boton-banner" :disable="true" />
        </q-btn-group>
      </div>

      <!-- Botones secundarios -->
      <div class="col-12 col-md-auto text-center">
        <q-btn-group unelevated>
          <q-btn outline unelevated no-caps color="primary" icon-right="close" @click="openDeleteHolds" label="Cancelar"
            :disable="holds.length <= 0" />
          <q-btn no-caps unelevated class="gradient-btn" icon-right="point_of_sale" @click="abrirRealizarVenta"
            label="Realizar venta (F6)" :disable="holds.length <= 0" />

        </q-btn-group>
      </div>
    </div>

    <!-- Sección las tarjetas -->
    <div class="puntodeventa row mt-2">
      <q-img v-if="slide === 1" src="img/sin-productos.png" style=" width: 35% ; height: auto;" fit="contain" />
      <div v-else class="puntodeventaconitem col">
        <div class="row justify-center">

          <q-card class="my-card custom-shadow custom-border-radius col-md-5 col-sm-11 col-xs-11" bordered
            v-for="item in holds" :key="item" style="margin:10px;">
            <q-card-section>
              <div class="row items-center no-wrap">
                <q-img class="rounded-borders col-3" src="img/no-photo.png" />
                <div class="col-9">
                  <div class="row items-center justify-between q-mb-md" style="margin:10px;">
                    <div class="row items-center col">
                      <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)" class="q-mr-sm">
                        {{ primeraletra(item.producto) }}
                      </q-avatar>
                      <div>
                        <div class="text-h6">
                          {{ item.producto }}
                        </div>
                        <div class="text-grey">
                          {{ item.categoria }}
                        </div>
                      </div>
                    </div>
                    <q-btn round unelevated color="red-1" text-color="red-10" icon="delete"
                      @click="deleteItemHolds(item)" style="margin:0" />
                  </div>
                  <div class="tarjeticainside" style="margin:10px;">
                    <span class="color-texto">Precio unitario: <b>Bs {{ item.precio }}</b> </span><br>
                    <span class="color-texto">🏛️ Imp %: <b>{{ item.tasa }}</b></span><br>
                    <span :id="'monto' + item.idproducto" class="precio">Bs. {{ item.total }}</span>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="center">

              <span style="margin-right: 10px;">Cantidad</span>
              <input class="inputCantidad" :id="'cantidad' + item.idproducto" :value="item.cantidad"
                @input="calcularMonto(item)" style="margin-right: 10px;" />

              <q-btn round unelevated class="btncantidad" icon="remove" color="red-1" text-color="red-10"
                @click="actualizarCantidad(item, 2)" style="margin-right: 10px;" />
              <q-btn round unelevated class="btncantidad" color="green-1" text-color="green-10" icon="add"
                @click="actualizarCantidad(item, 1)" />

            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Sección de modales -->
    <!-- BUSCAR ITEMS DE PRODUCTOS -->
    <q-dialog v-model="buscaritem">
      <q-card class="q-pa-lg custom-shadow custom-border-radius" style=" width: 400px;">
        <q-card-section style="padding: 10px 15px 7px;">
          <div class="">
            <q-input color="blue-grey-3" outlined standout bottom-slots v-model="textitem"
              label="Nombre o Sku de producto" counter autofocus>
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

        <q-card-section v-if="buscadoproducto" style="max-height: 64vh" class="scroll">
          <q-card v-for="item in rowsproductosfiltre" :key="item.id" class=" custom-shadow custom-border-radius"
            style="margin:10px">
            <q-item horizontal>
              <q-item-section>
                <q-item-label>{{ item.producto }}</q-item-label>
                <q-item-label>
                  <q-badge
                    :color="item.intipoproducto === '1' ? 'light-green-2' : item.intipoproducto === '2' ? 'deep-orange-2' : 'orange-2'"
                    style="margin-top: 5px;margin-right: 5px; border-radius: 10%; color:#404d52">
                    {{ item.intipoproducto === '1' ? 'Simple' : item.intipoproducto === '2' ? 'Compuesto' : 'Servicio'
                    }}
                  </q-badge>
                  SKU {{ item.sku }}
                </q-item-label>
                <q-item-label caption>{{ item.categoria }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div style="display: flex;">
                  <q-btn flat round color="primary" icon="add_shopping_cart" @click="additemholds(item)" />
                </div>
              </q-item-section>
            </q-item>

            <q-item horizontal>
              <q-item-section avatar style="padding-right: 15px;align-items: center;">
                <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)">
                  {{ primeraletra(item.producto) }}
                </q-avatar>
                <q-badge color="dark" style="margin-top: 5px;">
                  Bs. {{ item.precio }}
                </q-badge>
              </q-item-section>

              <q-item-section class="tarjeticainside">
                <div style="display: flex;">
                  {{ item.descripcion }}
                </div>
                <div style="display: flex;">
                  <div style="display: grid;width: 48%;font-size: 11px; justify-content: center;">
                    <div class="text-left">Unidad</div>
                    <div class="text-primary">{{ item.unidad }}</div>
                  </div>
                  <div style="display: grid;width: 48%;font-size: 11px; justify-content: center;">
                    <div class="text-center">Impuesto.</div>
                    <div class="text-primary">{{ item.impuesto }}</div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn outline no-caps icon-right="close" label="Cancelar" color="warning" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- BUSCAR Y AGREGAR CLIENTES A LA VENTA -->

    <q-dialog v-model="modalcliente">
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section class="text-center">
          <h6>Buscar cliente</h6>
        </q-card-section>
        <q-separator />
        <q-card-section style="padding: 15px;">
          <div class="">
            <q-select outlined v-model="modeldocumento" :options="optionsdocumento" option-label="tipodocumento"
              option-value="cod" label="Seleccione tipo documento">
              <template v-slot:prepend>
                <q-icon name="badge" />
              </template>
            </q-select>

          </div>
        </q-card-section>
        <q-card-section style="padding: 10px 15px;">
          <div class="row">
            <q-input class="col-10" outlined v-model="documento" label="Documento" stack-label autofocus
              v-on:keyup.enter="buscarCliente">
              <template v-slot:prepend>
                <q-icon name="badge" />
              </template>
            </q-input>
            <q-btn class="col-2" icon="search" unelevated color="accent" @click="buscarCliente" />
          </div>
        </q-card-section>
        <div v-if="noencontrado" class="noencontrado">
          <p class="text-noencontrado">Lo sentimos, no existe un cliente con ese documento</p>

        </div>
        <div v-if="encontrado" class="encontrado">
          <p class="text-encontrado">Cliente encontrado</p>
        </div>
        <q-separator v-if="clientebuscado" />
        <q-card-section v-if="clientebuscado" style="padding: 15px;">
          <q-input outlined v-model="nombrecliente" label="Nombre del cliente" stack-label>
            <template v-slot:prepend>
              <q-icon name="badge" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="clientebuscado" style="padding:  15px;">
          <q-input outlined v-model="correocliente" label="Email del cliente" stack-label>
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="clientebuscado" style="padding: 15px;">
          <q-input outlined v-model="telefonocliente" label="Teléfono del cliente" stack-label>
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="clientebuscado" style="padding: 15px;">
          <q-input outlined v-model="direccioncliente" label="Dirección del cliente" stack-label>
            <template v-slot:prepend>
              <q-icon name="location_on" />
            </template>
          </q-input>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn outline no-caps label="Cancelar" icon-right="close" color="warning" @click="limpiarCliente"
            v-close-popup />
          <q-btn unelevated no-caps label="Aceptar (F4)" color="warning" icon-right="check" @click="crearCliente"
            :disable="dsbBtnCrearCliente" />
        </q-card-actions>
        <q-card-actions align="center" style="color: #404d52;">
          Presione ESC para salir
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- LIMPIAR HOLDS DE VENTA -->
    <q-dialog v-model="modaldeleteholds" persistent>
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section style="display: flex; align-items: center;">
          <q-avatar color="primary" text-color="white">
            <q-icon name="delete" />
          </q-avatar>
          <div class="text-h6 color-texto" style="margin-left: 10px;"> ¿Desea eliminar esta venta?</div>
        </q-card-section>

        <q-card-section>

        </q-card-section>

        <q-card-actions align="center">
          <q-btn outline no-caps icon-right="close" label="Cancelar" color="warning" v-close-popup />
          <q-btn unelevated no-caps label="Aceptar" color="warning" icon-right="check" @click="deleteHolds(1)" />
        </q-card-actions>
        <q-card-actions align="center" style="color: #404d52;">
          Presione ESC para salir
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- MOSTRAR PREVIO DE VENTA -->
    <q-dialog v-model="modalrealizarventa" persistent>
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section style="display: flex; align-items: center;">
          <q-avatar color="primary" text-color="white">
            <q-icon name="shopping_cart_checkout" />
          </q-avatar>
          <div class="text-h6 color-texto" style="margin-left: 10px;"> ¿Realizar esta venta?</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <table class="color-texto" style="width: 100%;">
            <tr>
              <td style="width: 30%;">Razón social:</td>
              <td style="font-weight: bold;">{{ nombrecliente }}</td>
            </tr>
            <tr>
              <td>{{ documentoabrev }}:</td>
              <td style="font-weight: bold;">{{ documentoclientesolo }}</td>
            </tr>
            <tr>
              <td>Fecha:</td>
              <td style="font-weight: bold;">{{ fechaholds }}</td>
            </tr>
          </table>
          <table class="color-texto" style="width: 100%;">
            <tr style="font-weight: bold;">
              <td class="rayafactura rayaarriba">Producto</td>
              <td class="rayafactura rayaarriba">Precio</td>
              <td class="rayafactura rayaarriba">Cantidad</td>
              <td class="rayafactura rayaarriba">Tasa %</td>
              <td class="rayafactura rayaarriba">Total</td>
            </tr>
            <tr v-for="item in holds" :key="item">
              <td style="width: 150px; font-style: italic;">{{ item.producto }}</td>
              <td style="text-align: right;">{{ item.precio }}</td>
              <td style="text-align: center;">{{ item.cantidad }}</td>
              <td style="text-align: center;">{{ item.tasa }}%</td>
              <td style="text-align: right;">{{ item.total }}</td>
            </tr>

            <tr>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
            </tr>
          </table>
          <table class="color-texto" style="width: 100%;">
            <tr class="letratotalesfactura">
              <td style="width: 50%;"></td>
              <td>Subtotal Bs.:</td>
              <td style="text-align: right;">{{ subtotal }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Impuestos Bs.:</td>
              <td style="text-align: right;">{{ impuesto }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Descuentos Bs.:</td>
              <td style="text-align: right;">{{ descuento }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td class="rayafactura">IGTF 3% Bs.:</td>
              <td class="rayafactura" style="text-align: right;">{{ igtf }}</td>
            </tr>
            <tr class="letratotalesfactura" style="font-weight: bold;">
              <td></td>
              <td>Total Bs.:</td>
              <td style="text-align: right;">{{ total }}</td>
            </tr>
            <tr class="letratotalesfactura" style="font-weight: bold;">
              <td></td>
              <td>Total $:</td>
              <td style="text-align: right;">{{ totalusd }}</td>
            </tr>
          </table>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn outline no-caps icon-right="close" color="warning" label="Cancelar" v-close-popup />
          <q-btn unelevated no-caps icon-right="check" color="warning" label="Aceptar" @click="realizarVenta" />
        </q-card-actions>
        <q-card-actions align="center" style="color: #404d52;">
          Presione ESC para salir
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- MOSTRAR DETALLE DE VENTA -->
    <q-dialog v-model="modaldetalleinvoice" persistent>
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <div id="areaImprimir" style="width: 100%;">
          <q-card-section style="justify-content: center;">
            <div class="text-center letratotalesfactura " style=""> {{ empresa }} - {{ rif }}</div>
            <div class="text-center letratotalesfactura " style=""> {{ direccion }}</div>
            <div class="text-center letratotalesfactura " style=""> {{ telefono }}</div>
            <div class="text-center letratotalesfactura " style=""> {{ email }}</div>
            <q-separator style="margin: 10px 0px;" />
            <div style="display: flex; align-items: left;width: 100%;">
              <div class="numero" style="margin-left: 10px;"> {{ detalleventa.tipofactura }}</div>
              <div class="numero" style="margin-left: 10px;"> {{ detalleventa.numerointerno }}</div>
            </div>
            <div style="display: flex; align-items: center;">
              <div class="control" style="margin-left: 10px;"> N° de control:</div>
              <div class="control" style="margin-left: 10px;"> {{ detalleventa.numerocontrol }}</div>
            </div>
            <q-separator style="margin: 10px 0px;" />
            <table style="width: 100%;">
              <tr class="letratotalesfactura">
                <td style="width: 30%;">Razón social:</td>
                <td style="font-weight: bold;">{{ detalleventa.nombrecliente }}</td>
              </tr>
              <tr class="letratotalesfactura">
                <td>{{ detalleventa.abrev }}</td>
                <td style="font-weight: bold;">{{ detalleventa.documento }}</td>
              </tr>
              <tr class="letratotalesfactura">
                <td>Fecha:</td>
                <td style="font-weight: bold;">{{ fechaDetalle(detalleventa.fecha) }}</td>
              </tr>
              <tr class="letratotalesfactura">
                <td>Cajero:</td>
                <td style="font-weight: bold;">{{ detalleventa.usuario }}</td>
              </tr>
            </table>
            <table style="width: 100%;">
              <tr style="font-weight: bold; font-size: 11px;">
                <td class="rayafactura rayaarriba">Producto</td>
                <td class="rayafactura rayaarriba" style="text-align: right;">Precio</td>
                <td class="rayafactura rayaarriba">Cant.</td>
                <td class="rayafactura rayaarriba">Imp %</td>
                <td class="rayafactura rayaarriba" style="text-align: right;">Total</td>
              </tr>
              <tr v-for="item in ventas" :key="item" style="font-size: 11px;">
                <td style="width: 140px; font-style: italic;">{{ item.producto }}</td>
                <td style="text-align: right;">{{ item.precio }}</td>
                <td style="text-align: center;">{{ item.cantidad }}</td>
                <td style="text-align: center;">{{ item.tasa }}%</td>
                <td style="text-align: right;">{{ item.subtotal }}</td>
              </tr>

              <tr>
                <td class="rayafactura"></td>
                <td class="rayafactura"></td>
                <td class="rayafactura"></td>
                <td class="rayafactura"></td>
                <td class="rayafactura"></td>
              </tr>
            </table>
            <table style="width: 100%;">
              <tr class="letratotalesfactura">
                <td style="width: 40%;"></td>
                <td>Subtotal Bs.:</td>
                <td style="text-align: right;">{{ detalleventa.subtotal }}</td>
              </tr>
              <tr class="letratotalesfactura">
                <td></td>
                <td>Impuestos Bs.:</td>
                <td style="text-align: right;">{{ detalleventa.impuesto }}</td>
              </tr>
              <tr class="letratotalesfactura">
                <td></td>
                <td>Descuentos Bs.:</td>
                <td style="text-align: right;">{{ detalleventa.descuentos }}</td>
              </tr>
              <tr class="letratotalesfactura">
                <td></td>
                <td class="rayafactura">IGTF 3% Bs.:</td>
                <td class="rayafactura" style="text-align: right;">{{ detalleventa.igtf }}</td>
              </tr>
              <tr class="letratotalesfactura" style="font-weight: bold;">
                <td></td>
                <td>Total Bs.:</td>
                <td style="text-align: right;">{{ detalleventa.total }}</td>
              </tr>
              <tr class="letratotalesfactura" style="font-weight: bold;">
                <td></td>
                <td>Total $:</td>
                <td style="text-align: right;">{{ detalleventa.totalusd }}</td>
              </tr>
            </table>
          </q-card-section>
        </div>
        <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
        <q-separator />
        <q-card-actions align="center">

          <q-btn label="Cerrar" outline no-caps icon-right="close" color="warning" v-close-popup />
          <q-btn unelevated no-caps label="Imprimir" color="warning" icon-right="check" @click="imprimir" />
        </q-card-actions>
        <q-card-actions align="center" style="color: #404d52;">
          Presione ESC para salir
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <anular-documento
     v-bind:modal="modalanular"
    /> -->
    <!-- MOSTRAR ANULAR DOCUMENTO -->
    <q-dialog v-model="modalanular" persistent>
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section style="display: flex; align-items: center;">
          <q-avatar color="primary" text-color="white">
            <q-icon name="cancel_presentation" />
          </q-avatar>
          <div class="text-h6" style="margin-left: 10px;"> Anular Documento</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="justify-content: center;">
          <div class="row">
            <q-input class="col-10" color="blue-grey-3" outlined v-model="numerointernoanular" label="Número Interno"
              stack-label autofocus />
            <q-btn class="col-2" icon="search" unelevated color="accent" @click="buscarFactura" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="facturabuscado" style="justify-content: center;">
          <div :class="detalleventaanular.estatus === '1' ? 'procesada' : 'anulada'"
            style="display: flex; justify-content: center; align-items: center;width: 100%;"> {{
              detalleventaanular.estatus
                === '1' ? 'PROCESADA' : 'ANULADA' }}</div>
          <div style="display: flex; align-items: left;width: 100%;">
            <div class="numero" style="margin-left: 10px;"> {{ detalleventaanular.tipofactura }}</div>
            <div class="numero" style="margin-left: 10px;"> {{ detalleventaanular.numerointerno }}</div>
          </div>
          <div style="display: flex; align-items: center;">
            <div class="control" style="margin-left: 10px;"> N° de control:</div>
            <div class="control" style="margin-left: 10px;"> {{ detalleventaanular.numerocontrol }}</div>
          </div>
          <q-separator style="margin: 10px 0px;" />
          <table style="width: 100%;">
            <tr class="letratotalesfactura">
              <td style="width: 30%;">Razón social:</td>
              <td style="font-weight: bold;">{{ detalleventaanular.nombrecliente }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td>{{ detalleventaanular.abrev }}</td>
              <td style="font-weight: bold;">{{ detalleventaanular.documento }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td>Fecha:</td>
              <td style="font-weight: bold;">{{ fechaDetalle(detalleventaanular.fecha) }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td>Cajero:</td>
              <td style="font-weight: bold;">{{ detalleventaanular.usuario }}</td>
            </tr>
          </table>
          <table style="width: 100%;">
            <tr style="font-weight: bold; font-size: 11px;">
              <td class="rayafactura rayaarriba">Producto</td>
              <td class="rayafactura rayaarriba">Precio</td>
              <td class="rayafactura rayaarriba">Cant.</td>
              <td class="rayafactura rayaarriba">Imp %</td>
              <td class="rayafactura rayaarriba">Total</td>
            </tr>
            <tr v-for="item in ventasanular" :key="item" style="font-size: 11px;">
              <td style="width: 140px; font-style: italic;">{{ item.producto }}</td>
              <td>{{ item.precio }}</td>
              <td>{{ item.cantidad }}</td>
              <td>{{ item.tasa }}%</td>
              <td style="text-align: right;">{{ item.subtotal }}</td>
            </tr>

            <tr>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
              <td class="rayafactura"></td>
            </tr>
          </table>
          <table style="width: 100%;">
            <tr class="letratotalesfactura">
              <td style="width: 40%;"></td>
              <td>Subtotal Bs.:</td>
              <td style="text-align: right;">{{ detalleventaanular.subtotal }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Impuestos Bs.:</td>
              <td style="text-align: right;">{{ detalleventaanular.impuesto }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td>Descuentos Bs.:</td>
              <td style="text-align: right;">{{ detalleventaanular.descuentos }}</td>
            </tr>
            <tr class="letratotalesfactura">
              <td></td>
              <td class="rayafactura">IGTF 3% Bs.:</td>
              <td class="rayafactura" style="text-align: right;">{{ detalleventaanular.igtf }}</td>
            </tr>
            <tr class="letratotalesfactura" style="font-weight: bold;">
              <td></td>
              <td>Total Bs.:</td>
              <td style="text-align: right;">{{ detalleventaanular.total }}</td>
            </tr>
            <tr class="letratotalesfactura" style="font-weight: bold;">
              <td></td>
              <td>Total $:</td>
              <td style="text-align: right;">{{ detalleventaanular.totalusd }}</td>
            </tr>
          </table>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn label="Cerrar" outline no-caps icon-right="close" color="warning" v-close-popup />
          <q-btn label="Aceptar" unelevated no-caps color="warning" icon-right="check" :disable="btnDisableAnular"
            @click="anularDocumento" />
        </q-card-actions>
        <q-card-actions align="center" style="color: #404d52;">
          Presione ESC para salir
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>

  <!-- <div class="totales  col-md-6 col-sm-12 col-xs-12">
          <q-card class="my-card" bordered style="margin: 10px;">
            <q-card-section style="padding: 7px 16px;">
              <div
                style="width: 100%; background: #ddd; border-radius: 7px; display: flex; justify-content: space-between; padding: 3px 10px; font-size: 11px;">
                <span style="color: #000213;">Cliente:
                  <span style="color: blue; margin-left: 5PX;">{{ nombrecliente.length > 0 ? nombrecliente + ' (' +
                    documentoclienteventa + ')' : 'S/INF' }}</span>
                </span>
                <span style="color: #000213;">Fecha:
                  <span style="color: blue; margin-left: 5PX;">{{ nombrecliente.length > 0 ? fechaholds :
                    fechahoy }}</span>
                </span>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section horizontal>
              <q-card-section class="column" style="padding: 7px;font-size: 12px;align-items: center;">
                <img src="logo_bcv.png" style="width: 60px;" />
                <q-badge color="primary" style="margin-top: 5px;">
                  Bs. {{ tasausd || '0.00' }}
                </q-badge>
              </q-card-section>
              <q-separator vertical />
              <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px; width: 115px;">
                <span style="color: #757575;">Subtotal:</span>
                <span style="color: #757575;">Impuesto:</span>
                <span style="color: #757575;">Descuento:</span>
                <span class="itemtotal">$ {{ totalusd }}</span>
              </q-card-section>

              <q-separator vertical />

              <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px;">
                <span>Bs. {{ subtotal }}</span>
                <span>Bs. {{ impuesto }}</span>
                <span>Bs. {{ descuento }}</span>
                <span class="itemtotal">Bs. {{ total }}</span>
              </q-card-section>
            <q-separator vertical />

              <q-card-section style="display: grid;padding: 7px 16px;font-size: 12px; color:white;">
                <span>$ {{subtotalusd}}</span>
                <span>$ {{impuestousd}}</span>
                <span>$ {{descuentousd}}</span>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div> -->
  <!-- <div class="col-md-6 col-sm-12 col-xs-12" style="display: -webkit-box; align-items: center;">
          <div class="botones row">
            <div class="col-6 contenedorBtn" style="margin: 5px,">
              <q-btn color="primary" icon="zoom_in" @click="abrirBuscarItem" label="Item (F2)"
                style="font-size: 12px;" />
            </div>
            <div class="col-6 contenedorBtn" style="margin: 5px,">
              <q-btn color="secondary" icon-right="paid" @click="abrirRealizarVenta" label="Vender (F6)"
                style="font-size: 12px;" :disable="holds.length <= 0" />
            </div>
            <div class="col-6 contenedorBtn" style="margin: 5px,">
              <q-btn color="secondary" icon="cancel" @click="openDeleteHolds" label="Cancelar" style="font-size: 12px;"
                :disable="holds.length <= 0" />
            </div>
            <div class="col-6 contenedorBtn" style="margin: 5px,">
              <q-btn color="primary" icon-right="person_add_alt" @click="abrirBuscarCliente" label="Cliente (F3)"
                style="font-size: 12px;" />
            </div>
            <div class="col-6 contenedorBtn" style="margin: 5px,">
              <q-btn color="primary" icon="cancel_presentation" @click="abrirBuscarFactura" label="Anular"
                style="font-size: 12px;" />
            </div>
            <q-btn class="col-6" color="accent" icon="playlist_remove" @click="abrirBuscarFactura" label="Nota de Crédito" style="font-size: 12px;" :disable="holds.length <= 0"/>
            <q-btn class="col-6" color="info" icon="playlist_add" @click="abrirBuscarFactura" label="Nota de Dédito" style="font-size: 12px;" :disable="holds.length <= 0"/>
            <div class="col-6 contenedorBtn" style="margin: 5px,">
              <q-btn color="secondary" icon-right="assignment_return" @click="abrirBuscarFactura" label="Devoluciones"
                style="font-size: 12px;" :disable="true" />
            </div>
          </div>
        </div> -->

</template>

<script>
import { defineComponent, ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'
// import { VueShortkey } from 'vue3-shortkey'

const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'IndexPage',
  /* components: {
    VueShortkey
    // AnularDocumento: defineAsyncComponent(() => import('components/AnularDocumento'))
  }, */
  setup() {
    return {
      slide: ref(2),
      buscadoproducto: ref(true),
      btnDisableAnular: ref(true),
      numerointernoanular: ref(''),
      modalanular: ref(false),
      empresa: ref(''),
      direccion: ref(''),
      rif: ref(''),
      telefono: ref(''),
      email: ref(''),
      igtf: ref(0),
      numerointerno: ref(''),
      idventa: ref(''),
      textitem: ref(''),
      subtotal: ref(0),
      impuesto: ref(0),
      descuento: ref(0),
      total: ref(0),
      subtotalusd: ref(0),
      impuestousd: ref(0),
      descuentousd: ref(0),
      totalusd: ref(0),
      nombrecliente: ref(''),
      correocliente: ref(''),
      telefonocliente: ref(''),
      direccioncliente: ref(''),
      idclienteventa: ref(''),
      nombreclienteventa: ref(''),
      documentoabrev: ref(''),
      documentoclientesolo: ref(''),
      documentoclienteventa: ref(''),
      fechahoy: ref(moment().format('DD/MM/YYYY')),
      fechaholds: ref(''),
      idhold: ref(''),
      iditemhold: ref(''),
      buscaritem: ref(false),
      modalrealizarventa: ref(false),
      noencontrado: ref(false),
      clientebuscado: ref(false),
      facturabuscado: ref(false),
      encontrado: ref(false),
      modalcliente: ref(false),
      dsbBtnCrearCliente: ref(true),
      modeldocumento: ref(null),
      modaldeleteholds: ref(false),
      modaldetalleinvoice: ref(false),
      optionsdocumento: [],
      rowsproductos: [],
      rowsproductosfiltre: [],
      holds: [],
      ventas: [],
      ventasanular: [],
      detalleventa: {},
      detalleventaanular: {},
      tasausd: ref(0),
      idusuario: ref(sessionStorage.getItem('id_usuario'))
    }
  },
  methods: {
    imprimir() {
      window.frames.print_frame.document.body.innerHTML = document.getElementById('areaImprimir').innerHTML
      window.frames.print_frame.window.focus()
      window.frames.print_frame.window.print()
      this.modaldetalleinvoice = false
    },
    fechaDetalle(fecha) {
      return moment(fecha).format('DD/MM/YYYY HH:mm:ss')
    },
    abrirBuscarFactura() {
      this.detalleventaanular = {}
      this.numerointernoanular = ''
      this.idUpd = ''
      this.facturabuscado = false
      this.btnDisableAnular = true
      this.modalanular = true
    },
    async anularDocumento() {
      // const $this = this
      const body = {
        idventa: this.idUpd
      }
      await axios.post(ENDPOINT_PATH_V2 + 'ventas/anularventa', body).then(async response => {
        console.log(response)
        this.modalanular = false
        Notify.create('Documento ANULADO con éxito')
      })
    },
    async buscarFactura() {
      // const $this = this
      this.detalleventaanular = {}
      this.ventasanular = []
      this.facturabuscado = false
      this.idtipofacturaanular = 1
      await axios.get(ENDPOINT_PATH_V2 + 'ventas/getventanumerointerno/' + sessionStorage.getItem('co_empresa') + '/' + this.idtipofacturaanular + '/' + this.numerointernoanular).then(async response => {
        console.log(this.numerointernoanular)
        console.log(response)
        if (response.status === 200) {
          this.detalleventaanular = response.data.resp
          this.idUpd = this.detalleventaanular.id
          this.ventasanular = response.data.respdetalles
          this.facturabuscado = true
          this.btnDisableAnular = this.detalleventaanular.estatus === '2' || false
        } else {
          Notify.create('Documento NO ENCONTRADO')
          this.facturabuscado = false
          this.btnDisableAnular = true
          this.idUpd = ''
        }
      })
    },
    async abrirDetalleInvoive() {
      const $this = this
      this.detalleventa = {}
      await axios.get(ENDPOINT_PATH_V2 + 'ventas/getventa/' + this.idventa).then(async response => {
        // console.log(this.idventa)
        // console.log(response)
        this.detalleventa = response.data.resp
        await axios.get(ENDPOINT_PATH_V2 + 'ventas/getitemsventas/' + this.idventa).then(async response2 => {
          $this.ventas = []
          console.log(response2)
          const data = response2.data.resp
          for (const i in data) {
            const obj = data[i]
            $this.ventas.push(obj)
          }
          $this.deleteHolds(2)
          // console.log('VENTA REALIZADA')
          $this.modaldetalleinvoice = true
        }).catch(error => {
          Notify.create('Problemas al listar items Ventas ' + error)
        })
        console.log(this.detalleventa)
      })
    },
    async actualizarCantidad(item, accion) {
      console.log(item)
      const idcantidad = document.getElementById('cantidad' + item.idproducto)
      if (accion === 1) {
        idcantidad.value = Number(idcantidad.value) + 1
        this.subtotal = (Number(this.subtotal) + item.precio).toFixed(2)
        this.impuesto = (Number(this.impuesto) + (item.precio * item.tasa / 100)).toFixed(2)
        this.total = (Number(this.total) + (Number(item.precio) + item.precio * item.tasa / 100)).toFixed(2)
      } else {
        if (idcantidad.value > 1) {
          this.subtotal = (Number(this.subtotal) - item.precio).toFixed(2)
          this.impuesto = (Number(this.impuesto) - (item.precio * item.tasa / 100)).toFixed(2)
          this.total = (Number(this.total) - (Number(item.precio) + item.precio * item.tasa / 100)).toFixed(2)
        }
        idcantidad.value = idcantidad.value <= 1 ? 1 : Number(idcantidad.value) - 1
      }
      item.total = (Number(item.precio) + (item.precio * item.tasa / 100)) * idcantidad.value
      console.log('this.tasausd')
      console.log(this.tasausd)
      this.subtotalusd = (this.subtotal / this.tasausd).toFixed(2)
      this.impuestousd = (this.impuesto / this.tasausd).toFixed(2)
      this.totalusd = (this.total / this.tasausd).toFixed(2)
      const resp = await this.updItemHolds(item.iditemhold, idcantidad.value, idcantidad.value * (Number(item.precio) + item.precio * item.tasa / 100), item.idproducto, accion, item.intipoproducto)
      if (resp) {
        await this.calcularMonto(item)
      } else {
        console.log('resp input false')
        console.log(resp)
        idcantidad.value = idcantidad.value <= 1 ? 1 : Number(idcantidad.value) - 1
      }
      // document.getElementById('monto' + item.cod).innerHTML = 'Bs.' + item.monto
    },
    calcularMonto(item) {
      const idcantidad = document.getElementById('cantidad' + item.idproducto)
      if (idcantidad) {
        const cantidad = idcantidad.value > 0 ? idcantidad.value : 1
        this.holds.map((product) => {
          if (product.cod === item.cod) {
            product.monto = (product.precio * product.tasa / 100 + product.precio) * cantidad
            item.monto = product.monto
            product.cantidad = cantidad
          }
          return product
        })
        document.getElementById('monto' + item.idproducto).innerHTML = 'Bs.' + item.monto.toFixed(2)
      }
    },
    async updItemHolds(iditemhold, cantidad, total, idproducto, accion, intipoproducto) {
      const body = {
        idproducto,
        iditemhold,
        cantidad,
        accion,
        total,
        intipoproducto
      }
      // console.log(body)
      const response = await axios.post(ENDPOINT_PATH_V2 + 'ventas/upditemholds', body)
      console.log(response.status)
      if (response.status === 202) {
        this.$q.dialog({
          title: 'Ooops! ' + response.data.resp,
          message: ' Contacte al administrador del sistema.',
          html: true,
          ok: {
            color: 'primary',
            label: 'Aceptar'
          }
        })
        return false
      } else {
        return true
      }
    },
    openDeleteHolds() {
      this.modaldeleteholds = true
    },
    deleteHolds(accion) {
      const body = {
        idhold: this.idhold,
        accion
      }
      axios.post(ENDPOINT_PATH_V2 + 'ventas/deleteholds', body).then(async response => {
        // console.log(response.data.success)
        this.modaldeleteholds = false
        this.documentoclienteventa = ''
        this.listarHolds()
      }).catch(error => {
        Notify.create('Problemas al ELIMINAR Hold de venta ' + error)
      })
    },
    deleteItemHolds(item) {
      console.log(item)
      const body = {
        iditemhold: item.iditemhold,
        idproducto: item.idproducto,
        intipoproducto: item.intipoproducto,
        cantidad: item.cantidad
      }
      // console.log(body)
      this.$q.dialog({
        title: 'Eliminar Item!',
        message: '¿Desea eliminar este item?',
        html: true,
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'negative',
          label: 'No'
        },
        persistent: true
      }).onOk(() => {
        axios.post(ENDPOINT_PATH_V2 + 'ventas/deleteitemholds', body).then(async response => {
          console.log(response.data.success)
          this.nombrecliente = ''
          this.listarHolds()
        }).catch(error => {
          Notify.create('Problemas al ELIMINAR itemhold de venta ' + error)
        })
      })
    },
    async additemholds(item) {
      console.log(item)
      // console.log(this.holds)
      const descuento = this.descuento // DESCUENTO CERO POR DEFECTO
      let resp = false
      const find = this.holds.findIndex(obj => obj.idproducto === item.idproducto)
      // console.log(find)
      // console.log('resp1')
      // console.log(resp)
      if (find === -1) {
        const monto = (item.precio * item.tasa / 100 + item.precio)
        // const iditemhold = await this.crearItemHolds(this.idhold, item.cod, item.precio, 1, item.tasa, monto, item.idunidad)
        const body = {
          idhold: this.idhold,
          idproducto: item.idproducto,
          precio: item.precio,
          cantidad: 1,
          tasa: item.tasa,
          total: monto,
          idunidad: item.idunidad,
          intipoproducto: item.intipoproducto,
          descuento
        }
        // console.log(body)
        await axios.post(ENDPOINT_PATH_V2 + 'ventas/setitemholds', body).then(async response => {
          const datos = response.data.resp
          if (response.data.success) {
            const obj = {}
            obj.idhold = this.idhold
            obj.iditemhold = datos.iditemhold
            obj.idproducto = item.idproducto
            obj.precio = item.precio
            obj.cantidad = 1
            obj.tasa = item.tasa
            obj.total = monto
            obj.producto = item.producto
            obj.categoria = item.categoria
            obj.descripcion = item.descripcion
            obj.intipoproducto = item.intipoproducto
            obj.descuento = descuento

            this.subtotal = (Number(this.subtotal) + (obj.precio * obj.cantidad)).toFixed(2)
            this.impuesto = (Number(this.impuesto) + (item.precio * item.tasa / 100)).toFixed(2)
            this.total = (Number(this.total) + monto).toFixed(2)
            this.holds.push(obj)
            resp = true
          } else {
            this.buscaritem = false
            this.slide = 2
            Notify.create(response.data.resp.toUpperCase())
          }
        }).catch(error => {
          Notify.create('Problemas al crear itemhold de venta ' + error)
        })
      } else { // si find
        // console.log('this.holds[find]')
        // console.log(this.holds[find])
        this.holds[find].cantidad = Number(this.holds[find].cantidad) + 1
        const monto = (item.precio * item.tasa / 100 + item.precio)
        document.getElementById('monto' + item.idproducto).innerHTML = 'Bs.' + (monto * this.holds[find].cantidad).toFixed(2)
        this.subtotal = (Number(this.subtotal) + item.precio).toFixed(2)
        this.impuesto = (Number(this.impuesto) + (item.precio * item.tasa / 100)).toFixed(2)
        this.total = (Number(this.total) + monto).toFixed(2)
        resp = await this.updItemHolds(this.holds[find].iditemhold, this.holds[find].cantidad, monto * this.holds[find].cantidad, item.idproducto, 1)
        // console.log('resp2')
        // console.log(resp)
      }
      // console.log('resp3')
      // console.log(resp)
      if (resp) {
        this.subtotalusd = (this.subtotal / this.tasausd).toFixed(2)
        this.impuestousd = (this.impuesto / this.tasausd).toFixed(2)
        this.totalusd = (this.total / this.tasausd).toFixed(2)
        // this.calcularMonto(item)
        this.buscaritem = false
        this.slide = 2
      }
    },
    listarProductos() {
      const idcategoria = 0
      axios.get(ENDPOINT_PATH_V2 + 'productos/' + sessionStorage.getItem('co_empresa') + '/' + idcategoria).then(async response => {
        // console.log(response.data)
        const datos = response.data.resp
        this.rowsproductos = []
        for (const i in datos) {
          const obj = {}
          obj.idproducto = datos[i].id
          obj.sku = datos[i].sku
          obj.producto = datos[i].producto
          obj.id = datos[i].id
          obj.categoria = datos[i].categoria
          obj.descripcion = datos[i].descripcion
          obj.unidad = datos[i].unidad
          obj.idunidad = datos[i].idunidad
          obj.impuesto = datos[i].impuesto
          obj.precio = datos[i].precio
          obj.inventario = Number(datos[i].inventario1)
          obj.costo = datos[i].costo
          obj.tasa = datos[i].tasa
          obj.intipoproducto = datos[i].intipoproducto
          this.rowsproductos.push(obj)
        }
        this.rowsproductosfiltre = this.rowsproductos
      }).catch(error => {
        Notify.create('Problemas al listar Categorias ' + error)
      })
    },
    abrirRealizarVenta() {
      this.listarHolds()
      // console.log(this.holds)
      this.modalrealizarventa = true
    },
    realizarVenta() {
      const $this = this
      const body = {
        idhold: this.idhold,
        tasausd: this.tasausd,
        totalusd: this.totalusd,
        idempresa: sessionStorage.getItem('co_empresa')
      }
      axios.post(ENDPOINT_PATH_V2 + 'ventas/setventa', body).then(async response => {
        const datos = response.data
        console.log(datos.success)
        if (datos.success) {
          $this.idventa = datos.resp.idventa
          $this.abrirDetalleInvoive()
          // $this.modaldetalleinvoice = true
        } else {
          Notify.create(datos.resp.message)
        }
      }).catch(error => {
        Notify.create('Problemas al REALIZAR venta ' + error)
      })
      this.modalrealizarventa = false
    },
    abrirBuscarItem() {
      // console.log(this.nombrecliente.length)
      if (this.nombrecliente.length === 0) {
        console.log('Debe buscar cliente')
        this.abrirBuscarCliente()
      } else {
        this.buscaritem = true
        this.textitem = ''
      }
    },
    abrirBuscarCliente() {
      this.modalcliente = true
      this.documento = ''
      // this.modeldocumento = null
      console.log(this.optionsdocumento[0])
      this.modeldocumento = this.optionsdocumento[0]
      this.limpiarCliente()
    },
    limpiarCliente() {
      this.nombrecliente = ''
      this.telefonocliente = ''
      this.correocliente = ''
      this.direccioncliente = ''
      this.noencontrado = false
      this.encontrado = false
      this.clientebuscado = false
      this.dsbBtnCrearCliente = true
    },
    listarTiposDocumentos() {
      axios.get(ENDPOINT_PATH_V2 + 'tipodocumento').then(async response => {
        const datos = response.data.data
        this.optionsdocumento = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.tipodocumento = datos[i].tipodocumento
          obj.abrev = datos[i].abrev
          this.optionsdocumento.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Tipos ' + error)
      })
    },
    buscarCliente() {
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
          this.idcliente = datos[0].id
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
    crearCliente() {
      // if (this.modeldocumento)
      // console.log(this.modeldocumento)
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
      if (!this.encontrado) {
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
            this.idclienteventa = datos
            this.nombreclienteventa = this.nombrecliente
            this.documentoclienteventa = this.modeldocumento.abrev + ' ' + this.documento
            this.crearHolds(datos, this.idusuario)
          }
        }).catch(error => {
          Notify.create('Problemas al crear cliente ' + error)
        })
      } else {
        this.modalcliente = false
        this.idclienteventa = this.idcliente
        this.nombreclienteventa = this.nombrecliente
        this.documentoclienteventa = this.modeldocumento.abrev + ' ' + this.documento
        this.crearHolds(this.idcliente, this.idusuario)
      }
    },
    crearHolds(idcliente, idusuario) {
      const idtipofactura = 1 // TIPO FACTURA ES FACTURA POR DEFECTO
      const body = {
        idcliente,
        idusuario,
        idtipofactura
      }
      axios.post(ENDPOINT_PATH_V2 + 'ventas/setholds', body).then(async response => {
        const datos = response.data.resp
        if (datos) {
          this.idhold = datos.idhold
          this.fechaholds = datos.fecha
        }
      }).catch(error => {
        Notify.create('Problemas al crear hold de venta ' + error)
      })
    },
    async listarHolds() {
      this.nombrecliente = ''
      await axios.get(ENDPOINT_PATH_V2 + 'ventas/gethols/' + sessionStorage.getItem('id_usuario')).then(async response => {
        // console.log(response.data)
        const datos = response.data.resp.length > 0 ? response.data.resp[0] : null
        console.log(datos)
        this.holds = []
        // const obj = {}
        this.slide = 1
        this.subtotal = 0
        this.impuesto = 0
        this.total = 0
        if (datos) {
          this.idcliente = datos.idcliente
          this.nombrecliente = datos.nombre
          this.documentoabrev = datos.abrev
          this.documentoclienteventa = datos.abrev + ' ' + datos.documento
          this.documentoclientesolo = datos.documento
          this.idhold = datos.idhold
          this.fechaholds = moment(datos.fecha).format('DD/MM/YYYY')
          await axios.get(ENDPOINT_PATH_V2 + 'ventas/getitemshols/' + this.idhold).then(async response => {
            this.holds = response.data.resp
            for (const i in this.holds) {
              const obj = this.holds[i]
              const sbttl = obj.precio * obj.cantidad
              const impto = sbttl * obj.tasa / 100
              const monto = impto + sbttl
              this.subtotal = (Number(this.subtotal) + sbttl).toFixed(2)
              this.impuesto = (Number(this.impuesto) + impto).toFixed(2)
              this.total = (Number(this.total) + monto).toFixed(2)
            }
            this.slide = this.holds.length > 0 ? 2 : 1
          }).catch(error => {
            Notify.create('Problemas al listar items Holds ' + error)
          })
        }
        this.subtotalusd = (this.subtotal / this.tasa).toFixed(2)
        this.impuestousd = (this.impuesto / this.tasa).toFixed(2)
        this.totalusd = (this.total / this.tasausd).toFixed(2)
        // this.holds.push(obj)
        /* for (const i in datos) {
        } */
      }).catch(error => {
        Notify.create('Problemas al listar Holds ' + error)
      })
    },
    primeraletra(item) {
      return item[0]
    },
    colorLetra(item) {
      const asciicode = item[0].charCodeAt(0)
      return '#' + asciicode + '0'
    },
    async cargar() {
      const datos = await axios.get(ENDPOINT_PATH_V2 + 'configuracion/' + sessionStorage.getItem('co_empresa'))
        .catch(error => {
          Notify.create('Problemas al listar Configuracion ' + error)
        })
      console.log(datos)
      return datos.data.resp
    }
  },
  watch: {
    textitem(val) {
      console.log('textitem')
      console.log(val)
      this.buscadoproducto = false
      if (val.length > 0) {
        this.rowsproductosfiltre = this.rowsproductos.filter(obj => {
          if (obj.producto.toUpperCase().includes(val.toUpperCase()) || (obj.sku && obj.sku.includes(val))) {
            return true
          } else {
            return false
          }
        })
      } else {
        this.rowsproductosfiltre = this.rowsproductos
      }
      this.buscadoproducto = true
      this.rowsproductosfiltre = this.rowsproductosfiltre.slice().reverse()
      console.log(this.rowsproductosfiltre)
    }
  },
  async mounted() {
    const datos = await this.cargar()
    this.tasausd = datos.tasabcv
    this.empresa = datos.empresa
    this.rif = datos.rif
    this.direccion = datos.direccion
    this.telefono = datos.telefono
    this.email = datos.email
    console.log('this.tasausd')
    console.log(this.tasausd)
    await this.listarTiposDocumentos()
    await this.listarHolds()
    await this.listarProductos()
    const $this = this
    document
      .addEventListener('keydown',
        function (event) {
          console.log(event.key)
          if (event.key === 'F2') {
            event.preventDefault()
            $this.abrirBuscarItem()
          }
          if (event.key === 'F3') {
            event.preventDefault()
            $this.abrirBuscarCliente()
          }
          if (event.key === 'F4') {
            if (!$this.dsbBtnCrearCliente) {
              event.preventDefault()
              $this.crearCliente()
            }
          }
          if (event.key === 'F6') {
            if ($this.holds.length <= 0) {
              Notify.create('NO TIENE VENTA ')
            } else {
              event.preventDefault()
              $this.abrirRealizarVenta()
            }
          }
        })
  }
})
</script>

<style scoped>
.logo-bcv img {

  width: 100%;
  margin-top: 30%;
  padding-right: 5px;
  height: auto;
}

.logo {
  width: 30%;
  height: auto;
}

.texto-pequeno {
  font-size: 10px;
}

.negrita {
  font-weight: bold;
}

.bd-left {
  border-left: 1px solid #ccc;
}

.columna-botones {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.custom-border-radius {
  border-radius: 20px;
}

.bd-left {
  border-left: 1px solid rgba(211, 211, 211, 0.589);
  padding-left: 5px;
}

.negrita {
  font-weight: bold;
  color: #5A5A5A;
}

.letra-pequenia {
  font-size: 11px;
  color: gray
}

.color-degradado-vnz {
  background: linear-gradient(90deg, rgba(255, 179, 50, 0.20) 0%, rgba(33.82, 121.76, 202.94, 0.20) 50%, rgba(255, 0, 0, 0.20) 100%)
}

.text-encontrado {
  color: #32651A;
  background: rgba(90.58, 233.75, 96.30, 0.13);
}

.text-noencontrado {
  color: #900101;
  background: rgba(255, 9.56, 9.56, 0.13);
}

.btncantidad {
  font-size: 10px;
  width: 33px;
}

.totales {

  width: 100%;
}

.botones {
  padding: 2%;
  padding-left: 5%;
  padding-right: 5%;
}

.boton-banner {
  padding: 5px
}

.precio {
  color: #5A5A5A;
  font-size: 25px;
  font-weight: bold;
}

.puntodeventa {
  height: 59vh;
  background: #FFFAEC;
  display: flex;
  justify-content: center;
  overflow: auto;
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

.puntodeventaconitem {
  width: 95%;
  overflow: auto;
}

.tarjetaitem {
  margin: 3px;
}

.inputCantidad {
  width: 50px;
  text-align: center;
  border-radius: 10%;
  border-color: rgb(255, 255, 255);
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

.procesada {
  color: green;
  font-weight: bold;
}

.anulada {
  color: red;
  font-weight: bold;
}

.contenedorBtn {
  padding: 3px;
  display: grid;
}
</style>
