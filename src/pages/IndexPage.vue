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
              <img src="logo_bcv.png">
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
      <div class="col-12 col-md-auto text-center">
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
      <div class="col-12 col-md-auto text-center q-mt-md">
        <q-btn-group unelevated>
          <q-btn outline unelevated no-caps color="primary" icon-right="close" @click="openDeleteHolds" label="Cancelar"
            :disable="holds.length <= 0" />
          <q-btn no-caps unelevated class="gradient-btn" icon-right="point_of_sale" @click="abrirRealizarVenta"
            label="Realizar venta (F6)" :disable="holds.length <= 0" />
        </q-btn-group>
      </div>
    </div>

    <!-- Sección las tarjetas -->
    <div class=" row">

      <q-img v-if="slide === 1" src="img/sin-productos.png"
        style="width: 35%; height: auto; display: block; margin: auto" fit="contain" />
      <div v-else class="listarcategoriasconitem col">
        <div class="row justify-center">
          <q-card class="my-card custom-shadow custom-border-radius col-md-5 col-sm-11 col-xs-11" bordered
            v-for="item in holds" :key="item" style="margin: 10px;">
            <div class="row no-wrap">
              <!-- Imagen a la izquierda -->
              <q-img class="borde-cust col-4" src="img/no-photo-prod.avif">
                <div class="overlay-content"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; background: rgba(0, 0, 0, 0.5);">
                  <q-avatar text-color="white" :style="'background: ' + colorLetra(item.producto)" size="40px">
                    {{ primeraletra(item.producto) }}
                  </q-avatar>
                  <div><b>{{ item.producto }}</b></div>
                  <q-badge color="grey-5" class="q-mt-xs q-mr-xs q-pa-xs" rounded>
                    {{ item.categoria }}
                  </q-badge>
                </div>
              </q-img>

              <!-- Contenido a la derecha -->
              <div class="col-8">
                <q-card-section class="q-pa-sm">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h6 class="q-mb-none">{{ item.producto }}</h6>
                    <q-btn round unelevated color="red-1" text-color="red-10" icon="delete"
                      @click="deleteItemHolds(item)" style="margin: 0;" />
                  </div>

                </q-card-section>
                <q-separator />

                <q-separator />
                <q-list>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="sell" color="grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Precio unitario:</q-item-label>
                      <q-item-label>{{ item.precio }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="account_balance" color="grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Impuesto (%):</q-item-label>
                      <q-item-label>{{ item.tasa }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="attach_money" color="grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Total:</q-item-label>
                      <span :id="'monto' + item.idproducto" class="precio">Bs. {{ item.total }}</span>
                    </q-item-section>
                  </q-item>

                </q-list>
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
              </div>
            </div>

          </q-card>
        </div>
      </div>
    </div>

    <!-- Sección de modales -->
    <!-- BUSCAR ITEMS DE PRODUCTOS -->
    <q-dialog v-model="buscaritem">
      <q-card class="q-pa-lg custom-shadow custom-border-radius" style="width: 800px; " bordered>
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Agregar Item</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section style="padding: 10px 15px;">
          <q-input color="blue-grey-3" outlined standout bottom-slots v-model="textitem"
            label="Nombre o Sku de producto" counter autofocus>
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>

            <template v-slot:hint>
              Cantidad de letras
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="buscadoproducto">
          <q-scroll-area style="height:  64vh;">
            <q-card v-for="item in rowsproductosfiltre" :key="item.id"
              class="custom-shadow custom-border-radius q-mb-md" bordered>
              <q-item class="q-pa-sm">
                <q-item-section>
                  <q-item-label caption style="padding-left:7px">{{ item.categoria }}</q-item-label>
                  <q-item-label class="text-h6"> <q-avatar text-color="white"
                      :style="'background: ' + colorLetra(item.producto)">
                      {{ primeraletra(item.producto) }}
                    </q-avatar>
                    {{ item.producto }}</q-item-label>
                  <q-item-label>
                    <q-badge
                      :color="item.intipoproducto === '1' ? 'light-green-5' : item.intipoproducto === '2' ? 'deep-orange-5' : 'orange-5'"
                      class="q-mt-xs q-mr-xs q-pa-xs" rounded>
                      {{ item.intipoproducto === '1' ? 'Simple' : item.intipoproducto === '2' ? 'Compuesto' : 'Servicio'
                      }}
                    </q-badge>
                    <span class="q-ml-sm">SKU: {{ item.sku }}</span>
                  </q-item-label>

                </q-item-section>
                <q-item-section side>
                  <q-btn round unelevated color="deep-orange-1" text-color="deep-orange-8" icon="add_shopping_cart"
                    @click="additemholds(item)" />
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item class="q-pa-sm">
                <q-item-section class=" q-ml-md">

                  <div class="row q-mt-sm">
                    <div class="col-4 text-left">
                      <span class="color-texto texto-pequeno">Descripción: </span>
                      <p class=" tarjeticainside mr-2 texto-pequeno"> {{ item.descripcion }}</p>

                    </div>
                    <div class="col-4  text-left">
                      <span class="color-texto texto-pequeno">Unidad: </span>
                      <p>{{ item.unidad }}</p>
                    </div>
                    <div class="col-4  text-left">
                      <span class="color-texto texto-pequeno">Impuesto: </span>
                      <p>{{ item.impuesto }}</p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-card-actions class="tarjeticainside" align="right">
                <h6> <span class="color-texto texto-pequeno">Precio: </span>
                  Bs. {{ item.precio }} </h6>
              </q-card-actions>
            </q-card>
          </q-scroll-area>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline no-caps label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- BUSCAR Y AGREGAR CLIENTES A LA VENTA -->
    <q-dialog v-model="modalcliente">
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Agregar cliente</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
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
        <div v-if="noencontrado" class="noencontrado text-center">
          <p class="text-noencontrado">Lo sentimos, no existe un cliente con ese documento</p>

        </div>
        <div v-if="encontrado" class="encontrado text-center">
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
          <q-btn outline no-caps label="Cancelar" icon-right="close" color="primary" @click="limpiarCliente"
            v-close-popup />
          <q-btn unelevated no-caps label="Aceptar (F4)" color="primary" icon-right="check" @click="crearCliente"
            :disable="dsbBtnCrearCliente" />
        </q-card-actions>
        <q-card-actions align="center" class=" color-texto">
          Presione ESC para salir
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- LIMPIAR HOLDS DE VENTA -->
    <q-dialog v-model="modaldeleteholds" persistent>
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Eliminar</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section style="display: flex; align-items: center;">

          <div class=" color-texto" style="margin-left: 10px;"> ¿Desea eliminar esta venta?</div>
        </q-card-section>

        <q-card-section>
          <q-img class="rounded-borders col-3" src="img/delete.png" />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn outline no-caps icon-right="close" label="Cancelar" color="primary" v-close-popup />
          <q-btn unelevated no-caps label="Aceptar" color="primary" icon-right="check" @click="deleteHolds(1)" />
        </q-card-actions>
        <q-card-actions align="center" class=" color-texto">
          Presione ESC para salir
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MOSTRAR PREVIO DE VENTA -->
    <q-dialog v-model="modalrealizarventa" persistent>
      <q-card class="q-pa-lg custom-shadow custom-border-radius">
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Realizar venta</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section style="display: flex; align-items: center;">
          <q-avatar color="primary" text-color="white">
            <q-icon name="shopping_cart_checkout" />
          </q-avatar>
          <div class="text-p color-texto" style="margin-left: 10px;"> ¿Desea realizar esta venta?</div>
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
          <q-btn outline no-caps icon-right="close" color="primary" label="Cancelar" v-close-popup />
          <q-btn unelevated no-caps icon-right="check" color="primary" label="Aceptar" @click="realizarVenta" />
        </q-card-actions>
        <q-card-actions align="center" class=" color-texto">
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

          <q-btn label="Cerrar" outline no-caps icon-right="close" color="primary" v-close-popup />
          <q-btn unelevated no-caps label="Imprimir" color="primary" icon-right="check" @click="imprimir" />
        </q-card-actions>
        <q-card-actions align="center" class=" color-texto">
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
        <q-card-section
          style="padding: 10px 15px 7px; display: flex; justify-content: space-between; align-items: center;">
          <div class="text-center">
            <h6>Anular documento</h6>
          </div>

          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section style="display: flex; align-items: center;">
          <q-avatar color="primary" text-color="white">
            <q-icon name="cancel_presentation" />
          </q-avatar>
          <div style="margin-left: 10px;"> Buscar número interno</div>
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
            style="display: flex; justify-content: center; align-items: center;width: 100%;">{{
              detalleventaanular.estatus
                === '1' ? 'Procesada' : 'Anulada' }}</div>
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
          <q-btn label="Cerrar" outline no-caps icon-right="close" color="primary" v-close-popup />
          <q-btn label="Aceptar" unelevated no-caps color="primary" icon-right="check" :disable="btnDisableAnular"
            @click="anularDocumento" />
        </q-card-actions>
        <q-card-actions align="center" class=" color-texto">
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
        Notify.create({ message: 'Documento ANULADO con éxito', type: 'positive' })
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
          Notify.create({ message: 'Documento NO ENCONTRADO', type: 'info' })
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
          Notify.create({
            message: 'Problemas al listar items Ventas ' + error,
            type: 'negative'
          })
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
        Notify.create({
          message: 'Problemas al ELIMINAR Hold de venta ' + error,
          type: 'negative'
        })
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
        title: 'Eliminar Item',
        message: '¿Desea eliminar este item?',
        ok: {
          label: 'Aceptar',
          color: 'primary', // Cambia el color del botón a primario (azul)
          flat: false, // Botón con estilo plano
          outline: false, // Botón sin borde
          unelevated: true,
          icon: 'check',
          noCaps: true

        },
        cancel: {
          label: 'No',
          color: 'primary', // Cambia el color del botón a negativo (rojo)
          icon: 'close',
          flat: false, // Botón con estilo plano
          outline: true, // Botón sin borde
          unelevated: true,
          noCaps: true
        },
        persistent: true
      }).onOk(() => {
        axios.post(ENDPOINT_PATH_V2 + 'ventas/deleteitemholds', body).then(async response => {
          console.log(response.data.success)
          this.nombrecliente = ''
          this.listarHolds()
        }).catch(error => {
          Notify.create({
            message: 'Problemas al ELIMINAR itemhold de venta ' + error,
            type: 'negative'
          })
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
            Notify.create({
              message: `<span style="text-transform: uppercase;">${response.data.resp}</span>`
            })
          }
        }).catch(error => {
          Notify.create({
            message: 'Problemas al crear itemhold de venta ' + error,
            type: 'negative'
          })
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
        Notify.create({
          message: 'Problemas al listar Categorías' + error,
          type: 'negative'
        })
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
          Notify.create({
            message: datos.resp.message,
            type: 'negative'
          })
        }
      }).catch(error => {
        Notify.create({
          message: 'Problemas al REALIZAR venta ' + error,
          type: 'negative'
        })
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
        Notify.create({
          message: 'Problemas al listar Tipos' + error,
          type: 'negative'
        })
      })
    },
    buscarCliente() {
      this.limpiarCliente()
      if (!this.modeldocumento) {
        Notify.create({ message: 'Debe seleccionar TIPO DOCUMENTO', type: 'info' })
        return
      }
      if (this.documento.length === 0) {
        Notify.create({ message: 'Debe agregar DOCUMENTO', type: 'info' })
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
        Notify.create({
          message: 'Problemas al buscar cliente' + error,
          type: 'negative'
        })
      })
    },
    crearCliente() {
      // if (this.modeldocumento)
      // console.log(this.modeldocumento)
      if (!this.modeldocumento) {
        Notify.create({ message: 'Debe seleccionar TIPO DOCUMENTO', type: 'info' })
        return
      }
      if (this.documento.length === 0) {
        Notify.create({ message: 'Debe agregar DOCUMENTO', type: 'info' })
        return
      }
      if (this.nombrecliente.length === 0) {
        Notify.create({ message: 'Debe agregar NOMBRE', type: 'info' })
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
          Notify.create({
            message: 'Problemas al crear cliente' + error,
            type: 'negative'
          })
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
        Notify.create({
          message: 'Problemas al crear hold de venta' + error,
          type: 'negative'
        })
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
            Notify.create({
              message: 'Problemas al listar items Holds' + error,
              type: 'negative'
            })
          })
        }
        this.subtotalusd = (this.subtotal / this.tasa).toFixed(2)
        this.impuestousd = (this.impuesto / this.tasa).toFixed(2)
        this.totalusd = (this.total / this.tasausd).toFixed(2)
        // this.holds.push(obj)
        /* for (const i in datos) {
    } */
      }).catch(error => {
        Notify.create({
          message: 'Problemas al listar Holds' + error,
          type: 'negative'
        })
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
          Notify.create({
            message: 'Problemas al listar Configuración' + error,
            type: 'negative'
          })
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
              Notify.create({ message: 'No tiene venta', type: 'info' })
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

.text-encontrado,
.procesada {
  color: #32651A;
  background: rgba(90.58, 233.75, 96.30, 0.13);
}

.text-noencontrado,
.anulada {
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

/* .puntodeventa {
  height: 59vh;
  background: #FFFAEC;
  display: flex;
  justify-content: center;
  overflow: auto;
} */

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

.contenedorBtn {
  padding: 3px;
  display: grid;
}
</style>
