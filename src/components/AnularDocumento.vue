<template>
   <q-dialog v-model="modal" persistent>
        <q-card style="width: 320px;">
            <q-card-section style="justify-content: center;">
                Anular Documento
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
                <q-btn label="Cerrar" color="negative" v-close-popup />
                <q-btn label="Imprimir" color="secondary" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnularDocumento',
  props: ['modal'],
  mounted () {
    console.log('Aqui anular documento')
    console.log(this.modal)
  }
})
</script>
