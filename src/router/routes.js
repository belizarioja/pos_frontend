const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue')
  },
  {
    path: '/puntodeventa',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/categorias', component: () => import('pages/Categorias.vue') },
      { path: '/productos', component: () => import('pages/Productos.vue') },
      { path: '/ventas', component: () => import('pages/Ventas.vue') },
      { path: '/empresas', component: () => import('pages/Empresas.vue') },
      { path: '/usuarios', component: () => import('pages/Usuarios.vue') },
      { path: '/configuracion', component: () => import('pages/Configuracion.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
